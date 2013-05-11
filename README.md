Language Learning
=================

Installation
------------

Retreive the source

    $ git clone https://github.com/antoviaque/languagelearning.git

You will need a version of `distribute` >= 0.6.28. If you use https://github.com/brainsik/virtualenv-burrito you can upgrade with this command:

    $ ~/.venvburrito/bin/virtualenv-burrito upgrade

Install the dependencies:

    $ cd languagelearning
    $ mkvirtualenv languagelearning
    $ pip install -r requirements.txt

Running the server
------------------

### Development mode

To run the development server (loading static files directly from the /static
directory and avoid having to reload the server during development):

    $ ./manage.py runserver

Then go to http://localhost:8000

Running browser tests
---------------------

phantomjs is used for automated headless browser testing.  To run these tests,
you'll need to make sure you've got phantomjs.  On Mac, that would be:

    $ brew install phantomjs

On debian/ubuntu, you will need to install phantomjs from source to have the 
latest version (the repository currently contains 1.6.0). Download the source
from http://phantomjs.org/download.html and create a symlink to the 
`bin/phantomjs` binary from your path.

Then, in the root project directory:

    $ npm install mocha-phantomjs mocha

Finally, in the root project directory:

    $ node_modules/.bin/mocha-phantomjs -R dot http://localhost:8000/static/index.html --view 800x600 
