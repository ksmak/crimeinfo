from django.contrib import admin

from .models import (
    Category,
    Region,
    District,
    Item,
    ItemFile,
    Info,
    InfoFile,
    Test,
    UserRole
)


class ItemAdmin(admin.ModelAdmin):
    """
    Item admin model
    """
    readonly_fields = ('create_user', 'change_user',
                       'date_of_creation', 'date_of_change')


class InfoAdmin(admin.ModelAdmin):
    """
    Info admin model
    """
    readonly_fields = ('create_user', 'change_user',
                       'date_of_creation', 'date_of_change')


class TestAdmin(admin.ModelAdmin):
    """
    Test admin model
    """
    readonly_fields = ('create_user', 'change_user',
                       'date_of_creation', 'date_of_change')


admin.site.register(Category)
admin.site.register(Region)
admin.site.register(District)
admin.site.register(Item, ItemAdmin)
admin.site.register(ItemFile)
admin.site.register(Info, InfoAdmin)
admin.site.register(InfoFile)
admin.site.register(Test, TestAdmin)
admin.site.register(UserRole)
