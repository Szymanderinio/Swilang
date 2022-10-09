from rest_framework.routers import SimpleRouter

from Swilang.views import TranslationViewSet
from words.views import WordViewSet

router = SimpleRouter()

router.register(r'translations', TranslationViewSet, basename='translations')
router.register(r'words', WordViewSet, basename='words')

urlpatterns = router.urls
