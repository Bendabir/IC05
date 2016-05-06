from django.conf.urls import url

import views

urlpatterns = [
    url(r'^connexion$', views.connexion_cas),
    url(r'^deconnexion$', views.deconnexion),
]
