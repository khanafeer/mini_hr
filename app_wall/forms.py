from django.forms import ModelForm
from main_app.models import Employee,Taxes

class EmployeeForm(ModelForm):
    class Meta:
        model = Employee
        fields = '__all__'

class TaxesForm(ModelForm):
    class Meta:
        model = Taxes
        fields = '__all__'
