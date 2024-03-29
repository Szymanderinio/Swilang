from django.db import models


class Word(models.Model):
    word = models.CharField(max_length=50, unique=True)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, default=None)

    def __str__(self):
        return self.word
