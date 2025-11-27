from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'myself/home.html')

def education(request):
    return render(request, 'myself/education.html')


def skills(request):
    return render(request, 'myself/skills.html')

def projects(request):
    return render(request, 'myself/projects.html')

def contact(request):
    return render(request, 'myself/contact.html')