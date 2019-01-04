# Generated by Django 2.1.4 on 2019-01-01 12:37

import django.core.validators
import django_countries.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=45)),
                ('middle_name', models.CharField(max_length=45)),
                ('last_name', models.CharField(max_length=45)),
                ('national_id', models.CharField(max_length=14, validators=[django.core.validators.DecimalValidator])),
                ('job_position', models.CharField(max_length=100)),
                ('date_of_birth', models.DateField(null=True)),
                ('place_of_birth', models.CharField(max_length=45, null=True)),
                ('country', django_countries.fields.CountryField(max_length=2)),
                ('nationality', django_countries.fields.CountryField(max_length=2)),
                ('martial_status', models.CharField(max_length=45)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=1)),
                ('main_salary', models.FloatField(default=0)),
            ],
        ),
    ]
