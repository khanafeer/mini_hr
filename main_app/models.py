from django.db import models
from django.db.models import Sum

from django_countries.fields import CountryField
from datetime import date

class Employee(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    first_name = models.CharField(max_length=45)
    middle_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    national_id = models.CharField(max_length=14)
    job_position = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True)
    place_of_birth = models.CharField(max_length=45,null=True)
    country = CountryField()
    nationality = CountryField()
    martial_status = models.CharField(max_length=45)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    main_salary = models.FloatField(default=0)

    def get_full_name(self):
        return " ".join([self.first_name,self.middle_name,self.last_name])

    def get_age(self):
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))

    def __str__(self):
        return str(self.get_full_name())

    def get_tax_rate(self):
        tax_value = 0
        try:
            tax_object = Taxes.objects.get(range_end__gte=self.main_salary,range_start__lt=self.main_salary)
            if tax_object:
                tax_value = tax_object.value
                return tax_value
        except Taxes.DoesNotExist:
            pass
        return tax_value

    def get_tottals(self,month):
        try:
            total_earnings = EmployeeEarning.objects.filter(date__month=month,employee=self).aggregate(Sum('amount')).get('amount__sum')
        except:
            total_earnings = 0

        try:
            total_deductions = EmployeeDeduction.objects.filter(date__month=month,employee=self).aggregate(Sum('amount')).get('amount__sum')
        except:
            total_deductions = 0

        return total_earnings,total_deductions
    def get_tottal_salary(self,month):
        total_earnings,total_deductions = self.get_tottals(month)
        return self.main_salary + (total_earnings - total_deductions)

    def get_taxable_salary(self,month):
        total = self.get_tottal_salary(month)
        tax = self.get_tax_rate()
        return total - (total * tax)

    def get_net_salary(self,month):
        return self.get_tottal_salary(month) - self.get_taxable_salary(month)


class EmployeeEarning(models.Model):
    employee = models.ForeignKey(Employee,on_delete=models.CASCADE)
    amount = models.FloatField(default=0)
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.employee.first_name + " " + str(self.amount)

class EmployeeDeduction(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    amount = models.FloatField(default=0)
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.employee.first_name + " " + str(self.amount)

class Taxes(models.Model):
    value = models.FloatField(max_length=100,default=0)
    range_start = models.FloatField(default=0)
    range_end = models.FloatField(default=0)

    def __str__(self):
        return str(self.value) + "% range {} to {}".format(self.range_start,self.range_end)


class EmployeeJops(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} {}.".format(self.employee.first_name,self.description[:15])

