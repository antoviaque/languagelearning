test-client:
	node_modules/.bin/mocha-phantomjs -R dot http://localhost:8000/ --view 800x600 
	node_modules/.bin/mocha-phantomjs -R dot http://localhost:8000/static/test/harness.html --view 800x600 
