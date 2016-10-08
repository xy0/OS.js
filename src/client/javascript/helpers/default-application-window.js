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
  // Default Application Window Helper
  /////////////////////////////////////////////////////////////////////////////

  /**
   * This is a helper to more easily create an application.
   *
   * Use in combination with 'DefaultApplication'
   *
   * @summary Helper for making Applications with file interaction.
   *
   * @constructor
   * @memberof OSjs.Helpers
   * @see OSjs.Helpers.DefaultApplication
   * @see OSjs.Core.Window
   */
  function DefaultApplicationWindow(name, app, args, scheme, file) {
    Window.apply(this, arguments);

    this.hasClosingDialog = false;
    this.currentFile = file ? new VFS.File(file) : null;
    this.hasChanged = false;
  }

  DefaultApplicationWindow.prototype = Object.create(Window.prototype);
  DefaultApplicationWindow.constructor = Window;

  /**
   * Destroy
   */
  DefaultApplicationWindow.prototype.destroy = function() {
    Window.prototype.destroy.apply(this, arguments);

    this.currentFile = null;
  };

  /**
   * Initialize
   */
  DefaultApplicationWindow.prototype.init = function(wm, app, scheme) {
    var root = Window.prototype.init.apply(this, arguments);
    return root;
  };

  /**
   * Applies default Window GUI stuff
   */
  DefaultApplicationWindow.prototype._inited = function() {
    var result = Window.prototype._inited.apply(this, arguments);
    var self = this;
    var app = this._app;

    var menuMap = {
      MenuNew:    function() {
        app.newDialog(self.currentFile, self);
      },
      MenuSave:   function() {
        app.saveDialog(self.currentFile, self);
      },
      MenuSaveAs: function() {
        app.saveDialog(self.currentFile, self, true);
      },
      MenuOpen:   function() {
        app.openDialog(self.currentFile, self);
      },
      MenuClose:  function() {
        self._close();
      }
    };

    this._scheme.find(this, 'SubmenuFile').on('select', function(ev) {
      if ( menuMap[ev.detail.id] ) {
        menuMap[ev.detail.id]();
      }
    });

    this._scheme.find(this, 'MenuSave').set('disabled', true);

    // Load given file
    if ( this.currentFile ) {
      if ( !this._app.openFile(this.currentFile, this) ) {
        this.currentFile = null;
      }
    }

    return result;
  };

  /**
   * On Drag-And-Drop Event
   */
  DefaultApplicationWindow.prototype._onDndEvent = function(ev, type, item, args) {
    if ( !Window.prototype._onDndEvent.apply(this, arguments) ) {
      return;
    }

    if ( type === 'itemDrop' && item ) {
      var data = item.data;
      if ( data && data.type === 'file' && data.mime ) {
        this._app.openFile(new VFS.File(data), this);
      }
    }
  };

  /**
   * On Close
   */
  DefaultApplicationWindow.prototype._close = function() {
    var self = this;
    if ( this.hasClosingDialog ) {
      return;
    }

    if ( this.hasChanged ) {
      this.hasClosingDialog = true;
      this.checkHasChanged(function(discard) {
        self.hasClosingDialog = false;
        if ( discard ) {
          self.hasChanged = false; // IMPORTANT
          self._close();
        }
      });
      return;
    }

    Window.prototype._close.apply(this, arguments);
  };

  /**
   * Checks if current file has changed
   *
   * @function  checkHasChanged
   * @memberof OSjs.Helpers.DefaultApplicationWindow#
   *
   * @param   {Function}      cb        Callback => fn(discard_changes)
   */
  DefaultApplicationWindow.prototype.checkHasChanged = function(cb) {
    var self = this;

    if ( this.hasChanged ) {
      this._toggleDisabled(true);

      API.createDialog('Confirm', {
        buttons: ['yes', 'no'],
        message: API._('MSG_GENERIC_APP_DISCARD')
      }, function(ev, button) {
        self._toggleDisabled(false);
        cb(button === 'ok' || button === 'yes');
      });
      return;
    }

    cb(true);
  };

  /**
   * Show opened/created file
   *
   * YOU SHOULD EXTEND THIS METHOD IN YOUR WINDOW TO ACTUALLY DISPLAY CONTENT
   *
   * @function  showFile
   * @memberof OSjs.Helpers.DefaultApplicationWindow#
   *
   * @param   {OSjs.VFS.File}       file        File
   * @param   {Mixed}               content     File contents
   */
  DefaultApplicationWindow.prototype.showFile = function(file, content) {
    this.updateFile(file);
  };

  /**
   * Updates current view for given File
   *
   * @function updateFile
   * @memberof OSjs.Helpers.DefaultApplicationWindow#
   *
   * @param   {OSjs.VFS.File}       file        File
   */
  DefaultApplicationWindow.prototype.updateFile = function(file) {
    this.currentFile = file || null;
    this.hasChanged = false;

    if ( this._scheme && (this._scheme instanceof GUI.Scheme) ) {
      this._scheme.find(this, 'MenuSave').set('disabled', !file);
    }

    if ( file ) {
      this._setTitle(file.filename, true);
    } else {
      this._setTitle();
    }
  };

  /**
   * Gets file data
   *
   * YOU SHOULD IMPLEMENT THIS METHOD IN YOUR WINDOW TO RETURN FILE CONTENTS
   *
   * @function getFileData
   * @memberof OSjs.Helpers.DefaultApplicationWindow#
   *
   * @return  {Mixed} File contents
   */
  DefaultApplicationWindow.prototype.getFileData = function() {
    return null;
  };

  /**
   * Window key
   */
  DefaultApplicationWindow.prototype._onKeyEvent = function(ev, type, shortcut) {
    if ( shortcut === 'SAVE' ) {
      this._app.saveDialog(this.currentFile, this, !this.currentFile);
      return false;
    } else if ( shortcut === 'SAVEAS' ) {
      this._app.saveDialog(this.currentFile, this, true);
      return false;
    } else if ( shortcut === 'OPEN' ) {
      this._app.openDialog(this.currentFile, this);
      return false;
    }

    return Window.prototype._onKeyEvent.apply(this, arguments);
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Helpers.DefaultApplicationWindow = DefaultApplicationWindow;

})(OSjs.Core.Application, OSjs.Core.Window, OSjs.Utils, OSjs.VFS, OSjs.API, OSjs.GUI);

