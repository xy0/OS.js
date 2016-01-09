all:
	cp -r ../../os.js.org/build/* .
	git add .
	git commit -a -m "Updated from os.js.org repo"
