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
(function(CoreWM, Panel, PanelItem, Utils, API, VFS) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // ITEM
  /////////////////////////////////////////////////////////////////////////////

  function NotificationAreaItem(name, opts) {
    opts = opts || {};

    this.name           = name;
    this.opts           = opts;
    this.$container     = document.createElement('li');
    this.$image         = (opts.image || opts.icon) ? document.createElement('img') : null;
    this.onCreated      = opts.onCreated     || function() {};
    this.onInited       = opts.onInited      || function() {};
    this.onDestroy      = opts.onDestroy     || function() {};
    this.onClick        = opts.onClick       || function() {};
    this.onContextMenu  = opts.onContextMenu || function() {};

    this._build(name);
    this.onCreated.call(this);
  }

  NotificationAreaItem.prototype._build = function(name) {
    var self = this;
    var classNames = ['NotificationArea', 'NotificationArea_' + name];
    if ( this.opts.className ) {
      classNames.push(this.opts.className);
    }

    this.$container.className = classNames.join(' ');
    this.$container.setAttribute('role', 'button');
    this.$container.setAttribute('aria-label', this.opts.title);

    if ( this.opts.tooltip ) {
      this.$container.title = this.opts.tooltip;
    }

    Utils.$bind(this.$container, 'mousedown', function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    });

    Utils.$bind(this.$container, 'click', function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      OSjs.API.blurMenu();
      self.onClick.apply(self, arguments);
      return false;
    });

    Utils.$bind(this.$container, 'contextmenu', function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      OSjs.API.blurMenu();
      self.onContextMenu.apply(self, arguments);
      return false;
    });

    if ( this.$image ) {
      this.$image.title = this.opts.title || '';
      this.$image.src   = (this.opts.image || this.opts.icon || 'about:blank');
      this.$container.appendChild(this.$image);
    }

    var inner = document.createElement('div');
    inner.appendChild(document.createElement('div'));
    this.$container.appendChild(inner);
  };

  NotificationAreaItem.prototype.init = function(root) {
    root.appendChild(this.$container);

    try {
      this.onInited.call(this, this.$container, this.$image);
    } catch ( e ) {
      console.warn('NotificationAreaItem', 'onInited error');
      console.warn(e, e.stack);
    }
  };

  NotificationAreaItem.prototype.setIcon = function(src) {
    return this.setImage(src);
  };

  NotificationAreaItem.prototype.setImage = function(src) {
    if ( this.$image ) {
      this.$image.src = src;
    }
    this.opts.image = src;
  };

  NotificationAreaItem.prototype.setTitle = function(title) {
    if ( this.$image ) {
      this.$image.title = title;
    }
    this.opts.title = title;
  };

  NotificationAreaItem.prototype.destroy = function() {
    if ( this.$container ) {
      Utils.$unbind(this.$container, 'click');
      Utils.$unbind(this.$container, 'contextmenu');
    }
    this.onDestroy.call(this);

    this.$image     = Utils.$remove(this.$image);
    this.$container = Utils.$remove(this.$container);
  };

  // NOTE: This is a workaround for resetting items on panel change
  var _restartFix = {};

  /**
   * PanelItem: NotificationArea
   */
  function PanelItemNotificationArea() {
    PanelItem.apply(this, ['PanelItemNotificationArea corewm-panel-right']);
    this.notifications = {};
  }

  PanelItemNotificationArea.prototype = Object.create(PanelItem.prototype);
  PanelItemNotificationArea.constructor = PanelItem;

  PanelItemNotificationArea.prototype.init = function() {
    var self = this;

    var root = PanelItem.prototype.init.apply(this, arguments);
    root.setAttribute('role', 'toolbar');

    var fix = Object.keys(_restartFix);
    if ( fix.length ) {
      fix.forEach(function(k) {
        self.createNotification(k, _restartFix[k]);
      });
    }

    return root;
  };

  PanelItemNotificationArea.prototype.createNotification = function(name, opts) {
    if ( this._$root ) {
      if ( !this.notifications[name] ) {
        var item = new NotificationAreaItem(name, opts);
        item.init(this._$container);
        this.notifications[name] = item;
        _restartFix[name] = opts;

        return item;
      }
    }
    return null;
  };

  PanelItemNotificationArea.prototype.removeNotification = function(name) {
    if ( this._$root ) {
      if ( this.notifications[name] ) {
        this.notifications[name].destroy();
        delete this.notifications[name];
        if ( _restartFix[name] ) {
          delete _restartFix[name];
        }
        return true;
      }
    }

    return false;
  };

  PanelItemNotificationArea.prototype.getNotification = function(name) {
    if ( this._$root ) {
      if ( this.notifications[name] ) {
        return this.notifications[name];
      }
    }
    return false;
  };

  PanelItemNotificationArea.prototype.destroy = function() {
    for ( var i in this.notifications ) {
      if ( this.notifications.hasOwnProperty(i) ) {
        if ( this.notifications[i] ) {
          this.notifications[i].destroy();
        }
        delete this.notifications[i];
      }
    }

    PanelItem.prototype.destroy.apply(this, arguments);
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.CoreWM = OSjs.Applications.CoreWM || {};
  OSjs.Applications.CoreWM.PanelItems = OSjs.Applications.CoreWM.PanelItems || {};
  OSjs.Applications.CoreWM.PanelItems.NotificationArea = PanelItemNotificationArea;

})(OSjs.Applications.CoreWM.Class, OSjs.Applications.CoreWM.Panel, OSjs.Applications.CoreWM.PanelItem, OSjs.Utils, OSjs.API, OSjs.VFS);
