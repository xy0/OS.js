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

(function(Application, Window, Utils, VFS, API, GUI) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // Default Application Helper
  /////////////////////////////////////////////////////////////////////////////

  /**
   * This is a helper to more easily create an application.
   *
   * Handles opening, saving and creation of files.
   *
   * @summary Helper for making Applications with file interaction.
   *
   * @constructor
   * @memberof OSjs.Helpers
   * @see OSjs.Helpers.DefaultApplicationWindow
   * @see OSjs.Core.Application
   */
  function DefaultApplication(name, args, metadata, opts) {
    this.defaultOptions = Utils.argumentDefaults(opts, {
      readData: true,
      rawData: false,
      extension: '',
      mime: 'application/octet-stream',
      filetypes: [],
      filename: 'New file'
    });

    Application.apply(this, [name, args, metadata]);
  }

  DefaultApplication.prototype = Object.create(Application.prototype);
  DefaultApplication.constructor = Application;

  /**
   * Destroy
   */
  DefaultApplication.prototype.destroy = function() {
    Application.prototype.destroy.apply(this, arguments);
  };

  /**
   * Initialize
   *
   * @TODO DEPRECATED This is kept for backward compability
   */
  DefaultApplication.prototype.init = function(settings, metadata, onLoaded) {
    Application.prototype.init.call(this, settings, metadata);

    var file = this._getArgument('file');
    this._loadScheme('./scheme.html', function(scheme) {
      onLoaded(scheme, file);
    });
  };

  /**
   * On Message
   */
  DefaultApplication.prototype._onMessage = function(obj, msg, args) {
    Application.prototype._onMessage.apply(this, arguments);

    var self = this;
    var current = this._getArgument('file');
    var win = this._getWindow(this.__mainwindow);

    if ( msg === 'vfs' && args.source !== null && args.source !== this.__pid && args.file ) {
      if ( win && current && current.path === args.file.path ) {
        win._toggleDisabled(true);
        API.createDialog('Confirm', {
          buttons: ['yes', 'no'],
          message: API._('MSG_FILE_CHANGED')
        }, function(ev, button) {
          win._toggleDisabled(false);
          if ( button === 'ok' || button === 'yes' ) {
            self.openFile(new VFS.File(args.file), win);
          }
        }, win);
      }
    }
  };

  /**
   * Open given File
   *
   * @function openFile
   * @memberof OSjs.Helpers.DefaultApplication#
   *
   * @param   {OSjs.VFS.File}       file        File
   * @param   {OSjs.Core.Window}    win         Window reference
   */
  DefaultApplication.prototype.openFile = function(file, win) {
    var self = this;
    if ( !file ) {
      return;
    }

    function onError(error) {
      if ( error ) {
        API.error(self.__label,
                  API._('ERR_FILE_APP_OPEN'),
                  API._('ERR_FILE_APP_OPEN_ALT_FMT',
                  file.path));
        return true;
      }
      return false;
    }

    function onDone(result) {
      self._setArgument('file', file);
      win.showFile(file, result);
    }

    var check = this.__metadata.mime || [];
    if ( !Utils.checkAcceptMime(file.mime, check) ) {
      API.error(this.__label,
                API._('ERR_FILE_APP_OPEN'),
                API._('ERR_FILE_APP_OPEN_FMT',
                file.path, file.mime)
      );
      return false;
    }

    win._toggleLoading(true);

    function CallbackVFS(error, result) {
      win._toggleLoading(false);
      if ( onError(error) ) {
        return;
      }
      onDone(result);
    }

    if ( this.defaultOptions.readData ) {
      VFS.read(file, CallbackVFS, {type: this.defaultOptions.rawData ? 'binary' : 'text'});
    } else {
      VFS.url(file, CallbackVFS);
    }

    return true;
  };

  /**
   * Save given File
   *
   * @function saveFile
   * @memberof OSjs.Helpers.DefaultApplication#
   *
   * @param   {OSjs.VFS.File}       file        File
   * @param   {Mixed}               value       File contents
   * @param   {OSjs.Core.Window}    win         Window reference
   */
  DefaultApplication.prototype.saveFile = function(file, value, win) {
    var self = this;
    if ( !file ) {
      return;
    }

    win._toggleLoading(true);
    VFS.write(file, value || '', function(error, result) {
      win._toggleLoading(false);

      if ( error ) {
        API.error(self.__label,
                  API._('ERR_FILE_APP_SAVE'),
                  API._('ERR_FILE_APP_SAVE_ALT_FMT',
                  file.path));
        return;
      }

      self._setArgument('file', file);
      win.updateFile(file);
    }, {}, this);
  };

  /**
   * Open Save dialog
   *
   * @function saveDialog
   * @memberof OSjs.Helpers.DefaultApplication#
   *
   * @param   {OSjs.VFS.File}       file        File
   * @param   {OSjs.Core.Window}    win         Window reference
   * @param   {Boolean}             saveAs      SaveAs ?
   */
  DefaultApplication.prototype.saveDialog = function(file, win, saveAs) {
    var self = this;
    var value = win.getFileData();

    if ( !saveAs ) {
      this.saveFile(file, value, win);
      return;
    }

    win._toggleDisabled(true);
    API.createDialog('File', {
      file: file,
      filename: file ? file.filename : this.defaultOptions.filename,
      filetypes: this.defaultOptions.filetypes,
      filter: this.__metadata.mime,
      extension: this.defaultOptions.extension,
      mime: this.defaultOptions.mime,
      type: 'save'
    }, function(ev, button, result) {
      win._toggleDisabled(false);
      if ( button === 'ok' ) {
        self.saveFile(result, value, win);
      }
    }, win);
  };

  /**
   * Open Open dialog
   *
   * @function openDialog
   * @memberof OSjs.Helpers.DefaultApplication#
   *
   * @param   {OSjs.VFS.File}       [file]      Current File
   * @param   {OSjs.Core.Window}    [win]       Window reference
   */
  DefaultApplication.prototype.openDialog = function(file, win) {
    var self = this;

    function openDialog() {
      win._toggleDisabled(true);
      API.createDialog('File', {
        file: file,
        filter: self.__metadata.mime
      }, function(ev, button, result) {
        win._toggleDisabled(false);
        if ( button === 'ok' && result ) {
          self.openFile(new VFS.File(result), win);
        }
      }, win);
    }

    win.checkHasChanged(function(discard) {
      if ( discard ) {
        openDialog();
      }
    });
  };

  /**
   * Create a new file
   *
   * @function newDialog
   * @memberof OSjs.Helpers.DefaultApplication#
   *
   * @param   {String}              [path]        Current path
   * @param   {OSjs.Core.Window}    [win]         Window reference
   */
  DefaultApplication.prototype.newDialog = function(path, win) {
    var self = this;
    win.checkHasChanged(function(discard) {
      if ( discard ) {
        self._setArgument('file', null);
        win.showFile(null, null);
      }
    });
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Helpers.DefaultApplication       = DefaultApplication;

})(OSjs.Core.Application, OSjs.Core.Window, OSjs.Utils, OSjs.VFS, OSjs.API, OSjs.GUI);

