import json

from django.core.mail import EmailMessage
from django.template import Context, Template
from easy_pdf.rendering import render_to_pdf
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from main_app.models import (Employee, EmployeeDeduction, EmployeeEarning,
                             EmployeeJops, Taxes)
from main_app.serializers import (EmployeeDeductionSerializer,
                                  EmployeeEarningSerializer,
                                  EmployeeJopsSerializer, EmployeeSerializer,
                                  TaxesSerializer)


class EmployeViewset(ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class EmployeeEarningViewset(ModelViewSet):
    queryset = EmployeeEarning.objects.all()
    serializer_class = EmployeeEarningSerializer

class EmployeeDeductionViewset(ModelViewSet):
    queryset = EmployeeDeduction.objects.all()
    serializer_class = EmployeeDeductionSerializer

class TaxesViewset(ModelViewSet):
    queryset = Taxes.objects.all()
    serializer_class = TaxesSerializer

class EmployeeJopsViewset(ModelViewSet):
    queryset = EmployeeJops.objects.all()
    serializer_class = EmployeeJopsSerializer

@api_view(['GET'])
def emp_jobs(request,emp_id):
    try:
        emp = Employee.objects.get(pk=emp_id)
    except:
        return Response(status.HTTP_400_BAD_REQUEST)
    try:
        q = EmployeeJops.objects.filter(employee=emp)
        print(q)
        ser = EmployeeJopsSerializer(q,many=True)
        return Response(ser.data,status.HTTP_200_OK)

    except Exception as ex:
        print(ex)
    return Response(status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def emp_salary_slip(request,emp_id,month):
    try:
        emp = Employee.objects.get(pk=emp_id)
        main_salary = emp.main_salary
        total_salary = emp.get_tottal_salary(month)
        net_salary = emp.get_net_salary(month)
        total_earnings, total_deductions = emp.get_tottals(month)

        try:
            s1 = EmployeeEarning.objects.filter(date__month=month,employee=emp)
            print(s1)
            s = EmployeeEarningSerializer(s1,many=True)
            earnings = s.data
        except Exception as ex:
            print("sss",ex)
            earnings = []

        try:
            d1 = EmployeeDeduction.objects.filter(date__month=month,employee=emp)
            print(d1)
            d = EmployeeDeductionSerializer(d1,many=True)
            deductions = d.data
        except Exception as ex:
            print("ddd",ex)
            deductions = []

        data = {'main_salary':main_salary,'total_salary':total_salary,'net_salary':net_salary,'total_earnings':total_earnings,'total_deductions':total_deductions,'earnings':earnings,'deductions':deductions}
        return Response(json.dumps(data),status.HTTP_200_OK)
    except Exception as ex:
        print(ex)
        return Response(status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def send_slip(request,emp_id,mail,month=1):
        emp = Employee.objects.get(pk=emp_id)
        main_salary = emp.main_salary
        total_salary = emp.get_tottal_salary(month)
        net_salary = emp.get_net_salary(month)
        total_earnings, total_deductions = emp.get_tottals(month)

        try:
            s1 = EmployeeEarning.objects.filter(date__month=month,employee=emp)
            print(s1)
            s = EmployeeEarningSerializer(s1,many=True)
            earnings = s.data
        except Exception as ex:
            print("sss",ex)
            earnings = []

        try:
            d1 = EmployeeDeduction.objects.filter(date__month=month,employee=emp)
            print(d1)
            d = EmployeeDeductionSerializer(d1,many=True)
            deductions = d.data
        except Exception as ex:
            print("ddd",ex)
            deductions = []

        data = {'main_salary':main_salary,'total_salary':total_salary,'net_salary':net_salary,'total_earnings':total_earnings,'total_deductions':total_deductions,'earnings':earnings,'deductions':deductions}
        post_pdf = render_to_pdf('app_wall/slip.html',data)
        print(mail)
        msg = EmailMessage("Employee Slip", "this slip for {}".format(emp.get_full_name()), to=[mail])
        msg.attach('file.pdf', post_pdf, 'application/pdf')
        msg.content_subtype = "html"
        msg.send()
        return Response(status.HTTP_200_OK)
