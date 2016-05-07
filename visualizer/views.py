# coding: utf-8

""" Liste des vues du visualiseur """

from datetime import datetime, timedelta

from django.core.exceptions import FieldError, ObjectDoesNotExist, PermissionDenied
from django.shortcuts import render

from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from visualizer.api.uvs import get_uvweb_information
from visualizer.models import UV, UVSuivie

def home(request):
    """ Accueil du site """
    return render(request, 'index.html', {'logged' : request.user.is_authenticated(),
                                          'user': request.user})

@api_view(['GET'])
@renderer_classes((JSONRenderer, ))
def student_info(request):
    """ Vue permettant d'obtenir les infos sur un étudiant connecté à partir de son login """
    if not request.user.is_authenticated():
        raise PermissionDenied('Missing login')
    login = request.user.username
    uvs_etudiant = UVSuivie.objects.filter(etudiant__login=login).prefetch_related()
    return Response([{'uv': uv.uv_suivie.code, 'semestre': uv.semestre_etudiant}
                     for uv in uvs_etudiant])

@api_view(['GET'])
@renderer_classes((JSONRenderer, ))
def uvweb_information(request):
    """ Vue permettant d'obtenir les infos sur une UV depuis UVWweb """
    if not request.GET.get('uv'):
        raise FieldError('Missing UV')
    uvcode = request.GET['uv']
    uv_studied = UV.objects.filter(code=uvcode)
    if not uv_studied.count():
        raise ObjectDoesNotExist('UV pas enregistrée en base')
    if uv_studied.note_last_update < (datetime.now() - timedelta(weeks=4)):
        uv_studied.review_update_procedure()
    return Response({'name': uv_studied.nom, 'note': uv_studied.note})
