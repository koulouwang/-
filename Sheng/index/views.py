import json

from django.core import serializers
from django.shortcuts import render

# Create your views here.
from index.models import *


def index_views(request):
    return  render(request, 'index.html')

def addHero_views(request):
    heros = Heros.objects.all()
    List=[]
    for hero in heros:


        dic={
            'hero':json.dumps(hero.to_dict()),
        }
    pass
def login_views(request):
    return render(request,"login.html")

def register_views(request):
    return render(request,"register.html")
# 人气排行模板
def top10_views(request):
    return render(request,"top10.html")
