import django_filters

from .models import Translation


class BaseTranslationFilter(django_filters.FilterSet):
    lng = django_filters.CharFilter(field_name='language__language_short', lookup_expr='icontains')

    class Meta:
        model = Translation
        fields = ['language']
