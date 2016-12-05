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
  // HELPERS
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Element: 'gui-paned-view'
   *
   * A view with resizable content boxes
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-paned-view
   */
  GUI.Elements['gui-paned-view'] = {
    bind: function(el, evName, callback, params) {
      if ( evName === 'resize' ) {
        evName = '_' + evName;
      }
      Utils.$bind(el, evName, callback.bind(new GUI.Element(el)), params);
    },
    build: function(el) {
      var orient = el.getAttribute('data-orientation') || 'horizontal';

      function bindResizer(resizer, idx, cel) {
        var resizeEl = resizer.previousElementSibling;
        if ( !resizeEl ) {
          return;
        }

        var startWidth = resizeEl.offsetWidth;
        var startHeight = resizeEl.offsetHeight;
        var minSize = 16;
        var maxSize = Number.MAX_VALUE;

        GUI.Helpers.createDrag(resizer, function(ev) {
          startWidth = resizeEl.offsetWidth;
          startHeight = resizeEl.offsetHeight;
          minSize = parseInt(cel.getAttribute('data-min-size'), 10) || minSize;

          var max = parseInt(cel.getAttribute('data-max-size'), 10);
          if ( !max ) {
            var totalSize = resizer.parentNode[(orient === 'horizontal' ? 'offsetWidth' : 'offsetHeight')]
            var totalContainers = resizer.parentNode.querySelectorAll('gui-paned-view-container').length;
            var totalSpacers = resizer.parentNode.querySelectorAll('gui-paned-view-handle').length;

            maxSize = totalSize - (totalContainers * 16) - (totalSpacers * 8);
          }
        }, function(ev, diff) {
          var newWidth = startWidth + diff.x;
          var newHeight = startHeight + diff.y;

          var flex;
          if ( orient === 'horizontal' ) {
            if ( !isNaN(newWidth) && newWidth > 0 && newWidth >= minSize && newWidth <= maxSize ) {
              flex = newWidth.toString() + 'px';
            }
          } else {
            if ( !isNaN(newHeight) && newHeight > 0 && newHeight >= minSize && newHeight <= maxSize ) {
              flex = newHeight.toString() + 'px';
            }
          }

          if ( flex ) {
            resizeEl.style.webkitFlexBasis = flex;
            resizeEl.style.mozFflexBasis = flex;
            resizeEl.style.msFflexBasis = flex;
            resizeEl.style.oFlexBasis = flex;
            resizeEl.style.flexBasis = flex;
          }
        }, function(ev) {
          el.dispatchEvent(new CustomEvent('_resize', {detail: {index: idx}}));
        });

      }

      el.querySelectorAll('gui-paned-view-container').forEach(function(cel, idx) {
        if ( idx % 2 ) {
          var resizer = document.createElement('gui-paned-view-handle');
          resizer.setAttribute('role', 'separator');
          cel.parentNode.insertBefore(resizer, cel);
          bindResizer(resizer, idx, cel);
        }
      });
    }
  };

  /**
   * Element: 'gui-paned-view-container'
   *
   * <pre><code>
   *   property  base      String        CSS base flexbox property
   *   property  grow      integer       CSS grow flexbox property
   *   property  shrink    integer       CSS shrink flexbox property
   *   property  min-size  integer       Minimum size in pixels
   *   property  max-size  integer       Maxmimum size in pixels
   * </code></pre>
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-paned-view-container
   */
  GUI.Elements['gui-paned-view-container'] = {
    build: function(el) {
      GUI.Helpers.setFlexbox(el);
    }
  };

  /**
   * Element: 'gui-button-bar'
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-button-bar
   */
  GUI.Elements['gui-button-bar'] = {
    build: function(el) {
      el.setAttribute('role', 'toolbar');
    }
  };

  /**
   * Element: 'gui-toolbar'
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-toolbar
   */
  GUI.Elements['gui-toolbar'] = {
    build: function(el) {
      el.setAttribute('role', 'toolbar');
    }
  };

  /**
   * Element: 'gui-grid'
   *
   * A grid-type container with equal-sized containers
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-grid
   */
  GUI.Elements['gui-grid'] = {
    build: function(el) {
      var rows = el.querySelectorAll('gui-grid-row');
      var p = 100 / rows.length;

      rows.forEach(function(r) {
        r.style.height = String(p) + '%';
      });
    }
  };

  /**
   * Element: 'gui-grid-row'
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-grid-row
   */
  GUI.Elements['gui-grid-row'] = {
    build: function(el) {
    }
  };

  /**
   * Element: 'gui-grid-entry'
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-grid-entry
   */
  GUI.Elements['gui-grid-entry'] = {
    build: function(el) {
    }
  };

  /**
   * Element: 'gui-vbox'
   *
   * Vertical boxed layout
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-vbox
   */
  GUI.Elements['gui-vbox'] = {
    build: function(el) {
    }
  };

  /**
   * Element: 'gui-vbox-container'
   *
   * Vertical boxed layout container
   *
   * <pre><code>
   *   property  base      String        CSS base flexbox property
   *   property  grow      integer       CSS grow flexbox property
   *   property  shrink    integer       CSS shrink flexbox property
   *   property  expand    boolean       Make content expand to full width
   *   property  fill      boolean       Make content fill up entire space
   * </code></pre>
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-vbox-container
   */
  GUI.Elements['gui-vbox-container'] = {
    build: function(el) {
      GUI.Helpers.setFlexbox(el);
    }
  };

  /**
   * Element: 'gui-hbox'
   *
   * Horizontal boxed layout
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-hbox
   */
  GUI.Elements['gui-hbox'] = {
    build: function(el) {
    }
  };

  /**
   * Element: 'gui-hbox-container'
   *
   * Horizontal boxed layout container
   *
   * <pre><code>
   *   property  base      String        CSS base flexbox property
   *   property  grow      integer       CSS grow flexbox property
   *   property  shrink    integer       CSS shrink flexbox property
   *   property  expand    boolean       Make content expand to full width
   *   property  fill      boolean       Make content fill up entire space
   * </code></pre>
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-hbox-container
   */
  GUI.Elements['gui-hbox-container'] = {
    build: function(el) {
      GUI.Helpers.setFlexbox(el);
    }
  };

  /**
   * Element: 'gui-expander'
   *
   * A expandable/collapsable container with label and indicator
   *
   * <pre><code>
   *   property  label     String        The label
   *   property  expanded  boolean       Expanded state (default=true)
   * </code></pre>
   *
   * @constructs OSjs.GUI.Element
   * @memberof OSjs.GUI.Elements
   * @var gui-expander
   */
  GUI.Elements['gui-expander'] = (function() {
    function toggleState(el, expanded) {
      if ( typeof expanded === 'undefined' ) {
        expanded = el.getAttribute('data-expanded') !== 'false';
        expanded = !expanded;
      }

      el.setAttribute('aria-expanded', String(expanded));
      el.setAttribute('data-expanded', String(expanded));
      return expanded;
    }

    return {
      set: function(el, param, value) {
        if ( param === 'expanded' ) {
          return toggleState(el, value === true);
        }
        return null;
      },
      bind: function(el, evName, callback, params) {
        if ( (['change']).indexOf(evName) !== -1 ) {
          evName = '_' + evName;
        }
        Utils.$bind(el, evName, callback.bind(new GUI.Element(el)), params);
      },
      build: function(el) {
        var lbltxt = el.getAttribute('data-label') || '';
        var label = document.createElement('gui-expander-label');

        Utils.$bind(label, 'click', function(ev) {
          el.dispatchEvent(new CustomEvent('_change', {detail: {expanded: toggleState(el)}}));
        }, false);

        label.appendChild(document.createTextNode(lbltxt));

        el.setAttribute('role', 'toolbar');
        el.setAttribute('aria-expanded', 'true');
        el.setAttribute('data-expanded', 'true');
        if ( el.children.length ) {
          el.insertBefore(label, el.children[0]);
        } else {
          el.appendChild(label);
        }
      }
    };
  })();

})(OSjs.API, OSjs.Utils, OSjs.VFS, OSjs.GUI);
