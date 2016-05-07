# coding: utf-8

""" Modèles disponibles """

from datetime import datetime

from django.db import models

from ic05backend.middleware.exceptions import APIRequestFailed

from visualizer.api import uvs as api_uvs

class Etudiant(models.Model):
    """ Student in database """
    login = models.CharField(max_length=8, primary_key=True, db_column="loginEtudiant")

    def __str__(self):
        """ Printing student for visualization """
        return self.login

    class Meta(object):
        """ Modélisation en DB """
        db_table = "Etudiant"


class UV(models.Model):
    """ Class in database """
    UV_TYPE_TSH = "TSH"
    UV_TYPE_CS = "CS"
    UV_TYPE_TM = "TM"
    UV_TYPE_CHOICES = (
        (UV_TYPE_TSH, "Technologie et sciences de l'homme"),
        (UV_TYPE_CS, "Connaissances scientifiques"),
        (UV_TYPE_TM, "Techniques et Méthodes"),
    )
    code = models.CharField(max_length=5, primary_key=True, db_column="codeUV")
    categorie = models.CharField(max_length=3, null=True, db_column="categorieUV")
    nom = models.CharField(max_length=256, db_column="nomUV")
    credits = models.IntegerField(db_column="nbCreditsUV")
    note = models.FloatField(null=True)
    note_last_update = models.DateTimeField(null=True)

    def __str__(self):
        """ Printing UV for visualization """
        return self.code + "' (" + self.nom + ")"

    def reviews(self):
        """ Obtenir les avis sur l'UV voulue """
        return api_uvs.get_uvweb_information(self.code)

    def review_update_procedure(self):
        """ Mettre à jour la note en local """
        try:
            info = self.reviews()
            self.note = info['details']['averageRate']
            self.note_last_update = datetime.now()
            self.save()
        except APIRequestFailed:
            pass

    class Meta(object):
        """ Modélisation en DB """
        db_table = "UV"


class UVSuivie(models.Model):
    """ Class that a student has followed, with the student that followed
        it, and the time it was studied at """
    etudiant = models.ForeignKey(Etudiant, db_column="loginEtudiant")
    uv_suivie = models.ForeignKey(UV, db_column="codeUV")
    semestre = models.CharField(max_length=5, db_column="codeSemestre")
    semestre_etudiant = models.CharField(max_length=5, db_column="GX")

    class Meta(object):
        """ Modélisation en DB """
        db_table = "Cursus"
