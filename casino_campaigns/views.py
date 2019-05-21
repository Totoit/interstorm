from cms.utils.i18n import get_current_language
from django.shortcuts import render
from django.views.generic import ListView, DetailView

from casino_campaigns.models import Campaign
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware
from django.http import JsonResponse, HttpResponse
from django.core import serializers
class CampaignViewBase(object):
	def get_queryset(self):
		queryset = Campaign.objects.language(self.request.GET.get('language', get_current_language()))

		return queryset


class CampaignListView(CampaignViewBase, ListView):
	template_name = 'promotions/home.html'
	context_object_name = 'campaign_list'
	model = Campaign

	def get_queryset(self):
		queryset = super(CampaignListView, self).get_queryset()

		return queryset.published()


class CampaignDetailView(CampaignViewBase, DetailView):
	template_name = 'promotions/promotions_detail.html'
	context_object_name = 'campaign'
	model = Campaign

	def get_queryset(self):
		queryset = super(CampaignDetailView, self).get_queryset()

		if not self.request.user.is_staff:
			queryset.published()

		return queryset

@csrf_exempt
def get_promotion_list(request):
		if request.method == 'POST':
			# csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
			# if csrf_invalid:
			# 	response = {
			# 		'error' : 'invalid CSRF Token'
			# 	}
			# 	return JsonResponse(response)
			# else :
				user_id = request.POST.get('user_id');
				response = Campaign.objects.filter(landing_page__exact=False)
				response_serialized = serializers.serialize('json', response)
				return JsonResponse(response_serialized,safe=False)