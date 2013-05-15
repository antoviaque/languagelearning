
# Imports ###########################################################

from django.conf import settings
from django.views.generic.base import View

from utils.json import JSONResponseMixin


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
            return super(APIView, self).dispatch(request, *args, **kwargs)
        except ErrorResponse as e:
            return self.handle_error(request, e)
        except Exception as e:
            if settings.DEBUG:
                raise
            else:
                e.description = u'Sorry! An error has occurred.'
            return self.handle_error(request, e)


