from django.db import models
from django.utils import timezone


class Translation(models.Model):
    word = models.ForeignKey('words.Word', on_delete=models.CASCADE, related_name='translations', null=True, blank=True)
    translated_word = models.CharField(max_length=50, unique=True, null=True, blank=True)
    language = models.ForeignKey('languages.Language', on_delete=models.CASCADE, null=True, blank=True)
    is_confirmed = models.BooleanField(default=False)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '({}) {} --> {}'.format(self.language.language_short, self.word, self.translated_word)


class Action(models.Model):
    SWIPE_LEFT = 0
    SWIPE_RIGHT = 1
    REPORT = 2

    ACTION_TYPE = (
        (SWIPE_LEFT, 'Swipe Left'),
        (SWIPE_RIGHT, 'Swipe Right'),
        (REPORT, 'Report')
    )

    action_type = models.IntegerField(choices=ACTION_TYPE)
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True)
    translation = models.ForeignKey('Swilang.Translation', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


