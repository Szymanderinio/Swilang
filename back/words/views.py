
from rest_framework.viewsets import ModelViewSet

from rest_framework.permissions import IsAuthenticated

from .models import Word
from .serializers import WordSerializer


class WordViewSet(ModelViewSet):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = (IsAuthenticated, )

    def get_serializer_context(self):
        context = super(WordViewSet, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        request = serializer.context["request"]
        serializer.save(added_by=request.user)
