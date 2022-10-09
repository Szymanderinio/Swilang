from django.db import models
from django.utils import timezone


class Translation(models.Model):
    word = models.ForeignKey('words.Word', on_delete=models.CASCADE, related_name='translations', null=True, blank=True)
    translated_word = models.CharField(max_length=50, unique=True, null=True, blank=True)
    language = models.ForeignKey('languages.Language', on_delete=models.CASCADE, null=True, blank=True)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '({}) {} --> {}'.format(self.language.language_short, self.word, self.translated_word)
