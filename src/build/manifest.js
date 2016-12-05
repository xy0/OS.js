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

/*eslint strict:["error", "global"]*/
'use strict';

const _path = require('path');
const _glob = require('glob-promise');
const _fs = require('node-fs-extra');

const _config = require('./config.js');

const ROOT = _path.dirname(_path.dirname(_path.join(__dirname)));

///////////////////////////////////////////////////////////////////////////////
// HELPERS
///////////////////////////////////////////////////////////////////////////////

/*
 * Parses the preload array(s)
 */
function parsePreloads(iter) {
  if ( typeof iter === 'string' ) {
    var niter = {
      src: iter,
      type: null
    };

    if ( iter.match(/\.js/) ) {
      niter.type = 'javascript';
    } else if ( iter.match(/\.css/) ) {
      niter.type = 'stylesheet';
    } else if ( iter.match(/\.html/) ) {
      niter.type = 'html';
    }

    return niter;
  }

  return iter;
}

///////////////////////////////////////////////////////////////////////////////
// API
///////////////////////////////////////////////////////////////////////////////

/*
 * Checks if package is enabled
 */
function checkEnabledState(enabled, disabled, meta) {
  const name = meta.path;
  const shortName = meta.path.split('/')[1];

  if ( String(meta.enabled) === 'false' ) {
    if ( enabled.indexOf(shortName) !== -1 ) {
      return true;
    }
    return enabled.indexOf(name) !== -1;
  }

  if ( disabled.indexOf(shortName) === -1 ) {
    return true;
  }
  return disabled.indexOf(name) === -1;
}

/*
 * Get Package Metadata
 */
function getPackageMetadata(repo, file) {

  return new Promise(function(resolve, reject) {
    const name = [repo, _path.basename(_path.dirname(file))].join('/');
    const meta = JSON.parse(_fs.readFileSync(file));

    meta.type = meta.type || 'application';
    meta.path = name;
    meta.build = meta.build || {};
    meta.repo = repo;
    meta.preload = (meta.preload ? meta.preload : []).map(parsePreloads);

    if ( typeof meta.sources !== 'undefined' ) {
      meta.preload = meta.preload.concat(meta.sources.map(parsePreloads));
    }

    resolve(Object.freeze(meta));
  });
}

/*
 * Get packages from repository
 */
function getRepositoryPackages(repo, all) {
  const path = _path.join(ROOT, 'src/packages', repo);
  const result = {};

  return new Promise(function(resolve, reject) {
    _config.getConfiguration().then(function(cfg) {
      const forceEnabled = _config.getConfigPath(cfg, 'packages.ForceEnable', []);
      const forceDisabled = _config.getConfigPath(cfg, 'packages.ForceDisable', []);

      _glob(_path.join(path, '*', 'metadata.json')).then(function(files) {

        Promise.each(files.map(function(file) {
          return function() {
            return getPackageMetadata(repo, file);
          };
        }), function(meta) {
          meta = Object.assign({}, meta);
          if ( all || checkEnabledState(forceEnabled, forceDisabled, meta) ) {
            result[meta.path] = meta;
          }
        }).then(function() {
          resolve(result);
        }).catch(reject);

      }).catch(reject);
    }).catch(reject);
  });
}

/*
 * Get all packages (with filter)
 */
function getPackages(repos, filter) {
  repos = repos || [];
  filter = filter || function() {
    return true;
  };

  var list = {};
  return new Promise(function(resolve, reject) {
    Promise.each(repos.map(function(repo) {
      return function() {
        return getRepositoryPackages(repo);
      };
    }), function(packages) {
      list = Object.assign(list, packages);
    }).then(function() {
      const result = {};
      Object.keys(list).forEach(function(k) {
        if ( filter(list[k]) ) {
          result[k] = list[k];
        }
      });

      resolve(result);
    }).catch(reject);
  });
}

/*
 * Generates a client-side manifest file
 */
function generateClientManifest(target, manifest) {
  return new Promise(function(resolve, reject) {
    const dest = _path.join(ROOT, target, 'packages.js');

    var tpl = _fs.readFileSync(_path.join(ROOT, 'src/templates/dist/packages.js'));
    tpl = tpl.toString().replace('%PACKAGES%', JSON.stringify(manifest, null, 4));

    _fs.writeFile(dest, tpl, function(err) {
      /*eslint no-unused-expressions: "off"*/
      err ? reject(err) : resolve();
    });
  });
}

///////////////////////////////////////////////////////////////////////////////
// API
///////////////////////////////////////////////////////////////////////////////

/*
 * Gets a package manifest by name
 */
function getPackage(name) {
  const file = _path.join(ROOT, 'src/packages', name, 'metadata.json');
  const repo = file.split('/')[0];
  return getPackageMetadata(repo, file);
}

/*
 * Combines preload files
 */
function combinePreloads(manifest) {
  var pcss = false;
  var pjs  = false;
  var preload = [];

  manifest.preload.forEach(function(p) {
    if ( p.combine === false || p.src.match(/^(ftp|https?\:)?\/\//) ) {
      preload.push(p);
      return;
    }

    if ( p.type === 'javascript' ) {
      if ( !pjs ) {
        preload.push({type: 'javascript', src: 'combined.js'});
      }
      pjs = true;
    } else if ( p.type === 'stylesheet' ) {
      if ( !pcss ) {
        preload.push({type: 'stylesheet', src: 'combined.css'});
      }
      pcss = true;
    } else {
      preload.push(p);
    }
  });

  return preload;
}

/*
 * Parses a client manifest
 */
function mutateClientManifest(packages) {
  packages = JSON.parse(JSON.stringify(packages));

  Object.keys(packages).forEach(function(p) {
    packages[p].preload = combinePreloads(packages[p]);

    if ( packages[p].build ) {
      delete packages[p].build;
    }

    if ( typeof packages[p].enabled !== 'undefined' ) {
      delete packages[p].enabled;
    }

    if ( packages[p].type === 'service' ) {
      packages[p].singular = true;
    }

  });

  return packages;
}

///////////////////////////////////////////////////////////////////////////////
// TASKS
///////////////////////////////////////////////////////////////////////////////

const TARGETS = {
  'dist': function(cli, cfg) {
    return new Promise(function(resolve, reject) {
      getPackages(cfg.repositories).then(function(packages) {
        packages = mutateClientManifest(packages);

        generateClientManifest('dist', packages).then(resolve).catch(reject);
      });
    });
  },

  'dist-dev': function(cli, cfg) {
    return new Promise(function(resolve, reject) {
      getPackages(cfg.repositories).then(function(packages) {
        packages = JSON.parse(JSON.stringify(packages));

        Object.keys(packages).forEach(function(p) {
          var pkg = packages[p];

          if ( pkg.preload ) {
            pkg.preload = pkg.preload.map(function(iter) {
              if ( !iter.src.match(/^(ftp|https?):/) ) {
                try {
                  const asrc = _path.join(ROOT, 'src/packages', pkg.path, iter.src);
                  const stat = _fs.statSync(asrc);

                  iter.mtime = (new Date(stat.mtime)).getTime();
                } catch ( e ) {}
              }
              return iter;
            });
          }
        });

        generateClientManifest('dist-dev', packages).then(resolve).catch(reject);
      });
    });
  },

  'server': function(cli, cfg) {
    return new Promise(function(resolve, reject) {
      const dest = _path.join(ROOT, 'src', 'server', 'packages.json');

      getPackages(cfg.repositories).then(function(packages) {
        const meta = {
          'dist': mutateClientManifest(packages),
          'dist-dev': packages
        };

        _fs.writeFile(dest, JSON.stringify(meta, null, 4), function(err) {
          err ? reject(err) : resolve();
        });
      });
    });
  }
};

/*
 * Writes the given manifest file(s)
 */
function writeManifest(target, cli, cfg) {
  return new Promise(function(resolve, reject) {
    if ( TARGETS[target] ) {
      console.log('Generating manifest for', target);
      TARGETS[target](cli, cfg).then(resolve).catch(reject);
    } else {
      reject('Invalid target ' + target);
    }
  });
}

///////////////////////////////////////////////////////////////////////////////
// EXPORTS
///////////////////////////////////////////////////////////////////////////////

module.exports.getPackages = getPackages;
module.exports.getPackage = getPackage;
module.exports.writeManifest = writeManifest;
module.exports.combinePreloads = combinePreloads;
module.exports.checkEnabledState = checkEnabledState;
