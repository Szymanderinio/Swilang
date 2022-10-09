from django import forms

from words.models import Word
from .models import Translation


class TranslationForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        qs = Word.objects.filter(is_confirmed=True)
        self.fields['word'].queryset = qs

    class Meta:
        model = Translation
        fields = '__all__'
