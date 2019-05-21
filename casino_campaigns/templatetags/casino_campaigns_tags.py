from cms.models import Page
from django import template
from django.core.files.storage import default_storage
from django.db.models.functions import Lower

from ..models import *
from ..views import *
from django.utils.html import strip_tags

register = template.Library()


class GetPageParentNode(template.Node):
    def __init__(self, page_var_name, page_depth, variable_name):
        self.page_var = template.Variable(page_var_name)
        self.page_depth = page_depth
        self.variable_name = variable_name

    def render(self, context):
        try:
            page = self.page_var.resolve(context)
        except template.VariableDoesNotExist:
            return ''

        if page.depth < self.page_depth:
            return None

        try:
            parent = Page.objects.get(path=page.path[0:page.steplen * (self.page_depth + 1)])
        except Page.DoesNotExist:
            parent = None

        context[self.variable_name] = parent

        return ''


@register.tag(name='get_page_parent')
def do_get_page_parent(parser, token):
    bits = token.split_contents()[1:]

    if len(bits) != 4:
        raise ValueError('Invalid number of arguments')

    if bits[2] != 'as':
        raise ValueError('Missing argument `as`')

    variable_name = bits[3]
    page_var_name = bits[0]
    page_depth = int(bits[1])

    return GetPageParentNode(page_var_name, page_depth, variable_name)

@register.filter(name='file_exists')
def file_exists(filepath):
    if not default_storage.exists(filepath):
        index = filepath.rfind('/')
        new_filepath = filepath[:index] + '/image.png'
        return new_filepath
    else:
        return filepath



@register.assignment_tag
def show_results(limit=False, randomize=True, slider=1,  category=''):
    qs = Campaign.objects.all()

    if randomize:
        qs = qs.order_by(Lower('created').desc())

    if limit:
        qs = qs[0:limit]

    if  category:
        qs = Campaign.objects.filter(category__exact=category)

    return qs

@register.assignment_tag
def show_results_lang(limit=False, language_code='en'):
    qa = Campaign.objects.language(language_code).filter(language_code__exact=language_code)
    if limit:
        qa = qa[0:limit]

    return qa

@register.assignment_tag
def show_slide():
    qs = Campaign.objects.filter(show_slide__exact=True)
    return qs

@register.assignment_tag
def show_bottom_banners():
    qs = Campaign.objects.filter(show_bottom_banners=True)
    return qs

# @register.filter()
# def remove_html_tag(html):
#     stripped = removetags(html, 'strong p h1 h2 h3 h4 h5 h6 span div')
#     return stripped # will produce: paragraph