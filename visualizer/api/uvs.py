# coding: utf-8

""" Fonctions relatives à la gestion des UVs """

import json
import requests

def get_uvweb_information(uvcode):
    """ Obtenir des informations d'UVWeb à partir du code d'une UV """
    uvweb_info = requests.get('https://assos.utc.fr/uvweb/uv/app/details/' + str(uvcode), {})
    if uvweb_info.status_code != 200:
        raise Exception('Impossible to get UVWeb information')
    return json.loads(uvweb_info.text)
