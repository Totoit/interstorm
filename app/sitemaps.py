from django.contrib.sitemaps import Sitemap
from django.utils import timezone
from django.core.urlresolvers import reverse
from casino_campaigns.models import Campaign
from django.apps import apps
from cms.models import Page as CMS_Page
from datetime import date

class StaticSitemap(Sitemap):
    """Reverse 'static' views for XML sitemap."""
    changefreq = "daily"
    priority = 0.5

    def location(self, item):
        return reverse(item)
    def lastmod(self, item):
        return timezone.now()   

class DynamicSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.5
    
    def items(self):
        return Campaign.objects.all()
    def lastmod(self, obj):
        return obj.updated


class APPSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.5
    
    def items(self):
        return CMS_Page.objects.all()
    def lastmod(self, obj):
        return obj.changed_date