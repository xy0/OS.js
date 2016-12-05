/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2016, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */

(function(API, VFS, Utils, Connection) {
  'use strict';

  function WSConnection() {
    Connection.apply(this, arguments);

    this.ws = null;
    this.wsqueue = {};
  }

  WSConnection.prototype = Object.create(Connection.prototype);
  WSConnection.constructor = Connection;

  WSConnection.prototype.destroy = function() {
    if ( this.ws ) {
      this.ws.close();
    }

    this.ws = null;
    this.wsqueue = {};
    return Connection.prototype.destroy.apply(this, arguments);
  };

  WSConnection.prototype.init = function(callback) {
    var self = this;
    var url = window.location.protocol.replace('http', 'ws') + '//' + window.location.host;
    var connected = false;

    console.info('Using WebSocket', url);

    this.ws = new WebSocket(url);

    this.ws.onopen = function() {
      connected = true;

      callback();
    };

    this.ws.onmessage = function(ev) {
      var data = JSON.parse(ev.data);
      var idx = data._index;

      if ( typeof idx === 'undefined'  ) {
        self.message(data);
      } else {
        if ( self.wsqueue[idx] ) {
          delete data._index;

          self.wsqueue[idx](data);

          delete self.wsqueue[idx];
        }
      }
    };

    this.ws.onclose = function(ev) {
      if ( !connected && ev.code !== 3001 ) {
        callback('WebSocket connection error'); // FIXME: Locale
      }
    };
  };

  WSConnection.prototype.message = function(data) {
    // Emit a VFS event when a change occures
    if ( data.action === 'vfs:watch' ) {
      VFS.Helpers.triggerWatch(data.action.split(':')[1], VFS.file(data.args));
    }

    // Emit a subscription event
    if ( this._evHandler ) {
      this._evHandler.emit(data.action, data.args);
    }
  };

  WSConnection.prototype.request = function(method, args, onsuccess, onerror, options) {
    onerror = onerror || function() {
      console.warn('Connection::callWS()', 'error', arguments);
    };

    var res = Connection.prototype.request.apply(this, arguments);
    if ( res !== false ) {
      return res;
    }

    var idx = this.index++;
    var base = method.match(/^FS:/) ? '/FS/' : '/API/';

    try {
      this.ws.send(JSON.stringify({
        _index: idx,
        sid: Utils.getCookie('session'),
        path: base + method.replace(/^FS:/, ''),
        args: args
      }));

      this.wsqueue[idx] = onsuccess || function() {};

      return true;
    } catch ( e ) {
      console.warn('callWS() Warning', e.stack, e);
      onerror(e);
    }

    return false;
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Connections = OSjs.Connections || {};
  OSjs.Connections.ws = WSConnection;

})(OSjs.API, OSjs.VFS, OSjs.Utils, OSjs.Core.Connection);
