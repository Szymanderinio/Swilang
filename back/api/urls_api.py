from rest_framework.routers import SimpleRouter

from Swilang.views import TranslationViewSet

router = SimpleRouter()

router.register(r'translations', TranslationViewSet, basename='translations')

urlpatterns = router.urls
