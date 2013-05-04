from django.conf.urls import patterns
from django.views.generic import RedirectView

urlpatterns = patterns('',
    #url(r'^$', 'home', name='home'),
    (r'^$', RedirectView.as_view(url='/static/index.html')),
)

