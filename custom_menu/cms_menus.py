from menus.menu_pool import menu_pool
from django.utils.translation import ugettext_lazy as _
from django.utils import translation
from django.core.urlresolvers import reverse
from django.db.models.signals import post_save, post_delete
from cms.menu_bases import CMSAttachMenu
from menus.base import Menu, NavigationNode
from menus.base import Modifier
from cms.models.pagemodel import Page
from cms.models import Title
# custom menu
class CustomMenu(Modifier):
    def modify(self, request, nodes, namespace, root_id, post_cut, breadcrumb):
        for poll in Page.objects.all():
            for node in nodes:
                if poll.id == node.id:
                    node.extra = poll
                    node.slug = Title.objects.get(page_id = poll.id ,language=translation.get_language()).slug
        return nodes
menu_pool.register_modifier(CustomMenu)
