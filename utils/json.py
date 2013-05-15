
# Imports ###########################################################

from django import http
from django.utils import simplejson as json


# View Mixins #######################################################

class JSONResponseMixin(object):
    def render_to_response(self, context, **httpresponse_kwargs):
        """Returns a JSON response containing 'context' as payload"""

        return self.get_json_response(self.convert_context_to_json(context), 
                                      **httpresponse_kwargs)

    def get_json_response(self, content, **httpresponse_kwargs):
        """Construct an `HttpResponse` object."""

        return http.HttpResponse(content,
                                 content_type='application/json',
                                 **httpresponse_kwargs)

    def convert_context_to_json(self, context):
        """Convert the context dictionary into a JSON object"""

        # TODO: Convert querysets/models
        return json.dumps(context, sort_keys=True, indent=2)