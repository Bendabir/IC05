# coding: utf-8

""" Middlewares de l'ic05 backend """

from django.http import HttpResponse

from ic05backend.middleware.exceptions import APIRequestFailed

class CustomExceptionHandling(object):
    """ Middleware ayant pour but de gérer les exceptions custom
    Par défaut, toutes les erreurs doivent être renvoyées avec un
    Content-Type en application/json, et avec le code HTTP adéquat"""
    def process_exception(self, request, exception):
        """ Fonction de gestion des exceptions dans le middleware """
        response = HttpResponse()
        response['Content-Type'] = 'application/json'
        if isinstance(exception, APIRequestFailed):
            response.write("""Connection to external API has failed,
            preventing the resource from loading.""")
            response.status_code = 504
            return response
