
# Imports ###########################################################

import logging

from django.conf import settings
from django.http import HttpResponse
from django.views.generic.base import View

from utils.json import JSONResponseMixin


# Logging ###########################################################

logger = logging.getLogger(__name__)


# Exceptions ########################################################

class ErrorResponse(Exception):
    """
    Raised from an APIView method to trigger returning a formatted JSON error response
    """
    @property
    def description(self):
        return u'; '.join(self.args)


# Views #############################################################

class APIView(JSONResponseMixin, View):
    """
    Provides common handling of API view classes:
     - Converts response to JSON
     - Error handling & formatting
    """
    def dispatch(self, request, *args, **kwargs):
        try:
            return self.dispatch_progressive(request, *args, **kwargs)
        except ErrorResponse as e:
            return self.handle_error(request, e)
        except Exception as e:
            if settings.DEBUG:
                raise
            else:
                # TODO LOCAL
                e.description = u'Sorry! An error has occurred.'
                logger.exception(e)
                return self.handle_error(request, e)

    def dispatch_progressive(self, request, *args, **kwargs):
        """
        Uses special self.progressive_<httpverb>() methods when defined, otherwise 
        use the normal self.<httpverb>() method

        When defined, the progressive version is expected to return a generator, which 
        will be used to generate *both* the progressive response and the continuous
        one. It should yield values progressively as the response context is being 
        generated.
        """
        if request.method.lower() not in self.http_method_names:
            return self.http_method_not_allowed(request, *args, **kwargs)
        progressive_handler = getattr(self, 'progressive_{0}'.format(request.method.lower()))
        progressive_requested = request.REQUEST.get('progressive')

        if progressive_handler:
            if progressive_requested:
                return self.handle_progressive(progressive_handler, request)
            else:
                return self.handle_noprogressive_emulate(progressive_handler, request)
        else:
            if progressive_requested:
                return self.http_method_not_allowed(request, *args, **kwargs)
            else:
                return super(APIView, self).dispatch(request, *args, **kwargs)

    def handle_noprogressive_emulate(self, progressive_handler, request):
        """
        Emulated non-progressive response - iterates over a progressive generator,
        only returning its last answer

        Since raising an exception from an iterator stops it, the handler is responsible
        for catching exceptions & formatting them as one of the responses
        """
        response = None
        for progressive_response in progressive_handler(request, progressive=False):
            response = progressive_response
        return response

    def handle_progressive(self, progressive_handler, request):
        """
        Progressive answer - iterates over a progressive generator, sending responses
        to the browser progressively as they are yielded

        Since raising an exception from an iterator stops it, the handler is responsible
        for catching exceptions & formatting them as one of the responses
        """
        response = HttpResponse(progressive_handler(request, progressive=True),
                                content_type='application/json')
        response['X-Progressive-Response-Separator'] = settings.PROGRESSIVE_RESPONSE_SEPARATOR
        return response
