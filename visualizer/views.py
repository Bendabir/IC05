""" Liste des vues du visualiseur """

from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    """ Accueil du site """
    return render(request, 'index.html')

def dashboard(request):
    return HttpResponse('<html><body>welcome</body></html>')
