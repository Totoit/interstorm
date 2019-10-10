# """interstorm URL Configuration

# The `urlpatterns` list routes URLs to views. For more information please see:
#     https://docs.djangoproject.com/en/1.11/topics/http/urls/
# Examples:
# Function views
#     1. Add an import:  from my_app import views
#     2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
# Class-based views
#     1. Add an import:  from other_app.views import Home
#     2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
# Including another URLconf
#     1. Import the include() function: from django.conf.urls import url, include
#     2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
# """
# from django.conf.urls import url,include
# from django.contrib import admin
# from interstorm_vendor import views as InterStoremVenderViews
# from django.conf import settings
# from django.conf.urls.static import static

# urlpatterns = [
#     url(r'', include('interstorm_wheel.urls')),
#     url(r'^admin/', admin.site.urls),
#     url(r'^get_game_api/', InterStoremVenderViews.get_game_api),
# ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


"""interstorm URL Configuration

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
from django.conf.urls import url,include
from django.contrib import admin
from interstorm_vendor import views as InterStoremVenderViews
from django.conf import settings
from django.conf.urls.static import static
from django.views.i18n import JavaScriptCatalog
from django.conf.urls.i18n import i18n_patterns
from interstorm_wheel import views as Wheel
from django.views.decorators.csrf import csrf_exempt
from interstorm import views as AppViews
urlpatterns = [
    # url(r'', include('interstorm_wheel.urls')),
    # url(r'^$', Wheel.login),
    # url(r'^game', Wheel.index),
    url(r'^admin/', admin.site.urls),
    url(r'^get_game_api/', InterStoremVenderViews.get_game_api),
    url((r'^api/'),include([
        url(r'^spin$', csrf_exempt(Wheel.spin), name='spin'),
        url(r'^get_spins$', Wheel.get_spins, name='get_spins'),
        url(r'^get_last_transaction$', Wheel.get_last_transaction, name='get_last_transaction'),
        url(r'^get_bonus_code$', Wheel.get_bonus_code, name='get_bonus_code'),
        url(r'^get_wheel_image', Wheel.get_wheel_image, name='get_wheel_image'),
        url(r'^get_granted_bonuses$', Wheel.getGrantedBonuses, name='get_granted_bonuses'),
        url(r'^get_eligible_claimBonus',Wheel.getEligibleClaimBonus,name='get_eligible_claimBonus'),
        url(r'^get_convert_bonus',Wheel.getConvertBonus,name='get_convert_bonus'),
        url(r'^reload_uwsgi/', AppViews.reload_uwsgi ,name="reload-uwsgi"),
    ]))
    # url('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += i18n_patterns(
    url('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
    # url(r'^admin/', admin.site.urls),
    url(r'^$', Wheel.login),
    url(r'^game', Wheel.index),
    
    # url(r'', include('interstorm_wheel.urls')),
    
    
)