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
(function(Application, Window, GUI, Dialogs, VFS) {
  // jscs:disable validateQuoteMarks
  'use strict';

  /////////////////////////////////////////////////////////////////////////////
  // LOCALES
  /////////////////////////////////////////////////////////////////////////////

  var _Locales = {
    bg_BG : {
      'Playlist' : 'Плейлист',
      'Playback aborted' : 'Прекратено изпълнение',
      'Network or communication error' : 'Проблем с връзка към мрежа',
      'Decoding failed. Corruption or unsupported media' : 'Провалено декодиране, повереден файл или неподдържан формат',
      'Media source not supported' : 'Източника на медия не се поддържа',
      'Failed to play file' : 'Изпълнението на файла се провали',
      'Artist' : 'Изпълнител',
      'Album' : 'Албум',
      'Track' : 'Песен',
      'Time' : 'Време',
      'Media information query failed' : 'Получаване на информация провалено',
      'seek unavailable in format' : 'Невъществуващ формат',
      'The audio type is not supported: {0}' : 'Аудио формата не се поддържа'
    },
    de_DE : {
      'Playlist' : 'Wiedergabeliste',
      'Playback aborted' : 'Wiedergabe abgebrochen',
      'Network or communication error' : 'Netzwerk Kommunikationsfehler',
      'Decoding failed. Corruption or unsupported media' : 'Dekodierung gescheitert. Fehlerhafte oder nicht unterstützte Datei',
      'Media source not supported' : 'Medienquelle nicht unterstützt',
      'Failed to play file' : 'Wiedergabe der Datei gescheitert',
      'Artist' : 'Künstler',
      'Album' : 'Album',
      'Track' : 'Titel',
      'Time' : 'Zeit',
      'Media information query failed' : 'Media Informationssuche gescheitert',
      'seek unavailable in format' : 'Spulen im Format nicht verfügbar',
      'The audio type is not supported: {0}' : 'Der Audio-Typ {0} ist nicht unterstützt'
    },
    es_ES : {
      'Playlist' : 'Lista de reproducción',
      'Playback aborted' : 'Playback anulado',
      'Network or communication error' : 'Error de red o de comunicación',
      'Decoding failed. Corruption or unsupported media' : 'Fallo en el desentrelazado. Medio corrupto o no soportado',
      'Media source not supported' : 'Medio no soportado',
      'Failed to play file' : 'Error reproduciendo archivo',
      'Artist' : 'Artista',
      'Album' : 'Album',
      'Track' : 'Pista',
      'Time' : 'Tiempo',
      'Media information query failed' : 'Error recupersqndo información del medio',
      'seek unavailable in format' : 'búsqueda no disponible en este formato',
      'The audio type is not supported: {0}' : 'El tipo de audio no está soportado: {0}'
    },
    fr_FR : {
      'Playlist' : 'Liste de lecture',
      'Playback aborted' : 'Lecture interrompue',
      'Network or communication error' : 'Erreur de communication ou de réseau',
      'Decoding failed. Corruption or unsupported media' : 'Décodage raté. Média corrompus ou non pris en charge',
      'Media source not supported' : 'Source de médias non pris en charge',
      'Failed to play file' : 'Impossible de lire le fichier',
      'Artist' : 'Artiste',
      'Album' : 'Album',
      'Track' : 'Piste',
      'Time' : 'Durée',
      'Media information query failed' : 'Requête des informations média échoué',
      'seek unavailable in format' : 'recherche indisponible dans ce format',
      'The audio type is not supported: {0}' : 'Le type audio n\'est pas pris en charge: {0}'
    },
    ar_DZ : {
      'Playlist' : 'قائمة القرائة',
      'Playback aborted' : 'قطع التشغيل',
      'Network or communication error' : 'خطأ في الإتصال بالشبكة',
      'Decoding failed. Corruption or unsupported media' : 'فشل في فك التشفير. وسائط غير صالحة أو غير مدعومة',
      'Media source not supported' : 'وسائط غير مدعومة',
      'Failed to play file' : 'لايمكن قراءة الملف',
      'Artist' : 'الفنان',
      'Album' : 'الألبوم',
      'Track' : 'المقطع',
      'Time' : 'المدة',
      'Media information query failed' : 'خطأ في قراءة معلومات الوسائط',
      'seek unavailable in format' : 'بحث غير ممكن في هذا النوع',
      'The audio type is not supported: {0}' : 'نوع الملف الصوتي غير مدعوم: {0}'
    },
    it_IT : {
      'Playlist' : 'Playlist',
      'Playback aborted' : 'Riproduzione terminata',
      'Network or communication error' : 'Errore di rete o di comunicazione',
      'Decoding failed. Corruption or unsupported media' : 'Decodifica fallita. Supporto corroto o non supportato.',
      'Media source not supported' : 'Sorgente multimediale non supportata',
      'Failed to play file' : 'Riproduzione file fallita',
      'Artist' : 'Artista',
      'Album' : 'Album',
      'Track' : 'Traccia',
      'Time' : 'Tempo',
      'Media information query failed' : 'Recupero informazioni media fallita',
      'seek unavailable in format' : 'ricerca non disponibile nel formato',
      'The audio type is not supported: {0}' : 'Tipo di audio non supportato: {0}'
    },
    ko_KR : {
      'Playlist' : '재생목록',
      'Playback aborted' : '일시중지',
      'Network or communication error' : '네트워크 등 통신 문제가 발생했습니다',
      'Decoding failed. Corruption or unsupported media' : '디코딩에 실패했습니다. 손상되었거나 지원하지 않는 형식입니다',
      'Media source not supported' : '지원하지 않는 미디어 소스입니다',
      'Failed to play file' : '파일을 재생하는데 실패했습니다',
      'Artist' : '아티스트',
      'Album' : '앨범',
      'Track' : '트랙',
      'Time' : '시간',
      'Media information query failed' : '미디어 정보 조회에 실패했습니다',
      'seek unavailable in format' : '탐색을 지원하지 않는 형식입니다',
      'The audio type is not supported: {0}' : '이 오디오 형식은 지원하지 않습니다: {0}'
    },
    nl_NL : {
      'Playlist' : 'Afspeellijst',
      'Playback aborted' : 'Afspelen afgebroken',
      'Network or communication error' : 'Netwerk of communicatie fout',
      'Decoding failed. Corruption or unsupported media' : 'Decoderen mislukt: bestandstype wordt niet ondersteund',
      'Media source not supported' : 'Mediabron wordt niet ondersteund',
      'Failed to play file' : 'Afspelen van bestand mislukt',
      'Artist' : 'Artiest',
      'Album' : 'Album',
      'Track' : 'Nummer',
      'Time' : 'Tijd',
      'Media information query failed' : 'Zoeken naar media is niet gelukt',
      'seek unavailable in format' : 'Voor/achteruit spoelen is niet beschikbaar in dit formaat',
      'The audio type is not supported: {0}' : 'Audio type {0} wordt niet ondersteund'
    },
    no_NO : {
      'Playlist' : 'Spilleliste',
      'Playback aborted' : 'Avspilling avbrutt',
      'Network or communication error' : 'Nettverks- eller kommunikasjonsfeil',
      'Decoding failed. Corruption or unsupported media' : 'Dekoding feilet. Korrupt eller ustøttet media',
      'Media source not supported' : 'Media-kilde ikke støttet',
      'Failed to play file' : 'Klarte ikke spille av fil',
      'Artist' : 'Artist',
      'Album' : 'Album',
      'Track' : 'Låt',
      'Time' : 'Tid',
      'Media information query failed' : 'Media-informasjon forespursel feil',
      'seek unavailable in format' : 'spoling utilgjenglig i format',
      'The audio type is not supported: {0}' : 'Denne lyd-typen er ikke støttet: {0}'
    },
    pl_PL : {
      'Playlist' : 'Playlista',
      'Playback aborted' : 'Odtwarzanie Przerwane',
      'Network or communication error' : 'Błąd Sieci lub Komunikacji',
      'Decoding failed. Corruption or unsupported media' : 'Dekodowanie nie powiodło się. Uszkodzony lub nieobsługiwany plik',
      'Media source not supported' : 'Plik nie jest wspierany',
      'Failed to play file' : 'Nie można odtworzyć pliku',
      'Artist' : 'Artysta',
      'Album' : 'Album',
      'Track' : 'Ścieżka',
      'Time' : 'Czas',
      'Media information query failed' : 'Brak informacji',
      'seek unavailable in format' : 'Przewijanie nie jest obsługiwane w tym formacie',
      'The audio type is not supported: {0}' : 'Ten typ audio nie jest obsługiwany: {0}'
    },
    ru_RU : {
      'Playlist' : 'Список воспроизведения',
      'Playback aborted' : 'Воспроизведение прервано',
      'Network or communication error' : 'Ошибка соединения',
      'Decoding failed. Corruption or unsupported media' : 'Не удалось декодировать файл. Файл поврежден или данынй формат не поддерживается',
      'Media source not supported' : 'Тип файла не поддерживается',
      'Failed to play file' : 'Ошибка воспроизведения',
      'Artist' : 'Артист',
      'Album' : 'Альбом',
      'Track' : 'Трек',
      'Time' : 'Время',
      'Media information query failed' : 'Ошибка в запросе медиа-информации',
      'seek unavailable in format' : 'Перемотка недоступна в этом формате',
      'The audio type is not supported: {0}' : 'Тип аудио не поддерживается: {0}'
    },
    sk_SK : {
      'Playlist' : 'Zoznam skladieb',
      'Playback aborted' : 'Prehrávanie prerušené',
      'Network or communication error' : 'Chyba v sieťovej komunikácii',
      'Decoding failed. Corruption or unsupported media' : 'Dekódovanie sa nepodarilo alebo médium je nepodporované',
      'Media source not supported' : 'Zdrojové médium nie je podporované',
      'Failed to play file' : 'Chyba pri prehrávaní súboru',
      'Artist' : 'Umelec',
      'Album' : 'Album',
      'Track' : 'Skladba',
      'Time' : 'Čas',
      'Media information query failed' : 'Chyba pri získavaní informácii o médiu',
      'seek unavailable in format' : 'Formát média nepodporuje preskakovanie (seek)',
      'The audio type is not supported: {0}' : 'Nepodporovaný formát: {0}'
    },

    tr_TR : {
      'Playlist' : 'Oynatma listesi',
      'Playback aborted' : 'kayıt çalma/dinleme durduruldu',
      'Network or communication error' : 'ağ veya iletişim hatası',
      'Decoding failed. Corruption or unsupported media' : 'çözümleme hatası. Bozuk veya çalışmıyor.',
      'Media source not supported' : 'medya kaynağı bulunamadı',
      'Failed to play file' : 'Oynatma hatası',
      'Artist' : 'Artist',
      'Album' : 'Album',
      'Track' : 'Parça',
      'Time' : 'zaman',
      'Media information query failed' : 'medya bilgisini elde etmede hata oluştu',
      'seek unavailable in format' : 'bu formatta ileri saramazsınız',
      'The audio type is not supported: {0}' : 'Bu format desteklenmiyor: {0}'
    },
    vi_VN : {
      'Playlist' : 'Danh sách phát',
      'Playback aborted' : 'Phát lại bị hủy',
      'Network or communication error' : 'Mạng hoặc thông tin liên lạc bị lỗi',
      'Decoding failed. Corruption or unsupported media' : 'Giải mã thất bại. Tập tin bị hỏng hoặc không được hỗ trợ',
      'Media source not supported' : 'Nguồn phương tiện không được hỗ trợ',
      'Failed to play file' : 'Không thể chơi tập tin',
      'Artist' : 'Ca sĩ',
      'Album' : 'Album',
      'Track' : 'Bài hát',
      'Time' : 'Thời gian',
      'Media information query failed' : 'Truy vấn thông tin tập tin thất bại',
      'seek unavailable in format' : 'không tua được trong định dạng này',
      'The audio type is not supported: {0}' : 'Loại âm thanh {0} không được hỗ trợ'
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
  OSjs.Applications.ApplicationMusicPlayer = OSjs.Applications.ApplicationMusicPlayer || {};
  OSjs.Applications.ApplicationMusicPlayer._ = _;

})(OSjs.Core.Application, OSjs.Core.Window, OSjs.GUI, OSjs.Dialogs, OSjs.VFS);
