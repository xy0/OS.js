/*!
 * OS.js - JavaScript Cloud/Web Sound Platform
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
(function(Application, Window, Utils, API, VFS, GUI) {
  'use strict';

  var sounds = {};

  function renderList(win, scheme) {
    win._find('SoundsList').clear().add(Object.keys(sounds).map(function(name) {
      return {
        value: {
          name: name,
          value: sounds[name]
        },
        columns: [
          {label: name},
          {label: sounds[name]}
        ]
      };
    }));
  }

  function editList(win, scheme, key) {
    var _ = OSjs.Applications.ApplicationSettings._;
    win._toggleDisabled(true);
    API.createDialog('Input', {
      message: _('Enter filename for:') + ' ' + key.name,
      value: key.value
    }, function(ev, button, value) {
      win._toggleDisabled(false);
      value = value || '';
      if ( value.length ) {
        sounds[key.name] = value;
      }

      renderList(win, scheme);
    })
  }

  /////////////////////////////////////////////////////////////////////////////
  // MODULE
  /////////////////////////////////////////////////////////////////////////////

  var module = {
    group: 'personal',
    name: 'Sounds',
    label: 'LBL_SOUNDS',
    icon: 'status/stock_volume-max.png',

    init: function() {
    },

    update: function(win, scheme, settings, wm) {
      win._find('SoundThemeName').set('value', settings.soundTheme);
      win._find('EnableSounds').set('value', settings.enableSounds);

      sounds = Utils.cloneObject(settings.sounds);

      renderList(win, scheme);
    },

    render: function(win, scheme, root, settings, wm) {
      var soundThemes = (function(tmp) {
        return Object.keys(tmp).map(function(t) {
          return {label: tmp[t], value: t};
        });
      })(wm.getSoundThemes());

      win._find('SoundThemeName').add(soundThemes);

      win._find('SoundsEdit').on('click', function() {
        var selected = win._find('SoundsList').get('selected');
        if ( selected && selected[0] ) {
          editList(win, scheme, selected[0].data);
        }
      });
    },

    save: function(win, scheme, settings, wm) {
      settings.soundTheme = win._find('SoundThemeName').get('value');
      settings.enableSounds = win._find('EnableSounds').get('value');

      if ( sounds && Object.keys(sounds).length ) {
        settings.sounds = sounds;
      }
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationSettings = OSjs.Applications.ApplicationSettings || {};
  OSjs.Applications.ApplicationSettings.Modules = OSjs.Applications.ApplicationSettings.Modules || {};
  OSjs.Applications.ApplicationSettings.Modules.Sounds = module;

})(OSjs.Core.Application, OSjs.Core.Window, OSjs.Utils, OSjs.API, OSjs.VFS, OSjs.GUI);
