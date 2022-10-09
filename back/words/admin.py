from django.contrib import admin

from words.models import Word


class WordAdmin(admin.ModelAdmin):
    list_display = ('word', 'is_confirmed', 'created_at')

    class Meta:
        model = Word
        fields = '__all__'


admin.site.register(Word, WordAdmin)