from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('main_app.urls')),
    path('',include('app_wall.urls'))

]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

