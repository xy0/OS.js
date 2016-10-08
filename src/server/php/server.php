<?php
/*!
 * OS.js - JavaScript Operating System
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

/**
 * Works using CGI or any other method
 * To use with PHP Internal Webserver:
 *  To use with `php -S localhost:8000 src/server/php/server.php'
 *  in the directory dist/
 */
ini_set('always_populate_raw_post_data', 1);
error_reporting(E_ALL);

// Bootstrapping
$root = __DIR__;

define("ROOT", $root);

require "{$root}/vfs.php";
require "{$root}/api.php";
require "{$root}/settings.php";

if ( !defined("SERVERDIR") )  define("SERVERDIR",   realpath(__DIR__ . '/../'));                      // The path to server root
if ( !defined("ROOTDIR") )    define("ROOTDIR",     realpath(__DIR__ . '/../../../'));                // The path to root dir
if ( !defined("DISTDIR") )    define("DISTDIR",     ROOTDIR . "/dist");                               // Dist dir
if ( !defined("REPODIR") )    define("REPODIR",     ROOTDIR . "/src/packages");
if ( !defined("TIMEZONE") )   define("TIMEZONE",    "Europe/Oslo");                                   // Timezone
if ( !defined("SHOWERRORS") ) define("SHOWERRORS",  true);                                            // Show error reports from backend
if ( !defined("ERRHANDLER") ) define("ERRHANDLER",  false);                                           // Report non-errors (warnings, notices etc)

define("DIST", strpos(DISTDIR, "dist-dev") !== false ? "dist-dev" : "dist");

$settings = Settings::get();

if ( !empty($settings['handler']) ) {
  require sprintf("%s/src/server/php/handlers/%s/handler.php", ROOTDIR, $settings['handler']);
}
if ( !empty($settings['extensions']) ) {
  foreach ( $settings['extensions'] as $l ) {
    if ( preg_match("/\.php$/", $l) === false ) {
      require sprintf("%s/%s", ROOTDIR, preg_replace("/\/$/", "", $l));
    }
  }
}

date_default_timezone_set(TIMEZONE);
register_shutdown_function(Array('APIResponse', 'ErrorHandler'));
session_start();

APIUser::restore();

if ( defined("NOSERVER") && (NOSERVER === true) ) {
  return;
}

if ( $response = APIRequest::call() ) {
  $response->output();
  return true;
} else {
  if ( php_sapi_name() === "cli-server" ) {
    return false;
  }
  header("HTTP/1.0 404 Not Found");
  print "404 Not Found";
  if ( !empty($_SERVER["REQUEST_URI"]) ) {
    print " - {$_SERVER["REQUEST_URI"]}";
  }
}

return false;

?>
