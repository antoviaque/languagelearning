
# Imports ###########################################################

from django import http
from django.conf import settings
from django.utils import simplejson as json


# View Mixins #######################################################

class JSONResponseMixin(object):
    def render_to_response(self, context, progressive=False, **httpresponse_kwargs):
        """Returns a JSON response containing 'context' as payload"""

        if progressive:
            return u'{content}\n{separator}\n'\
                    .format(content=self.convert_context_to_json(context), 
                            separator=settings.PROGRESSIVE_RESPONSE_SEPARATOR)
        else:
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
