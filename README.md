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

To run the development server (loading static files directly from the /static directory and 
avoid having to reload the server during development):

    $ ./manage.py runserver

Then go to http://localhost:8000


