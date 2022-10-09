from django.contrib import admin

from Swilang.models import Translation


class TranslationAdmin(admin.ModelAdmin):
    list_display = ('word', 'translated_word', 'language', 'is_confirmed', 'created_at')

    class Meta:
        model = Translation
        fields = '__all__'


admin.site.register(Translation, TranslationAdmin)