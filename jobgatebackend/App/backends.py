from django.contrib.auth.backends import ModelBackend
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from .models import Talent, Recruteur

class MultiUserBackend(ModelBackend):
    def authenticate(self,request,username=None,password=None):
        try:
            user = Talent.objects.get(email=username)
            if check_password(password, user.password):
                return user
        except Talent.DoesNotExist:
            pass
        try:
            user = Recruteur.objects.get(email=username)
            if check_password(password, user.password):
                return user
        except Recruteur.DoesNotExist:
            pass
        return None

    def get_user(self, email):
        try:
            return Talent.objects.get(email=email)
        except Talent.DoesNotExist:
            try:
                return Recruteur.objects.get(email=email)
            except Recruteur.DoesNotExist:
                return None

class MultiUserJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            email = validated_token['email']
            user_type = validated_token.get('user_type')

            if user_type == 'talent':
                return Talent.objects.get(email=email)
            elif user_type == 'recruteur':
                return Recruteur.objects.get(email=email)
            else:
                return None
        except (Talent.DoesNotExist, Recruteur.DoesNotExist, KeyError):
            return None