
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
        self.expression = request.GET.get('expression', '')
        self.source = request.GET.get('source', '').lower()
        self.target = request.GET.get('target', 'en').lower()
        self.query_types = request.GET.getlist('query_type', [])
        # TODO: key, callback

        # Query format check
        if not self.expression:
            raise ErrorResponse("'expression' can't be empty")

    def get(self, request):
        self.fetch_parameters(request)
        if not self.query_types:
            raise ErrorResponse('No query type specified')
        
        results = {}
        for query_type in self.query_types:
            if query_type not in ('translation',):
                continue
            results[query_type] = getattr(self, 'query_{0}'.format(query_type))()

        return self.render_to_response({
                'expression': self.expression,
                'source': self.source,
                'target': self.target,
                'status': 'success',
                'results': results
            })
    
    def handle_error(self, request, e):
        return self.render_to_response({
                'expression': self.expression,
                'source': self.source,
                'target': self.target,
                'status': 'error',
                'error': "; ".join(e.args)
            })
    
    def query_translation(self):
        translator = GoogleTranslator()
        try:
            response = translator.translate(self.expression, source=self.source, target=self.target)
        except Exception as e:
            raise ErrorResponse("; ".join(e.args))

        if 'error' in response:
            raise ErrorResponse(json.dumps(response['error']))
        try:
            translation = response['data']['translations'][0]
            translated_text = translation['translatedText']
        except KeyError:
            raise ErrorResponse('No translation found')

        if not self.source and 'detectedSourceLanguage' in translation:
            self.source = translation['detectedSourceLanguage']

        return translated_text

