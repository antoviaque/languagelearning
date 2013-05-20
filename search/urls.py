
# Imports ###########################################################

from django.conf.urls import patterns, url
from django.views.generic import TemplateView

from views.search import SearchAPIView


# URLs ##############################################################

urlpatterns = patterns('',
    url(r'^api/v1/search$', SearchAPIView.as_view(), name=u'api_search'),
    url(r'^expression/', TemplateView.as_view(template_name=u'index.html')),
    url(r'^$', TemplateView.as_view(template_name=u'index.html')),
)

