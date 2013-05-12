
# Imports ###########################################################

from django.views.generic.base import View

from utils.json import JSONResponseMixin


# Exceptions ########################################################

class ErrorResponse(Exception):
    """
    Raised from an APIView method to trigger returning a formatted JSON error response
    """
    pass


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


