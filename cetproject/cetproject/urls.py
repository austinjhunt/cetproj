"""cetproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import url, include
from cet import views
urlpatterns = [
    url(r'^$',views.index),
    url(r'^sign_up/$',views.sign_up),
    url(r'^sign_in/$',views.sign_in),
    url(r'^logout/$', views.log_out),
    url(r'^requestService/$',views.requestService),
    url(r'^getdistributors/', views.get_distributors),
    url(r'^getmanufacturers/',views.get_manufacturers),
    url(r'^getcustomers/', views.get_customers),
    url(r'^getjobs/',views.get_jobs),
    url(r'^addNewInvoice/',views.addNewInvoice),
    url(r'^deleteInvoice/', views.delete_invoice),
    url(r'^getInvoiceInfo/', views.get_invoice_info),
    url(r'^addNewPart/',views.addNewPart),
    url(r'^addNewJob/',views.addNewJob),
    url(r'^invoice/', views.invoice),
    url('admin/', admin.site.urls),
]
