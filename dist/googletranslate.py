# -*- coding: utf-8 -*-
"""
Use Google Translate API from Python 
by Skipper Seabold
https://gist.github.com/jseabold/1473363

You need to fill in your API key from google (settings.GOOGLE_API_KEY). 
Note that querying supported languages is not implemented.

Language Code
-------- ----
Afrikaans 	af
Albanian 	sq
Arabic 	ar
Belarusian 	be
Bulgarian 	bg
Catalan 	ca
Chinese Simplified 	zh-CN
Chinese Traditional 	zh-TW
Croatian 	hr
Czech 	cs
Danish 	da
Dutch 	nl
English 	en
Estonian 	et
Filipino 	tl
Finnish 	fi
French 	fr
Galician 	gl
German 	de
Greek 	el
Hebrew 	iw
Hindi 	hi
Hungarian 	hu
Icelandic 	is
Indonesian 	id
Irish 	ga
Italian 	it
Japanese 	ja
Korean 	ko
Latvian 	lv
Lithuanian 	lt
Macedonian 	mk
Malay 	ms
Maltese 	mt
Norwegian 	no
Persian 	fa
Polish 	pl
Portuguese 	pt
Romanian 	ro
Russian 	ru
Serbian 	sr
Slovak 	sk
Slovenian 	sl
Spanish 	es
Swahili 	sw
Swedish 	sv
Thai 	th
Turkish 	tr
Ukrainian 	uk
Vietnamese 	vi
Welsh 	cy
Yiddish 	yi
"""
import os
import urlparse
import urllib
import urllib2
import httplib2
import gzip
import json
from httplib2 import FileCache
from urllib2 import HTTPRedirectHandler, HTTPDefaultErrorHandler, HTTPError
from django.conf import settings

### Hard-coded variables ###

languages = ["af", "sq", "ar","be", "bg", "ca", "zh-CN", "zh-TW", "hr",
             "cs", "da", "nl", "en", "et", "tl", "fi", "fr", "gl", "de",
             "el", "iw", "hi", "hu", "is", "id", "ga", "it", "ja", "ko",
             "lv", "lt", "mk", "ms", "mt", "no", "fa", "pl", "pt", "ro",
             "ru", "sr", "sk", "sl", "es", "sw", "sv", "th", "tr", "uk",
             "vi", "cy", "yi"]

def _validate_language(lang):
    if lang in languages:
        return True
    return False

### Custom G-Zipped Cache ###

def save_cached_key(path, value):
    f = gzip.open(path, 'wb')
    f.write(value)
    f.close()

def load_cached_key(key):
    f = gzip.open(key)
    retval = f.read()
    f.close()
    return retval

class ZipCache(FileCache):
    def __init__(self, cache='var/cache'): #TODO: allow user configurable?
        super(ZipCache, self).__init__(cache)

    def get(self, key):
        cacheFullPath = os.path.join(self.cache, self.safe(key))
        retval = None
        try:
            retval = load_cached_key(cacheFullPath)
        except IOError:
            pass
        return retval

    def set(self, key, value):
        cacheFullPath = os.path.join(self.cache, self.safe(key))
        save_cached_key(cacheFullPath, value)

### Error Handlers ###

class DefaultErrorHandler(HTTPDefaultErrorHandler):
    def http_error_default(self, req, fp, code, msg, headers):
        result = HTTPError(req.get_full_url(), code, msg, headers, fp)
        result.status = code
        return result


class RedirectHandler(HTTPRedirectHandler):
    def http_error_301(self, req, fp, code, msg, headers):
        result = HTTPRedirectHandler.http_error_301(self, req, fp, code,
                        msg, headers)
        result.status = code
        return result

    def http_error_302(self, req, fp, code, msg, headers):
        result = HTTPRedirectHandler.http_error_302(self, req, fp, code,
                        msg, headers)
        result.status = code
        return result

### Translator Class ###

class GoogleTranslator(object):
    """
    Google Translator object.

    Examples
    --------
    translator = GoogleTranslator()

    results1 = translator.translate("Einen schönen Tag allerseits")

    # try 2 at a time
    results2 = translator.translate(["Einen schönen Tag allerseits",
                                     "Ich nehme an"])

    # try detect
    results3 = translator.detect("Einen schönen Tag allerseits")

    # try to detect 2 at a time
    results4 = translator.detect(["Einen schönen Tag allerseits",
                                     "Ich nehme an"])
    """
    def __init__(self):
        #NOTE: caching is done on etag not expiry
        self.cache_control = 'max-age='+str(7 * 24 * 60 * 60)
        self.connection = httplib2.Http(ZipCache())
        self._opener = urllib2.build_opener(DefaultErrorHandler,
                                            RedirectHandler)
        self.base_url = "https://www.googleapis.com/language/translate/v2/"

    def _urlencode(self, params):
        """
        Rewrite urllib.urlencode to handle string input verbatim
        """
        params = "&".join(map("=".join,params))
        return params

    def _build_uri(self, extra_url, params):
        params = [('key', settings.GOOGLE_API_KEY)] + params
        params = self._urlencode(params)
        url = "%s?%s" % (urlparse.urljoin(self.base_url, extra_url), params)
        if len(url) > 2000: # for GET requests only, POST is 5K
            raise ValueError("Query is too long. URL can only be 2000 "
                             "characters")
        return url

    def _fetch_data(self, url):
        connection = self.connection
        resp, content = connection.request(url, headers={'user-agent' : settings.GOOGLE_API_KEY,
                            'cache-control' : self.cache_control})
        #DEBUG
        #if resp.fromcache:
        #   print "Using from the cache"
        return content

    def _sanitize_query(self, query):
        if isinstance(query, (list,tuple)):
            query = zip('q' * len(query), map(urllib.quote,query))
        else:
            query = [('q',urllib.quote(query))]
        return query

    def _decode_json(self, response):
        return json.loads(response)

    def detect(self, query):
        """
        Try to detect the language of a word, phrase, or list of either.

        Parameters
        ----------
        query : str or iterable
            Query or list of queries to translate

        Returns
        -------
        List of dictionaries for each query
        """
        query = self._sanitize_query(query)
        url = self._build_uri(extra_url='detect/', params=query)
        content = self._fetch_data(url)
        # going to have json, decode it first
        return self._decode_json(content)

    def translate(self, query, target="en", source=""):
        """
        Translate a query.

        Parameters
        ----------
        query : str or iterable
            Query or list of queries to translate
        target : str
            Language to translate into.
        source : str, optional
            Language of the source text, if known. Will be auto-detected
            if an empty string is passed.

        Returns
        -------
        List of dictionaries for each query

        Notes
        -----
        If the language can't be detected for a word an attempt is made
        to detect the language of the word and resubmit the query. If a
        list of words to translate is given and an error is encountered,
        it is assumed that the list of words all have the same source language
        when resubmitted.
        """
        try:
            assert _validate_language(target)
        except:
            raise ValueError("target language %s is not valid" % target)
        newquery = self._sanitize_query(query)
        params = [('key', settings.GOOGLE_API_KEY), ('target' , target)]
        if source:
            try:
                assert _validate_language(target)
            except:
                raise ValueError("source language %s is not valid" % target)
            params += ["source", source]
        params += newquery
        url = self._build_uri("", params)
        content = self._fetch_data(url)
        results = self._decode_json(content)

        return results

