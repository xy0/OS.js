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
(function(Application, Window, GUI, Dialogs, Utils, API, VFS) {
  // jscs:disable validateQuoteMarks
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // LOCALES
  /////////////////////////////////////////////////////////////////////////////

  var _Locales = {
    bg_BG : {
      'Background Type' : 'Тип на фон',
      'Image (Repeat)' : 'Изображение (повтарящо се)',
      'Image (Centered)' : 'Изображение (Центрирано)',
      'Image (Fill)' : 'Изображение (Запълващо)',
      'Image (Streched)' : 'Изображение (Разтеглено)',
      'Desktop Margin ({0}px)' : 'Размер на работен плот ({0}px)',
      'Enable Animations' : 'Разреши анимации',
      'Language (requires restart)' : 'Език (нуждае се от рестарт)',
      'Enable Sounds' : 'Включи звуци',
      'Enable Window Switcher' : 'Включи превключване на прозорци',
      'Enable Hotkeys' : 'Включи горещи клавиши',
      'Enable Icon View' : 'Включи иконен-изглед'
    },
    de_DE : {
      'Background Type' : 'Hintergrundtyp',
      'Image (Repeat)' : 'Bild (Wiederholend)',
      'Image (Centered)' : 'Bild (Zentriert)',
      'Image (Fill)' : 'Bild (Ausgefüllt)',
      'Image (Streched)' : 'Bild (Gestreckt)',
      'Desktop Margin ({0}px)' : 'Arbeitsoberflächen Margin ({0}px)',
      'Enable Animations' : 'Animationen verwenden',
      'Language (requires restart)' : 'Sprache (benötigt Neustart)',
      'Enable Sounds' : 'Aktiviere Sounds',
      'Enable Window Switcher' : 'Aktiviere Fensterwechsler',
      'Enable Hotkeys' : 'Aktiviere Hotkeys',
      'Enable Icon View' : 'Aktiviere Icon-Ansicht',
    },
    es_ES : {
      'Background Type' : 'Tipo de fondo',
      'Image (Repeat)' : 'Imagen (Repetir)',
      'Image (Centered)' : 'Imagen (Centrada)',
      'Image (Fill)' : 'Imagen (Estirar)',
      'Image (Streched)' : 'Imagen (Ajustar)',
      'Desktop Margin ({0}px)' : 'Margen del escritorio ({0}px)',
      'Enable Animations' : 'Habilitar animaciones',
      'Language (requires restart)' : 'Idioma (requiere reiniciar)',
      'Enable Sounds' : 'Activar sonidos',
      'Enable Window Switcher' : 'Activar el alternador de ventanas',
      'Enable Hotkeys' : 'Activar Hotkeys',
      'Enable Icon View' : 'Activar la vista de icono',
    },
    ar_DZ : {
      'Background Type' : 'نوع الخلفية',
      'Image (Repeat)' : 'صورة (إعادة)',
      'Image (Centered)' : 'صورة (وسط)',
      'Image (Fill)' : 'صورة (ملئ)',
      'Image (Streched)' : 'صورة (تمدد)',
      'Desktop Margin ({0}px)' : 'هوامش المكتب ({0}px)',
      'Enable Animations' : 'تفعيل الحركة',
      'Language (requires restart)' : 'اللغة (تتطب إعادة التشغيل)',
      'Enable Sounds' : 'تفعيل الأصوات',
      'Enable Window Switcher' : 'تفعيل محول النوافذ',
      'Enable Hotkeys' : 'تفعيل إختصارات لوحة المفاتيح',
      'Enable Icon View' : 'تفعيل مظهر الأيقونات',
      'Remove shortcut' : 'حذف الإختصار',
      'File View': 'خصائص الملفات',
      'Show Hidden Files': 'إظهار الملفات المخفية',
      'Show File Extensions': 'إظهار لواحق الملفات',
      'File View Options': 'خيارات إظهار الملفات',
      'Invert Text Color' : 'عكس لون الخط',
      'Icon View' : 'إظهار الأيقونات',
      'Installed Packages' : 'حزم مثبتة',
      'App Store' : 'متجر التطبيقات',
      'Regenerate metadata' : 'إعادة توليد المعلومات',
      'Install from zip' : 'تثبيت من ملف مضغوط',
      'Install selected' : 'تثبيت المختار',
      'Enable TouchMenu' : 'تفعيل قائمة اللمس'
    },
    fr_FR : {
      'Background Type' : 'Type de fond d\'écran',
      'Image (Repeat)' : 'Image (Répéter)',
      'Image (Centered)' : 'Image (Centrer)',
      'Image (Fill)' : 'Image (Remplir)',
      'Image (Streched)' : 'Image (Étiré)',
      'Desktop Margin ({0}px)' : 'Marge du bureau ({0}px)',
      'Enable Animations' : 'Activer les animations',
      'Language (requires restart)' : 'Langue (redémarrage requis)',
      'Enable Sounds' : 'Activer la musique',
      'Enable Window Switcher' : 'Activer Window Switcher',
      'Enable Hotkeys' : 'Activer les raccourcis clavier',
      'Enable Icon View' : 'Activer l\'affichage des icônes sur le bureau',
      'Remove shortcut' : 'Supprimer le raccourci',
      'File View': 'Options des fichiers',
      'Show Hidden Files': 'Montrer les fichiers cachés',
      'Show File Extensions': 'Montrer les extensions de fichiers',
      'File View Options': 'Options d\'affichage des fichier',
      'Invert Text Color' : 'Inverser la couleur du texte',
      'Icon View' : 'Affichage des icônes',
      'Installed Packages' : 'Paquets installés',
      'App Store' : 'Magasin d\'applications',
      'Regenerate metadata' : 'Régénérer les métadonnées',
      'Install from zip' : 'Installer à partir du fichier zip',
      'Install selected' : 'Installer la sélection',
      'Enable TouchMenu' : 'Activer le TouchMenu'
    },
    it_IT : {
      'Background Type' : 'Tipo di sfondo',
      'Image (Repeat)' : 'Immagine (Ripeti)',
      'Image (Centered)' : 'Immagine (Centrata)',
      'Image (Fill)' : 'Immagine (Riempi)',
      'Image (Streched)' : 'Immagine (Distorci)',
      'Desktop Margin ({0}px)' : 'Margini Scrivania ({0}px)',
      'Enable Animations' : 'Abilita animazioni',
      'Language (requires restart)' : 'Lingua (necessita riavvio)',
      'Enable Sounds' : 'Abilita Suoni',
      'Enable Window Switcher' : 'Abilita Cambia-Finestre',
      'Enable Hotkeys' : 'Abilita Scorciatoie da tastiera',
      'Enable Icon View' : 'Abilita Visualizzazione ad icona',
      'Remove shortcut' : 'Rimuovi scorciatoia',
      'File View': 'Visualizza file',
      'Show Hidden Files': 'Mostra file nascosti',
      'Show File Extensions': 'Mostra estenzioni dei file',
      'File View Options': 'Opzioni visualizza file',
      'Invert Text Color' : 'Inverti colore testi',
      'Icon View' : 'Visualizzazione ad icone',
      'Installed Packages' : 'Installa pacchetti',
      'App Store' : 'Negozio applicazioni',
      'Application' : 'Applicazione',
      'Scope' : 'Scope (namespace)',
      'Regenerate metadata' : 'Rigenerazione metadata',
      'Install from zip' : 'Installa da zip',
      'Install selected' : 'Installa selezionato',
      'Enable TouchMenu' : 'Abilita TouchMenu'
    },
    ko_KR : {
      'Background Type' : '바탕화면 타입',
      'Image (Repeat)' : '이미지 (반복)',
      'Image (Centered)' : '이미지 (가운데)',
      'Image (Fill)' : '이미지 (채우기)',
      'Image (Streched)' : '이미지 (늘이기)',
      'Desktop Margin ({0}px)' : '데스크탑 여백 ({0}px)',
      'Enable Animations' : '애니메이션 효과 켜기',
      'Language (requires restart)' : '언어 (재시작 필요)',
      'Enable Sounds' : '사운드 켜기',
      'Enable Window Switcher' : '윈도우 전환 활성',
      'Enable Hotkeys' : '단축키 활성',
      'Enable Icon View' : '아이콘 보이기',
      'Desktop Corner Snapping ({0}px)' : '바탕화면 가장자리에 붙이기 ({0}px)',
      'Window Snapping ({0}px)' : '창 가장자리에 붙이기 ({0}px)',
      'File View': '파일보기',
      'Show Hidden Files': '숨긴 파일 보이기',
      'Show File Extensions': '파일 확장자 보이기',
      'File View Options': '파일보기 옵션',
      'Invert Text Color' : '텍스트 색상 반전',
      'Icon View' : '아이콘 보기',
      'Installed Packages' : '설치된 패키지',
      'App Store' : '앱스토어',
      'Regenerate metadata' : '메타데이터 재생성',
      'Install from zip' : 'zip 파일로부터 설치하기',
      'Install selected' : '선택된 항목 설치',
      'Enable TouchMenu' : '터치메뉴 활성화',
      'Search Options' : '검색 옵션',
      'Enable Application Search' : '어플리케이션 검색 활성화',
      'Enable File Search' : '파일 검색 활성화'
    },
    nl_NL : {
      'Background Type' : 'Achtergrond type',
      'Image (Repeat)' : 'Afbeelding (Herhalend)',
      'Image (Centered)' : 'Afbeelding (Gecentreerd)',
      'Image (Fill)' : 'Afbeelding (Passend)',
      'Image (Streched)' : 'Afbeelding (Uitrekken)',
      'Desktop Margin ({0}px)' : 'Achtergrondmarge ({0}px)',
      'Enable Animations' : 'Animaties gebruiken',
      'Language (requires restart)' : 'Taal (Herstarten vereist)',
      'Enable Sounds' : 'Activeer Geluiden',
      'Enable Window Switcher' : 'Activeer Venster Wisselaar',
      'Enable Hotkeys' : 'Activeer Hotkeys',
      'Enable Icon View' : 'Activeer Iconen-weergave'
    },
    no_NO : {
      'Background Type' : 'Bakgrunn type',
      'Image (Repeat)' : 'Bilde (Gjenta)',
      'Image (Centered)' : 'Bilde (Sentrert)',
      'Image (Fill)' : 'Bilde (Fyll)',
      'Image (Streched)' : 'Bilde (Strekk)',
      'Desktop Margin ({0}px)' : 'Skrivebord Margin ({0}px)',
      'Enable Animations' : 'Bruk animasjoner',
      'Language (requires restart)' : 'Språk (krever omstart)',
      'Enable Sounds' : 'Skru på lyder',
      'Enable Window Switcher' : 'Skru på Vindu-bytter',
      'Enable Hotkeys' : 'Skru på Hurtigtaster',
      'Enable Icon View' : 'Skru på Ikonvisning',
      'Remove shortcut' : 'Fjern snarvei',
      'Search path \'{0}\' is already handled by another entry': 'Søkestien \'{0}\' er allrede håndtert av en annen oppføring'
    },
    pl_PL : {
      'Background Type' : 'Typ Tła',
      'Image (Repeat)' : 'Powtarzający się',
      'Image (Centered)' : 'Wycentrowany',
      'Image (Fill)' : 'Wypełniony',
      'Image (Streched)' : 'Rozciągnięty',
      'Desktop Margin ({0}px)' : 'Margines Pulpitu ({0}px)',
      'Desktop Corner Snapping ({0}px)' : 'Przyciąganie do Narożników Pulpitu ({0}px)',
      'Window Snapping ({0}px)' : 'Przyciąganie do Okien ({0}px)',
      'Enable Animations' : 'Włączone Animacje',
      'Icon View' : 'Widok Ikon',
      'Language (requires restart)' : 'Język (zmiana wymaga restartu)',
      'Enable Sounds' : 'Włączone Dźwięki',
      'Enable TouchMenu' : 'Włączone Menu Dotykowe',
      'Enable Window Switcher' : 'Właczony Zmieniacz Okien',
      'Enable Hotkeys' : 'Włączone Skróty Klawiaturowe',
      'Enable Icon View' : 'Włączone Pokazywanie Ikon',
      'Remove shortcut' : 'Usuwanie skrótu',
      'File View': 'Widok Plików',
      'Show Hidden Files': 'Pokazuj Ukryte Pliki',
      'Show File Extensions': 'Pokazuj Rozszerzenia Plików',
      'File View Options': 'Opcje Widoku Plików',
      'Invert Text Color' : 'Odwróć Kolor Tekstu',
      'Installed Packages' : 'Zainstalowane Pakiety',
      'App Store' : 'Sklep App',
      'Regenerate metadata' : 'Zregeneruj metadane',
      'Install from zip' : 'Zainstaluj z pliku zip',
      'Install selected' : 'Zainstaluj wybrane'
    },
    ru_RU : {
      'Background Type' : 'Тип фона',
      'Image (Repeat)' : 'Изображение (повторяющееся)',
      'Image (Centered)' : 'Изображение (по центру)',
      'Image (Fill)' : 'Изображение (заполнить)',
      'Image (Streched)' : 'Изображение (растянуть)',
      'Desktop Margin ({0}px)' : 'Отступ рабочего стола ({0}px)',
      'Enable Animations' : 'Использовать анимацию',
      'Enable TouchMenu' : 'Крупное меню',
      'Language (requires restart)' : 'Язык (необходим перезапуск)',
      'Enable Sounds' : 'Включить звук',
      'Enable Window Switcher' : 'Включить растягивание окон',
      'Enable Hotkeys' : 'Включить горячии клавиши',
      'Enable Icon View' : 'Включить ярлыки',
      'Icon View' : 'Ярлыки рабочего стола',
      'Invert Text Color' : 'Обратить цвет текста'
    },
    sk_SK : {
      'Background Type' : 'Typ pozadia',
      'Image (Repeat)' : 'Dlaždice',
      'Image (Centered)' : 'Na stred',
      'Image (Fill)' : 'Vyplniť',
      'Image (Streched)' : 'Roztiahnutý',
      'Desktop Margin ({0}px)' : 'Hranice pracovnej plochy ({0}px)',
      'Enable Animations' : 'Povoliť animácie',
      'Language (requires restart)' : 'Jazyk (vyžaduje reštart)',
      'Enable Sounds' : 'Povoliť zvuky',
      'Enable Window Switcher' : 'Povoliť Prepínač Okien',
      'Enable Hotkeys' : 'Klávesové skratky',
      'Enable Icon View' : 'Ikony na ploche',
      'Remove shortcut' : 'Odstrániť skratku'
    },
    tr_TR : {
      'Background Type' : 'arkaplan türü',
      'Image (Repeat)' : 'resim (tekrarla)',
      'Image (Centered)' : 'resm(ortala)',
      'Image (Fill)' : 'resm (kapla/doldur)',
      'Image (Streched)' : 'resm (uzat)',
      'Desktop Margin ({0}px)' : 'masaüstü kenar ({0}px)',
      'Enable Animations' : 'animasyonlar etkin',
      'Language (requires restart)' : 'Dil(yeniden başlatma gerektirir)',
      'Enable Sounds' : 'Müzik etkin',
      'Enable Window Switcher' : 'Ekran(pencere) değiştirme etkin',
      'Enable Hotkeys' : 'kısayol tuşları etkin',
      'Enable Icon View' : 'icon görünümü etkin',
      'Remove shortcut' : 'kısayolları kaldır'
    },
    vi_VN : {
      'Background Type' : 'Kiểu nền',
      'Image (Repeat)' : 'Lặp lại',
      'Image (Centered)' : 'Căn giữa',
      'Image (Fill)' : 'Lấp đầy',
      'Image (Streched)' : 'Trải dài',
      'Desktop Margin ({0}px)' : 'Phần biên màn hình ({0}px)',
      'Enable Animations' : 'Bật hiệu ứng',
      'Language (requires restart)' : 'Ngôn ngữ (cần khởi động lại)',
      'Enable Sounds' : 'Bật âm thanh',
      'Enable Window Switcher' : 'Bật chuyển đổi cửa sổ',
      'Enable Hotkeys' : 'Bật phím nóng',
      'Enable Icon View' : 'Hiện biểu tượng',
      'Remove shortcut' : 'Xóa lối tắt',
      'File View': 'Quản lí tệp',
      'Show Hidden Files': 'Hiện tập tin ẩn',
      'Show File Extensions': 'Hiện đuôi tập tin',
      'File View Options': 'Cài đặt quản lí tệp',
      'Icon View' : 'Biểu tượng',
      'Installed Packages' : 'Các phần mềm đã cài',
      'App Store' : 'Chợ ứng dụng',
      'Regenerate metadata' : 'Làm mới metadata',
      'Install from zip' : 'Cài từ file zip',
      'Install selected' : 'Cài mục đã chọn',
      'Enable TouchMenu' : 'Bật Menu cảm ứng',
      'Invert Text Color' : 'Đảo màu chữ',
      'Search Options' : 'Cài đặt tìm kiếm',
      'Enable Application Search' : 'Cho phép tìm kiếm phần mềm',
      'Enable File Search' : 'Cho phép tìm kiếm tập tin',
      'Search path \'{0}\' is already handled by another entry': 'Đường dẫn tìm kiếm \'{0}\' đã bị xử lý bởi mục khác'
    }
  };

  function _() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(_Locales);
    return API.__.apply(this, args);
  }

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Applications = OSjs.Applications || {};
  OSjs.Applications.ApplicationSettings = OSjs.Applications.ApplicationSettings || {};
  OSjs.Applications.ApplicationSettings._ = _;

})(OSjs.Core.Application, OSjs.Core.Window, OSjs.GUI, OSjs.Dialogs, OSjs.Utils, OSjs.API, OSjs.VFS);
