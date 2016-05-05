# coding: utf-8

""" Liste des vues du visualiseur """

from django.core.exceptions import FieldError
from django.shortcuts import render

from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from visualizer.api.uvs import get_uvweb_information
from visualizer.models import UVSuivie

def home(request):
    """ Accueil du site """
    return render(request, 'index.html')

@api_view(['GET'])
@renderer_classes((JSONRenderer, ))
def student_info(request):
    """ Vue permettant d'obtenir les infos sur un étudiant à partir de son login """
    if not request.GET.get('login'):
        raise FieldError('Missing login')
    login = request.GET['login']
    uvs_etudiant = UVSuivie.objects.filter(etudiant__login=login).prefetch_related()
    return Response([{'uv': uv.uv_suivie.code, 'semestre': uv.semestre_etudiant} for uv in uvs_etudiant])

@api_view(['GET'])
@renderer_classes((JSONRenderer, ))
def uvweb_information(request):
    """ Vue permettant d'obtenir les infos sur une UV depuis UVWweb """
    if not request.GET.get('uv'):
        raise FieldError('Missing UV')
    return Response(get_uvweb_information(request.GET['uv']))
