from django.conf.urls import url, include

from casino_campaigns.views import CampaignListView, CampaignDetailView

app_name = 'casino_campaigns'

urlpatterns = [
	url(r'^$', CampaignListView.as_view(), name='index'),
	url(r'^(?P<slug>.+)/$', CampaignDetailView.as_view(), name='detail'),
]


# urlpatterns = [url('^', include(campaign_urlpatterns, namespace=app_name, app_name=app_name))]
