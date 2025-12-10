from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('education', views.education, name='education'),
    path('skills', views.skills, name='skills'),
    path('projects', views.projects, name='projects'),
    path('contact', views.contact, name='contact'),
    path('submit_contact/', views.submit_contact, name='submit_contact'),
]