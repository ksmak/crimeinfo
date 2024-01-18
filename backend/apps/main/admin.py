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

admin.site.register(Category)
admin.site.register(Region)
admin.site.register(District)
admin.site.register(Item)
admin.site.register(ItemFile)
admin.site.register(Info)
admin.site.register(InfoFile)
admin.site.register(Test)
admin.site.register(UserRole)
