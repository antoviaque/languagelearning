.PHONY: test-client build update-nltk

SHELL := /bin/bash
NODE ?= $(shell which node)
NPM ?= $(shell which npm)
UGLIFYJS ?= node_modules/uglify-js/bin/uglifyjs

test-client:
	node_modules/.bin/mocha-phantomjs -R dot http://localhost:8000/ --view 800x600 
	node_modules/.bin/mocha-phantomjs -R dot http://localhost:8000/static/test/harness.html --view 800x600

build:
	# Compile all files and make copies to the static/build directory.
	#
	${NODE} static/js/vendor/r.js \
	    -o static/js/languagelearning.build.js \
	    dir=static/build \
	    optimize=none
	#
	# Install UglifyJS2 at correct version if it is not currently
	# installed locally.
	#
	if ! [ -e ${UGLIFYJS} ]; then ${NPM} install uglify-js@2.3.6; fi
	#
	# Run uglifyJS compressor on languagelearning.main.js
	#
	#   Code is compressed, but not mangled, and is beautified.  The loss
	#   in compression is partly compensated by gzip, and makes debugging
	#   much, much easier.
	${UGLIFYJS} -c -b -o static/build/js/languagelearning.main.js \
	    static/build/js/languagelearning.main.js
	#
	# Run uglifyJS compressor on require.js:
	#
	#   Code is compressed and mangled, since we're not worried about
	#   catching errors here.
	${UGLIFYJS} -c -m -o static/build/js/vendor/require.js \
	    static/build/js/vendor/require.js
	#
	# Remove any testing scripts.
	#
	rm -rf static/build/test

update-nltk:
	@echo Downloading corpus files for nltk library...
	python -m nltk.downloader punkt

	
