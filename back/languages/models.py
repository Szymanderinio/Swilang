from django.db import models


from api.abstracts import IsContentTypeModel


class Language(IsContentTypeModel):
    language = models.CharField(max_length=100, unique=True)
    language_short = models.CharField(max_length=2)

    def __str__(self):
        return '{}'.format(self.language)
