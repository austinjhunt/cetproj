from .models import *
import datetime,json
# use this json serialization function particularly for objects with dates as fields
def json_default(value):
    if isinstance(value, datetime.datetime):
        return dict(year=value.year, month=value.month, day=value.day, hour=value.hour,min=value.minute,sec=value.second)

    elif isinstance(value, datetime.date):
        return dict(year=value.year,month=value.month,day=value.day)

    elif isinstance(value,datetime.time):
        value = value.strftime("%I:%M")
        value = datetime.datetime.strptime(value, "%H:%M")
        return dict(hour=value.hour,min=value.minute)

    else:
        return value.__dict__


class JobObj:
    def __init__(self,Job):
        self.id = Job.id
        self.customer = Job.requestor.first_name + ' ' + Job.requestor.last_name
        self.description = Job.description
        self.completed = Job.complete
        self.parts_needed = Part.objects.filter(id__in=(Part_Job.objects.filter(job_id=Job.id,still_need_part=True).values_list('part_id',flat=True)))
        self.parts_bought = Part.objects.filter(id__in=(Part_Job.objects.filter(job_id=Job.id,still_need_part=False).values_list('part_id',flat=True)))
        self.machine = Job.machine
        self.urgency = Job.urgency
        self.date_requested = Job.date_submitted
    def toJSON(self):
        return json.dumps(self, default=lambda o: json_default(o), sort_keys=True, indent=4)

class CustomerObj:
    def __init__(self, User):
        self.id = User.id
        self.name = User.first_name + ' ' + User.last_name
        self.num_total_jobs = len(list(Job.objects.filter(requestor_id=User.id)))
        self.phone = UserProfile.objects.get(user_id=User.id).phone
        self.num_active_jobs = len(list(Job.objects.filter(requestor_id=User.id,complete=False)))

    def toJSON(self):
        return json.dumps(self, default=lambda o: json_default(o), sort_keys=True, indent=4)

class DistributorObj:
    def __init__(self, D):
        self.id = D.id
        self.name = D.name
        self.phone = D.phone_number
        self.location = D.location
        self.open_time = D.open_time
        self.close_time = D.close_time

    def toJSON(self):
        return json.dumps(self, default=lambda o: json_default(o), sort_keys=True, indent=4)

