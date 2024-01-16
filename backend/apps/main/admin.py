from django.contrib import admin

from .models import (
    Category,
    Region,
    District,
    Color,
    Item,
    Info
)

admin.site.register(Category)
admin.site.register(Region)
admin.site.register(District)
admin.site.register(Color)
admin.site.register(Item)
admin.site.register(Info)
