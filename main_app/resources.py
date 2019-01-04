from import_export import resources

from main_app.models import Employee


class EmployeeResource(resources.ModelResource):
    class Meta:
        model = Employee
