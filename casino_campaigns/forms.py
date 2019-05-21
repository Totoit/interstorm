from django import forms
from hvad.forms import TranslatableModelForm

from casino_campaigns.models import Campaign


class CampaignAdminForm(TranslatableModelForm, forms.ModelForm):
	class Meta:
		model = Campaign
		fields = ('banner_cover', 'cta', 'title', 'subtitle','detail', 'topic', 'topic_data','thumbnail','slug', 'show_slide', 'show_bottom_banners','landing_page', 'publish_date', 'expire_date')
		labels = {'show_slide': 'Add to homepage slide show', 'show_bottom_banners' : 'Add to bottom banner show'}

		
			
	def __init__(self, *args, **kwargs):
		super(CampaignAdminForm, self).__init__(*args, **kwargs)
		# self.fields['show_bottom_banners'].widget.attrs['readonly'] = True
		# print(Campaign.objects.filter(show_bottom_banners=True).exists())
		# if(Campaign.objects.filter(show_bottom_banners=True).exists()):
		# 	self.fields['show_bottom_banners'].widget.attrs['readonly'] = True
			# import pprint
			# print(self.fields['show_bottom_banners'])
			# if(self.fields['show_bottom_banners']):
			# 	self.fields['show_bottom_banners'].widget.attrs['readonly'] = False
		self.fields['cta'].required = False
		# self.fields['subtitle'].required = False
		# self.fields['subdetail'].required = False


class CampaignWizardForm(CampaignAdminForm):
	pass
