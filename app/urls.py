""" URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import url, include
from django.contrib import admin
from solid_i18n.urls import solid_i18n_patterns
from django.views.i18n import javascript_catalog
from django.utils.translation import ugettext_lazy as _
from django.views.generic import TemplateView, RedirectView
# from casino_common.casino_identification import views as identification
from casino_campaigns.views import CampaignListView, CampaignDetailView, get_promotion_list
from app.views import readGamesData, syncgames

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.clickjacking import xframe_options_exempt
# from contract_management import views as ContractManagementViews
# from translation_manager import urls as translation_urls
from . import views
# from casino_campaigns.views import get_promotion_list

from django.contrib.sitemaps.views import sitemap
# from casino_campaigns.sitemaps import CampaignSitemap
# from casino_campaigns import views as campaigns_view
from app.sitemaps import StaticSitemap, DynamicSitemap, APPSitemap

sitemaps = {'static': StaticSitemap, 'dynamic': DynamicSitemap , 'app':APPSitemap}

import private_storage.urls
from django.conf.urls import handler404, handler500
from app import views as AppViews
urlpatterns = [
    url(r'^jsi18n\.js$', javascript_catalog, name='javascript-catalog'),
    url(r'^i18n/', include('django.conf.urls.i18n')),

    url(r'^readGamesData/$', readGamesData),
    url(r'^syncgames/', syncgames),
    url(r'^casino_common/', include('casino_common.casino_user.urls')),
    url(r'^sitemap.xml$', sitemap, {'sitemaps': sitemaps}),
    url(r'^promotions/api/get_promotion_list', get_promotion_list,name="get_promotion_list"),
    url(r'^treasure_chest/', include('treasure_chest.urls')),
    url(r'^reload_uwsgi/', AppViews.reload_uwsgi ,name="reload-uwsgi"),
    url(r'api/', include([
        url(r'^readGamesData/$', readGamesData),
        url(r'^reload_uwsgi/', AppViews.reload_uwsgi ,name="reload-uwsgi"),
    ])),
]

urlpatterns += [
    url('^private-media/', include(private_storage.urls)),
]

# urlpatterns += solid_i18n_patterns(
#     # url(r'^jsi18n\.js$', javascript_catalog, name='javascript-catalog'),
#     # url(r'^i18n/', include('django.conf.urls.i18n')),
#     # url(r'^$', RedirectView.as_view(url='/')),
#     # url(r'^$', TemplateView.as_view(template_name='home/home.html'), name="start"),
#     # url(r'^django-rq/', include('django_rq.urls')),
#     # url(r'^translations/', include(translation_urls)),
#     # url(r'^promotions', include('casino_campaigns.urls')),
#     # url(r'^casino_common/', include('casino_common.casino_user.urls')),
#     # url(r'^wheel/', include('wheel.urls')),
# )

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += patterns('',
#                         (r'^static/(?P<path>.*)$', 'django.views.static.serve',
#                          {'document_root': settings.STATIC_ROOT}),
#                         )

urlpatterns += solid_i18n_patterns(
    # url(r'^jsi18n\.js$', javascript_catalog, name='javascript-catalog'),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    # Admin
    url(r'^admin/', admin.site.urls),
    # url(r'^eSignatureClick/$',ContractManagementViews.index),
    # url(r'^account/$',ContractManagementViews.getContractUserData),
    # url(r'^OpenPDFFile/$',ContractManagementViews.OpenPDFFile),
    # url(r'^DownloadPDFFile/$',ContractManagementViews.DownloadPDFFile),#DownloadPDFFile
    url(_(r'login/$'), TemplateView.as_view(template_name='dashboard/auth/login.html'), name="login"),
    url(_(r'register/$'), TemplateView.as_view(template_name='dashboard/auth/register_mobile.html'), name="mobile register"),
    url(_(r'registersuccess/$'), TemplateView.as_view(template_name='dashboard/auth/register_success.html'), name="registersuccess"),
    url(_(r'activate/$'), TemplateView.as_view(template_name='dashboard/auth/activate.html'), name="activate"),
    url(_(r'^game/'), include([
        url(r'^$', TemplateView.as_view(template_name='dashboard/game/game.html'), name="game"),
        url(r'(?P<slug>[\w-]+)/$', views.game_screen, name="game-screen")
    ])),
    # url(_(r'promotions/'), include([
    #     url(r'^$', TemplateView.as_view(template_name='promotions/home.html'), name="promotions"),
    #     url(r'(?P<slug>[\w-]+)/$', CampaignDetailView.as_view(template_name='promotions/promotions_detail.html'), name="promotions-detail")
    # ])),
    url(_(r'treasurechest/$'), TemplateView.as_view(template_name='treasure_chest/home.html'), name="treasurechest"),
    url(_(r'treasurechest_frame/$'), xframe_options_exempt(TemplateView.as_view(template_name='treasure_chest/home_frame.html')), name="treasurechest_frame"),
    # url(_(r'forgot-password/$'), TemplateView.as_view(template_name='forgot-password/home.html'), name="forgot password"),
    url(_(r'verifynewemail/$'), TemplateView.as_view(template_name='verifynewemail/home.html'), name="verifynewemail"),
    url(_(r'reset/$'), TemplateView.as_view(template_name='reset-password/home.html'), name="reset"),
    url(_(r'^account/'), include([
        url(r'^$', TemplateView.as_view(template_name='dashboard/account/home.html'), name="account"),
        # url(r'settings/$', TemplateView.as_view(template_name='dashboard/account/profile.html'), name="settings"),
        url(r'bonus/$', TemplateView.as_view(template_name='dashboard/account/active_bonus.html'), name="bonus"),
        # url(r'identification/$', identification.verificationView, name="identification"),
        url(r'gaming_history/$', TemplateView.as_view(template_name='dashboard/account/gaming_history.html'), name="gaming_history"),
        url(r'pending/$', TemplateView.as_view(template_name='dashboard/account/pending_withdraw.html'), name="pending"),
        url(r'transactions/$', TemplateView.as_view(template_name='dashboard/account/transactions.html'), name="transactions"),
        url(_(r'limits/'), include([
            url(r'^$', TemplateView.as_view(template_name='dashboard/account/gaming_limits.html'), name="limits"),
            url(r'deposit/$', TemplateView.as_view(template_name='dashboard/auth/deposit_limit.html'), name="deposit_limit"),
            url(r'loss/$', TemplateView.as_view(template_name='dashboard/auth/loss_limit.html'), name="loss_limit"),
            url(r'wager/$', TemplateView.as_view(template_name='dashboard/auth/wagering_limit.html'), name="wagering_limit"),
            url(r'session/$', TemplateView.as_view(template_name='dashboard/auth/session_limit.html'), name="session_limit"),
            url(r'stake/$', TemplateView.as_view(template_name='dashboard/auth/max_stake_limit.html'), name="max_stake_limit"),
        ])),
        url(r'inbox/$', TemplateView.as_view(template_name='dashboard/account/inbox.html'), name="inbox"),
        url(r'email/$', TemplateView.as_view(template_name='dashboard/account/change_email.html'), name="email"),
        url(_(r'deposit/'), include([
            url(r'^$', TemplateView.as_view(template_name='dashboard/transactions/deposit.html'), name="deposit"),
            url(r'status/$', TemplateView.as_view(template_name='dashboard/transactions/deposit_success.html'), name="depositstatus"),
            url(r'(?P<slug>[\w-]+)/$', TemplateView.as_view(template_name='dashboard/transactions/deposit_screen.html'), name="deposit-screen")
        ])),
        url(_(r'withdraw/'), include([
            url(r'^$', TemplateView.as_view(template_name='dashboard/transactions/withdraw.html'), name="withdraw"),
            url(r'status/$', TemplateView.as_view(template_name='dashboard/transactions/withdraw_success.html'), name="withdrawstatus"),
            url(r'(?P<slug>[\w-]+)/$', TemplateView.as_view(template_name='dashboard/transactions/withdraw_screen.html'), name="withdraw-screen")
        ])),
        url(r'password/$', TemplateView.as_view(template_name='dashboard/account/change_password.html'), name="password"),
        url(r'videocall/$', TemplateView.as_view(template_name='dashboard/account/videoCall.html'), name="video-call"),
        url(r'chat/$', TemplateView.as_view(template_name='dashboard/account/chat.html'), name="chat")
    ])),
    url(_(r'tablegames/'), TemplateView.as_view(template_name='table_games/home.html'), name="tablegames"),
    url(_(r'allgames/'), TemplateView.as_view(template_name='all_games/home.html'), name="allgames"),
    url(_(r'slotgames/'), TemplateView.as_view(template_name='slot_games/home.html'), name="slotgames"),
    url(_(r'about-us/'), TemplateView.as_view(template_name='home/about_us.html'), name="about-us"),
    url(_(r'favorites/'), TemplateView.as_view(template_name='dashboard/auth/favorites.html'), name="favorites"),
    # url(_(r'rules-security/'), TemplateView.as_view(template_name='home/rules_security.html'), name="rules-security"),
    # url(_(r'forgotpassword/'), TemplateView.as_view(template_name='home/forgot_pass.html'), name="forgotpassword"),
    url(_(r'vip/'), TemplateView.as_view(template_name='home/vip.html'), name="vip"),
    # url(_(r'payment-method/'), TemplateView.as_view(template_name='home/payment_method.html'), name="payment-method"),
    url(_(r'casino/'), include([
        url(r'(?P<slug>[\w-]+)/$', TemplateView.as_view(template_name='casino/category.html'), name="casino-category")
    ])),
    url(_(r'livegames/'), TemplateView.as_view(template_name='livegames/home.html'), name="livegames"),
    url(r'^', include('cms.urls'))
)

urlpatterns += solid_i18n_patterns(
    url(_(r'login/$'), TemplateView.as_view(template_name='dashboard/auth/login.html'), name="login")
)

handler404 = views.handler404
handler500 = views.handler404