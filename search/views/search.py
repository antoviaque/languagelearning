
# Imports ###########################################################

import json

from dist.googletranslate import GoogleTranslator
from utils.api import APIView, ErrorResponse


# Classes ###########################################################

class SearchAPIView(APIView):
    
    def fetch_parameters(self, request):
        """
        Retreives query parameters from the request data
        """
        self.expression = request.GET.get(u'expression', u'')
        self.source = request.GET.get(u'source', u'').lower()
        self.target = request.GET.get(u'target', u'en').lower()
        self.query_types = request.GET.getlist(u'query_type', [])
        # TODO: key, callback

        # Query format check
        if not self.expression:
            raise ErrorResponse(u"'expression' can't be empty")

    def get(self, request):
        self.fetch_parameters(request)
        if not self.query_types:
            raise ErrorResponse(u'No query type specified')
        
        results = {}
        for query_type in self.query_types:
            if query_type not in (u'translation',):
                continue
            results[query_type] = getattr(self, u'query_{0}'.format(query_type))()

        return self.render_to_response({
                u'expression': self.expression,
                u'source': self.source,
                u'target': self.target,
                u'status': u'success',
                u'results': results
            })
    
    def handle_error(self, request, e):
        return self.render_to_response({
                u'expression': self.expression,
                u'source': self.source,
                u'target': self.target,
                u'status': u'error',
                u'error': e.description
            }, status=400)
    
    def query_translation(self):
        translator = GoogleTranslator()
        response = translator.translate(self.expression, source=self.source, target=self.target)

        if u'error' in response:
            raise ErrorResponse(json.dumps(response[u'error']))
        
        translation = response[u'data'][u'translations'][0]
        translated_text = translation[u'translatedText']

        if not self.source and u'detectedSourceLanguage' in translation:
            self.source = translation[u'detectedSourceLanguage']

        return translated_text

