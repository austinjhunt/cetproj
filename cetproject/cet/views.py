# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db.models import Q, Count
from django.forms.models import model_to_dict
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext, loader
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from random import *
# Create your views here.

class Break_Nested_Loop(Exception): pass
import datetime
import pytz
from django.core import serializers
from django.contrib.auth import update_session_auth_hash  # for enabling user to stay logged in after PW change
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template import loader
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.utils.timezone import is_aware, is_naive
from django.views.generic import *
from django.contrib import messages
from .models import *
import re  # regex matching
# for generating/downloading grades
import csv
# import all of the JSON serializable classes
# separately define and import helper functions to improve modularity
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .customclasses import *

# DRY Utility Functions
def rp(request, data):
    return request.POST.get(data)
def isauth(request):
    return request.user.is_authenticated

def ajax(request):
    return request.is_ajax()


# for ajax requests, returning JSON to JS
def render_to_json_response(context, **response_kwargs):
    data = json.dumps(context)
    response_kwargs['content_type'] = 'application/json'
    return HttpResponse(data, **response_kwargs)


@csrf_exempt
def index(request):
    context = {}
    if isauth(request):
            template = loader.get_template('cet/index_in.html')
            if request.user.is_superuser: # Ron's account, load owner page.
                jobs = [JobObj(el) for el in Job.objects.all()]
                # return all customers (users that have at least 1 job request)
                customers = [CustomerObj(el) for el in User.objects.filter(id__in=(Job.objects.all().values_list('requestor_id',flat=True)))]
                context = {'jobs': jobs,'customers': customers }
                template = loader.get_template('cet/owner.html')
    else:
            template = loader.get_template('cet/index_out.html')
    return HttpResponse(template.render(context,request))

@csrf_exempt
def sign_up(request):
    if request.method == "POST":
        email = rp(request,'email')
        u = User.objects.create_user(email=email,username=email,last_name=rp(request,'last_name'),first_name=rp(request,'first_name'),
                 password=rp(request,'password'))
        UserProfile(phone=rp(request,'phone'),user_id=u.id).save()
        login(request,user=u)
        return HttpResponseRedirect('/')

    template = loader.get_template('cet/sign_up.html')
    context = {}
    return HttpResponse(template.render(context,request))

@csrf_exempt
def sign_in(request):
    template = loader.get_template('cet/sign_in.html')
    context = {}
    if request.user.is_authenticated:
        return HttpResponseRedirect('/')

    if request.method == "POST":
        print("Signing in...")
        email = rp(request,'email')
        password = rp(request,'password')
        print(email,password)
        user = authenticate(request, username=email, password=password)
        print(user)
        if user is not None:
            login(request, user)
            request.session['user_id'] = str(user.id)
            request.session['user_email'] = user.username
            request.session['full_name'] = user.first_name + ' ' + user.last_name
            return HttpResponseRedirect('/')
        # failed login, stay on page.
        context = {'fail': True}
        return HttpResponse(template.render(context,request))
    return HttpResponse(template.render(context,request))

@csrf_exempt
def log_out(request):
    logout(request)
    return HttpResponseRedirect('/sign_in/')

@csrf_exempt
def requestService(request):
    template = loader.get_template('cet/requestService.html')
    context = {}
    return HttpResponse(template.render(context,request))
@csrf_exempt
def get_distributors(request):
    if request.is_ajax():
        return render_to_json_response({'distributors': [DistributorObj(el).toJSON() for el in Distributor.objects.all()]})

@csrf_exempt
def get_manufacturers(request):
    if request.is_ajax():
        return render_to_json_response({'manufacturers': [ManufacturerObj(el).toJSON() for el in Manufacturer.objects.all()]})

@csrf_exempt
def get_jobs(request):
    if request.is_ajax():
        return render_to_json_response({'jobs': [JobObj(el).toJSON() for el in Job.objects.all()]})


@csrf_exempt
def get_customers(request):
    if request.is_ajax():
        return render_to_json_response({'customers': [CustomerObj(el).toJSON() for el in User.objects.all().exclude(id=1)]})

@csrf_exempt
def addNewPart(request):
    if request.is_ajax():
        name = rp(request,'name')
        num = rp(request,'num')
        man_id = rp(request,'man')
        dist_id = rp(request,'dist')
        cost = rp(request,'cost')
        job_id = rp(request,'job')
        still_need_part = True if rp(request,'still_need_part') == 'true' else False
        newPart = Part(part_number=num, manufacturer_id=man_id, part_name=name)
        newPart.save()

        Part_Distributor(part_id=newPart.id,distributor_id=dist_id,cost=cost).save()
        Part_Job(part_id=newPart.id,job_id=job_id,still_need_part=still_need_part).save()

        return HttpResponseRedirect('/#parts')
def superajax(request):
    return request.user.is_authenticated and request.user.is_superuser and request.is_ajax()
@csrf_exempt
def addNewInvoice(request):
    if superajax(request):
        customer = rp(request, 'customer')
        date_of_invoice = rp(request,'date_of_invoice')
        date_due = rp(request,'date_due')
        notes = rp(request,'notes')
        Invoice(customer_id=customer, date_of_invoice=date_of_invoice, date_due=date_due, notes=notes).save()
        return render_to_json_response({})
@csrf_exempt
def delete_invoice(request):
    if superajax(request):
        invoiceid = rp(request,'id')
        Invoice.objects.get(id=invoiceid).delete()
        return render_to_json_response({})
@csrf_exempt
def get_invoice_info(request):
    id=rp(request,'id')
    invoice = InvoiceObj(Invoice.objects.get(id=id)).toJSON()
    customers = [CustomerObj(e).toJSON() for e in User.objects.all().exclude(id=1)]
    data = {'invoice': invoice, 'customers': customers }
    return render_to_json_response(data)
@csrf_exempt
def addNewJob(request):
    if request.is_ajax():
        pass

@csrf_exempt
def invoice(request):
    if request.user.is_authenticated and request.user.is_superuser:
        #Invoice.objects.all().delete()
        #LineItem.objects.all().delete()
        #BillableExpense.objects.all().delete()
        #new = Invoice(date_of_invoice=datetime.datetime.now().date(),date_due=datetime.datetime.now().date(),customer_id=2,notes='This is a note')
        #new.save()
        #for i in range(4):
        #   LineItem(invoice_id=new.id,description='random description ' + str(i*3), hours=i, price_per_hour=23).save()

        #BillableExpense(cost=10, invoice_id=new.id,description='spark plug').save()
       # BillableExpense(cost=20, invoice_id=new.id, description='gas for mower pick up and delivery').save()


        template = loader.get_template('cet/invoice.html')
        invoices = [InvoiceObj(el) for el in Invoice.objects.all()]
        context = {'invoices': invoices}
        return HttpResponse(template.render(context,request))
    else:
        return HttpResponseRedirect('/')


