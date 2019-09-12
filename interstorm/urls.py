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

urlpatterns = [
    url(r'', include('interstorm_wheel.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^get_game_api/', InterStoremVenderViews.get_game_api),
    # url('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = i18n_patterns(
    url('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
    url(r'^admin/', admin.site.urls),
)