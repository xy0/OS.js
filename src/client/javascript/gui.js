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

  GUI.Helpers = GUI.Helpers || {};

  /**
   * @namespace GUI
   * @memberof OSjs
   */

  /**
   * @namespace Helpers
   * @memberof OSjs.GUI
   */

  /////////////////////////////////////////////////////////////////////////////
  // HELPERS
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Gets window id from upper parent element
   *
   * @function getWindowId
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}      el      Child element (can be anything)
   *
   * @return  {Number}
   */
  GUI.Helpers.getWindowId = function getWindowId(el) {
    while ( el.parentNode ) {
      var attr = el.getAttribute('data-window-id');
      if ( attr !== null ) {
        return parseInt(attr, 10);
      }
      el = el.parentNode;
    }
    return null;
  };

  /**
   * Gets "label" from a node
   *
   * @function getLabel
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}      el      The element
   *
   * @return  {String}
   */
  GUI.Helpers.getLabel = function getLabel(el) {
    var label = el.getAttribute('data-label');
    return label || '';
  };

  /**
   * Gets "label" from a node (Where it can be innerHTML and parameter)
   *
   * @function getValueLabel
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}      el      The element
   *
   * @return  {String}
   */
  GUI.Helpers.getValueLabel = function getValueLabel(el, attr) {
    var label = attr ? el.getAttribute('data-label') : null;

    if ( el.childNodes.length && el.childNodes[0].nodeType === 3 && el.childNodes[0].nodeValue ) {
      label = el.childNodes[0].nodeValue;
      Utils.$empty(el);
    }

    return label || '';
  };

  /**
   * Gets "value" from a node
   *
   * @function getViewNodeValue
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}      el       The element
   *
   * @return  {String}
   */
  GUI.Helpers.getViewNodeValue = function getViewNodeValue(el) {
    var value = el.getAttribute('data-value');
    if ( typeof value === 'string' && value.match(/^\[|\{/) ) {
      try {
        value = JSON.parse(value);
      } catch ( e ) {
        value = null;
      }
    }
    return value;
  };

  /**
   * Internal for getting
   *
   * @function getIcon
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}                el      Element
   * @param   {OSjs.Core.Window}    [win]   Window Reference
   *
   * @return  {String}
   */
  GUI.Helpers.getIcon = function getIcon(el, win) {
    var image = el.getAttribute('data-icon');

    if ( image && image !== 'undefined') {
      if ( image.match(/^stock:\/\//) ) {
        image = image.replace('stock://', '');

        var size  = '16x16';
        try {
          var spl = image.split('/');
          var tmp = spl.shift();
          var siz = tmp.match(/^\d+x\d+/);
          if ( siz ) {
            size = siz[0];
            image = spl.join('/');
          }

          image = API.getIcon(image, size);
        } catch ( e ) {}
      } else if ( image.match(/^app:\/\//) ) {
        image = API.getApplicationResource(win._app, image.replace('app://', ''));
      }

      return image;
    }

    return null;
  };

  /**
   * Wrapper for getting custom dom element property value
   *
   * @function getProperty
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}     el          Element
   * @param   {String}   param       Parameter name
   * @param   {String}   [tagName]   What tagname is in use? Automatic
   *
   * @return  {Mixed}
   */
  GUI.Helpers.getProperty = function getProperty(el, param, tagName) {
    tagName = tagName || el.tagName.toLowerCase();
    var isDataView = tagName.match(/^gui\-(tree|icon|list|file)\-view$/);

    if ( param === 'value' && !isDataView) {
      if ( (['gui-text', 'gui-password', 'gui-textarea', 'gui-slider', 'gui-select', 'gui-select-list']).indexOf(tagName) >= 0 ) {
        return el.querySelector('input, textarea, select').value;
      }
      if ( (['gui-checkbox', 'gui-radio', 'gui-switch']).indexOf(tagName) >= 0 ) {
        return !!el.querySelector('input').checked;
        //return el.querySelector('input').value === 'on';
      }
      return null;
    }

    if ( (param === 'value' || param === 'selected') && isDataView ) {
      return GUI.Elements[tagName].values(el);
    }

    return el.getAttribute('data-' + param);
  };

  /**
   * Wrapper for setting custom dom element property value
   *
   * @function setProperty
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}            el            Element
   * @param   {String}          param         Parameter name
   * @param   {Mixed}           value         Parameter value
   * @param   {String}          [tagName]     What tagname is in use? Automatic
   */
  GUI.Helpers.setProperty = function setProperty(el, param, value, tagName) {
    tagName = tagName || el.tagName.toLowerCase();

    function _setKnownAttribute(i, k, v, a) {
      if ( v ) {
        i.setAttribute(k, k);
      } else {
        i.removeAttribute(k);
      }

      if ( a ) {
        el.setAttribute('aria-' + k, String(value === true));
      }
    }

    function _setValueAttribute(i, k, v) {
      if ( typeof v === 'object' ) {
        try {
          v = JSON.stringify(value);
        } catch ( e ) {}
      }

      i.setAttribute(k, String(v));
    }

    // Generics for input elements
    var inner = el.children[0];
    var accept = ['gui-slider', 'gui-text', 'gui-password', 'gui-textarea', 'gui-checkbox', 'gui-radio', 'gui-select', 'gui-select-list', 'gui-button'];

    (function() {
      var firstChild;

      var params = {
        readonly: function() {
          _setKnownAttribute(firstChild, 'readonly', value, true);
        },

        disabled: function() {
          _setKnownAttribute(firstChild, 'disabled', value, true);
        },

        value: function() {
          if ( tagName === 'gui-radio' || tagName === 'gui-checkbox' ) {
            _setKnownAttribute(firstChild, 'checked', value);

            firstChild.checked = !!value;
          }
          firstChild.value = value;
        },

        label: function() {
          el.appendChild(firstChild);
          Utils.$remove(el.querySelector('label'));
          GUI.Helpers.createInputLabel(el, tagName.replace(/^gui\-/, ''), firstChild, value);
        }
      };

      if ( accept.indexOf(tagName) >= 0 ) {
        firstChild = el.querySelector('textarea, input, select, button');

        if ( firstChild ) {
          if ( params[param] ) {
            params[param]();
          } else {
            _setValueAttribute(firstChild, param, value || '');
          }
        }
      }
    })();

    // Other types of elements
    accept = ['gui-image', 'gui-audio', 'gui-video'];
    if ( (['src', 'controls', 'autoplay', 'alt']).indexOf(param) >= 0 && accept.indexOf(tagName) >= 0 ) {
      inner[param] = value;
    }

    // Normal DOM attributes
    if ( (['_id', '_class', '_style']).indexOf(param) >= 0 ) {
      inner.setAttribute(param.replace(/^_/, ''), value);
      return;
    }

    // Set the actual root element property value
    if ( param !== 'value' ) {
      _setValueAttribute(el, 'data-' + param, value);
    }
  };

  /**
   * Creates a label for given input element
   *
   * @function createInputLabel
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}            el        Element root
   * @param   {String}          type      Input element type
   * @param   {Node}            input     The input element
   * @param   {String}          [label]   Used when updating
   */
  GUI.Helpers.createInputLabel = function createInputLabel(el, type, input, label) {
    label = label || GUI.Helpers.getLabel(el);

    if ( label ) {
      var lbl = document.createElement('label');
      var span = document.createElement('span');
      span.appendChild(document.createTextNode(label));

      if ( type === 'checkbox' || type === 'radio' ) {
        lbl.appendChild(input);
        lbl.appendChild(span);
      } else {
        lbl.appendChild(span);
        lbl.appendChild(input);
      }
      el.appendChild(lbl);
    } else {
      el.appendChild(input);
    }
  };

  /**
   * Create a new custom DOM element
   *
   * @function createElement
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {String}      tagName           Tag Name
   * @param   {Object}      params            Dict with data-* properties
   * @param   {Array}       [ignoreParams]    List of arguments to ignore
   *
   * @return {Node}
   */
  GUI.Helpers.createElement = function createElement(tagName, params, ignoreParams) {
    ignoreParams = ignoreParams || [];

    var el = document.createElement(tagName);

    var classMap = {
      textalign: function(v) {
        Utils.$addClass(el, 'gui-align-' + v);
      },
      className: function(v) {
        Utils.$addClass(el, v);
      }
    };

    function getValue(k, value) {
      if ( typeof value === 'boolean' ) {
        value = value ? 'true' : 'false';
      } else if ( typeof value === 'object' ) {
        try {
          value = JSON.stringify(value);
        } catch ( e ) {}
      }

      return value;
    }

    if ( typeof params === 'object' ) {
      Object.keys(params).forEach(function(k) {
        if ( ignoreParams.indexOf(k) >= 0 ) {
          return;
        }

        var value = params[k];
        if ( typeof value !== 'undefined' && typeof value !== 'function' ) {
          if ( classMap[k] ) {
            classMap[k](value);
            return;
          }

          var fvalue = getValue(k, value);
          el.setAttribute('data-' + k, fvalue);
        }
      });
    }

    return el;
  };

  /**
   * Sets the flexbox CSS style properties for given container
   *
   * @function setFlexbox
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}            el              The container
   * @param   {Number}          grow            Grow factor
   * @param   {Number}          shrink          Shrink factor
   * @param   {String}          [basis=auto]    Basis
   * @param   {Node}            [checkel]       Take defaults from this node
   */
  GUI.Helpers.setFlexbox = function setFlexbox(el, grow, shrink, basis, checkel) {
    checkel = checkel || el;
    (function() {
      if ( typeof basis === 'undefined' || basis === null ) {
        basis = checkel.getAttribute('data-basis') || 'auto';
      }
    })();

    (function() {
      if ( typeof grow === 'undefined' || grow === null ) {
        grow = checkel.getAttribute('data-grow') || 0;
      }
    })();

    (function() {
      if ( typeof shrink === 'undefined' || shrink === null ) {
        shrink = checkel.getAttribute('data-shrink') || 0;
      }
    })();

    var flex = [grow, shrink];
    if ( basis.length ) {
      flex.push(basis);
    }

    var style = flex.join(' ');
    el.style.WebkitBoxFlex = style;
    el.style.MozBoxFlex = style;

    el.style.WebkitFlex = style;
    el.style.MozFlex = style;
    el.style.MSFlex = style;
    el.style.OFlex = style;
    el.style.flex = style;

    var align = el.getAttribute('data-align');
    Utils.$removeClass(el, 'gui-flex-align-start');
    Utils.$removeClass(el, 'gui-flex-align-end');
    if ( align ) {
      Utils.$addClass(el, 'gui-flex-align-' + align);
    }
  };

  /**
   * Wrapper for creating a draggable container
   *
   * @function createDrag
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}              el          The container
   * @param   {Function}          onDown      On down action callback
   * @param   {Function}          onMove      On move action callback
   * @param   {Function}          onUp        On up action callback
   */
  OSjs.GUI.Helpers.createDrag = function createDrag(el, onDown, onMove, onUp) {
    onDown = onDown || function() {};
    onMove = onMove || function() {};
    onUp = onUp || function() {};

    var startX, startY, currentX, currentY;
    var dragging = false;

    function _onMouseDown(ev, pos, touchDevice) {
      ev.preventDefault();

      startX = pos.x;
      startY = pos.y;

      onDown(ev, {x: startX, y: startY});
      dragging = true;

      Utils.$bind(window, 'mouseup:guidrag', _onMouseUp, false);
      Utils.$bind(window, 'mousemove:guidrag', _onMouseMove, false);
    }

    function _onMouseMove(ev, pos, touchDevice) {
      ev.preventDefault();

      if ( dragging ) {
        currentX = pos.x;
        currentY = pos.y;

        var diffX = currentX - startX;
        var diffY = currentY - startY;

        onMove(ev, {x: diffX, y: diffY}, {x: currentX, y: currentY});
      }
    }

    function _onMouseUp(ev, pos, touchDevice) {
      onUp(ev, {x: currentX, y: currentY});
      dragging = false;

      Utils.$unbind(window, 'mouseup:guidrag');
      Utils.$unbind(window, 'mousemove:guidrag');
    }

    Utils.$bind(el, 'mousedown', _onMouseDown, false);
  };

  /**
   * Method for getting the next (or previous) element in sequence
   *
   * If you don't supply a current element, the first one will be taken!
   *
   * @function getNextElement
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Boolean}     prev        Get previous element instead of next
   * @param   {Node}        el          The current element
   * @param   {Node}        root        The root container
   */
  GUI.Helpers.getNextElement = function getNextElement(prev, current, root) {
    function getElements() {
      var ignore_roles = ['menu', 'menuitem', 'grid', 'gridcell', 'listitem'];
      var list = [];

      root.querySelectorAll('.gui-element').forEach(function(e) {
        // Ignore focused and disabled elements, and certain aria roles
        if ( Utils.$hasClass(e, 'gui-focus-element') || ignore_roles.indexOf(e.getAttribute('role')) >= 0 || e.getAttribute('data-disabled') === 'true' ) {
          return;
        }

        // Elements without offsetParent are invisible
        if ( e.offsetParent ) {
          list.push(e);
        }
      });
      return list;
    }

    function getCurrentIndex(els, m) {
      var found = -1;

      // Simply get index from array, it seems indexOf is a bit iffy here ?!
      if ( m ) {
        els.every(function(e, idx) {
          if ( e === m ) {
            found = idx;
          }
          return found === -1;
        });
      }

      return found;
    }

    function getCurrentParent(els, m) {
      if ( m ) {
        var cur = m;
        while ( cur.parentNode ) {
          if ( Utils.$hasClass(cur, 'gui-element') ) {
            return cur;
          }
          cur = cur.parentNode;
        }

        return null;
      }

      // When we dont have a initial element, take the first one
      return els[0];
    }

    function getNextIndex(els, p, i) {
      // This could probably be prettier, but it does the job
      if ( prev ) {
        i = (i <= 0) ? (els.length) - 1 : (i - 1);
      } else {
        i = (i >= (els.length - 1)) ? 0 : (i + 1);
      }
      return i;
    }

    function getNext(els, i) {
      var next = els[i];

      // Get "real" elements from input wrappers
      if ( next.tagName.match(/^GUI\-(BUTTON|TEXT|PASSWORD|SWITCH|CHECKBOX|RADIO|SELECT)/) ) {
        next = next.querySelectorAll('input, textarea, button, select')[0];
      }

      // Special case for elements that wraps
      if ( next.tagName === 'GUI-FILE-VIEW' ) {
        next = next.children[0];
      }

      return next;
    }

    if ( root ) {
      var elements = getElements();
      if ( elements.length ) {
        var currentParent = getCurrentParent(elements, current);
        var currentIndex = getCurrentIndex(elements, currentParent);

        if ( currentIndex >= 0 ) {
          var nextIndex = getNextIndex(elements, currentParent, currentIndex);
          return getNext(elements, nextIndex);
        }
      }
    }

    return null;
  };

  /**
   * Create a draggable DOM element
   *
   * @function createDraggable
   * @memberof OSjs.GUI.Helpers
   *
   * @param  {Node}          el                               DOMElement
   * @param  {Object}        args                             JSON of draggable params
   * @param  {Object}        args.data                        The data (JSON by default)
   * @param  {String}        [args.type]                      A custom drag event 'type'
   * @param  {String}        [args.effect=move]               The draggable effect (cursor)
   * @param  {String}        [args.mime=application/json]     The mime type of content
   * @param  {Function}      args.onStart                     Callback when drag started => fn(ev, el, args)
   * @param  {Function}      args.onEnd                       Callback when drag ended => fn(ev, el, args)
   */
  GUI.Helpers.createDraggable = function createDraggable(el, args) {
    args = OSjs.Utils.argumentDefaults(args, {
      type       : null,
      effect     : 'move',
      data       : null,
      mime       : 'application/json',
      dragImage  : null,
      onStart    : function() {
        return true;
      },
      onEnd      : function() {
        return true;
      }
    });

    if ( OSjs.Utils.isIE() ) {
      args.mime = 'text';
    }

    function _toString(mime) {
      return JSON.stringify({
        type:   args.type,
        effect: args.effect,
        data:   args.data,
        mime:   args.mime
      });
    }

    function _dragStart(ev) {
      try {
        ev.dataTransfer.effectAllowed = args.effect;
        if ( args.dragImage && (typeof args.dragImage === 'function') ) {
          if ( ev.dataTransfer.setDragImage ) {
            var dragImage = args.dragImage(ev, el);
            if ( dragImage ) {
              var dragEl    = dragImage.element;
              var dragPos   = dragImage.offset;

              document.body.appendChild(dragEl);
              ev.dataTransfer.setDragImage(dragEl, dragPos.x, dragPos.y);
            }
          }
        }
        ev.dataTransfer.setData(args.mime, _toString(args.mime));
      } catch ( e ) {
        console.warn('Failed to dragstart: ' + e);
        console.warn(e.stack);
      }
    }

    el.setAttribute('draggable', 'true');
    el.setAttribute('aria-grabbed', 'false');

    Utils.$bind(el, 'dragstart', function(ev) {
      this.setAttribute('aria-grabbed', 'true');

      this.style.opacity = '0.4';
      if ( ev.dataTransfer ) {
        _dragStart(ev);
      }
      return args.onStart(ev, this, args);
    }, false);

    Utils.$bind(el, 'dragend', function(ev) {
      this.setAttribute('aria-grabbed', 'false');
      this.style.opacity = '1.0';
      return args.onEnd(ev, this, args);
    }, false);
  };

  /**
   * Create a droppable DOM element
   *
   * @function createDroppable
   * @memberof OSjs.GUI.Helpers
   *
   * @param   {Node}            el                              DOMElement
   * @param   {Object}          args                            JSON of droppable params
   * @param   {String}          [args.accept]                   Accept given drag event 'type'
   * @param   {String}          [args.effect=move]              The draggable effect (cursor)
   * @param   {String}          [args.mime=application/json]    The mime type of content
   * @param   {Boolean}         [args.files=true]               Support file drops from OS
   * @param   {Function}        args.onEnter                    Callback when drag entered => fn(ev, el)
   * @param   {Function}        args.onOver                     Callback when drag over => fn(ev, el)
   * @param   {Function}        args.onLeave                    Callback when drag leave => fn(ev, el)
   * @param   {Function}        args.onDrop                     Callback when drag drop all => fn(ev, el)
   * @param   {Function}        args.onFilesDropped             Callback when drag drop file => fn(ev, el, files, args)
   * @param   {Function}        args.onItemDropped              Callback when drag drop internal object => fn(ev, el, item, args)
   */
  GUI.Helpers.createDroppable = function createDroppable(el, args) {
    args = OSjs.Utils.argumentDefaults(args, {
      accept         : null,
      effect         : 'move',
      mime           : 'application/json',
      files          : true,
      onFilesDropped : function() {
        return true;
      },
      onItemDropped  : function() {
        return true;
      },
      onEnter        : function() {
        return true;
      },
      onOver         : function() {
        return true;
      },
      onLeave        : function() {
        return true;
      },
      onDrop         : function() {
        return true;
      }
    });

    if ( OSjs.Utils.isIE() ) {
      args.mime = 'text';
    }

    function getParent(start, matcher) {
      if ( start === matcher ) {
        return true;
      }

      var i = 10;

      while ( start && i > 0 ) {
        if ( start === matcher ) {
          return true;
        }
        start = start.parentNode;
        i--;
      }
      return false;
    }

    function _onDrop(ev, el) {
      ev.stopPropagation();
      ev.preventDefault();

      args.onDrop(ev, el);
      if ( !ev.dataTransfer ) {
        return true;
      }

      if ( args.files ) {
        var files = ev.dataTransfer.files;
        if ( files && files.length ) {
          return args.onFilesDropped(ev, el, files, args);
        }
      }

      var data;
      try {
        data = ev.dataTransfer.getData(args.mime);
      } catch ( e ) {
        console.warn('Failed to drop: ' + e);
      }
      if ( data ) {
        var item = JSON.parse(data);
        if ( args.accept === null || args.accept === item.type ) {
          return args.onItemDropped(ev, el, item, args);
        }
      }

      return false;
    }

    el.setAttribute('aria-dropeffect', args.effect);

    Utils.$bind(el, 'drop', function(ev) {
      //Utils.$removeClass(el, 'onDragEnter');
      return _onDrop(ev, this);
    }, false);

    Utils.$bind(el, 'dragenter', function(ev) {
      //Utils.$addClass(el, 'onDragEnter');
      return args.onEnter.call(this, ev, this, args);
    }, false);

    Utils.$bind(el, 'dragover', function(ev) {
      ev.preventDefault();
      if ( !getParent(ev.target, el) ) {
        return false;
      }

      ev.stopPropagation();
      ev.dataTransfer.dropEffect = args.effect;
      return args.onOver.call(this, ev, this, args);
    }, false);

    Utils.$bind(el, 'dragleave', function(ev) {
      //Utils.$removeClass(el, 'onDragEnter');
      return args.onLeave.call(this, ev, this, args);
    }, false);
  };

})(OSjs.API, OSjs.Utils, OSjs.VFS, OSjs.GUI);
