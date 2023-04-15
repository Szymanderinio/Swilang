from rest_framework.routers import SimpleRouter

from Swilang.views import TranslationViewSet, ReportViewSet
from words.views import WordViewSet
from languages.views import LanguageViewSet

router = SimpleRouter()

router.register(r'translations', TranslationViewSet, basename='translations')
router.register(r'words', WordViewSet, basename='words')
router.register(r'reports', ReportViewSet, basename='reports')
router.register(r'languages', LanguageViewSet, basename='languages')

urlpatterns = router.urls
