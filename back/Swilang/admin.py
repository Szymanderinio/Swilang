from django.contrib import admin

from Swilang.models import Translation, Action
from Swilang.forms import TranslationForm


class TranslationAdmin(admin.ModelAdmin):
    list_display = ('word', 'translated_word', 'language', 'is_confirmed', 'created_at')
    form = TranslationForm

    class Meta:
        model = Translation
        fields = '__all__'


class ActionAdmin(admin.ModelAdmin):
    list_display = ('action_type', 'user', 'translation', 'created_at')
    readonly_fields = ('action_type', 'user', 'translation', 'created_at')

    class Meta:
        model = Action
        fields = '__all__'


admin.site.register(Action, ActionAdmin)
admin.site.register(Translation, TranslationAdmin)