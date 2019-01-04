from app_wall.views import index
from django.urls import path,include
from app_wall.views import export_employee,simple_upload

urlpatterns = [
    path('', index),
    path('export_employee/', export_employee),
    path('import_employee/', simple_upload),

]



