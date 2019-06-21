
from django.db import models

# Create your models here.

from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    phone = models.TextField(default='')
    location = models.TextField(default='')
    num_requests = models.IntegerField(default=0)
    rating = models.IntegerField(default=5)

class Job(models.Model):
    date_submitted = models.DateField()
    urgency = models.IntegerField(default=1)
    requestor = models.ForeignKey(User,on_delete=models.CASCADE)
    complete = models.BooleanField(default=False)
    description = models.TextField(default='')
    machine = models.TextField(default='')

class CompleteJob(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    date_completed = models.DateField()


class Manufacturer(models.Model):
    primary_contact = models.TextField(default='')
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