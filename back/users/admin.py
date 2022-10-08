from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from users.models import User
from users.forms import UserCreationForm, UserChangeForm


# Register your models here.
class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    list_display = ('email', 'is_staff', 'last_login')
    list_filter = ('is_staff', 'is_superuser')

    fieldsets = (
        (None, {'fields': ('email', 'password', 'is_active', 'date_joined')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'date_of_birth',)}),
        ('Permissions', {'fields': ('is_superuser', 'is_staff', )}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2',)
        }),
    )
    ordering = ('email',)


admin.site.register(User, UserAdmin)