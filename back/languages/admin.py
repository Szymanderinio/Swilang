from django.contrib import admin

from languages.models import Language


class LanguageAdmin(admin.ModelAdmin):
    list_display = ('language_short', 'language')
    list_display_links = ('language_short', 'language')

    class Meta:
        model = Language
        fields = '__all__'


admin.site.register(Language, LanguageAdmin)

