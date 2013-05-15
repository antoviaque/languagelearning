# -*- coding: utf8 -*-

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
            message = u'\nReturned:\n{returned}\n\nExpected:\n{expected}'.format(returned=response.content,
                                                                                 expected=expected)
            raise AssertionError(message)

    def test_api_search_missing_parameters(self):
        response = self.client.get(u'/api/v1/search')
        self.api_check(response, {
                u'error': u"'expression' can't be empty",
                u'expression': u'', 
                u'source': u'', 
                u'status': u'error', 
                u'target': u'en'
            })
        
        response = self.client.get(u'/api/v1/search?expression=')
        self.api_check(response, {
                u'error': u"'expression' can't be empty", 
                u'expression': u'', 
                u'source': u'', 
                u'status': u'error', 
                u'target': u'en'
            })
        
        response = self.client.get(u'/api/v1/search?expression=test')
        self.api_check(response, {
                u'error': u'No query type specified', 
                u'expression': u'test', 
                u'source': u'', 
                u'status': u'error', 
                u'target': u'en'
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
                    u'data': {
                        u'translations': [{
                            u'translatedText': u'good day eèÉɘ',
                            u'detectedSourceLanguage': u'pt'
                        }]
                    }
                }
        mock_translator.translate.side_effect = mock_translate

        response = self.client.get(u'/api/v1/search?expression=bom%20dia%20e%C3%A8%C3%89%C9%98&query_type=translation')
        self.api_check(response, {
                u'expression': u'bom dia eèÉɘ',
                u'results': {
                    u'translation': u'good day eèÉɘ'
                }, 
                u'source': u'pt', 
                u'status': u'success', 
                u'target': u'en'
            })
        self.assertEqual(mock_translator.mock_calls, [call.translate(u'bom dia eèÉɘ', source=u'', target=u'en')])
        
    @patch('search.views.search.GoogleTranslator')
    def test_api_search_translation_error(self, MockGoogleTranslator):
        # Mock class instance
        mock_translator = Mock()
        def create_mock_translator():
            return mock_translator
        MockGoogleTranslator.side_effect = create_mock_translator

        # Translation returns an error message
        def mock_translate(*args, **kwargs):
            return {u'error': [u'Error message']}
        mock_translator.translate.side_effect = mock_translate

        response = self.client.get(u'/api/v1/search?expression=bom%20dia%20e%C3%A8%C3%89%C9%98&query_type=translation')
        self.api_check(response, {
                u'error': u'["Error message"]',
                u'expression': u'bom dia eèÉɘ', 
                u'source': u'', 
                u'status': u'error', 
                u'target': u'en'
            })
        
        # Translation returns an unexpected format
        def mock_translate(*args, **kwargs):
            return {u'something': u'unexpected'}
        mock_translator.translate.side_effect = mock_translate

        response = self.client.get(u'/api/v1/search?expression=bom%20dia%20e%C3%A8%C3%89%C9%98&query_type=translation')
        self.api_check(response, {
                u'error': u'No translation found',
                u'expression': u'bom dia eèÉɘ', 
                u'source': u'', 
                u'status': u'error', 
                u'target': u'en'
            })
        
        # Translation throws an exception
        def mock_translate(*args, **kwargs):
            raise KeyError(u'test error one')
        mock_translator.translate.side_effect = mock_translate

        response = self.client.get(u'/api/v1/search?expression=bom%20dia%20e%C3%A8%C3%89%C9%98&query_type=translation')
        self.api_check(response, {
                u'error': u'test error one',
                u'expression': u'bom dia eèÉɘ', 
                u'source': u'', 
                u'status': u'error', 
                u'target': u'en'
            })
        
        

