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
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS' AND
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
(function() {
  // jscs:disable validateQuoteMarks
  'use strict';

  OSjs.Locales.no_NO = {
    'ERR_FILE_OPEN'             : 'Feil ved åpning av fil',
    'ERR_WM_NOT_RUNNING'        : 'Window Manager kjører ikke',
    'ERR_FILE_OPEN_FMT'         : 'Filen \'**{0}**\' kunne ikke bli åpnet',
    'ERR_APP_MIME_NOT_FOUND_FMT': 'Fant ingen Applikasjoner som støtter \'{0}\' filer',
    'ERR_APP_LAUNCH_FAILED'     : 'Klarte ikke starte Applikasjon',
    'ERR_APP_LAUNCH_FAILED_FMT' : 'En feil oppstod ved oppstart av: {0}',
    'ERR_APP_CONSTRUCT_FAILED_FMT'  : 'Applikasjonen \'{0}\' construct feilet: {1}',
    'ERR_APP_INIT_FAILED_FMT'       : 'Applikasjonen \'{0}\' init() feilet: {1}',
    'ERR_APP_RESOURCES_MISSING_FMT' : 'Applikasjonen ressursjer mangler for \'{0}\', eller de feilet under lasting!',
    'ERR_APP_PRELOAD_FAILED_FMT'    : 'Applikasjonen \'{0}\' preloading feilet: \n{1}',
    'ERR_APP_LAUNCH_ALREADY_RUNNING_FMT'    : 'Applikasjonen \'{0}\' kjører allerede og bare en instans er tillatt!',
    'ERR_APP_LAUNCH_MANIFEST_FAILED_FMT'    : 'Klarte ikke starte \'{0}\'. Manifest ble ikke funnet!',
    'ERR_APP_LAUNCH_COMPABILITY_FAILED_FMT' : 'Klarte ikke starte \'{0}\'. Nettleseren din støtter ikke: {1}',

    'ERR_NO_WM_RUNNING'         : 'Window Manager kjører ikke',
    'ERR_CORE_INIT_FAILED'      : 'Klarte ikke starte OS.js',
    'ERR_CORE_INIT_FAILED_DESC' : 'En feil oppstod under oppstart av OS.js',
    'ERR_CORE_INIT_NO_WM'       : 'Kan ikke starte OS.js: Ingen window manager definert!',
    'ERR_CORE_INIT_WM_FAILED_FMT'   : 'Kan ikke starte OS.js: Window Manager startet ikke: {0}',
    'ERR_CORE_INIT_PRELOAD_FAILED'  : 'Kan ikke starte OS.js: Feil under forhåndslasting...',
    'ERR_JAVASCRIPT_EXCEPTION'      : 'JavaScript Feilrapport',
    'ERR_JAVACSRIPT_EXCEPTION_DESC' : 'En uventet feil eller bug oppstod.',

    'ERR_APP_API_ERROR'           : 'Applikasjon API feil',
    'ERR_APP_API_ERROR_DESC_FMT'  : 'Applikasjon {0} feilet under operasjonen \'{1}\'',
    'ERR_APP_MISSING_ARGUMENT_FMT': 'Mangler argument: {0}',
    'ERR_APP_UNKNOWN_ERROR'       : 'Ukjent feil',

    'ERR_OPERATION_TIMEOUT'       : 'Tidsavbrudd i operasjon',
    'ERR_OPERATION_TIMEOUT_FMT'   : 'Tidsavbrudd i operasjon ({0})',

    'ERR_ARGUMENT_FMT'    : '\'{0}\' expects \'{1}\' to be a \'{2}\', \'{3}\' given',

    // Window
    'ERR_WIN_DUPLICATE_FMT' : 'Du har allerede et Window med navnet \'{0}\'',
    'WINDOW_MINIMIZE' : 'Minimiser',
    'WINDOW_MAXIMIZE' : 'Maksimer',
    'WINDOW_RESTORE'  : 'Gjenopprett',
    'WINDOW_CLOSE'    : 'Lukk',
    'WINDOW_ONTOP_ON' : 'På topp (På)',
    'WINDOW_ONTOP_OFF': 'På topp (Av)',

    // Handler
    'TITLE_SIGN_OUT' : 'Logg ut',
    'TITLE_SIGNED_IN_AS_FMT' : 'Logget inn som: {0}',
    'ERR_LOGIN_FMT' : 'Login feil: {0}',
    'ERR_LOGIN_INVALID' : 'Ugyldig innlogging',

    // SESSION
    'ERR_NO_SESSION': 'Ingen sessjon er aktiv. Vil du laste på nytt?',
    'MSG_SESSION_WARNING' : 'Er du sikker på at du vil avslutte OS.js? Du vil tape alle ulagrede data!',

    // Service
    'BUGREPORT_MSG' : 'Vennligst rapporter dette problemet hvis du tror det er en feil.\nLegg ved en beskrivelse om hvordan problemet oppstod og hvordan man kan reprodusere feilen.',

    // API
    'SERVICENOTIFICATION_TOOLTIP' : 'Innloget i eksterne tjenester: {0}',

    // Utils
    'ERR_UTILS_XHR_FATAL' : 'Fatal Feil',
    'ERR_UTILS_XHR_FMT' : 'AJAX/XHR Feil: {0}',

    // Dialogs
    'DIALOG_LOGOUT_TITLE' : 'Logg ut (Avslutt)', // Actually located in session.js
    'DIALOG_LOGOUT_MSG_FMT' : 'Logger ut bruker \'{0}\'.\nVil du lagre gjeldende sessjon?',

    'DIALOG_CLOSE' : 'Lukk',
    'DIALOG_CANCEL': 'Avbryt',
    'DIALOG_APPLY' : 'Angi',
    'DIALOG_OK'    : 'OK',

    'DIALOG_ALERT_TITLE' : 'Advarsel Dialog',

    'DIALOG_COLOR_TITLE' : 'Farge Dialog',
    'DIALOG_COLOR_R' : 'Rød: {0}',
    'DIALOG_COLOR_G' : 'Grønn: {0}',
    'DIALOG_COLOR_B' : 'Blå: {0}',
    'DIALOG_COLOR_A' : 'Alfa: {0}',

    'DIALOG_CONFIRM_TITLE' : 'Bekreft Dialog',

    'DIALOG_ERROR_MESSAGE'   : 'Beskjed',
    'DIALOG_ERROR_SUMMARY'   : 'Oppsummering',
    'DIALOG_ERROR_TRACE'     : 'Trace',
    'DIALOG_ERROR_BUGREPORT' : 'Bugreport',

    'DIALOG_FILE_SAVE'      : 'Lagre',
    'DIALOG_FILE_OPEN'      : 'Åpne',
    'DIALOG_FILE_MKDIR'     : 'Ny Mappe',
    'DIALOG_FILE_MKDIR_MSG' : 'Lage ny mappe i **{0}**',
    'DIALOG_FILE_OVERWRITE' : 'Vil du overskrive filen \'{0}\'?',
    'DIALOG_FILE_MNU_VIEWTYPE' : 'Visningstype',
    'DIALOG_FILE_MNU_LISTVIEW' : 'Liste-visning',
    'DIALOG_FILE_MNU_TREEVIEW' : 'Tre-visining',
    'DIALOG_FILE_MNU_ICONVIEW' : 'Ikon-visning',
    'DIALOG_FILE_ERROR'        : 'FileDialog Error',
    'DIALOG_FILE_ERROR_SCANDIR': 'Klarte ikke liste innhold for mappen \'{0}\' fordi en feil oppstod',
    'DIALOG_FILE_ERROR_FIND': 'Klarte ikke søke i mappen \'{0}\' fordi en feil oppstod',
    'DIALOG_FILE_MISSING_FILENAME' : 'Du må velge en fil eller skrive inn filnavn!',
    'DIALOG_FILE_MISSING_SELECTION': 'Du må velge en fil!',

    'DIALOG_FILEINFO_TITLE'   : 'Fil Informasion',
    'DIALOG_FILEINFO_LOADING' : 'Laste informasjon for filen: {0}',
    'DIALOG_FILEINFO_ERROR'   : 'FileInformationDialog Feil',
    'DIALOG_FILEINFO_ERROR_LOOKUP'     : 'Klarte ikke hente informasjon for filen **{0}**',
    'DIALOG_FILEINFO_ERROR_LOOKUP_FMT' : 'Klarte ikke hente informasjon for filen: {0}',

    'DIALOG_INPUT_TITLE' : 'Inndata Dialog',

    'DIALOG_FILEPROGRESS_TITLE'   : 'Fil-operasjon fremgang',
    'DIALOG_FILEPROGRESS_LOADING' : 'Laster...',

    'DIALOG_UPLOAD_TITLE'   : 'Opplasting Dialog',
    'DIALOG_UPLOAD_DESC'    : 'Opplasting fil til **{0}**.<br />Maksimum størrelse: {1} bytes',
    'DIALOG_UPLOAD_MSG_FMT' : 'Laster opp \'{0}\' ({1} {2}) til {3}',
    'DIALOG_UPLOAD_MSG'     : 'Laster opp fil...',
    'DIALOG_UPLOAD_FAILED'  : 'Opplasting feilet',
    'DIALOG_UPLOAD_FAILED_MSG'      : 'Opplastingen feilet',
    'DIALOG_UPLOAD_FAILED_UNKNOWN'  : 'Ukjent årsak...',
    'DIALOG_UPLOAD_FAILED_CANCELLED': 'Avbrutt av bruker...',
    'DIALOG_UPLOAD_TOO_BIG': 'Fil er for stor',
    'DIALOG_UPLOAD_TOO_BIG_FMT': 'Fil er for stor, større en {0}',

    'DIALOG_FONT_TITLE' : 'Tekst Dialog',

    'DIALOG_APPCHOOSER_TITLE' : 'Velg Applikasjon',
    'DIALOG_APPCHOOSER_MSG'   : 'Velg en applikasjon for åpning',
    'DIALOG_APPCHOOSER_NO_SELECTION' : 'Du må velge en applikasjon',
    'DIALOG_APPCHOOSER_SET_DEFAULT'  : 'Bruk som standard for {0}',

    // GoogleAPI
    'GAPI_DISABLED'           : 'GoogleAPI Modul dekativert eller ikke konfigurert',
    'GAPI_SIGN_OUT'           : 'Logg ut av Google API Services',
    'GAPI_REVOKE'             : 'Tilbakekall tillatelse og Logg ut',
    'GAPI_AUTH_FAILURE'       : 'Google API autentisering feilet eller tok ikke sted',
    'GAPI_AUTH_FAILURE_FMT'   : 'Klarte ikke autentisere: {0}:{1}',
    'GAPI_LOAD_FAILURE'       : 'Klarte ikke laste Google API',

    // Windows Live API
    'WLAPI_DISABLED'          : 'Windows Live API Modul deaktivert eller ikke konfigurert',
    'WLAPI_SIGN_OUT'          : 'Logg ut av Window Live API',
    'WLAPI_LOAD_FAILURE'      : 'Klarte ikke laste Windows Live API',
    'WLAPI_LOGIN_FAILED'      : 'Klarte ikke logge inn Windows Live API',
    'WLAPI_LOGIN_FAILED_FMT'  : 'Klarte ikke logge inn Windows Live API: {0}',
    'WLAPI_INIT_FAILED_FMT'   : 'Windows Live API returnerte {0} status',

    // IndexedDB
    'IDB_MISSING_DBNAME' : 'Kan ikke opprette IndexedDB uten databasenavn',
    'IDB_NO_SUCH_ITEM'   : 'Item ble ikke funnet',

    // VFS
    'ERR_VFS_FATAL'           : 'Fatal Feil',
    'ERR_VFS_UNAVAILABLE'     : 'Ikke tilgjenglig',
    'ERR_VFS_FILE_ARGS'       : 'File forventer minst èt argument',
    'ERR_VFS_NUM_ARGS'        : 'Ikke not argumenter',
    'ERR_VFS_EXPECT_FILE'     : 'Forventer èt Fil-objekt',
    'ERR_VFS_EXPECT_SRC_FILE' : 'Forventer èt kilde Fil-objekt',
    'ERR_VFS_EXPECT_DST_FILE' : 'Forventer èt destinasjon Fil-objekt',
    'ERR_VFS_FILE_EXISTS'     : 'Destinasjonen finnes allerede',
    'ERR_VFS_TARGET_NOT_EXISTS': 'Destinasjon finnes ikke',
    'ERR_VFS_TRANSFER_FMT'    : 'En feil oppstod under overføring av filen: {0}',
    'ERR_VFS_UPLOAD_NO_DEST'  : 'Kan ikke laste opp uten destinasjon',
    'ERR_VFS_UPLOAD_NO_FILES' : 'Kan ikke laste opp uten noen filer definert',
    'ERR_VFS_UPLOAD_FAIL_FMT' : 'Fil-opplasting feilet: {0}',
    'ERR_VFS_UPLOAD_CANCELLED': 'Fil-opplastingen ble avbrutt',
    'ERR_VFS_DOWNLOAD_NO_FILE': 'Kan ikke laste ned uten en sti',
    'ERR_VFS_DOWNLOAD_FAILED' : 'En feil oppstod under nedlasting: {0}',
    'ERR_VFS_REMOTEREAD_EMPTY' : 'Respons var tom',

    'ERR_VFSMODULE_INVALID'            : 'Ugyldig VFS Modul',
    'ERR_VFSMODULE_INVALID_FMT'        : 'Ugyldig VFS Modul: {0}',
    'ERR_VFSMODULE_INVALID_METHOD'     : 'Ugyldig VFS Metode',
    'ERR_VFSMODULE_INVALID_METHOD_FMT' : 'Ugyldig VFS Metode: {0}',
    'ERR_VFSMODULE_INVALID_TYPE'       : 'Ugyldig VFS Modul type',
    'ERR_VFSMODULE_INVALID_TYPE_FMT'   : 'Ugyldig VFS Modul type: {0}',
    'ERR_VFSMODULE_INVALID_CONFIG'     : 'Ugyldig VFS Modul konfigurasjon',
    'ERR_VFSMODULE_INVALID_CONFIG_FMT' : 'Ugyldig VFS Modul konfigurasjon: {0}',
    'ERR_VFSMODULE_ALREADY_MOUNTED'    : 'VFS Modul allerede montert',
    'ERR_VFSMODULE_ALREADY_MOUNTED_FMT': 'VFS Modul \'{0}\' allerede montert',
    'ERR_VFSMODULE_NOT_MOUNTED'        : 'VFS Modul ikke montert',
    'ERR_VFSMODULE_NOT_MOUNTED_FMT'    : 'VFS Modul \'{0}\' ikke montert',
    'ERR_VFSMODULE_EXCEPTION'          : 'VFS Modul Exception',
    'ERR_VFSMODULE_EXCEPTION_FMT'      : 'VFS Modul Exception: {0}',
    'ERR_VFSMODULE_NOT_FOUND_FMT'      : 'Ingen VFS Modul lik {0}. Fil sti eller format ?',
    'ERR_VFSMODULE_READONLY'           : 'VFS Modul er bare lesbar',
    'ERR_VFSMODULE_READONLY_FMT'       : 'VFS Modul er bare lesbar: {0}',

    'TOOLTIP_VFS_DOWNLOAD_NOTIFICATION': 'Laster ned fil',

    'ERR_VFSMODULE_XHR_ERROR'    : 'XHR Feil',
    'ERR_VFSMODULE_ROOT_ID'      : 'Klarte ikke hente id for rotmappe',
    'ERR_VFSMODULE_NOSUCH'       : 'Filen eksister ikke',
    'ERR_VFSMODULE_PARENT'       : 'Parent finnes ikke',
    'ERR_VFSMODULE_PARENT_FMT'   : 'Klarte ikke lete opp parent: {0}',
    'ERR_VFSMODULE_SCANDIR'      : 'Klarte ikke skanne mappe',
    'ERR_VFSMODULE_SCANDIR_FMT'  : 'Klarte ikke skanne mappe: {0}',
    'ERR_VFSMODULE_READ'         : 'Klarte ikke lese fil',
    'ERR_VFSMODULE_READ_FMT'     : 'Klarte ikke lese fil: {0}',
    'ERR_VFSMODULE_WRITE'        : 'Klarte ikke skrive fil',
    'ERR_VFSMODULE_WRITE_FMT'    : 'Klarte ikke skrive fil: {0}',
    'ERR_VFSMODULE_COPY'         : 'Klarte ikke kopiere',
    'ERR_VFSMODULE_COPY_FMT'     : 'Klarte ikke kopiere: {0}',
    'ERR_VFSMODULE_UNLINK'       : 'Klarte ikke slette fil',
    'ERR_VFSMODULE_UNLINK_FMT'   : 'Klarte ikke slette fil: {0}',
    'ERR_VFSMODULE_MOVE'         : 'Klarte ikke flytte fil',
    'ERR_VFSMODULE_MOVE_FMT'     : 'Klarte ikke flytte fil: {0}',
    'ERR_VFSMODULE_EXIST'        : 'Klarte ikke sjekke om fil eksisterer',
    'ERR_VFSMODULE_EXIST_FMT'    : 'Klarte ikke sjekke om fil eksisterer: {0}',
    'ERR_VFSMODULE_FILEINFO'     : 'Klarte ikke hente fil-informasjon',
    'ERR_VFSMODULE_FILEINFO_FMT' : 'Klarte ikke hente fil-informasjon: {0}',
    'ERR_VFSMODULE_MKDIR'        : 'Klarte ikke lage mappe',
    'ERR_VFSMODULE_MKDIR_FMT'    : 'Klarte ikke lage mapp: {0}',
    'ERR_VFSMODULE_MKFILE'       : 'Klarte ikke lage fil',
    'ERR_VFSMODULE_MKFILE_FMT'   : 'Klarte ikke lage fil: {0}',
    'ERR_VFSMODULE_URL'          : 'Klarte ikke hente URL for fil',
    'ERR_VFSMODULE_URL_FMT'      : 'Klarte ikke hente URL for fil: {0}',
    'ERR_VFSMODULE_TRASH'        : 'Klarte ikke flytte fil til søppelkassen',
    'ERR_VFSMODULE_TRASH_FMT'    : 'Klarte ikke flytte fil til søppelkassen: {0}',
    'ERR_VFSMODULE_UNTRASH'      : 'Klarte ikke flytte fil ut av søppelkassen',
    'ERR_VFSMODULE_UNTRASH_FMT'  : 'Klarte ikke flytte fil ut av søppelkassen: {0}',
    'ERR_VFSMODULE_EMPTYTRASH'     : 'Klarte ikke tømme søppel',
    'ERR_VFSMODULE_EMPTYTRASH_FMT' : 'Klarte ikke tømme søppel: {0}',
    'ERR_VFSMODULE_FIND'           : 'Klarte ikke søke',
    'ERR_VFSMODULE_FIND_FMT'       : 'Klarte ikke søke: {0}',
    'ERR_VFSMODULE_FREESPACE'      : 'Klarte ikke hente ledig plass',
    'ERR_VFSMODULE_FREESPACE_FMT'  : 'Klarte ikke hente ledig plass: {0}',
    'ERR_VFSMODULE_EXISTS'         : 'Klarte ikke sjekke destinasjon',
    'ERR_VFSMODULE_EXISTS_FMT'     : 'Klarte ikke check sjekke destinasjon: {0}',

    // VFS -> Dropbox
    'DROPBOX_NOTIFICATION_TITLE' : 'Du er logget inn i Dropbox API',
    'DROPBOX_SIGN_OUT'           : 'Logg ut fra Dropbox API',

    // VFS -> OneDrive
    'ONEDRIVE_ERR_RESOLVE'      : 'Klarte ikke løse sti: fant ikke filen',

    // ZIP
    'ZIP_PRELOAD_FAIL'  : 'Klarte ikke laste zip.js',
    'ZIP_VENDOR_FAIL'   : 'zip.js bliblioteket ble ikke funnet!',
    'ZIP_NO_RESOURCE'   : 'Ingen zip ressursj angitt',
    'ZIP_NO_PATH'       : 'Ingen sti angitt',

    // SearchEngine
    'SEARCH_LOADING': 'Søker...',
    'SEARCH_NO_RESULTS': 'Ingen resultater',

    // PackageManager
    'ERR_PACKAGE_EXISTS': 'Kan ikke fortsette. Pakkedestinasjonen finnes allerede!',

    // DefaultApplication
    'ERR_FILE_APP_OPEN'         : 'Kan ikke åpne filen',
    'ERR_FILE_APP_OPEN_FMT'     : 'Filen {0} ble ikke åpnet fordi MIME {1} ikke er støttet',
    'ERR_FILE_APP_OPEN_ALT_FMT' : 'Filen {0} ble ikke åpnet',
    'ERR_FILE_APP_SAVE_ALT_FMT' : 'Filen {0} ble ikke lagret',
    'ERR_GENERIC_APP_FMT'       : '{0} Applikasjon Feil',
    'ERR_GENERIC_APP_ACTION_FMT': 'Klarte ikke utføre operasjon \'{0}\'',
    'ERR_GENERIC_APP_UNKNOWN'   : 'Ukjent feil',
    'ERR_GENERIC_APP_REQUEST'   : 'En feil oppstod under håndteringen av din forespursel',
    'ERR_GENERIC_APP_FATAL_FMT' : 'Fatal Feil: {0}',
    'MSG_GENERIC_APP_DISCARD'   : 'Forkast endringer?',
    'MSG_FILE_CHANGED'          : 'Filen har blitt endret. Last inn på nytt?',
    'MSG_APPLICATION_WARNING'   : 'Applikasjon-advarsel',
    'MSG_MIME_OVERRIDE'         : 'Filtypen "{0}" er ikke støttet, bruker "{1}" istedet.',

    // General

    'LBL_UNKNOWN'      : 'Ukjent',
    'LBL_APPEARANCE'   : 'Utseende',
    'LBL_USER'         : 'Bruker',
    'LBL_NAME'         : 'Navn',
    'LBL_APPLY'        : 'Angi',
    'LBL_FILENAME'     : 'Filnavn',
    'LBL_PATH'         : 'Sti',
    'LBL_SIZE'         : 'Størrelse',
    'LBL_TYPE'         : 'Type',
    'LBL_MIME'         : 'MIME',
    'LBL_LOADING'      : 'Laster',
    'LBL_SETTINGS'     : 'Instillinger',
    'LBL_ADD_FILE'     : 'Legg til fil',
    'LBL_COMMENT'      : 'Kommenter',
    'LBL_ACCOUNT'      : 'Konto',
    'LBL_CONNECT'      : 'Koble til',
    'LBL_ONLINE'       : 'Online',
    'LBL_OFFLINE'      : 'Offline',
    'LBL_AWAY'         : 'Borte',
    'LBL_BUSY'         : 'Opptatt',
    'LBL_CHAT'         : 'Snakk',
    'LBL_HELP'         : 'Hjelp',
    'LBL_ABOUT'        : 'Om',
    'LBL_PANELS'       : 'Paneler',
    'LBL_LOCALES'      : 'Lokalisering',
    'LBL_THEME'        : 'Temaer',
    'LBL_COLOR'        : 'Farge',
    'LBL_PID'          : 'PID',
    'LBL_KILL'         : 'Drep',
    'LBL_ALIVE'        : 'I live',
    'LBL_INDEX'        : 'Indeks',
    'LBL_ADD'          : 'Legg til',
    'LBL_FONT'         : 'Skrift',
    'LBL_YES'          : 'Ja',
    'LBL_NO'           : 'Nei',
    'LBL_CANCEL'       : 'Avbryt',
    'LBL_TOP'          : 'Topp',
    'LBL_LEFT'         : 'Venstre',
    'LBL_RIGHT'        : 'Høyre',
    'LBL_BOTTOM'       : 'Bunn',
    'LBL_CENTER'       : 'Midt',
    'LBL_FILE'         : 'Fil',
    'LBL_NEW'          : 'Ny',
    'LBL_OPEN'         : 'Åpne',
    'LBL_SAVE'         : 'Lagre',
    'LBL_SAVEAS'       : 'Lagre som...',
    'LBL_CLOSE'        : 'Lukk',
    'LBL_MKDIR'        : 'Lag Mappe',
    'LBL_UPLOAD'       : 'Last opp',
    'LBL_VIEW'         : 'Visning',
    'LBL_EDIT'         : 'Rediger',
    'LBL_RENAME'       : 'Navngi',
    'LBL_DELETE'       : 'Slett',
    'LBL_OPENWITH'     : 'Åpne Med ...',
    'LBL_ICONVIEW'     : 'Ikon-visning',
    'LBL_TREEVIEW'     : 'Tre-visning',
    'LBL_LISTVIEW'     : 'Liste-visning',
    'LBL_REFRESH'      : 'Gjennoppfrisk',
    'LBL_VIEWTYPE'     : 'Visningstype',
    'LBL_BOLD'         : 'Feit',
    'LBL_ITALIC'       : 'Skeiv',
    'LBL_UNDERLINE'    : 'Underlinjet',
    'LBL_REGULAR'      : 'Normal',
    'LBL_STRIKE'       : 'Gjennomstrøk',
    'LBL_INDENT'       : 'Innrykk',
    'LBL_OUTDENT'      : 'Utrykk',
    'LBL_UNDO'         : 'Angre',
    'LBL_REDO'         : 'Gjør om igjen',
    'LBL_CUT'          : 'Kutt',
    'LBL_UNLINK'       : 'Fjern lenke',
    'LBL_COPY'         : 'Kopier',
    'LBL_PASTE'        : 'Lim inn',
    'LBL_INSERT'       : 'Sett inn',
    'LBL_IMAGE'        : 'Bilde',
    'LBL_LINK'         : 'Lenke',
    'LBL_DISCONNECT'    : 'Koble fra',
    'LBL_APPLICATIONS'  : 'Applikasjoner',
    'LBL_ADD_FOLDER'    : 'Legg til mappe',
    'LBL_INFORMATION'   : 'Informasjon',
    'LBL_TEXT_COLOR'    : 'Tekst-farge',
    'LBL_BACK_COLOR'    : 'Bakgrunn-farge',
    'LBL_RESET_DEFAULT' : 'Omstill til standard',
    'LBL_DOWNLOAD_COMP' : 'Last ned til datamaskin',
    'LBL_ORDERED_LIST'  : 'Ordnet liste',
    'LBL_BACKGROUND_IMAGE' : 'Bakgrunnsbilde',
    'LBL_BACKGROUND_COLOR' : 'Bakgrunnsfarge',
    'LBL_UNORDERED_LIST'   : 'Uordnet Liste',
    'LBL_SHOW_SIDEBAR' : 'Vis Sidebar',
    'LBL_SEARCH': 'Søk',
    'LBL_STATUS': 'Status',
    'LBL_READONLY': 'Kun lesbar',
    'LBL_CREATED': 'Opprettet',
    'LBL_MODIFIED': 'Modifisert',
    'LBL_SHOW_COLUMNS': 'Vis Kolonner',
    'LBL_MOVE': 'Flytt',
    'LBL_OPTIONS': 'Opsjoner',
    'LBL_OK': 'OK',
    'LBL_DIRECTORY': 'Mappe',
    'LBL_CREATE': 'Opprett',
    'LBL_BUGREPORT': 'Bug-rapport',
    'LBL_INSTALL': 'Installer',
    'LBL_UPDATE': 'Oppdater',
    'LBL_REMOVE': 'Fjern',
    'LBL_SHOW_NAVIGATION': 'Vis navigasjon',
    'LBL_SHOW_HIDDENFILES': 'Vis skjulte filer',
    'LBL_SHOW_FILEEXTENSIONS': 'Vis fil-utvidelser',
    'LBL_MOUNT': 'Montere',
    'LBL_DESCRIPTION': 'Beskrivelse',
    'LBL_USERNAME': 'Brukernavn',
    'LBL_PASSWORD': 'Passord',
    'LBL_HOST': 'Vert',
    'LBL_NAMESPACE': 'Navneplass',
    'LBL_BACK': 'Tilbake',
    'LBL_ICONS': 'Ikoner',
    'LBL_ICON': 'Ikon',
    'LBL_UNINSTALL': 'Avinstaller',
    'LBL_REGENERATE': 'Regenerer',
    'LBL_DESKTOP': 'Skrivebord',
    'LBL_WINDOWMANAGER': 'Vindu-håndterer',
    'LBL_HOTKEY': 'Snarknapp',
    'LBL_HOTKEYS': 'Snarknapper',
    'LBL_MOUNTS': 'Monteringer',
    'LBL_ID': 'ID',
    'LBL_APPLICATION': 'Applikasjon',
    'LBL_SCOPE': 'Skop',
    'LBL_HIDE': 'Skjul',
    'LBL_REPOSITORY': 'Repository',
    'LBL_VERSION': 'Versjon',
    'LBL_AUTHOR': 'Forfatter',
    'LBL_GROUPS': 'Grupper',
    'LBL_AUTOHIDE': 'Auto-skjul',
    'LBL_PERSONAL': 'Personlig',
    'LBL_SYSTEM': 'System',
    'LBL_STARTING': 'Starter',
    'LBL_SOUNDS': 'Lyder',
    'LBL_STORE': 'Butikk',
    'LBL_LOCALE': 'Språkvalg',
    'LBL_PACKAGE': 'Pakke',
    'LBL_PACKAGES': 'Pakker',
    'LBL_INPUT': 'Inndata',
    'LBL_MISC': 'Annet',
    'LBL_OTHER': 'Annet',
    'LBL_USERS': 'Brukere',
    'LBL_FONTS': 'Skrift',
    'LBL_BACKGROUND' : 'Bakgrunn',
    'LBL_PANEL' : 'Panel',
    'LBL_POSITION' : 'Posisjon',
    'LBL_OPACITY' : 'Gjennomsiktighet',
    'LBL_ONTOP' : 'Topp',
    'LBL_ITEMS' : 'Objekter',
    'LBL_GENERAL' : 'Generelt',
    'LBL_LOCK': 'Lås',
    'LBL_UNLOCK': 'Lås opp'
  };
})();
