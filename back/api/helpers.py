from django.contrib.contenttypes.models import ContentType


def obj_content_type(obj):
    """Gets content type for given object."""
    return ContentType.objects.get_for_model(obj._meta.model)