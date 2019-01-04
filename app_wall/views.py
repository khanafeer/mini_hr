from django.http import HttpResponse
from django.shortcuts import redirect, render
from tablib import Dataset

from app_wall.forms import EmployeeForm, TaxesForm
from main_app.resources import EmployeeResource


def index(request):
    return render(request, 'app_wall/index.html', {'form': EmployeeForm, 'tax_form': TaxesForm})


def export_employee(request):
    res = EmployeeResource()
    dataset = res.export()
    response = HttpResponse(dataset.json, content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="employees.json"'
    print(response)
    return response


def simple_upload(request):
    if request.method == 'POST':
        resource = EmployeeResource()
        dataset = Dataset()
        new_employees = request.FILES['myfile']

        imported_data = dataset.load(new_employees.read())
        result = resource.import_data(dataset, dry_run=True)  # Test the data import

        if not result.has_errors():
            resource.import_data(dataset, dry_run=False)  # Actually import now

    return redirect('/')
