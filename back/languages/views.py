
from rest_framework.viewsets import ModelViewSet


from .models import Language
from .serializers import LanguageSerializer


class LanguageViewSet(ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer

    def get_serializer_context(self):
        context = super(LanguageViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(added_by=request.user)
