from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from main_app.models import (Employee, EmployeeDeduction, EmployeeEarning,
                             EmployeeJops, Taxes)


@admin.register(Employee)
class EmployeeAdmin(ImportExportModelAdmin):
    pass


@admin.register(EmployeeEarning)
class EmployeeEarningAdmin(ImportExportModelAdmin):
    pass


@admin.register(EmployeeDeduction)
class EmployeeDeductionAdmin(ImportExportModelAdmin):
    pass


@admin.register(Taxes)
class TaxesAdmin(ImportExportModelAdmin):
    pass


@admin.register(EmployeeJops)
class EmployeeJopsAdmin(ImportExportModelAdmin):
    pass
