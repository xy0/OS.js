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
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS' AND
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
/*eslint strict:["error", "global"]*/
'use strict';

const _fs = require('node-fs-extra');
const _vfs = require('./../../core/vfs.js');
const _instance = require('./../../core/instance.js');

function _readFile(username, path, resolve) {
  function _done(data) {
    data = data || {};
    resolve(username ? (data[username] || []) : data);
  }

  _fs.readFile(path, function(err, data) {
    if ( err ) {
      _done(null);
    } else {
      try {
        _done(JSON.parse(data));
      } catch ( e ) {
        console.warn('Failed to read', path);
        _done({});
      }
    }
  });
}

module.exports.setSettings = function(http, username, settings) {
  const config = _instance.getConfig();
  const path = _vfs.resolvePathArguments(config.modules.storage.system.settings, {
    username: username
  });

  return new Promise(function(resolve, reject) {
    _fs.writeFile(path, JSON.stringify(settings), function(err, res) {
      if ( err ) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports.getSettings = function(http, username) {
  const config = _instance.getConfig();
  const path = _vfs.resolvePathArguments(config.modules.storage.system.settings, {
    username: username
  });
  return new Promise(function(resolve) {
    _readFile(null, path, resolve);
  });
};

module.exports.getGroups = function(http, username) {
  const config = _instance.getConfig();
  const path = config.modules.storage.system.groups;
  return new Promise(function(resolve) {
    _readFile(username, path, resolve);
  });
};

module.exports.getBlacklist = function(http, username) {
  const config = _instance.getConfig();
  const path = config.modules.storage.system.blacklist;
  return new Promise(function(resolve) {
    _readFile(username, path, resolve);
  });
};

module.exports.setBlacklist = function(http, username, list) {
  return new Promise(function(resolve) {
    resolve(true);
  });
};

module.exports.register = function(config) {
  return Promise.resolve();
};

module.exports.destroy = function() {
  return Promise.resolve();
};
