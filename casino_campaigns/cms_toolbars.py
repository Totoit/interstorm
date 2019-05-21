from cms.extensions.toolbar import ExtensionToolbar
from cms.toolbar_base import CMSToolbar
from cms.toolbar_pool import toolbar_pool
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _

from casino_campaigns.models import Campaign


@toolbar_pool.register
class CampaignToolbar(CMSToolbar):
	def populate(self):
		if self.is_current_app:
			resolver_match = self.request.resolver_match

			if resolver_match.view_name == 'casino_campaigns:detail':
				slug = resolver_match.kwargs.get('slug', None)

				if slug:
					try:
						campaign = Campaign.objects.language().get(slug=slug)
					except Campaign.DoesNotExist:
						return

					menu = self.toolbar.get_or_create_menu('campaigns-app', _('Campaign'))

					menu.add_modal_item(
						_('Edit Campaign'),
						url=reverse('admin:casino_campaigns_campaign_change', args=[campaign.pk]),
						active=True,
					)