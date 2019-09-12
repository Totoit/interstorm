from .settings import *
# import pymysql
import sys
# pymysql.install_as_MySQLdb()


# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'uniclub_casino',
#         'USER': 'root',
#         'PASSWORD': '',
#         'HOST': 'localhost'
#     }
# }

# ROOT_URLCONF = 'pwr.urls_server'

INSTALLED_APPS += (
    'redis_cache',
    # -- HTPPS-SSL --
    # "sslserver",
    # -- end --
    # -- translation --
    'translation_manager',
    'django_rq',
    'rest_framework',

)
MIDDLEWARE += (
    # 'cms.middleware.language.LanguageCookieMiddleware',
)

TRANSLATIONS_PROCESSING_METHOD = 'async_django_rq'

#=======================================
AUTHENTICATION_BACKENDS = ('django.contrib.auth.backends.ModelBackend',)
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_AGE = 1500
SESSION_COOKIE_DOMAIN = None
SESSION_COOKIE_NAME = 'DSESSIONID'
SESSION_COOKIE_SECURE = False

TESTING = sys.argv[1:2] == ['pwr']

if TESTING:
    LOCALE_PATHS = [os.path.join(BASE_DIR, '', "locale")]
    TRANSLATIONS_BASE_DIR = BASE_DIR
else:
    LOCALE_PATHS = [
        os.path.join(BASE_DIR, '', 'locale')
    ]
    TRANSLATIONS_BASE_DIR = os.path.join(BASE_DIR, '')

# print LOCALE_PATHS
# print TRANSLATIONS_BASE_DIR

TRANSLATIONS_MODE = "N"

TRANSLATIONS_PROJECT_BASE_DIR = BASE_DIR

TRANSLATIONS_ALLOW_NO_OCCURRENCES = False

TRANSLATIONS_IGNORED_PATHS = ['env']

TRANSLATIONS_MAKE_BACKUPS = True
TRANSLATIONS_CLEAN_PO_AFTER_BACKUP = False
TRANSLATIONS_QUERYSET_FORCE_FILTERS = []

TRANSLATIONS_HINT_LANGUAGE = 'en'

# e.g. 'occurrences', 'locale_parent_dir', 'domain'
TRANSLATIONS_ADMIN_EXCLUDE_FIELDS = []

TRANSLATIONS_ADMIN_FIELDS = ['original','get_hint','language','translation']

TRANSLATIONS_CUSTOM_FILTERS = (
    (r'^admin-', 'Admin fields'),
    (r'^test-', 'Test fields'),
)

CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': 'localhost:6379',
    },
}

RQ_QUEUES = {
    'default': {
        'HOST': 'localhost',
        'PORT': 6379,
        'DB': 0,
        'PASSWORD': '',
        'DEFAULT_TIMEOUT': 360,
        'USE_REDIS_CACHE': 'default',
    }
}
RQ_EXCEPTION_HANDLERS = ['path.to.my.handler']

# enable export translations from .po files in json obects via django REST Framework
TRANSLATIONS_ENABLE_API_COMMUNICATION = True

# settings below only works if TRANSLATIONS_ENABLE_API_COMMUNICATION is enabled

# absolute path to client api application source codes
# source codes must be on a same filesystem as current app
TRANSLATIONS_API_CLIENT_APP_SRC_PATH = ''

TRANSLATIONS_ENABLE_API_ANGULAR_JS = True

TRANSLATIONS_API_TRANSLATION_STRINGS_REGEX_LIST = [
    r'\{\{\s*\\[\'\"]\s*([a-z0-9\-\_]*)s*\\[\'\"]\s*\|\s*translate\s*\}\}', ]

# Dirs and files ignored for makemessages in client api app.
TRANSLATIONS_API_IGNORED_PATHS = ['front-']

TRANSLATIONS_API_RETURN_ALL = False

TRANSLATIONS_SYNC_REMOTE_URL = 'http://localhost/translations/sync/'
