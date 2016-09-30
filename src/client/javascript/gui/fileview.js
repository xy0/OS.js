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
(function(API, Utils, VFS, GUI) {
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // ABSTRACTION HELPERS
  /////////////////////////////////////////////////////////////////////////////

  var _iconSizes = { // Defaults to 16x16
    'gui-icon-view': '32x32'
  };

  /////////////////////////////////////////////////////////////////////////////
  // HELPERS
  /////////////////////////////////////////////////////////////////////////////

  function getChildView(el) {
    return el.children[0];
  }

  function getFileIcon(iter, size) {
    if ( iter.icon && typeof iter.icon === 'object' ) {
      return API.getIcon(iter.icon.filename, size, iter.icon.application);
    }

    var icon = 'status/gtk-dialog-question.png';
    return API.getFileIcon(iter, size, icon);
  }

  function getFileSize(iter) {
    var filesize = '';
    if ( iter.type !== 'dir' && iter.size >= 0 ) {
      filesize = Utils.humanFileSize(iter.size);
    }
    return filesize;
  }

  var removeExtension = (function() {
    var mimeConfig;

    return function(str, opts) {
      if ( !mimeConfig ) {
        mimeConfig = API.getConfig('MIME.mapping');
      }

      if ( opts.extensions === false ) {
        var ext = Utils.filext(str);
        if ( ext ) {
          ext = '.' + ext;
          if ( mimeConfig[ext] ) {
            str = str.substr(0, str.length - ext.length);
          }
        }
      }
      return str;
    };
  })();

  function getDateFromStamp(stamp) {
    if ( typeof stamp === 'string' ) {
      var date = null;
      try {
        date = new Date(stamp);
        //date = new Date(stamp.replace('T', ' ').replace(/\..+/, ''));
      } catch ( e ) {}

      if ( date ) {
        return OSjs.Helpers.Date.format(date);
      }
    }
    return stamp;
  }

  function getListViewColumns(iter, opts) {
    opts = opts || {};

    var columnMapping = {
      filename: {
        label: 'LBL_FILENAME',
        icon: function() {
          return getFileIcon(iter);
        },
        value: function() {
          return removeExtension(iter.filename, opts);
        }
      },
      mime: {
        label: 'LBL_MIME',
        size: '100px',
        icon: function() {
          return null;
        },
        value: function() {
          return iter.mime;
        }
      },
      mtime: {
        label: 'LBL_MODIFIED',
        size: '160px',
        icon: function() {
          return null;
        },
        value: function() {
          return getDateFromStamp(iter.mtime);
        }
      },
      ctime: {
        label: 'LBL_CREATED',
        size: '160px',
        icon: function() {
          return null;
        },
        value: function() {
          return getDateFromStamp(iter.ctime);
        }
      },
      size: {
        label: 'LBL_SIZE',
        size: '120px',
        icon: function() {
          return null;
        },
        value: function() {
          return getFileSize(iter);
        }
      }
    };

    var defColumns = ['filename', 'mime', 'size'];
    var useColumns = defColumns;

    if ( !opts.defaultcolumns ) {
      var vfsOptions = Utils.cloneObject(OSjs.Core.getSettingsManager().get('VFS') || {});
      var scandirOptions = vfsOptions.scandir || {};
      useColumns = scandirOptions.columns || defColumns;
    }

    var columns = [];

    useColumns.forEach(function(key, idx) {
      var map = columnMapping[key];

      if ( iter ) {
        columns.push({
          label: map.value(),
          icon: map.icon(),
          textalign: idx === 0 ? 'left' : 'right'
        });
      } else {
        columns.push({
          label: API._(map.label),
          size: map.size || '',
          resizable: idx > 0,
          textalign: idx === 0 ? 'left' : 'right'
        });
      }
    });

    return columns;
  }

  function buildChildView(el) {
    var type = el.getAttribute('data-type') || 'list-view';
    if ( !type.match(/^gui\-/) ) {
      type = 'gui-' + type;
    }

    var nel = new GUI.ElementDataView(GUI.Helpers.createElement(type, {'draggable': true, 'draggable-type': 'file'}));
    GUI.Elements[type].build(nel.$element);

    nel.on('select', function(ev) {
      el.dispatchEvent(new CustomEvent('_select', {detail: ev.detail}));
    });
    nel.on('activate', function(ev) {
      el.dispatchEvent(new CustomEvent('_activate', {detail: ev.detail}));
    });
    nel.on('contextmenu', function(ev) {
      if ( !el.hasAttribute('data-has-contextmenu') || el.hasAttribute('data-has-contextmenu') === 'false' ) {
        new GUI.Element(el).fn('contextmenu', [ev]);
      }
      el.dispatchEvent(new CustomEvent('_contextmenu', {detail: ev.detail}));
    });

    if ( type === 'gui-tree-view' ) {
      nel.on('expand', function(ev) {
        el.dispatchEvent(new CustomEvent('_expand', {detail: ev.detail}));
      });
    }

    el.setAttribute('role', 'region');
    el.appendChild(nel.$element);
  }

  function scandir(tagName, dir, opts, cb, oncreate) {
    var file = new VFS.File(dir);
    file.type  = 'dir';

    var scanopts = {
      backlink:           opts.backlink,
      showDotFiles:       opts.dotfiles === true,
      showFileExtensions: opts.extensions === true,
      mimeFilter:         opts.filter || [],
      typeFilter:         opts.filetype || null
    };

    try {
      VFS.scandir(file, function(error, result) {
        if ( error ) {
          cb(error); return;
        }

        var list = [];
        var summary = {size: 0, directories: 0, files: 0, hidden: 0};

        function isHidden(iter) {
          return (iter.filename || '').substr(0) === '.';
        }

        (result || []).forEach(function(iter) {
          list.push(oncreate(iter));

          summary.size += iter.size || 0;
          summary.directories += iter.type === 'dir' ? 1 : 0;
          summary.files += iter.type !== 'dir' ? 1 : 0;
          summary.hidden += isHidden(iter) ? 1 : 0;
        });

        cb(false, list, summary);
      }, scanopts);
    } catch ( e ) {
      cb(e);
    }
  }

  function readdir(el, dir, done, sopts) {
    sopts = sopts || {};

    var vfsOptions = Utils.cloneObject(OSjs.Core.getSettingsManager().get('VFS') || {});
    var scandirOptions = vfsOptions.scandir || {};

    var target = getChildView(el);
    var tagName = target.tagName.toLowerCase();
    el.setAttribute('data-path', dir);

    var opts = {filter: null, backlink: sopts.backlink};
    function setOption(s, d, c, cc) {
      if ( el.hasAttribute(s) ) {
        opts[d] = c(el.getAttribute(s));
      } else {
        opts[d] = (cc || function() {})();
      }
    }
    setOption('data-dotfiles', 'dotfiles', function(val) {
      return val === 'true';
    }, function() {
      return scandirOptions.showHiddenFiles === true;
    });
    setOption('data-extensions', 'extensions', function(val) {
      return val === 'true';
    }, function() {
      return scandirOptions.showFileExtensions === true;
    });
    setOption('data-filetype', 'filetype', function(val) {
      return val;
    });
    setOption('data-defaultcolumns', 'defaultcolumns', function(val) {
      return val === 'true';
    });

    try {
      opts.filter = JSON.parse(el.getAttribute('data-filter'));
    } catch ( e ) {
    }

    scandir(tagName, dir, opts, function(error, result, summary) {
      if ( tagName === 'gui-list-view' ) {
        GUI.Elements[tagName].set(target, 'zebra', true);
        GUI.Elements[tagName].set(target, 'columns', getListViewColumns(null, opts));
      }

      done(error, result, summary);
    }, function(iter) {
      var tooltip = Utils.format('{0}\n{1}\n{2} {3}', iter.type.toUpperCase(), iter.filename, getFileSize(iter), iter.mime || '');

      function _createEntry() {
        var row = {
          value: iter,
          id: iter.id || removeExtension(iter.filename, opts),
          label: iter.filename,
          tooltip: tooltip,
          icon: getFileIcon(iter, _iconSizes[tagName] || '16x16')
        };

        if ( tagName === 'gui-tree-view' && iter.type === 'dir' ) {
          if ( iter.filename !== '..' ) {
            row.entries = [{
              label: 'Loading...'
            }];
          }
        }

        return row;
      }

      // List view works a little differently
      if ( tagName !== 'gui-list-view' ) {
        return _createEntry();
      }

      return {
        value: iter,
        id: iter.id || iter.filename,
        tooltip: tooltip,
        columns: getListViewColumns(iter, opts)
      };
    });
  }

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Element: 'gui-file-view'
   *
   * Abstraction layer for displaying files within Icon-, Tree- or List Views
   *
   * For more properties and events etc, see 'dataview'
   *
   * <pre><code>
   *   property  multiple    boolean       If multiple elements are selectable
   *   property  type        String        Child type
   *   property  filter      Array         MIME Filters
   *   property  dotfiles    boolean       Show dotfiles (default=true)
   *   property  extensions  boolean       Show file extensions (default=true)
   *   action    chdir                     Change directory => fn(args)  (args = {path: '', done: function() })
   * </code></pre>
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-file-view
   * @see OSjs.GUI.Elements.gui-list-view
   * @see OSjs.GUI.Elements.gui-tree-view
   * @see OSjs.GUI.Elements.gui-icon-view
   */
  GUI.Elements['gui-file-view'] = {
    bind: function(el, evName, callback, params) {
      if ( (['activate', 'select', 'contextmenu']).indexOf(evName) !== -1 ) {
        evName = '_' + evName;
      }

      if ( evName === '_contextmenu' ) {
        el.setAttribute('data-has-contextmenu', 'true');
      }

      Utils.$bind(el, evName, callback.bind(new GUI.Element(el)), params);
    },
    set: function(el, param, value, arg, arg2) {
      if ( param === 'type' ) {
        var firstChild = el.children[0];
        if ( firstChild && firstChild.tagName.toLowerCase() === value ) {
          return true;
        }

        Utils.$empty(el);
        el.setAttribute('data-type', value);
        Utils.$bind(el, '_expand', function(ev) {
          var target = ev.detail.element;
          if ( target.getAttribute('data-was-rendered') ) {
            return;
          }

          if ( ev.detail.expanded ) {
            var view = new GUI.ElementDataView(getChildView(el));
            var entry = ev.detail.entries[0].data;
            target.setAttribute('data-was-rendered', String(true));
            readdir(el, entry.path, function(error, result, summary) {
              if ( !error ) {
                target.querySelectorAll('gui-tree-view-entry').forEach(function(e) {
                  Utils.$remove(e);

                  view.add({
                    entries: result,
                    parentNode: target
                  });
                });
              }
            }, {backlink: false});
          }
        });
        buildChildView(el);

        if ( typeof arg === 'undefined' || arg === true ) {
          GUI.Elements['gui-file-view'].call(el, 'chdir', {
            path: el.getAttribute('data-path')
          });
        }
        return true;
      } else if ( (['filter', 'dotfiles', 'filetype', 'extensions', 'defaultcolumns']).indexOf(param) >= 0 ) {
        GUI.Helpers.setProperty(el, param, value);
        return true;
      }

      var target = getChildView(el);
      if ( target ) {
        var tagName = target.tagName.toLowerCase();
        GUI.Elements[tagName].set(target, param, value, arg, arg2);
        return true;
      }

      return false;
    },
    build: function(el) {
      buildChildView(el);
    },
    values: function(el) {
      var target = getChildView(el);
      if ( target ) {
        var tagName = target.tagName.toLowerCase();
        return GUI.Elements[tagName].values(target);
      }
      return null;
    },

    contextmenu: function(ev) {
      var vfsOptions = OSjs.Core.getSettingsManager().instance('VFS');
      var scandirOptions = (vfsOptions.get('scandir') || {});

      function setOption(opt, toggle) {
        var opts = {scandir: {}};
        opts.scandir[opt] = toggle;
        vfsOptions.set(null, opts, true);
      }

      API.createMenu([
        {
          title: API._('LBL_SHOW_HIDDENFILES'),
          type: 'checkbox',
          checked: scandirOptions.showHiddenFiles === true,
          onClick: function() {
            setOption('showHiddenFiles', !scandirOptions.showHiddenFiles);
          }
        },
        {
          title: API._('LBL_SHOW_FILEEXTENSIONS'),
          type: 'checkbox',
          checked: scandirOptions.showFileExtensions === true,
          onClick: function() {
            setOption('showFileExtensions', !scandirOptions.showFileExtensions);
          }
        }
      ], ev);
    },

    call: function(el, method, args) {
      args = args || {};
      args.done = args.done || function() {};

      var target = getChildView(el);

      if ( target ) {
        var tagName = target.tagName.toLowerCase();

        if ( method === 'chdir' ) {
          var t = new GUI.ElementDataView(target);
          var dir = args.path || OSjs.API.getDefaultPath();

          clearTimeout(el._readdirTimeout);
          el._readdirTimeout = setTimeout(function() {
            readdir(el, dir, function(error, result, summary) {
              if ( error ) {
                API.error(API._('ERR_VFSMODULE_XHR_ERROR'), API._('ERR_VFSMODULE_SCANDIR_FMT', dir), error);
              } else {
                t.clear();
                t.add(result);
              }
              args.done(error, summary);
            });

            el._readdirTimeout = clearTimeout(el._readdirTimeout);
          }, 50); // Prevent exessive calls
          return;
        }

        GUI.Elements[tagName].call(target, method, args);
      }
    }
  };

})(OSjs.API, OSjs.Utils, OSjs.VFS, OSjs.GUI);
