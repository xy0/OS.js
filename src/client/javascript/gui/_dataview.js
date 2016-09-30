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

  var _classMap = { // Defaults to (foo-bar)-entry
    'gui-list-view': 'gui-list-view-row'
  };

  /////////////////////////////////////////////////////////////////////////////
  // HELPERS
  /////////////////////////////////////////////////////////////////////////////

  function getEntryTagName(type) {
    if ( typeof type !== 'string' ) {
      type = type.tagName.toLowerCase();
    }

    var className = _classMap[type];
    if ( !className ) {
      className = type + '-entry';
    }

    return className;
  }

  function getEntryFromEvent(ev) {
    var t = ev.isTrusted ? ev.target : (ev.relatedTarget || ev.target);
    var tn = t.tagName.toLowerCase();

    if ( tn.match(/(view|textarea|body)$/) ) {
      return null;
    } else if ( tn === 'gui-list-view-column' ) {
      return t.parentNode;
    }

    return t;
  }

  function handleItemSelection(ev, item, idx, className, selected, root, multipleSelect) {
    root = root || item.parentNode;

    if ( idx === -1 ) {
      root.querySelectorAll(getEntryTagName(root)).forEach(function(e) {
        Utils.$removeClass(e, 'gui-active');
      });
      selected = [];
    } else {
      if ( !multipleSelect || !ev.shiftKey ) {
        root.querySelectorAll(className).forEach(function(i) {
          Utils.$removeClass(i, 'gui-active');
        });
        selected = [];
      }

      var findex = selected.indexOf(idx);
      if ( findex >= 0 ) {
        selected.splice(findex, 1);
        Utils.$removeClass(item, 'gui-active');
      } else {
        selected.push(idx);
        Utils.$addClass(item, 'gui-active');
      }
    }

    selected.sort(function(a, b) {
      return a - b;
    });

    return selected;
  }

  function getSelected(el) {
    return GUI.Elements[el.tagName.toLowerCase()].values(el);
  }

  function handleKeyPress(el, ev) {
    var map = {};
    var key = ev.keyCode;
    var type = el.tagName.toLowerCase();
    var className = getEntryTagName(type);
    var root = el.querySelector(type + '-body');
    var entries = root.querySelectorAll(className);
    var count = entries.length;

    if ( !count ) {
      return;
    }

    if ( key === Utils.Keys.ENTER ) {
      el.dispatchEvent(new CustomEvent('_activate', {detail: {entries: getSelected(el)}}));
      return;
    }

    map[Utils.Keys.C] = function(ev) {
      if ( ev.ctrlKey ) {
        var selected = getSelected(el);
        if ( selected && selected.length ) {
          var data = [];

          selected.forEach(function(s) {
            if ( s && s.data ) {
              data.push(new VFS.File(s.data.path, s.data.mime));
            }
          });

          API.setClipboard(data);
        }
      }
    };

    var selected = el._selected.concat() || [];
    var first = selected.length ? selected[0] : 0;
    var last = selected.length > 1 ? selected[selected.length - 1] : first;
    var current = 0;

    function select() {
      var item = entries[current];
      if ( item ) {
        el._selected = handleItemSelection(ev, item, current, className, selected, root, ev.shiftKey);
        GUI.Elements._dataview.scrollIntoView(el, item);
      }
    }

    function getRowSize() {
      /* NOT ACCURATE!
      var ew = entries[0].offsetWidth;
      var tw = root.offsetWidth;
      var d = Math.floor(tw/ew);
      */
      var d = 0;

      var lastTop = -1;
      entries.forEach(function(e) {
        if ( lastTop === -1 ) {
          lastTop = e.offsetTop;
        }

        if ( lastTop !== e.offsetTop ) {
          return false;
        }

        lastTop = e.offsetTop;
        d++;

        return true;
      });

      return d;
    }

    function handleKey() {
      function next() {
        current = Math.min(last + 1, count);
        select();
      }
      function prev() {
        current = Math.max(0, first - 1);
        select();
      }

      if ( type === 'gui-tree-view' || type === 'gui-list-view' ) {
        map[Utils.Keys.UP] = prev;
        map[Utils.Keys.DOWN] = next;
      } else {
        map[Utils.Keys.UP] = function() {
          current = Math.max(0, first - getRowSize());
          select();
        };
        map[Utils.Keys.DOWN] = function() {
          current = Math.max(last, last + getRowSize());
          select();
        };
        map[Utils.Keys.LEFT] = prev;
        map[Utils.Keys.RIGHT] = next;
      }

      if ( map[key] ) {
        map[key](ev);
      }
    }

    handleKey();
  }

  function getValueParameter(r) {
    var value = r.getAttribute('data-value');
    try {
      return JSON.parse(value);
    } catch ( e ) {}

    return value;
  }

  function matchValueByKey(r, val, key, idx) {
    var value = r.getAttribute('data-value');
    if ( !key && (val === idx || val === value) ) {
      return r;
    } else {
      try {
        var json = JSON.parse(value);
        if ( typeof json[key] === 'object' ? json[key] === val : String(json[key]) === String(val) ) {
          return r;
        }
      } catch ( e ) {}
    }
    return false;
  }

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Element: '_dataview'
   *
   * This is an abstraction layer for Icon, Tree and List views.
   *
   * See `ev.detail` for data on events (like on 'change').
   *
   * <pre><code>
   *   getter    value     Mixed         The value/currently selected
   *   getter    selected  Mixed         Alias of 'value'
   *   getter    entry     Mixed         Gets an etnry by value, key
   *   setter    value     Mixed         The value/currently selected
   *   property  multiple  boolean       If multiple elements are selectable
   *   event     select                  When entry was selected => fn(ev)
   *   event     activate                When entry was activated => fn(ev)
   *   action    add                     Add elements(s) => fn(entries)
   *   action    patch                   Patch/Update elements => fn(entries)
   *   action    remove                  Removes element => fn(arg)
   *   action    clear                   Clear elements => fn()
   * </code></pre>
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var DataView
   * @abstract
   */
  GUI.Elements._dataview = {
    clear: function(el, body) {
      body = body || el;

      Utils.$empty(body);
      body.scrollTop = 0;
      el._selected = [];
    },

    add: function(el, args, oncreate) {
      var entries = args[0];
      if ( !(entries instanceof Array) ) {
        entries = [entries];
      }
      entries.forEach(oncreate);

      return this;
    },

    patch: function(el, args, className, body, oncreate, oninit) {
      var self = this;
      var entries = args[0];
      var single = false;

      if ( !(entries instanceof Array) ) {
        entries = [entries];
        single = true;
      }

      var inView = {};
      body.querySelectorAll(className).forEach(function(row) {
        var id = row.getAttribute('data-id');
        if ( id !== null ) {
          inView[id] = row;
        }
      });

      entries.forEach(function(entry) {
        var insertBefore;
        if ( typeof entry.id !== 'undefined' && entry.id !== null ) {
          if ( inView[entry.id] ) {
            insertBefore = inView[entry.id];
            delete inView[entry.id];
          }

          var row = oncreate(entry);
          if ( row ) {
            if ( insertBefore ) {
              if ( Utils.$hasClass(insertBefore, 'gui-active') ) {
                Utils.$addClass(row, 'gui-active');
              }

              body.insertBefore(row, insertBefore);
              self.remove(el, null, className, insertBefore);
            } else {
              body.appendChild(row);
            }
            oninit(el, row);
          }
        }
      });

      if ( !single ) {
        Object.keys(inView).forEach(function(k) {
          self.remove(el, null, className, inView[k]);
        });
      }

      inView = {};
      this.updateActiveSelection(el, className);

      return this;
    },

    remove: function(el, args, className, target, parentEl) {
      function remove(cel) {
        Utils.$remove(cel);
      }

      parentEl = parentEl || el;

      if ( target ) {
        remove(target);
        return;
      }
      if ( typeof args[1] === 'undefined' && typeof args[0] === 'number' ) {
        remove(parentEl.querySelectorAll(className)[args[0]]);
      } else {
        var findId = args[0];
        var findKey = args[1] || 'id';
        var q = 'data-' + findKey + '="' + findId + '"';
        parentEl.querySelectorAll(className + '[' + q + ']').forEach(remove);
      }

      this.updateActiveSelection(el, className);

      return this;
    },

    updateActiveSelection: function(el, className) {
      var active = [];
      el.querySelectorAll(className + '.gui-active').forEach(function(cel) {
        active.push(Utils.$index(cel));
      });
      el._active = active;
    },

    scrollIntoView: function(el, element) {
      var pos = Utils.$position(element, el);
      var marginTop = 0;
      if ( el.tagName.toLowerCase() === 'gui-list-view' ) {
        var header = el.querySelector('gui-list-view-head');
        if ( header ) {
          marginTop = header.offsetHeight;
        }
      }

      var scrollSpace = (el.scrollTop + el.offsetHeight) - marginTop;
      var scrollTop = el.scrollTop + marginTop;
      var elTop = pos.top - marginTop;

      if ( pos !== null && (elTop > scrollSpace || elTop < scrollTop) ) {
        el.scrollTop = elTop;
        return true;
      }

      return false;
    },

    bindEntryEvents: function(el, row, className) {

      function createDraggable() {
        var value = row.getAttribute('data-value');
        if ( value !== null ) {
          try {
            value = JSON.parse(value);
          } catch ( e ) {}
        }

        var source = row.getAttribute('data-draggable-source');
        if ( source === null ) {
          source = GUI.Helpers.getWindowId(el);
          if ( source !== null ) {
            source = {wid: source};
          }
        }

        GUI.Helpers.createDraggable(row, {
          type   : el.getAttribute('data-draggable-type') || row.getAttribute('data-draggable-type'),
          source : source,
          data   : value
        });

        var tooltip = row.getAttribute('data-tooltip');
        if ( tooltip && !row.getAttribute('title') ) {
          row.setAttribute('title', tooltip);
        }
      }

      el.dispatchEvent(new CustomEvent('_render', {detail: {
        element: row,
        data: GUI.Helpers.getViewNodeValue(row)
      }}));

      if ( el.getAttribute('data-draggable') === 'true' ) {
        createDraggable();
      }
    },

    getSelected: function(el, entries) {
      var selected = [];
      entries.forEach(function(iter, idx) {
        if ( Utils.$hasClass(iter, 'gui-active') ) {
          selected.push({
            index: idx,
            data: GUI.Helpers.getViewNodeValue(iter)
          });
        }
      });
      return selected;
    },

    getEntry: function(el, entries, val, key, asValue) {
      if ( val ) {
        var result = null;
        entries.forEach(function(r, idx) {
          if ( !result && matchValueByKey(r, val, key, idx) ) {
            result = r;
          }
        });

        return (asValue && result) ? getValueParameter(result) : result;
      }

      return !asValue ? entries : (entries || []).map(function(iter) {
        return getValueParameter(iter);
      });
    },

    setSelected: function(el, body, entries, val, key, opts) {
      var self = this;
      var select = [];
      var scrollIntoView = false;
      if ( typeof opts === 'object' ) {
        scrollIntoView = opts.scroll === true;
      }

      function sel(r, idx) {
        select.push(idx);
        Utils.$addClass(r, 'gui-active');
        if ( scrollIntoView ) {
          self.scrollIntoView(el, r);
        }
      }

      entries.forEach(function(r, idx) {
        Utils.$removeClass(r, 'gui-active');
        if ( matchValueByKey(r, val, key, idx) ) {
          sel(r, idx);
        }
      });

      el._selected = select;
    },

    build: function(el, applyArgs) {
      el._selected = [];
      el.scrollTop = 0;

      Utils.$addClass(el, 'gui-data-view');

      var singleClick = el.getAttribute('data-single-click') === 'true';
      var multipleSelect = el.getAttribute('data-multiple');
      multipleSelect = multipleSelect === null || multipleSelect === 'true';

      function select(ev) {
        ev.stopPropagation();
        API.blurMenu();

        var row = getEntryFromEvent(ev);
        var className = row ? row.tagName.toLowerCase() : null;

        if ( className === 'gui-tree-view-expander' ) {
          OSjs.GUI.Elements[el.tagName.toLowerCase()].call(el, 'expand', {ev: ev, entry: row.parentNode});
          return;
        }

        var idx = Utils.$index(row);
        el._selected = handleItemSelection(ev, row, idx, className, el._selected, el, multipleSelect);
        el.dispatchEvent(new CustomEvent('_select', {detail: {entries: getSelected(el)}}));
      }

      function activate(ev) {
        ev.stopPropagation();
        API.blurMenu();

        if ( singleClick ) {
          select(ev);
        }

        el.dispatchEvent(new CustomEvent('_activate', {detail: {entries: getSelected(el)}}));
      }

      function context(ev) {
        select(ev);
        el.dispatchEvent(new CustomEvent('_contextmenu', {detail: {entries: getSelected(el), x: ev.clientX, y: ev.clientY}}));
      }

      if ( !el.querySelector('textarea.gui-focus-element') && !el.getAttribute('no-selection') ) {
        var underlay = document.createElement('textarea');
        underlay.setAttribute('aria-label', '');
        underlay.setAttribute('aria-hidden', 'true');
        underlay.setAttribute('readonly', 'true');
        underlay.className = 'gui-focus-element';
        Utils.$bind(underlay, 'focus', function(ev) {
          ev.preventDefault();
          Utils.$addClass(el, 'gui-element-focused');
        });
        Utils.$bind(underlay, 'blur', function(ev) {
          ev.preventDefault();
          Utils.$removeClass(el, 'gui-element-focused');
        });
        Utils.$bind(underlay, 'keydown', function(ev) {
          ev.preventDefault();
          handleKeyPress(el, ev);
        });
        Utils.$bind(underlay, 'keypress', function(ev) {
          ev.preventDefault();
        });

        if ( singleClick ) {
          Utils.$bind(el, 'click', activate, true);
        } else {
          Utils.$bind(el, 'click', select, true);
          Utils.$bind(el, 'dblclick', activate, true);
        }

        Utils.$bind(el, 'contextmenu', function(ev) {
          ev.preventDefault();
          context(ev);
          return false;
        }, true);

        this.bind(el, 'select', function(ev) {
          if ( Utils.$hasClass(el, 'gui-element-focused') ) {
            return;
          }
          // NOTE: This is a fix for Firefox stupid behaviour when focusing/blurring textboxes
          // (which is used to have a focusable area in this case, called underlay)
          var oldTop = el.scrollTop;
          underlay.focus();
          el.scrollTop = oldTop;
          setTimeout(function() {
            el.scrollTop = oldTop;
          }, 2);
        }, true);

        el.appendChild(underlay);
      }
    },

    focus: function(el) {
      try {
        var underlay = el.querySelector('.gui-focus-element');
        underlay.focus();
      } catch ( e ) {
        console.warn(e, e.stack);
      }
    },

    blur: function(el) {
      try {
        var underlay = el.querySelector('.gui-focus-element');
        underlay.blur();
      } catch ( e ) {
        console.warn(e, e.stack);
      }
    },

    bind: function(el, evName, callback, params) {
      if ( (['activate', 'select', 'expand', 'contextmenu', 'render', 'drop']).indexOf(evName) !== -1 ) {
        evName = '_' + evName;
      }
      Utils.$bind(el, evName, callback.bind(new GUI.Element(el)), params);
    }

  };

})(OSjs.API, OSjs.Utils, OSjs.VFS, OSjs.GUI);
