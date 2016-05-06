""" Views relevant to the user connection """

#-*- coding: utf-8 -*-

from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect

from utcaccounts.settings import UTC_CAS_URL

from .utils import CASTicket, user_creation

def home_redirection():
    """ Redirect the user to the homepage. """
    return redirect('visualizer.views.home')

def dashboard_redirection():
    """ Redirect the user to the dashboard page. """
    return redirect('visualizer.views.home')

def connexion_cas(request):
    """ Connect the user.

    - If there's no ticket, redirects the user to the CAS URL.
    - If there's a ticket, identify the user using the given CAS."""
    if request.user.is_authenticated():
        # If the user is already auth'd, send him to the dashboard view
        return dashboard_redirection()
    # Trying to get a CAS ticket
    ticket = request.GET.get('ticket', '')
    if ticket is None or ticket == '':
        # If there's no CAS ticket, sending the user to the CAS URL for login
        return redirect(UTC_CAS_URL + 'login/?service=' + request.build_absolute_uri())
    else:
        # Getting the user ticket in the URL
        user_ticket = CASTicket(request.build_absolute_uri().split('?')[0], ticket)
        # Getting the user login from the CAS based on the received ticket
        login_given = user_ticket.get_information()[0].lower()
        user = authenticate(username=login_given)
        if user is None:
            user = user_creation(login_given)
        if user.is_active:
            user = authenticate(username=login_given)
            login(request, user)
        else:
            return redirect('visualizer.views.home', {'deactivated': True})
        response = dashboard_redirection()
        return response

def deconnexion(request):
    """ Disconnects the user """
    logout(request)
    return home_redirection()
