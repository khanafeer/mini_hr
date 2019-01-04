
from rest_framework import routers
from django.urls import path,include

from main_app.views import EmployeViewset,EmployeeDeductionViewset,EmployeeEarningViewset,TaxesViewset,EmployeeJopsViewset,emp_jobs,emp_salary_slip,send_slip

router = routers.DefaultRouter()
router.register(r'employees', EmployeViewset)
router.register(r'earnings', EmployeeEarningViewset)
router.register(r'deductions', EmployeeDeductionViewset)
router.register(r'taxes', TaxesViewset)
router.register(r'jops', EmployeeJopsViewset)
urlpatterns = [
    path('emp_jobs/<int:emp_id>/', emp_jobs),
    path('emp_totals/<int:emp_id>/<int:month>/',emp_salary_slip),
    path('send_slip_mail/<int:emp_id>/<str:mail>/',send_slip)
]

urlpatterns += router.urls
