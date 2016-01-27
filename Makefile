all:
	rm -rf doc/
	cp -r ../../os.js.org/build/* .
	git status > git-status.log
	git add .
	git commit -a -m "Updated from os.js.org repo"
