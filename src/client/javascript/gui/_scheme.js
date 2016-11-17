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
  // INTERNAL HELPERS
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Internal for parsing GUI elements
   */
  function parseDynamic(scheme, node, win, args) {
    args = args || {};

    var translator = args._ || API._;

    node.querySelectorAll('*[data-label]').forEach(function(el) {
      var label = translator(el.getAttribute('data-label'));
      el.setAttribute('data-label', label);
    });

    node.querySelectorAll('gui-label, gui-button, gui-list-view-column, gui-select-option, gui-select-list-option').forEach(function(el) {
      if ( !el.children.length && !el.getAttribute('data-no-translate') ) {
        var lbl = GUI.Helpers.getValueLabel(el);
        el.appendChild(document.createTextNode(translator(lbl)));
      }
    });

    node.querySelectorAll('gui-button').forEach(function(el) {
      var label = GUI.Helpers.getValueLabel(el);
      if ( label ) {
        el.appendChild(document.createTextNode(API._(label)));
      }
    });

    node.querySelectorAll('*[data-icon]').forEach(function(el) {
      var image = GUI.Helpers.getIcon(el, win);
      el.setAttribute('data-icon', image);
    });

    node.querySelectorAll('*[data-src]').forEach(function(el) {
      var old = el.getAttribute('data-src') || '';
      if ( win._app && old.match(/^app:\/\//) ) {
        var source = API.getApplicationResource(win._app, old.replace('app://', ''));
        el.setAttribute('data-src', source);
      }
    });
  }

  /**
   * Method for adding children (moving)
   */
  function addChildren(frag, root, before) {
    if ( frag ) {
      var children = frag.children;
      var i = 0;
      while ( children.length && i < 10000 ) {
        if ( before ) {
          root.parentNode.insertBefore(children[0], root);
        } else {
          root.appendChild(children[0]);
        }
        i++;
      }
    }
  }

  /**
   * Makes sure "include" fragments are rendered correctly
   */
  function resolveFragments(scheme, node) {
    function _resolve() {
      var nodes = node.querySelectorAll('gui-fragment');
      if ( nodes.length ) {
        nodes.forEach(function(el) {
          var id = el.getAttribute('data-fragment-id');
          if ( id ) {
            var frag = scheme.getFragment(id, 'application-fragment');
            if ( frag ) {
              addChildren(frag.cloneNode(true), el.parentNode);
            } else {
              console.warn('Fragment', id, 'not found');
            }
          }
          Utils.$remove(el); // Or else we'll never get out of the loop!
        });
        return true;
      }
      return false;
    }

    if ( scheme ) {
      var resolving = true;
      while ( resolving ) {
        resolving = _resolve();
      }
    }
  }

  /**
   * Removes self-closing tags from HTML string
   */
  function removeSelfClosingTags(str) {
    var split = (str || '').split('/>');
    var newhtml = '';
    for (var i = 0; i < split.length - 1;i++) {
      var edsplit = split[i].split('<');
      newhtml += split[i] + '></' + edsplit[edsplit.length - 1].split(' ')[0] + '>';
    }
    return newhtml + split[split.length - 1];
  }

  /**
   * Cleans a HTML string
   */
  function cleanScheme(html) {
    return Utils.cleanHTML(removeSelfClosingTags(html));
  }

  /**
   * Makes sure "external include" fragments are rendered correctly.
   *
   * Currently this only supports one level deep.
   *
   * This occurs on the load() function instead on runtime due to
   * performance concerns.
   */
  function resolveExternalFragments(root, html, cb) {
    var doc = document.createElement('div');
    doc.innerHTML = html;

    var nodes = doc.querySelectorAll('gui-fragment[data-fragment-external]');
    Utils.asyncs(nodes.map(function(el) {
      return {
        element: el,
        uri: el.getAttribute('data-fragment-external')
      };
    }), function(iter, index, next) {
      var uri = iter.uri.replace(/^\//, '');
      if ( uri.length < 3 ) {
        console.warn('resolveExternalFragments()', 'invalid', iter);
        return next();
      }

      Utils.ajax({
        url: Utils.pathJoin(root, uri),
        onsuccess: function(h) {
          var tmp = document.createElement('div');
          tmp.innerHTML = cleanScheme(h);
          addChildren(tmp, iter.element, iter.element);
          tmp = next();
        },
        onerror: function() {
          next();
        }
      });
    }, function() {
      cb(doc.innerHTML);

      doc = null;
      nodes = null;
    });
  }

  /////////////////////////////////////////////////////////////////////////////
  // SCHEME
  /////////////////////////////////////////////////////////////////////////////

  /**
   * The class for loading and parsing UI Schemes
   *
   * @summary Class for loading, parsing and manipulating Scheme files.
   *
   * @constructor Scheme
   * @memberof OSjs.GUI
   */
  function UIScheme(url) {
    console.debug('UIScheme::construct()', url);

    /**
     * The URL of the Scheme file
     * @name url
     * @memberof OSjs.GUI.Scheme#
     * @type {String}
     */
    this.url = url;

    /**
     * The Scheme DOM Node
     * @name scheme
     * @memberof OSjs.GUI.Scheme#
     * @type {DocumentFragment}
     */
    this.scheme = null;

    this.triggers = {render: []};
  }

  /**
   * Destroys the instance
   *
   * @function destroy
   * @memberof OSjs.GUI.Scheme#
   */
  UIScheme.prototype.destroy = function() {
    Utils.$empty(this.scheme);

    this.scheme = null;
    this.triggers = {};
  };

  /**
   * Register event
   *
   * @function on
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {String}      f       Event name
   * @param   {Function}    fn      Function/callback
   */
  UIScheme.prototype.on = function(f, fn) {
    this.triggers[f].push(fn);
  };

  UIScheme.prototype._trigger = function(f, args) {
    args = args || [];

    var self = this;
    if ( this.triggers[f] ) {
      this.triggers[f].forEach(function(fn) {
        fn.apply(self, args);
      });
    }
  };

  UIScheme.prototype._load = function(html) {
    var doc = document.createDocumentFragment();
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    doc.appendChild(wrapper);

    this.scheme = doc.cloneNode(true);

    wrapper = null;
    doc = null;
  };

  /**
   * Load Scheme from given String
   *
   * @function loadString
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {String}      html    HTML data
   * @param   {Function}    cb      callback => fn(error, scheme)
   */
  UIScheme.prototype.loadString = function(html, cb) {
    console.debug('UIScheme::loadString()');
    this._load(cleanScheme(html));
    if ( cb ) {
      cb(false, this.scheme);
    }
  };

  /**
   * Load Scheme from URL
   *
   * @function load
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {Function}    cb      callback => fn(error, DocumentFragment)
   * @param   {Function}    [cbxhr] callback on ajax => fn(error, html)
   */
  UIScheme.prototype.load = function(cb, cbxhr) {
    cbxhr = cbxhr || function() {};

    console.debug('UIScheme::load()', this.url);

    var self = this;
    var src = this.url;
    if ( src.substr(0, 1) !== '/' && !src.match(/^(https?|ftp)/) ) {
      src = window.location.pathname + src;
    }

    var root = Utils.dirname(src);
    Utils.ajax({
      url: src,
      onsuccess: function(html) {
        html = cleanScheme(html);

        resolveExternalFragments(root, html, function(result) {
          // This is normally used for the preloader for caching
          cbxhr(false, result);

          // Then we run some manipulations
          self._load(result);

          // And finally, finish
          cb(false, self.scheme);
        });
      },
      onerror: function() {
        cb('Failed to fetch scheme');
        cbxhr(true);
      }
    });
  };

  /**
   * Get fragment from ID (and/or type)
   *
   * @function getFragment
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {String}      id      ID
   * @param   {String}      [type]  Type (application-window | application-fragment)
   *
   * @return  {Node}
   */
  UIScheme.prototype.getFragment = function(id, type) {
    var content = null;
    if ( id ) {
      if ( type ) {
        content = this.scheme.querySelector(type + '[data-id="' + id + '"]');
      } else {
        content = this.scheme.querySelector('application-window[data-id="' + id + '"]') ||
                  this.scheme.querySelector('application-fragment[data-id="' + id + '"]');
      }
    }
    return content;
  };

  /**
   * Parses the given fragment
   *
   * @function parse
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {String}            id        Fragment ID
   * @param   {String}            [type]    Fragment Type
   * @param   {OSjs.Core.Window}  [win]     OS.js Window
   * @param   {Function}          [onparse] Callback on parsed
   * @param   {Object}            [args]    Parameters
   *
   * @return  {Node}
   */
  UIScheme.prototype.parse = function(id, type, win, onparse, args) {
    var content = this.getFragment(id, type);

    console.debug('UIScheme::parse()', id);

    if ( !content ) {
      console.error('UIScheme::parse()', 'No fragment found', id + '@' + type);
      return null;
    }

    type = type || content.tagName.toLowerCase();

    if ( content ) {
      var node = content.cloneNode(true);

      UIScheme.parseNode(this, win, node, type, args, onparse, id);

      return node;
    }

    return null;
  };

  /**
   * Renders the given fragment into Window
   *
   * @function render
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {OSjs.Core.Window}    win       OS.js Window
   * @param   {String}              id        Fragment ID
   * @param   {Node}                [root]    Root HTML Node
   * @param   {String}              [type]    Fragment Type
   * @param   {Function}            [onparse] Callback on parsed
   * @param   {Object}              [args]    Parameters
   *
   * @return  {Node}
   */
  UIScheme.prototype.render = function(win, id, root, type, onparse, args) {
    root = root || win._getRoot();
    if ( root instanceof GUI.Element ) {
      root = root.$element;
    }

    function setWindowProperties(frag) {
      if ( frag ) {
        var width = parseInt(frag.getAttribute('data-width'), 10) || 0;
        var height = parseInt(frag.getAttribute('data-height'), 10) || 0;
        var allow_maximize = frag.getAttribute('data-allow_maximize');
        var allow_minimize = frag.getAttribute('data-allow_minimize');
        var allow_close = frag.getAttribute('data-allow_close');
        var allow_resize = frag.getAttribute('data-allow_resize');

        if ( (!isNaN(width) && width > 0) || (!isNaN(height) && height > 0) ) {
          win._resize(width, height);
        }

        win._setProperty('allow_maximize', allow_maximize);
        win._setProperty('allow_minimize', allow_minimize);
        win._setProperty('allow_close', allow_close);
        win._setProperty('allow_resize', allow_resize);
      }
    }

    console.debug('UIScheme::render()', id);

    var content = this.parse(id, type, win, onparse, args);
    addChildren(content, root);

    root.querySelectorAll('application-fragment').forEach(function(e) {
      Utils.$remove(e);
    });

    if ( !win._restored ) {
      setWindowProperties(this.getFragment(id));
    }

    this._trigger('render', [root]);
  };

  /**
   * Renders the given fragment into Window
   *
   * @function create
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {OSjs.Core.Window}      win           OS.js Window
   * @param   {String}                tagName       OS.js GUI Element name
   * @param   {Object}                params        Parameters
   * @param   {Node}                  parentNode    Parent Node
   * @param   {Object}                applyArgs     New element parameters
   *
   * @return  {OSjs.GUI.Element}
   */
  UIScheme.prototype.create = function(win, tagName, params, parentNode, applyArgs) {
    tagName = tagName || '';
    params = params || {};
    parentNode = parentNode || win._getRoot();
    if ( parentNode instanceof GUI.Element ) {
      parentNode = parentNode.$element;
    }

    var el;
    if ( GUI.Elements[tagName] && GUI.Elements[tagName].create ) {
      el = GUI.Elements[tagName].create(params);
    } else {
      el = GUI.Helpers.createElement(tagName, params);
    }

    parentNode.appendChild(el);
    GUI.Elements[tagName].build(el, applyArgs, win);

    return this.get(el);
  };

  /**
   * Returns given UIElement by ID
   *
   * @function find
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {OSjs.Core.Window}      win       OS.js Window
   * @param   {String}                id        Element ID (data-id)
   * @param   {Node}                  [root]    Root Node
   *
   * @return  {OSjs.GUI.Element}
   */
  UIScheme.prototype.find = function(win, id, root) {
    root = this._findRoot(win, root);
    var res = this._findDOM(win, id, root);
    return this.get(res.el, res.q);
  };

  /**
   * Returns given UIElement by query
   *
   * @function findByQuery
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {OSjs.Core.Window}      win       OS.js Window
   * @param   {String}                id        Element ID (data-id)
   * @param   {Node}                  [root]    Root Node
   * @param   {Boolean}               [all]     Perform `querySelectorAll`
   *
   * @return  {OSjs.GUI.Element}
   */
  UIScheme.prototype.findByQuery = function(win, query, root, all) {
    root = this._findRoot(win, root);

    var el;
    var self = this;

    if ( all ) {
      el = root.querySelectorAll(query).map(function(e) {
        return self.get(e, query);
      });
    }

    el = root.querySelector(query);
    return this.get(el, query);
  };

  /**
   * Returns given DOMElement by ID
   *
   * @function findDOM
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {OSjs.Core.Window}      win       OS.js Window
   * @param   {String}                id        Element ID (data-id)
   * @param   {Node}                  [root]    Root Node
   *
   * @return  {Node}
   */
  UIScheme.prototype.findDOM = function(win, id, root) {
    root = this._findRoot(win, root);
    return this._findDOM(win, id, root).el;
  };

  UIScheme.prototype._findRoot = function(win, root) {
    if ( !(win instanceof OSjs.Core.Window) ) {
      throw new Error('UIScheme::_findDOM() expects a instance of Window');
    }
    return root || win._getRoot();
  };

  UIScheme.prototype._findDOM = function(win, id, root) {
    var q = '[data-id="' + id + '"]';
    return {
      q: q,
      el: root.querySelector(q)
    };
  };

  /**
   * Gets UIElement by DOMElement
   *
   * @function get
   * @memberof OSjs.GUI.Scheme#
   *
   * @param   {Node}    el      DOM Element
   *
   * @return  {OSjs.GUI.Element}
   */
  UIScheme.prototype.get = function(el, q) {
    return UIScheme.getElementInstance(el, q);
  };

  /**
   * Get HTML from Scheme
   *
   * @function getHTML
   * @memberof OSjs.GUI.Scheme#
   *
   * @return  {String}
   */
  UIScheme.prototype.getHTML = function() {
    return this.scheme.firstChild.innerHTML;
  };

  /**
   * Parses the given HTML node and makes OS.js compatible markup
   *
   * PLEASE NOTE THAT THIS METHOD IS STATIC!
   *
   * @function parseNode
   * @memberof OSjs.GUI.Scheme
   *
   * @param   {OSjs.GUI.Scheme}     scheme      Reference to the Scheme
   * @param   {OSjs.Core.Window}    win         Reference to the Window
   * @param   {Node}                node        The HTML node to parse
   * @param   {Object}              args        List of arguments to send to the parser
   * @param   {Function}            onparse     Method to signal when parsing has started
   * @param   {Mixed}               [id]        The id of the source (for debugging)
   *
   * @return  {String}
   */
  UIScheme.parseNode = function(scheme, win, node, type, args, onparse, id) {
    onparse = onparse || function() {};
    args = args || {};
    type = type || 'snipplet';

    // Resolve fragment includes before dynamic rendering
    if ( args.resolve !== false ) {
      resolveFragments(scheme, node);
    }

    // Apply a default className to non-containers
    node.querySelectorAll('*').forEach(function(el) {
      var lcase = el.tagName.toLowerCase();
      if ( lcase.match(/^gui\-/) && !lcase.match(/(\-container|\-(h|v)box|\-columns?|\-rows?|(status|tool)bar|(button|menu)\-bar|bar\-entry)$/) ) {
        Utils.$addClass(el, 'gui-element');
      }
    });

    // Go ahead and parse dynamic elements (like labels)
    parseDynamic(scheme, node, win, args);

    // Lastly render elements
    onparse(node);

    Object.keys(GUI.Elements).forEach(function(key) {
      node.querySelectorAll(key).forEach(function(pel) {
        if ( pel._wasParsed ) {
          return;
        }

        try {
          GUI.Elements[key].build(pel);
        } catch ( e ) {
          console.warn('parseNode()', id, type, win, 'exception');
          console.warn(e, e.stack);
        }
        pel._wasParsed = true;
      });
    });
  };

  /**
   * @function getElementInstance
   * @memberof OSjs.GUI.Scheme
   * @see OSjs.GUI.Scheme#get
   */
  UIScheme.getElementInstance = function(el, q) {
    if ( el ) {
      var tagName = el.tagName.toLowerCase();
      if ( tagName.match(/^gui\-(list|tree|icon|file)\-view$/) || tagName.match(/^gui\-(select|tabs)/) ) {
        return new GUI.ElementDataView(el, q);
      }
    }
    return new GUI.Element(el, q);
  };

  /////////////////////////////////////////////////////////////////////////////
  // DialogScheme
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Shortcut for creating a new UIScheme class
   *
   * @summary Helper for loading Dialog scheme files.
   *
   * @constructor DialogScheme
   * @memberof OSjs.GUI
   */
  var DialogScheme = (function() {
    var dialogScheme;

    return {

      /**
       * Get the Dialog scheme
       *
       * @function get
       * @memberof OSjs.GUI.DialogScheme#
       *
       * @return {OSjs.GUI.Scheme}
       */
      get: function() {
        return dialogScheme;
      },

      /**
       * Destroy the Dialog scheme
       *
       * @function destroy
       * @memberof OSjs.GUI.DialogScheme#
       */
      destroy: function() {
        if ( dialogScheme ) {
          dialogScheme.destroy();
        }
        dialogScheme = null;
      },

      /**
       * Initialize the Dialog scheme
       *
       * @function init
       * @memberof OSjs.GUI.DialogScheme#
       *
       * @param   {Function}    cb      Callback function
       */
      init: function(cb) {
        if ( dialogScheme ) {
          cb();
          return;
        }

        if ( OSjs.API.isStandalone() ) {
          var html = OSjs.STANDALONE.SCHEMES['/dialogs.html'];
          dialogScheme = new OSjs.GUI.Scheme();
          dialogScheme.loadString(html);
          cb();
          return;
        }

        var root = API.getConfig('Connection.RootURI');
        var url = root + 'client/dialogs.html';
        if ( API.getConfig('Connection.Dist') === 'dist' ) {
          url = root + 'dialogs.html';
        }

        dialogScheme = GUI.createScheme(url);
        dialogScheme.load(function(error) {
          if ( error ) {
            console.warn('OSjs.GUI.initDialogScheme()', 'error loading dialog schemes', error);
          }
          cb();
        });
      }

    };

  })();

  /////////////////////////////////////////////////////////////////////////////
  // API
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Shortcut for creating a new UIScheme class
   *
   * @function createScheme
   * @memberof OSjs.GUI
   *
   * @param {String}    url     URL to scheme file
   *
   * @return {OSjs.GUI.Scheme}
   */
  function createScheme(url) {
    return new UIScheme(url);
  }

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  GUI.Scheme = Object.seal(UIScheme);
  GUI.DialogScheme = DialogScheme;
  GUI.createScheme = createScheme;

})(OSjs.API, OSjs.Utils, OSjs.VFS, OSjs.GUI);
