from django.contrib import admin

# Register your models here.
from index.models import *

admin.site.register(Heros)
admin.site.register(Type)