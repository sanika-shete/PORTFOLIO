from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

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

@csrf_exempt
def submit_contact(request):
    if request.method == 'POST':
        # Process the form data
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        # Here you would typically save to database or send email
        # For now, we'll just redirect back to contact page
        return render(request, 'myself/contact.html', {'success': True})
    else:
        return render(request, 'myself/contact.html')