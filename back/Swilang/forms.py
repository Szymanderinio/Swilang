from django import forms

from words.models import Word
from .models import Translation


class TranslationForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['word'].queryset = Word.objects.filter(translations__isnull=True)

    class Meta:
        model = Translation
        fields = '__all__'
