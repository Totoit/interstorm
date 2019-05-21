from django.conf import settings
import requests
import pygeoip
import getip
import os.path

from django.utils import translation
from django.conf.urls.i18n import is_language_prefix_patterns_used
from django.http import HttpResponseRedirect
from django.urls import get_script_prefix, is_valid_path
from django.utils import translation
from django.utils.cache import patch_vary_headers
from django.utils.deprecation import MiddlewareMixin
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import socket
from binascii import hexlify
import struct

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
def is_valid_ipv6_address(address):
    try:
        socket.inet_pton(socket.AF_INET6, address)
    except socket.error:  # not a valid address
        return False
    return True

def IPV6_to_int(ipv6_addr):
    return int(hexlify(socket.inet_pton(socket.AF_INET6, ipv6_addr)), 16)

def Int2IP(ipnum):
    o1 = int(ipnum / 16777216) % 256
    o2 = int(ipnum / 65536) % 256
    o3 = int(ipnum / 256) % 256
    o4 = int(ipnum) % 256
    return '%(o1)s.%(o2)s.%(o3)s.%(o4)s' % locals()

class IprequireMiddlewere(MiddlewareMixin):
    response_redirect_class = HttpResponseRedirect
    @csrf_exempt
    def process_request(self, request):
        urlconf = getattr(request, 'urlconf', settings.ROOT_URLCONF)
        i18n_patterns_used, prefixed_default_language = is_language_prefix_patterns_used(urlconf)
        language = translation.get_language_from_request(request, check_path=i18n_patterns_used)
        language_from_path = translation.get_language_from_path(request.path_info)
        if not language_from_path and i18n_patterns_used and not prefixed_default_language:
            language = settings.LANGUAGE_CODE
        translation.activate(language)
        request.LANGUAGE_CODE = translation.get_language()
    @csrf_exempt
    def process_response(self, request, response):
        language = 'en'
        response.set_cookie('csrftoken', get_token(request))
        # print(get_client_ip(request))
        # print(request.LANGUAGE_CODE)

        if request.LANGUAGE_CODE == 'en':
            if not translation.LANGUAGE_SESSION_KEY in request.session:
                public_ip = get_client_ip(request)
                # public_ip = getip.get()
                if is_valid_ipv6_address(public_ip):
                    hexip = IPV6_to_int(public_ip)
                    public_ip = Int2IP(hexip)
                response.set_cookie('public_ip', public_ip)
                gi = pygeoip.GeoIP(os.path.join(settings.BASE_DIR, 'GeoIP.dat'))
                # country code
                country_code = gi.country_code_by_addr(public_ip).lower()
                # print(country_code)
                # set language
                # if country_code in ['fi','gr','de','es','kr','jp','it','se','nb','cn','gb','ar'] :
                if country_code in [] :
                    if country_code == 'gr':
                        language = 'en-ca'
                    if country_code == 'gb':
                        language = 'en-gb'
                    elif country_code == 'cn':
                        language = 'zh'
                    elif country_code == 'jp':
                        language = 'ja'
                    elif country_code == 'se':
                        language = 'sv'
                    elif country_code == 'kr':
                        language = 'ko'
                    elif country_code == 'ar':
                        language = 'es'
                    else :
                        language = country_code
                else :
                    language = 'en'
            else :
                language = 'en'
        else :
            language = request.LANGUAGE_CODE

        # change language
        language_from_path = translation.get_language_from_path(request.path_info)
        urlconf = getattr(request, 'urlconf', settings.ROOT_URLCONF)
        i18n_patterns_used, prefixed_default_language = is_language_prefix_patterns_used(urlconf)
        if not translation.LANGUAGE_SESSION_KEY in request.session:
            if (response.status_code != 404 and not language_from_path and
                    i18n_patterns_used and prefixed_default_language):
                # Maybe the language code is missing in the URL? Try adding the
                # language prefix and redirecting to that URL.
                language_path = '/%s%s' % (language, request.path_info)
                path_valid = is_valid_path(language_path, urlconf)
                path_needs_slash = (
                    not path_valid and (
                        settings.APPEND_SLASH and not language_path.endswith('/') and
                        is_valid_path('%s/' % language_path, urlconf)
                    )
                )
                if path_valid or path_needs_slash:
                    script_prefix = get_script_prefix()
                    # Insert language after the script prefix and before the
                    # rest of the URL
                    language_url = request.get_full_path(force_append_slash=path_needs_slash).replace(
                        script_prefix,
                        '%s%s/' % (script_prefix, language),
                        1
                    )
                    path_slash = request.get_full_path(force_append_slash=path_needs_slash)
                    path_array = path_slash.split("/")
                    for i in path_array : 
                        print ("----->",i)
                    api_path = path_array[1]
                    if (path_slash != '/casino_common/logoutcms/' and path_slash != '/api/check_mobile_number/' and api_path != 'api' ) and language != 'en':
                        return self.response_redirect_class(language_url)
        else:
            if (response.status_code != 404 and not language_from_path and
                    i18n_patterns_used and prefixed_default_language):
                # Maybe the language code is missing in the URL? Try adding the
                # language prefix and redirecting to that URL.
                language_path = '/%s%s' % (language, request.path_info)
                path_valid = is_valid_path(language_path, urlconf)
                path_needs_slash = (
                    not path_valid and (
                        settings.APPEND_SLASH and not language_path.endswith('/') and
                        is_valid_path('%s/' % language_path, urlconf)
                    )
                )
                if path_valid or path_needs_slash:
                    script_prefix = get_script_prefix()
                    # Insert language after the script prefix and before the
                    # rest of the URL
                    language_url = request.get_full_path(force_append_slash=path_needs_slash).replace(
                        script_prefix,
                        '%s%s/' % (script_prefix, language),
                        1
                    )
                    path_slash = request.get_full_path(force_append_slash=path_needs_slash)
                    path_array = path_slash.split("/")
                    for i in path_array : 
                        print ("----->",i)
                    api_path = path_array[1]
                    if (path_slash != '/casino_common/logoutcms/' and path_slash != '/api/check_mobile_number/' and api_path != 'api') and language != 'en':
                        return self.response_redirect_class(language_url)

        if not (i18n_patterns_used and language_from_path):
            patch_vary_headers(response, ('Accept-Language',))
        if 'Content-Language' not in response:
            response['Content-Language'] = language
        return response
