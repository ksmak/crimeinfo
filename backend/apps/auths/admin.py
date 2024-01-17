from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model


class MyUserAdmin(UserAdmin):
    list_display = (
        'email',
        'name',
        'surname',
        'patronymic',
        'phone',
        'avatar',
        'activation_code',
        'is_active',
        'is_staff',
        'is_superuser',
        'date_of_creation',
        'date_of_change'
    )

    list_filter = (
        'email',
        'name',
        'surname',
        'patronymic',
        'phone',
    )

    fieldsets = (
        (None, {
            'classes': ('wide', ),
            'fields': (
                'email',
                'password',
            )
        }),
        ('Персональные данные', {
            'classes': ('wide', ),
            'fields': (
                'name',
                'surname',
                'patronymic',
                'phone',
                'avatar',
                'activation_code',
            )
        }),
        ('Разрешения', {
            'classes': ('wide', ),
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
            )
        })
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide', ),
            'fields': (
                'email',
                'password1',
                'password2',
            )
        }),
        ('Персональные данные', {
            'classes': ('wide', ),
            'fields': (
                'name',
                'surname',
                'patronymic',
                'phone',
                'avatar',
                'activation_code'
            )
        }),
        ('Разрешения', {
            'classes': ('wide', ),
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
            )
        })
    )

    search_fields = ('email', )

    ordering = ('email', )

    readonly_fields = ('is_superuser', 'activation_code')


admin.site.register(get_user_model(), MyUserAdmin)
