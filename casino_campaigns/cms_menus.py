from django.core.urlresolvers import reverse
from django.db.models.signals import post_save, post_delete
from django.utils.translation import ugettext_lazy as _
from cms.menu_bases import CMSAttachMenu
from menus.base import NavigationNode
from menus.menu_pool import menu_pool

from casino_campaigns.models import Campaign


class CampaignMenu(CMSAttachMenu):
	name = _('Campaigns Menu')

	def get_nodes(self, request):
		nodes = []

		for campaign in Campaign.objects.language():
			node = NavigationNode(
				title=campaign.title,
				url=reverse('casino_campaigns:detail', args=[campaign.lazy_translation_getter('slug')]),
				id=campaign.pk,
			)

			nodes.append(node)

		return nodes


def clear_menu_cache(**kwargs):
	menu_pool.clear(all=True)

post_save.connect(clear_menu_cache, sender=Campaign)
post_delete.connect(clear_menu_cache, sender=Campaign)