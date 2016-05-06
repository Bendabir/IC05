# coding: utf-8

""" Fonctions relatives à la gestion des UVs """

import json
import requests

from ic05backend.middleware.exceptions import APIRequestFailed

def get_uvweb_information(uvcode):
    """ Obtenir des informations d'UVWeb à partir du code d'une UV """
    uvweb_info = requests.get('https://assos.utc.fr/uvweb/uv/app/details/' + str(uvcode), {})
    """ Comme l'API d'UVWeb est conçue comme une API de sagouins on ne check pass
    le status code, mais le status dans le JSON """
    result = json.loads(uvweb_info.text)
    if result['status'] != 'success' or uvweb_info.status_code != 200:
        raise APIRequestFailed('Impossible to get UVWeb information')
    return result
