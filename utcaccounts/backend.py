""" Backend allowing users to login using only their login """

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User


class PayUTCAuthBackend(ModelBackend):
    """Login to Django using just the user login
    """
    def authenticate(self, username=None, password=None):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
