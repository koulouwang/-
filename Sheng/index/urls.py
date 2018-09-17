from django.conf.urls import url

from index.views import *

urlpatterns = [
    url(r'^$',index_views),
]
urlpatterns +=[
    url(r'^add_hero/$',addHero_views),
    url(r'^login/$',login_views),
    url(r'^register/$',register_views),
    url(r'^top_10/$',top10_views),
]