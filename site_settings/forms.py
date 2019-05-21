from django import forms
from hvad.forms import TranslatableModelForm

from site_settings.models import AutoEmail

#AutoEmail
class AutoEmailAdminForm(TranslatableModelForm, forms.ModelForm):
	class Meta:
		model = AutoEmail
		fields = ('title', 'body')
		#labels = {'show_slide': 'Add to homepage slide show', }

	def __init__(self, *args, **kwargs):
		super(AutoEmailAdminForm, self).__init__(*args, **kwargs)
		# self.fields['subtitle'].required = False
		# self.fields['subdetail'].required = False


class AutoEmailWizardForm(AutoEmailAdminForm):
	pass
