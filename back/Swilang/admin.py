from django.contrib import admin

from Swilang.models import Translation, Action, Report
from Swilang.forms import TranslationForm


class TranslationAdmin(admin.ModelAdmin):
    list_display = ('word', 'translated_word', 'language', 'auto_translated','is_confirmed', 'created_by', 'created_at')
    form = TranslationForm
    readonly_fields = ('created_by', 'created_at')

    class Meta:
        model = Translation
        fields = '__all__'


class ActionAdmin(admin.ModelAdmin):
    list_display = ('action_type', 'user', 'translation', 'created_at')
    readonly_fields = ('action_type', 'user', 'translation', 'created_at')

    class Meta:
        model = Action
        fields = '__all__'


class ReportAdmin(admin.ModelAdmin):
    list_display = ('translation', 'report_type', 'comment', 'user', 'created_at')
    readonly_fields = ('translation', 'report_type', 'comment', 'user', 'created_at')

    class Meta:
        model = Report
        fields = '__all__'


admin.site.register(Report, ReportAdmin)
admin.site.register(Action, ActionAdmin)
admin.site.register(Translation, TranslationAdmin)