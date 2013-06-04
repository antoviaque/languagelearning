
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
            return self.progressive_dispatch(request, *args, **kwargs)
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

    def progressive_dispatch(self, request, *args, **kwargs):
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
                return HttpResponse(self.handle_progressive(progressive_handler, request), 
                                    content_type='application/json')
            else:
                return self.handle_noprogressive(progressive_handler, request)
        else:
            if progressive_requested:
                return self.http_method_not_allowed(request, *args, **kwargs)
            else:
                return super(APIView, self).dispatch(request, *args, **kwargs)

    def handle_noprogressive(self, progressive_handler, request):
        context = {}
        for progressive_context in progressive_handler(request):
            context = progressive_context
        return self.render_to_response(context)
    
    def handle_progressive(self, progressive_handler, request):
        yield u'{separators}[PROGRESSIVE_RESPONSE_BEGIN]{separators}\n'.format(separators=u'='*500)
        for progressive_context in progressive_handler(request):
            yield self.render_to_response(progressive_context, progressive=True)

