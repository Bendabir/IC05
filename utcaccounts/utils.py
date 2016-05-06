""" Connection functions """

import urllib2
from xml.etree import ElementTree

from django.contrib.auth import get_user_model

from utcaccounts.settings import UTC_CAS_URL


class CASException(Exception):
    """ Exception representing a CAS connection error """
    def __init__(self, message):
        self.message = message
        super(CASException, self).__init__()

    def __str__(self):
        return self.message


def parse_login(xml_info):
    """ Method parsing the server response to get the login """
    service_response_node = ElementTree.fromstring(xml_info)
    authentification_node = service_response_node.getchildren()[0]
    user_node = authentification_node.getchildren()[0]
    return user_node.text


class CASTicket(object):
    """ CAS Ticket object, with methods allowing to get the login """
    def __init__(self, uri, ticket):
        self.uri = uri
        self.ticket = str(ticket)
        if self.ticket is None or self.ticket == '':
            raise CASException('Empty ticket')

    def get_server_information(self):
        """ Getting server information """
        response = urllib2.urlopen(UTC_CAS_URL + 'serviceValidate?service='
                                   + self.uri + '&ticket=' + self.ticket)
        return response.read()

    def get_information(self):
        """ Getting the login based on the object creation """
        xml_info = self.get_server_information()
        return (parse_login(xml_info), None)

def user_creation(login):
    """ Function calling Ginger and generating a user based on its login """
    first_name = login
    last_name = login
    email = login + '@etu.utc.fr'
    user = get_user_model().objects.create(username=login, password=login, email=email,
                                           first_name=first_name, last_name=last_name)
    user.save()
    return get_user_model().objects.get(pk=user.pk)
