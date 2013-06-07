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
	# Run uglifyjs compressor.
	#
	#   For some files, code is compressed, but not mangled, and is
	#   beautified.  The loss in compression is partly compensated by gzip,
	#   and makes debugging much, much easier.
	#
	#   For other files, code is compressed and mangled, giving us the
	#   best compression.
	#
	DIR="static/build/js" \
	BEAUTIFY=( "languagelearning.main.js" "languagelearning.emergency.js" ) \
	MANGLE=( "vendor/require.js" "vendor/tracekit.js" ) && \
	for F in "$${BEAUTIFY[@]}"; do ${UGLIFYJS} -c -b -o $${DIR}/$${F} $${DIR}/$${F}; done && \
	for F in "$${MANGLE[@]}"; do ${UGLIFYJS} -c -m -o $${DIR}/$${F} $${DIR}/$${F}; done
	#
	# Remove any testing scripts.
	#
	rm -rf static/build/test

update-nltk:
	@echo Downloading corpus files for nltk library...
	python -m nltk.downloader punkt
