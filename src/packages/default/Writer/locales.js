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
(function(Application, Window, GUI, Dialogs, VFS, Utils) {
  // jscs:disable validateQuoteMarks
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // LOCALES
  /////////////////////////////////////////////////////////////////////////////

  var _Locales = {
    bg_BG : {
      'Insert URL' : 'Въведи URL'
    },
    de_DE : {
      'Insert URL' : 'URL einfügen'
    },
    es_ES : {
      'Insert URL' : 'Insertar URL'
    },
    fr_FR : {
      'Insert URL' : 'Insérer une URL'
    },
    ar_DZ : {
      'Insert URL' : 'أدخل رابط'
    },
    it_IT : {
      'Insert URL' : 'Inserisci URL'
    },
    ko_KR : {
      'Insert URL' : '링크 삽입'
    },
    nl_NL : {
      'Insert URL' : 'URL invoegen'
    },
    no_NO : {
      'Insert URL' : 'Sett inn URL'
    },
    pl_PL : {
      'Insert URL' : 'Wpisz URL'
    },
    ru_RU : {
      'Insert URL' : 'Вставить ссылку'
    },
    sk_SK : {
      'Insert URL' : 'Vložiť URL'
    },
    tr_TR : {
      'Insert URL' : 'URL ekle'
    },
    vi_VN : {
      'Insert URL' : 'Thêm URL'
    }
  };

  function _() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(_Locales);
    return OSjs.API.__.apply(this, args);
  }

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationWriter = OSjs.Applications.ApplicationWriter || {};
  OSjs.Applications.ApplicationWriter._ = _;

})(OSjs.Helpers.DefaultApplication, OSjs.Helpers.DefaultApplicationWindow, OSjs.GUI, OSjs.Dialogs, OSjs.VFS, OSjs.Utils);
