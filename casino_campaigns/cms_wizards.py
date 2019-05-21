from django.utils.translation import ugettext_lazy as _
from cms.wizards.wizard_base import Wizard
from cms.wizards.wizard_pool import wizard_pool

from casino_campaigns.forms import CampaignWizardForm
from casino_campaigns.models import Campaign


class CampaignWizard(Wizard):
	pass


campaign_wizard = CampaignWizard(
	model=Campaign,
	form=CampaignWizardForm,
	title=_('New Campaign'),
	weight=200,
	description=_('Create a new Campaign'),
)


# wizard_pool.register(campaign_wizard)
