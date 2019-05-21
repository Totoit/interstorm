from django.contrib import admin
from django import forms
from treasure_chest.models import TreasureChestReward,Treasure_Game,Treasure_Game_Log,Treasure_Roll_Bonus_Setting,Treasure_Every_Deposit_Setting
admin.site.disable_action('delete_selected')
@admin.register(TreasureChestReward)
class TreasureChestReward(admin.ModelAdmin):
    fields = ('reward_no','name','icon','description','rule_type','bonus_code','created_date')
    list_display = ('reward_no','name','description', 'rule_type')
    ordering = ('reward_no',)

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_readonly_fields(self, request, obj=None):
        return ['reward_no']

# admin.site.register(Treasure_Game)
# admin.site.register(Treasure_Game_Log)
# admin.site.register(Treasure_Roll_Bonus_Setting)
@admin.register(Treasure_Roll_Bonus_Setting)
class Treasure_Roll_Bonus_Setting(admin.ModelAdmin):
    # fields = ('reward_no','name','icon','description','rule_type','bonus_code','created_date')
    list_display = ('total','roll','check_first')
    ordering = ('total',)

# admin.site.register(Treasure_Every_Deposit_Setting)
@admin.register(Treasure_Every_Deposit_Setting)
class Treasure_Every_Deposit_Setting(admin.ModelAdmin):
    # fields = ('reward_no','name','icon','description','rule_type','bonus_code','created_date')
    list_display = ('more_than_total','roll')
    # ordering = ('total',)

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
