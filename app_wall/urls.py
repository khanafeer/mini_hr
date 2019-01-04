from django.urls import path

from app_wall.views import export_employee, index, simple_upload

urlpatterns = [
    path('', index),
    path('export_employee/', export_employee),
    path('import_employee/', simple_upload),

]
