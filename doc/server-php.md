# OS.js on PHP

**Please note that the PHP will be deprecated in the future (or at least moved to its own repository)**

Below is a list of supported methods of deployment (you choose one of these):

Make sure the _VFS_ directories in `vfs/` are given the same permissions as the web-servers running user.

## Apache

Run `grunt generate:apache-htaccess` to generate the required htaccess files for Apache to work properly.

Run `grunt generate:apache-vhost --out=/etc/apache2/sites-enabled/100-osjs.conf` to generate config file (or look in doc/configs/ for example) you can use.

*Note* You have to enable mod_rewrite for Apache and make sure htaccess is allowed.

## Lighttpd

Run `grunt generate:lighttpd-config --out=lighttpd.conf` to generate config file (or look in doc/configs/ for example)

## Nginx

Run `grunt generate:nginx-config --out=/etc/nginx/sites-enabled/100-osjs.conf` to generate config file (or look in doc/configs/ for example)

## WAMP

Works fine. Just look up the Apache section above for configuration.

# OS.js on Webhosts

If you have a "webhost" (or "webhotel") with ex. cPanel without shell access (or no node support), you can run OS.js, but has to be built on another computer, then transfered over to the target machine.

The only downside here is that you'd have to run from /OS.js/dist/ without doing modifications to the setup (if you don't have access to mod_rewrite to create proxy rules).

## 1: Clone on your computer
Build OS.js on your own computer

Basically follow the official instructions

```
sudo npm install -g grunt-cli

git clone https://github.com/os-js/OS.js.git
cd OS.js
npm install --production

# Important for Apache
grunt generate:apache-htaccess

grunt
```

## 2: Transfer files

Now copy the entire `OS.js` directory to your host

## 3: Run

Open up http://yourhost.com/OS.js/dist/


## Some notes

If you have a directory with a folder named "www", "public_html" or similar, you can copy the dist directory into there and everything else in the root directory.

This way you can run OS.js without the `/OS.js/dist/` in the URL.
