from django.db import models

from api.helpers import obj_content_type


class IsContentTypeModel(models.Model):
    """
    Mixin for models that are referenced in Generic Relation as ContentType
    object.
    """

    @property
    def content_type(self):
        return obj_content_type(self)

    @property
    def content_type_display(self):
        return f'{str(self.content_type)}: {str(self)}'

    class Meta:
        abstract = True