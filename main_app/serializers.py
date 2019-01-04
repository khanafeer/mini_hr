from rest_framework.serializers import ModelSerializer
from main_app.models import Employee,EmployeeEarning,EmployeeDeduction,Taxes,EmployeeJops

class EmployeeSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class EmployeeEarningSerializer(ModelSerializer):
    class Meta:
        model = EmployeeEarning
        fields = '__all__'

class EmployeeDeductionSerializer(ModelSerializer):
    class Meta:
        model = EmployeeDeduction
        fields = '__all__'

class TaxesSerializer(ModelSerializer):
    class Meta:
        model = Taxes
        fields = '__all__'

class EmployeeJopsSerializer(ModelSerializer):
    class Meta:
        model = EmployeeJops
        fields = '__all__'
