from cms.app_base import CMSApp
from cms.apphook_pool import apphook_pool
from django.utils.translation import ugettext_lazy as _

from casino_campaigns.cms_menus import CampaignMenu


class CampaignApphook(CMSApp):
	app_name = 'casino_campaigns'
	name = _('Campaigns')
	_menus = [CampaignMenu]
	_urls = ['casino_campaigns.urls']


apphook_pool.register(CampaignApphook)
