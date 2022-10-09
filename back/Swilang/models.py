from django.db import models
from django.utils import timezone


class Translation(models.Model):
    word = models.ForeignKey('words.Word', on_delete=models.CASCADE, related_name='translations')
    translated_word = models.CharField(max_length=50, unique=True, null=True)
    language = models.ForeignKey('languages.Language', on_delete=models.CASCADE, null=True)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '({}) {} --> {}'.format(self.language.language_short, self.word, self.translated_word)
