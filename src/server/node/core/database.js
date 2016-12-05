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
/*eslint strict:["error", "global"]*/
'use strict';

/**
 * @namespace core.database
 */

var instances = {};

///////////////////////////////////////////////////////////////////////////////
// HELPERS
///////////////////////////////////////////////////////////////////////////////

function mysqlConfiguration(config) {
  var ccfg = {};
  Object.keys(config).forEach(function(c) {
    if ( typeof config[c] === 'object' ) {
      ccfg[c] = config[c];
    } else {
      ccfg[c] = String(config[c]);
    }
  });
  return ccfg;
}

///////////////////////////////////////////////////////////////////////////////
// API
///////////////////////////////////////////////////////////////////////////////

function DatabaseInstance(name, type, opts) {
  this.conn = null;
  this.type = type;
  this.name = name;

  if ( type === 'mysql' ) {
    const _mysql = require('mysql');
    this.conn = _mysql.createPool(mysqlConfiguration(opts));
  } else if ( type === 'sqlite' ) {
    const _sqlite = require('sqlite3');
    this.conn = new _sqlite.Database(opts.database);
  }
}

DatabaseInstance.prototype.destroy = function() {
  if ( this.conn ) {
    if ( this.type === 'sqlite' ) {
      this.conn.close();
    }
  }

  this.conn = null;
  this.type = null;
};

DatabaseInstance.prototype.init = function() {
  const conn = this.conn;
  const type = this.type;

  if ( type === 'sqlite' ) {
    return new Promise(function(resolve, reject) {
      conn.serialize(resolve);
    });
  }

  return Promise.resolve();
};

DatabaseInstance.prototype._query = function(q, a, all, cb) {
  a = a || [];

  const type = this.type;
  const conn = this.conn;

  function mysqlQuery(done) {
    conn.getConnection(function(err, connection) {
      if ( err ) {
        done(err);
      } else {
        connection.query(q, a, function(err, row, fields) {
          if ( all ) {
            done(err, row, fields);
          } else {
            done(err, row ? row[0] : null, fields);
          }

          connection.release();
        });
      }
    });
  }

  function sqliteQuery(done) {
    if ( all ) {
      conn.all(q, a, done);
    } else {
      conn.get(q, a, done);
    }
  }

  if ( conn ) {
    return new Promise(function(resolve, reject) {
      if ( type === 'mysql' ) {
        mysqlQuery(function(err, res) {
          if ( err ) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      } else if ( type === 'sqlite' ) {
        sqliteQuery(function(err, res) {
          if ( err ) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      } else {
        reject('Invalid database driver');
      }
    });
  }

  return Promise.reject('No SQL connection available');
};

DatabaseInstance.prototype.query = function(q, a, cb) {
  return this._query(q, a, false, cb);
};

DatabaseInstance.prototype.queryAll = function(q, a, cb) {
  return this._query(q, a, true, cb);
};

///////////////////////////////////////////////////////////////////////////////
// EXPORTS
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates or fethes a connection
 *
 * @param   {String}      name      Connection Name
 * @param   {String}      [type]    Connection Type
 * @param   {Mixed}       [opts]    Connection Options
 *
 * @function instance
 * @memberof core.database
 */
module.exports.instance = function(name, type, opts) {
  return new Promise(function(resolve, reject) {
    if ( arguments.length === 1 || !(type && opts) ) {
      return resolve(instances[name]);
    }

    try {
      var i = new DatabaseInstance(name, type, opts);
      i.init().then(function() {
        instances[name] = i;
        resolve(i);
      }).catch(reject);
    } catch ( e ) {
      reject(e);
    }
  });
};

/**
 * Destroys all database connections
 *
 * @function destroy
 * @memberof core.database
 */
module.exports.destroy = function(name) {
  if ( name ) {
    instances[name].destroy();
    delete instances[name];
  } else {
    Object.keys(instances).forEach(function(k) {
      instances[k].destroy();
      delete instances[k];
    });
  }
};
