from rest_framework.routers import SimpleRouter

from Swilang.views import TranslationViewSet, ReportViewSet
from words.views import WordViewSet

router = SimpleRouter()

router.register(r'translations', TranslationViewSet, basename='translations')
router.register(r'words', WordViewSet, basename='words')
router.register(r'reports', ReportViewSet, basename='reports')

urlpatterns = router.urls
