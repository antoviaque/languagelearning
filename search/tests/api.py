
# Imports ###########################################################

import json

from mock import Mock, call, patch

from django.test import TestCase


# Classes ###########################################################

class SearchAPITest(TestCase):

    def api_check(self, response, reference):
        """
        Compare the JSON content of the response with a reference object, must be equal
        """
        response_obj = json.loads(response.content)
        try:
            self.assertEqual(response_obj, reference)
        except AssertionError:
            expected = json.dumps(reference, indent=2, sort_keys=True)
            message = "\nReturned:\n{returned}\n\nExpected:\n{expected}".format(returned=response.content,
                                                                                expected=expected)
            raise AssertionError(message)

    def test_api_search_missing_parameters(self):
        response = self.client.get('/api/v1/search')
        self.api_check(response, {
                "error": "'expression' can't be empty", 
                "expression": "", 
                "source": "", 
                "status": "error", 
                "target": "en"
            })
        
        response = self.client.get('/api/v1/search?expression=')
        self.api_check(response, {
                "error": "'expression' can't be empty", 
                "expression": "", 
                "source": "", 
                "status": "error", 
                "target": "en"
            })
        
        response = self.client.get('/api/v1/search?expression=test')
        self.api_check(response, {
                "error": "No query type specified", 
                "expression": "test", 
                "source": "", 
                "status": "error", 
                "target": "en"
            })
        
    @patch('search.views.search.GoogleTranslator')
    def test_api_search_translation(self, MockGoogleTranslator):
        # Mock class instance
        mock_translator = Mock()
        def create_mock_translator():
            return mock_translator
        MockGoogleTranslator.side_effect = create_mock_translator

        # Predetermine translation results
        def mock_translate(*args, **kwargs):
            return {
                    'data': {
                        'translations': [{
                            'translatedText': 'good day',
                            'detectedSourceLanguage': 'pt'
                        }]
                    }
                }
        mock_translator.translate.side_effect = mock_translate

        response = self.client.get('/api/v1/search?expression=bom%20dia&query_type=translation')
        self.api_check(response, {
                "expression": "bom dia", 
                "results": {
                    "translation": "good day"
                }, 
                "source": "pt", 
                "status": "success", 
                "target": "en"
            })
        self.assertEqual(mock_translator.mock_calls, [call.translate(u'bom dia', source='', target='en')])
        
    @patch('search.views.search.GoogleTranslator')
    def test_api_search_translation_error(self, MockGoogleTranslator):
        # Mock class instance
        mock_translator = Mock()
        def create_mock_translator():
            return mock_translator
        MockGoogleTranslator.side_effect = create_mock_translator

        # Translation returns an error message
        def mock_translate(*args, **kwargs):
            return {'error': ['Error message']}
        mock_translator.translate.side_effect = mock_translate

        response = self.client.get('/api/v1/search?expression=bom%20dia&query_type=translation')
        self.api_check(response, {
                "error": '["Error message"]', 
                "expression": "bom dia", 
                "source": "", 
                "status": "error", 
                "target": "en"
            })
        
        # Translation returns an unexpected format
        def mock_translate(*args, **kwargs):
            return {'something': 'unexpected'}
        mock_translator.translate.side_effect = mock_translate

        response = self.client.get('/api/v1/search?expression=bom%20dia&query_type=translation')
        self.api_check(response, {
                "error": 'No translation found',
                "expression": "bom dia", 
                "source": "", 
                "status": "error", 
                "target": "en"
            })
        
        # Translation throws an exception
        def mock_translate(*args, **kwargs):
            raise KeyError('test error one')
        mock_translator.translate.side_effect = mock_translate

        response = self.client.get('/api/v1/search?expression=bom%20dia&query_type=translation')
        self.api_check(response, {
                "error": 'test error one',
                "expression": "bom dia", 
                "source": "", 
                "status": "error", 
                "target": "en"
            })
        
        

