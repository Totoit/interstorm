from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class CampaignsConfig(AppConfig):
    name = 'casino_campaigns'
    verbose_name = _('Campaigns')
