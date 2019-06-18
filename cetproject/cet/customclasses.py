from .models import *
class JobObj:
    def __init__(self,Job):
        self.customer = Job.requestor.first_name + ' ' + Job.requestor.last_name
        self.description = Job.description
        self.completed = Job.complete
        self.parts_needed = Part.objects.filter(id__in=(Part_Job.objects.filter(job_id=Job.id,still_need_part=True).values_list('part_id',flat=True)))
        self.parts_bought = Part.objects.filter(id__in=(Part_Job.objects.filter(job_id=Job.id,still_need_part=False).values_list('part_id',flat=True)))
        self.machine = Job.machine
        self.urgency = Job.urgency
        self.date_requested = Job.date_submitted

class CustomerObj:
    def __init__(self, User):
        self.name = User.first_name + ' ' + User.last_name
        self.num_total_jobs = len(list(Job.objects.filter(requestor_id=User.id)))
        self.phone = UserProfile.objects.get(user_id=User.id).phone
        self.num_active_jobs = len(list(Job.objects.filter(requestor_id=User.id,complete=False)))

