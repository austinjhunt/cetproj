
from django.db import models

# Create your models here.

from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,null=True)
    phone = models.TextField(default='')
    location = models.TextField(default='')
    num_requests = models.IntegerField(default=0)
    rating = models.IntegerField(default=5)
    # if user does not exist, user = null, provide name and number (basic info, owner creates customer at time of job creation)
    name = models.TextField(default='')

class Job(models.Model):
    date_submitted = models.DateField()
    urgency = models.IntegerField(default=1)
    requestor = models.ForeignKey(User,on_delete=models.CASCADE)
    complete = models.BooleanField(default=False)
    description = models.TextField(default='')
    machine = models.TextField(default='')
    charge = models.FloatField(default=0)

class CompleteJob(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    date_completed = models.DateField()


class Manufacturer(models.Model):
    phone_number = models.TextField(default='')
    name = models.TextField(default='')
    location = models.TextField(default='')

class Distributor(models.Model):
    phone_number = models.TextField(default='')
    location = models.TextField(default='')
    open_time = models.TimeField(blank=True,null=True)
    close_time = models.TimeField(blank=True, null=True)
    name = models.TextField(default='')

class Part(models.Model):
    part_number = models.IntegerField(default=0) # determined by manufacturer
    manufacturer = models.ForeignKey(Manufacturer,on_delete=models.CASCADE)
    part_name = models.TextField(default='')

# a part may be sold at multiple distributors for different prices.
class Part_Distributor(models.Model):
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    distributor = models.ForeignKey(Distributor,on_delete=models.CASCADE)
    cost = models.FloatField(default=0)

# job may require many parts
class Part_Job(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    part = models.ForeignKey(Part,on_delete=models.CASCADE)
    still_need_part = models.BooleanField(default=True)

class Invoice(models.Model):
    # id will be the invoice number; unique identifier
    date_of_invoice = models.DateField()
    date_due = models.DateField()
    customer = models.ForeignKey(User,on_delete=models.CASCADE)
    notes = models.TextField(default='')

"""
Line items. The bulk of the body section is made up by line items. Line items name or describe the goods sold or services 
rendered, the cost per unit or hourly rate, the number of units bought or hours billed, and the total due for that 
particular item.  An invoice can contain as many line items as is applicable — individual goods or services don’t 
require separate invoices, as long as they appear on separate lines
"""
class LineItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    description = models.TextField(default='')
    hours = models.FloatField(default=0)
    price_per_hour = models.FloatField(default=20)

class BillableExpense(models.Model): # things ron had to pay for that customer needs to cover
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    description = models.TextField(default='')
    cost = models.FloatField(default=0)