# # from email.message import EmailMessage
# # from django.shortcuts import render
# # from rest_framework_simplejwt.views import TokenObtainPairView
# # from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# # from django.contrib.auth import authenticate
# # from django.core.mail import BadHeaderError, send_mail
# # from App.backends import MultiUserJWTAuthentication,MultiUserBackend
# # from django.db.models import Q
# # from django.contrib.auth import get_user_model

# # import random
# # import string
# # from django.conf import settings
# # from rest_framework_simplejwt.tokens import RefreshToken
# # from rest_framework import serializers,status
# # from rest_framework.views import APIView
# # from rest_framework.decorators import api_view,permission_classes
# # from django.contrib.auth.hashers import make_password
# # from django.http import JsonResponse
# # from .models import Talent,Recruteur,Candidature_forum
# # from django.forms.models import model_to_dict

# # import qrcode
# # from io import BytesIO
# # from django.core.files.base import ContentFile
# # from rest_framework.response import Response
# # from rest_framework import status
# # from .models import Forum, Feedback_candidat,Archive_Candidat, Archive_forum
# # from .serializers import FeedbackSerializer, ForumSerializer,CandidatureforumSerializer
# # from django.core import serializers
# # from rest_framework.permissions import IsAuthenticated
# # from django.contrib.auth import authenticate
# # from rest_framework.views import APIView
# # from rest_framework.response import Response
# # from rest_framework import status
# # from .models import Talent, Recruteur
# # from rest_framework.permissions import AllowAny
# # from django.db.models import Case, When, Value, IntegerField


# # @api_view(['POST'])
# # def signup(request):
# #     first_name = request.POST.get("first_name")
# #     last_name = request.POST.get("last_name")
# #     email = request.POST.get("email")
# #     numero_telephone = request.POST.get("numero_telephone")
# #     password = request.POST.get("password")
# #     cv = request.FILES.get("cv")
# #     if cv is None:
# #         recruteur = Recruteur(
# #             first_name=request.data.get('first_name'),
# #             last_name=request.data.get('last_name'),
# #             email=request.data.get('email'),
# #             entreprise=request.data.get('Entreprise'),
# #             numero_telephone = request.data.get("numero_telephone"),
# #             image = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
# #             password=make_password(request.data.get('password')),
# #         )
# #         recruteur.save()
# #         return JsonResponse({"message": "Recruteur créé avec succès"})
# #     else:
# #         talent = Talent(
# #             first_name=first_name,
# #             last_name=last_name,
# #             email=email,
# #             image = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
# #             numero_telephone=numero_telephone,
# #             password=make_password(password),
# #             cv=cv,
# #         )
# #         talent.save()
# #         return JsonResponse({"message": "Talent créé avec succès"})

# # def create_jwt_token_for_user(user):
# #     """
# #     Crée un token JWT pour n'importe quel modèle d'utilisateur
# #     """
# #     refresh = RefreshToken()
# #     refresh['email'] = user.email
    
# #     try:
# #         Talent.objects.get(email=user.email)
# #         refresh['user_type'] = 'talent'
# #     except Talent.DoesNotExist:
# #         refresh['user_type'] = 'recruteur'
    
# #     return refresh

# # class AuthentificationUsers(APIView):
# #     def post(self, request):
# #         email = request.data.get('email')
# #         password = request.data.get('password')
# #         user = authenticate(username=email, password=password)

# #         if not user:
# #             raise serializers.ValidationError("Identifiants invalides.")

# #         refresh = create_jwt_token_for_user(user)
# #         user_type = refresh['user_type']

# #         if user_type == "talent":
# #             data = {
# #                 "refresh": str(refresh),
# #                 "access": str(refresh.access_token),
# #                 "user_type": user_type,
# #                 "user": {
# #                     "id": user.id,
# #                     "email": user.email,
# #                     "first_name": user.first_name,
# #                     "last_name": user.last_name,
                    
# #                 }
# #             }
# #         if user_type == "recruteur":
# #             data = {
# #                 "refresh": str(refresh),
# #                 "access": str(refresh.access_token),
# #                 "user_type": user_type,
# #                 "user": {
# #                     "id": user.id,
# #                     "email": user.email,
# #                     "first_name": user.first_name,
# #                     "last_name": user.last_name,
# #                     "entreprise":user.entreprise
# #                 }
# #             }
# #         return Response(data, status=status.HTTP_200_OK)




# # # @api_view(['POST'])
# # # def forgot_password(request):
# # #     """Endpoint pour demander la réinitialisation du mot de passe"""
# # #     email = request.data.get('email')
    
# # #     print(f"=== REQUÊTE REÇUE ===")
# # #     print(f"Email: {email}")
    
# # #     if not email:
# # #         return Response({"message": "L'email est requis"}, status=400)
    
# # #     # Générer un token unique
# # #     token = ''.join(random.choices(string.ascii_letters + string.digits, k=50))
    
# # #     # Sauvegarder le token (en mémoire pour l'instant)
# # #     # Dans un vrai projet, sauvegardez dans un modèle ResetPasswordToken
# # #     request.session['reset_token'] = token
# # #     request.session['reset_email'] = email
# # #     request.session.set_expiry(3600)  # Expire dans 1 heure
    
# # #     # Créer le lien de réinitialisation
# # #     reset_link = f"http://localhost:3001/reset-password?token={token}&email={email}"
    
# # #     print(f"Lien de réinitialisation: {reset_link}")
    
# # #     # Version simplifiée - retourne le lien (pour le développement)
# # #     return Response({
# # #         "message": f"Un lien de réinitialisation a été envoyé à {email}",
# # #         "reset_link": reset_link,  # Pour le développement
# # #         "success": True
# # #     }, status=200)


# # # @api_view(['POST'])
# # # def reset_password(request):
# #     # """Endpoint pour réinitialiser le mot de passe avec un token"""
# #     # token = request.data.get('token')
# #     # email = request.data.get('email')
# #     # new_password = request.data.get('new_password')
# #     # confirm_password = request.data.get('confirm_password')
    
# #     # print(f"=== RESET PASSWORD REÇU ===")
# #     # print(f"Token: {token}")
# #     # print(f"Email: {email}")
    
# #     # # Vérifications
# #     # if not token or not email or not new_password:
# #     #     return Response({"message": "Tous les champs sont requis"}, status=400)
    
# #     # if new_password != confirm_password:
# #     #     return Response({"message": "Les mots de passe ne correspondent pas"}, status=400)
    
# #     # if len(new_password) < 6:
# #     #     return Response({"message": "Le mot de passe doit contenir au moins 6 caractères"}, status=400)
    
# #     # # Pour le développement, on accepte n'importe quel token
# #     # # En production, vérifiez dans la base de données
    
# #     # try:
# #     #     # Chercher l'utilisateur
# #     #     user = None
# #     #     try:
# #     #         user = Talent.objects.get(email=email)
# #     #         print(f"Talent trouvé: {user.email}")
# #     #     except Talent.DoesNotExist:
# #     #         try:
# #     #             user = Recruteur.objects.get(email=email)
# #     #             print(f"Recruteur trouvé: {user.email}")
# #     #         except Recruteur.DoesNotExist:
# #     #             pass
        
# #     #     if not user:
# #     #         return Response({"message": "Utilisateur non trouvé"}, status=404)
        
# #     #     # Mettre à jour le mot de passe
# #     #     user.password = make_password(new_password)
# #     #     user.save()
        
# #     #     print(f"Mot de passe réinitialisé avec succès pour: {email}")
        
# #     #     return Response({"message": "Mot de passe réinitialisé avec succès"}, status=200)
        
# #     # except Exception as e:
# #     #     print(f"Erreur dans reset_password: {e}")
# #     #     return Response({"message": f"Erreur: {str(e)}"}, status=500)


# # import random
# # import string
# # from django.core.mail import send_mail
# # from django.conf import settings
# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from django.contrib.auth.hashers import make_password
# # from .models import Talent, Recruteur, PasswordResetCode

# # # Dictionnaire pour stocker les codes de vérification (en mémoire)
# # from datetime import datetime, timedelta

# # from django.utils import timezone

# # @api_view(['POST'])
# # def send_verification_code(request):
# #     """Envoyer un code de vérification par email"""
# #     email = request.data.get('email')
    
# #     if not email:
# #         return Response({"message": "L'email est requis"}, status=400)
    
# #     # Vérifier si l'utilisateur existe (optionnel)
# #     user_exists = Talent.objects.filter(email=email).exists() or Recruteur.objects.filter(email=email).exists()
# #     if not user_exists:
# #         return Response({
# #             "message": "Si un compte existe avec cet email, vous recevrez un code de vérification"
# #         }, status=200)
    
# #     # Générer un code à 6 chiffres
# #     code = ''.join(random.choices(string.digits, k=6))
    
# #     # Stocker le code en mémoire
# #     PasswordResetCode.objects.filter(email=email, verified=False).delete()
# #     PasswordResetCode.objects.create(email=email, code=code)
    
# #     # Nettoyer les anciens codes (plus de 10 minutes)
# #     PasswordResetCode.objects.filter(created_at__lt=timezone.now() - timedelta(minutes=10)).delete()
    
# #     # Afficher le code dans la console (pour le développement)
# #     print(f"\n" + "="*50)
# #     print(f"🔐 CODE DE VÉRIFICATION")
# #     print(f"📧 Email: {email}")
# #     print(f"🔢 Code: {code}")
# #     print(f"⏰ Valable 10 minutes")
# #     print("="*50 + "\n")
    
# #     # Essayer d'envoyer l'email
# #     try:
# #         send_mail(
# #             'Code de vérification - JobGate',
# #             f'Votre code de vérification est : {code}\n\nCe code est valable 10 minutes.\n\nSi vous n\'êtes pas à l\'origine de cette demande, ignorez cet email.\n\nCordialement,\nL\'équipe JobGate',
# #             settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER or 'noreply@jobgate.com',
# #             [email],
# #             fail_silently=False,
# #         )
# #         print(f"Code de vérification envoyé à {email}")
# #     except Exception as exc:
# #         print(f"Erreur d'envoi du code de vérification à {email}: {exc}")
# #         return Response({
# #             "message": "Impossible d'envoyer le code de vérification. Vérifiez la configuration de l'email.",
# #             "error": str(exc)
# #         }, status=500)
    
# #     return Response({
# #         "message": "Un code de vérification a été envoyé à votre email",
# #         "email": email
# #     }, status=200)

# # @api_view(['POST'])
# # def verify_code(request):
# #     email = request.data.get('email')
# #     code = request.data.get('code')
# #     print("SESSION KEY:", request.session.session_key)
# #     print("SESSION DATA:", dict(request.session.items()))
# #     if not email or not code:
# #         return Response(
# #             {"message": "Email et code requis"},
# #             status=400
# #         )

# #     try:
# #         reset_code = PasswordResetCode.objects.get(
# #             email=email,
# #             code=code,
# #             verified=False
# #         )

# #         if reset_code.is_expired():
# #             return Response(
# #                 {"message": "Code expiré"},
# #                 status=400
# #             )

# #         reset_code.verified = True
# #         temp_token = ''.join(
# #             random.choices(
# #                 string.ascii_letters + string.digits,
# #                 k=50
# #             )
# #         )
# #         reset_code.reset_token = temp_token
# #         reset_code.save()

# #         return Response({
# #             "message": "Code vérifié avec succès",
# #             "reset_token": temp_token,
# #             "email": email
# #         })

# #     except PasswordResetCode.DoesNotExist:
# #         return Response(
# #             {"message": "Code invalide"},
# #             status=400
# #         )

# # @api_view(['POST'])
# # def reset_password_with_code(request):
# #     """Réinitialiser le mot de passe après vérification du code"""
# #     token = request.data.get('token')
# #     email = request.data.get('email')
# #     new_password = request.data.get('new_password')
# #     confirm_password = request.data.get('confirm_password')

# #     if not token or not email:
# #         return Response({"message": "Email et token requis"}, status=400)

# #     if new_password != confirm_password:
# #         return Response({"message": "Les mots de passe ne correspondent pas"}, status=400)

# #     if len(new_password) < 6:
# #         return Response({"message": "Le mot de passe doit contenir au moins 6 caractères"}, status=400)

# #     try:
# #         reset_code = PasswordResetCode.objects.get(
# #             email=email,
# #             reset_token=token,
# #             verified=True
# #         )

# #         if reset_code.is_expired():
# #             return Response({"message": "Le token de réinitialisation a expiré"}, status=400)

# #         # Chercher l'utilisateur
# #         user = None
# #         try:
# #             user = Talent.objects.get(email=email)
# #         except Talent.DoesNotExist:
# #             try:
# #                 user = Recruteur.objects.get(email=email)
# #             except Recruteur.DoesNotExist:
# #                 pass

# #         if not user:
# #             return Response({"message": "Utilisateur non trouvé"}, status=404)

# #         # Mettre à jour le mot de passe
# #         user.password = make_password(new_password)
# #         user.save()

# #         # Supprimer le code utilisé
# #         reset_code.delete()

# #         print(f"✅ Mot de passe réinitialisé avec succès pour: {email}")

# #         return Response({"message": "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."}, status=200)

# #     except PasswordResetCode.DoesNotExist:
# #         return Response({"message": "Token invalide ou code non vérifié"}, status=400)
# #     except Exception as e:
# #         print(f"❌ Erreur lors de la réinitialisation: {e}")
# #         return Response({"message": f"Erreur: {str(e)}"}, status=500)

# # # @api_view(['POST'])
# # # def send_verification_code(request):
# # #     """Envoyer un code de vérification par email"""
# # #     email = request.data.get('email')
    
# # #     if not email:
# # #         return Response({"message": "L'email est requis"}, status=400)
    
# # #     # Vérifier si l'utilisateur existe
# # #     user_exists = False
# # #     try:
# # #         if Talent.objects.filter(email=email).exists() or Recruteur.objects.filter(email=email).exists():
# # #             user_exists = True
# # #     except:
# # #         pass
    
# # #     if not user_exists:
# # #         # Pour des raisons de sécurité, on retourne un message générique
# # #         return Response({
# # #             "message": "Si un compte existe avec cet email, vous recevrez un code de vérification"
# # #         }, status=200)
    
# # #     # Générer un code à 6 chiffres
# # #     code = ''.join(random.choices(string.digits, k=6))
    
# # #     # Sauvegarder le code dans la base de données
# # #     # Supprimer les anciens codes pour cet email
# # #     PasswordResetCode.objects.filter(email=email, is_used=False).delete()
    
# # #     reset_code = PasswordResetCode.objects.create(
# # #         email=email,
# # #         code=code
# # #     )
    
# # #     # Envoyer l'email avec le code
# # #     subject = 'Code de vérification - JobGate'
# # #     message = f"""
# # # Bonjour,

# # # Vous avez demandé la réinitialisation de votre mot de passe.

# # # Votre code de vérification est : {code}

# # # Ce code est valable pendant 10 minutes.

# # # Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

# # # Cordialement,
# # # L'équipe JobGate
# # # """
    
# # #     try:
# # #         send_mail(
# # #             subject,
# # #             message,
# # #             settings.DEFAULT_FROM_EMAIL or 'noreply@jobgate.com',
# # #             [email],
# # #             fail_silently=False,
# # #         )
# # #         print(f"Code de vérification envoyé à {email}: {code}")
# # #     except Exception as e:
# # #         print(f"Erreur d'envoi: {e}")
    
# # #     return Response({
# # #         "message": "Un code de vérification a été envoyé à votre email",
# # #         "email": email
# # #     }, status=200)


# # # @api_view(['POST'])
# # # def verify_code(request):
# # #     """Vérifier le code et permettre la réinitialisation"""
# # #     email = request.data.get('email')
# # #     code = request.data.get('code')
    
# # #     if not email or not code:
# # #         return Response({"message": "Email et code requis"}, status=400)
    
# # #     try:
# # #         reset_code = PasswordResetCode.objects.get(email=email, code=code, is_used=False)
        
# # #         if not reset_code.is_valid():
# # #             return Response({"message": "Code expiré. Veuillez demander un nouveau code."}, status=400)
        
# # #         # Marquer le code comme utilisé
# # #         reset_code.is_used = True
# # #         reset_code.save()
        
# # #         # Générer un token temporaire pour la réinitialisation
# # #         temp_token = ''.join(random.choices(string.ascii_letters + string.digits, k=50))
        
# # #         # Stocker le token dans la session
# # #         request.session['reset_token'] = temp_token
# # #         request.session['reset_email'] = email
# # #         request.session.set_expiry(600)  # 10 minutes
        
# # #         return Response({
# # #             "message": "Code vérifié avec succès",
# # #             "reset_token": temp_token,
# # #             "email": email
# # #         }, status=200)
        
# # #     except PasswordResetCode.DoesNotExist:
# # #         return Response({"message": "Code invalide"}, status=400)


# # # @api_view(['POST'])
# # # def reset_password_with_code(request):
# #     """Réinitialiser le mot de passe après vérification du code"""
# #     token = request.data.get('token')
# #     email = request.data.get('email')
# #     new_password = request.data.get('new_password')
# #     confirm_password = request.data.get('confirm_password')
    
# #     # Vérifier le token de session
# #     session_token = request.session.get('reset_token')
# #     session_email = request.session.get('reset_email')
    
# #     if not session_token or not session_email:
# #         return Response({"message": "Session expirée. Veuillez recommencer."}, status=400)
    
# #     if session_token != token or session_email != email:
# #         return Response({"message": "Token invalide"}, status=400)
    
# #     if new_password != confirm_password:
# #         return Response({"message": "Les mots de passe ne correspondent pas"}, status=400)
    
# #     if len(new_password) < 6:
# #         return Response({"message": "Le mot de passe doit contenir au moins 6 caractères"}, status=400)
    
# #     try:
# #         # Chercher l'utilisateur
# #         user = None
# #         try:
# #             user = Talent.objects.get(email=email)
# #         except Talent.DoesNotExist:
# #             try:
# #                 user = Recruteur.objects.get(email=email)
# #             except Recruteur.DoesNotExist:
# #                 pass
        
# #         if not user:
# #             return Response({"message": "Utilisateur non trouvé"}, status=404)
        
# #         # Mettre à jour le mot de passe
# #         user.password = make_password(new_password)
# #         user.save()
        
# #         # Nettoyer la session
# #         del request.session['reset_token']
# #         del request.session['reset_email']
        
# #         return Response({"message": "Mot de passe réinitialisé avec succès"}, status=200)
        
# #     except Exception as e:
# #         return Response({"message": f"Erreur: {str(e)}"}, status=500)

# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from django.core.mail import EmailMessage

# # @api_view(['POST'])
# # def sendmail(request):
# #     file = request.FILES.get("file")
# #     user = request.user
# #     forum_nom = request.data.get("forum_nom")
# #     print(forum_nom)
# #     # Sujet dynamique
# #     subject = f"Registration Confirmed for Forum: {forum_nom}"

# #     body_html = f"""
# #     <html>
# #     <body>
# #         <p style="color: #1F2937; font-size: 16px;">
# #             Hello <strong>{user.last_name} {user.first_name}</strong>,
# #         </p>
# #         <p style="color: #008000; font-size: 16px;">
# #             Your registration for the forum <strong>{forum_nom}</strong> has been successfully recorded ✅
# #         </p>
# #         <p style="color: #374151; font-size: 14px;">
# #             Please find attached a PDF containing all the necessary details.
# #         </p>
# #         <p style="color: #DC2626; font-weight: bold;">
# #             Don't forget to attend the event on the scheduled day.
# #         </p>
# #         <p style="color: #6B7280; font-size: 14px;">
# #             Best regards,<br>
# #             JobGate
# #         </p>
# #     </body>
# #     </html>
# #     """


# #     # Création de l'email
# #     email = EmailMessage(
# #         subject,
# #         "",  # texte brut vide ou tu peux mettre un résumé simple
# #         from_email="noreply@monsite.com",
# #         to=[user.email],
# #     )

# #     # Indiquer que le corps est en HTML
# #     email.content_subtype = "html"
# #     email.body = body_html

# #     # Attacher le fichier PDF si présent
# #     if file:
# #         email.attach(file.name, file.read(), file.content_type)

# #     # Envoyer l'email
# #     email.send()

# #     return Response("Email envoyé avec succès")

# # from datetime import date,timedelta
# # def list_forums_candidature_demain(request):
# #     aujourdhui = date.today() + timedelta(days=1)
# #     forums = Forum.objects.filter(date_forum=aujourdhui)
    
# #     # Récupérer toutes les candidatures en une seule requête
# #     forum_ids = forums.values_list('id', flat=True)
# #     candidatures = Candidature_forum.objects.filter(forum_id__in=forum_ids)
    
# #     for cand in candidatures:
# #         subject = f"📅 REMINDER: Forum {cand.forum.nom} Tomorrow!"

# #         body_html = f"""
# #         <html>
# #         <head>
# #             <style>
# #             body {{
# #                 font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
# #                 line-height: 1.6;
# #                 color: #333;
# #                 max-width: 600px;
# #                 margin: 0 auto;
# #                 padding: 20px;
# #             }}
# #             .header {{
# #                 background-color: #2563EB;
# #                 color: white;
# #                 padding: 20px;
# #                 text-align: center;
# #                 border-radius: 8px 8px 0 0;
# #             }}
# #             .content {{
# #                 background-color: #F9FAFB;
# #                 padding: 20px;
# #                 border-radius: 0 0 8px 8px;
# #             }}
# #             .important {{
# #                 background-color: #FEF3C7;
# #                 padding: 15px;
# #                 border-left: 4px solid #D97706;
# #                 margin: 15px 0;
# #                 border-radius: 4px;
# #             }}
# #             .footer {{
# #                 margin-top: 20px;
# #                 padding-top: 20px;
# #                 border-top: 1px solid #E5E7EB;
# #                 color: #6B7280;
# #                 font-size: 14px;
# #             }}
# #             .button {{
# #                 display: inline-block;
# #                 background-color: #2563EB;
# #                 color: white;
# #                 padding: 12px 24px;
# #                 text-decoration: none;
# #                 border-radius: 6px;
# #                 margin: 15px 0;
# #             }}
# #             </style>
# #         </head>
# #         <body>
# #             <div class="header">
# #             <h1>📅 Important Reminder</h1>
# #             </div>
            
# #             <div class="content">
# #             <p>Hello <strong>{cand.first_name} {cand.last_name}</strong>,</p>
            
# #             <p>This is a reminder that the forum <strong>{cand.forum.nom}</strong> will take place <strong>tomorrow</strong>!</p>
            
# #             <div class="important">
# #                 <h3>🗓️ Event Details:</h3>
# #                 <p><strong>Date:</strong> {cand.forum.date_forum}</p>
# #                 <p><strong>Location:</strong> {cand.forum.lieu}</p>
# #             </div>
            
# #             <p>Get ready and be prepared to meet recruiters from top companies!</p>
            
# #             <p>We recommend:</p>
# #             <ul>
# #                 <li>👔 Wearing professional attire</li>
# #                 <li>⏰ Arriving 15 minutes early</li>
# #             </ul>       
# #             <p>We look forward to seeing you tomorrow!</p>
# #             </div>
            
# #             <div class="footer">
# #             <p>Best regards,<br>
# #             <strong>The JobGate Team</strong></p>
# #             <p><em>This email was sent automatically, please do not reply.</em></p>
# #             </div>
# #         </body>
# #         </html>
# #         """

# #         text_content = f"""
# #         REMINDER: Forum {cand.forum.nom} Tomorrow!

# #         Hello {cand.first_name} {cand.last_name},

# #         This is a reminder that the forum {cand.forum.nom} will take place tomorrow!

# #         Event Details:
# #         - Date: {cand.forum.date_forum}
# #         - Location: {cand.forum.lieu}

# #         Be prepared to meet recruiters!

# #         Recommendations:
# #         - Wear professional attire
# #         - Arrive 15 minutes early

# #         Best regards,
# #         The JobGate Team
# #         """

# #                 # Créer et envoyer l'email
            
# #         email = EmailMessage(
# #             subject,
# #             body_html,
# #             from_email="noreply@jobgate.com",
# #             to=[cand.email],
# #         )
# #         email.content_subtype = "html"
# #         email.send()

# #     return Response(f"Emails de rappel envoyés avec succès à {candidatures.count()} candidats")

# # @api_view(["POST"])
# # def user_conn(request):
# #     user = request.user
# #     if isinstance(user, Talent):
# #             data = {
# #                 "id": user.id,
# #                 "role": "talent",
# #                 "email": user.email,
# #                 "first_name": user.first_name,
# #                 "last_name": user.last_name,
# #             }
# #     elif isinstance(user, Recruteur):
# #             data = {
# #                 "id": user.id,
# #                 "role": "recruteur",
# #                 "email": user.email,
# #                 "first_name": user.first_name,
# #                 "last_name": user.last_name,
# #                 "entreprise": user.entreprise,
# #             }
# #     else:
# #             return Response({"detail": "Utilisateur inconnu"}, status=400)
# #     return JsonResponse(data,safe=False)


# # #Remplir Candidature
# # @api_view(['POST'])
# # def InscriptionForum(request):
    
# #     user = request.user
# #     forum = Forum.objects.get(nom=request.data.get("forum_nom"))
# #     if user.is_authenticated :
# #         if forum.duree == 0 :
# #             Candidature = Candidature_forum(
# #                 talent_id = user.id,
# #                 forum_id = forum.id,
# #                 first_name = user.first_name,
# #                 last_name = user.last_name,
# #                 email = user.email,
# #                 cv = user.cv,
# #                 numero_telephone = user.numero_telephone,
# #                 image = user.image,
# #             )
# #             Candidature.save()    
# #         else :
# #             Candidature = Candidature_forum(
# #                 talent_id = user.id,
# #                 forum_id = forum.id,
# #                 first_name = user.first_name,
# #                 last_name = user.last_name,
# #                 email = user.email,
# #                 cv = user.cv,
# #                 numero_telephone = user.numero_telephone,
# #                 image = user.image,
# #                 event_horaire = request.data.get("horaire")
# #             )
# #             Candidature.save() 
        

# #         serializer = CandidatureforumSerializer(Candidature)
# #         return JsonResponse({"message": "Candidature créée !!", "data": serializer.data}, status=200)
# #     return Response("Talent non connecte !!",status=400)

    
# # @api_view(['POST'])
# # # @permission_classes([IsAuthenticated])
# # def create_forum(request):
   
# #         data = request.data

# #         # # Récupération de l'université associée
        
    
# #         # Génération du QR code avec un lien d'inscription par exemple
# #         # qr = qrcode.QRCode(version=1, box_size=10, border=5)
# #         # qr_data = f"http://localhost:3000/forums/{data.get('nom').replace(' ', '_')}"
# #         # qr.add_data(qr_data)
# #         # qr.make(fit=True)
# #         # img = qr.make_image(fill='black', back_color='white')

# #         # # Sauvegarde de l'image en mémoire
# #         # buffer = BytesIO()
# #         # img.save(buffer, format="PNG")
# #         # file_name = f"{data.get('nom')}_qrcode.png"

# #         # Création du forum

# #         # recruteurs_list = json.loads(request.POST.get('recruteurs'))
# #         # return JsonResponse(type(recruteurs_list), status=200, safe=False)

# #         forum = Forum(
# #             nom=data.get("nom"),
# #             date_forum=data.get("date_forum"),
# #             lieu=data.get("lieu"),
# #             description=data.get("description"),
# #             recruteurs=data.get("recruteurs"),
# #             nombre_max=data.get("nombre_max"),
# #             date_debut=data.get("date_debut"),
# #             date_fin=data.get("date_fin"),
# #             duree=data.get("duree"),
# #             qrcode=request.FILES.get("qrcode"),
# #         )


# #         # Ajouter le QR code
# #         # forum.qrcode_img.save(file_name, ContentFile(buffer.getvalue()))
# #         forum.save()

# #         # # serializer = ForumSerializer(data=request.data)
# #         # if serializer.is_valid():
# #         #         serializer.save()

# #         return Response(status=status.HTTP_201_CREATED)
# #         # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# #     # except Universite.DoesNotExist:
# #     #     return Response({"error": "Université introuvable"}, status=status.HTTP_400_BAD_REQUEST)
# #     # except Exception as e:
# #     #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# # from .serializers import ForumSerializer, RecruteurSerializer
# # from rest_framework.decorators import permission_classes
# # import json; 

# # @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# # def get_data_rec(request):
# #     user = request.user
# #     queryset = Recruteur.objects.filter(entreprise = user.entreprise)
# #     serializer = RecruteurSerializer(queryset, many=True)
# #     return JsonResponse(serializer.data, safe=False)

# # @api_view(['GET'])
# # @permission_classes([IsAuthenticated])
# # def list_forums(request):
# #     user = request.user
# #     print(user)    
# #     if isinstance(user, Recruteur):
# #         forums = Forum.objects.filter(
# #             recruteurs__contains=[user.id]
# #         ).order_by('-date_forum')
# #     serializer = ForumSerializer(forums, many=True)
# #     return Response(serializer.data, status=status.HTTP_200_OK)



# # def get_data_candidature(request):
# #     queryset = Candidature_forum.objects.all()
# #     serializer = CandidatureforumSerializer(queryset, many=True)  # Sérialise plusieurs objets
# #     return JsonResponse(serializer.data, safe=False)     

# # @api_view(['GET'])
# # def get_data_candidature_forum(request):
# #     forum_id = request.query_params.get('forum_id')
# #     candidatures = Candidature_forum.objects.all()
# #     forum = Forum.objects.get(id=forum_id)


# #     # 🔹 On filtre uniquement si forum_id existe
# #     if forum_id:
# #        forum_id = int(forum_id)  # s'assurer que c'est un entier
# #        candidatures = candidatures.filter(forum_id=forum_id)
       
# #     forum_data = ForumSerializer(forum).data
# #     cand_data = CandidatureforumSerializer(candidatures, many=True).data

# #     return Response({
# #         "forum": forum_data,
# #         "candidatures": cand_data
# #     })


# # @api_view(['GET'])
# # def list_forums_talent(request):
# #     forums = Forum.objects.all().order_by('-date_forum')  # les forums récents d'abord
# #     serializer = ForumSerializer(forums, many=True)
# #     return Response(serializer.data, status=status.HTTP_200_OK)



# # @api_view(["POST"])
# # def add_feedback(request):
# #     try:
# #         feeback = Feedback_candidat(
# #             note = request.data.get("note"),
# #             annotation_candidat=request.data.get("annotation_candidat"),
# #             candidature_id=request.data.get("candidature_id"),
# #             etat = request.data.get("etat")
# #         )
# #         feeback.save()
# #         return Response("Feedback crée",status=200)
# #     except :
# #         return Response("Feedback non crée",status=400)
    

# # @api_view(["PUT"])
# # def alter_presence(request,candidature_id):
# #     candidature = Candidature_forum.objects.get(id=candidature_id)
# #     candidature.presence = not candidature.presence
# #     candidature.save()
# #     return Response("Candidature modifie")  



# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from .models import Forum, Candidature_forum, Feedback_candidat, Archive_forum, Archive_Candidat, Recruteur

# # # @api_view(["POST"])

# # # def archive_old_forums_Cands(request):
# # #     forum_id = request.data.get("forum_id")
    
# # #     # Vérifier que le forum existe
# # #     try:
# # #         old_forum = Forum.objects.get(id=forum_id)
# # #     except Forum.DoesNotExist:
# # #         return Response({"error": "Forum introuvable"}, status=404)
    

# # #     # Créer l'archive du forum
# # #     def truncate_field(value, max_length):
# # #         if value and len(str(value)) > max_length:
# # #             return str(value)[:max_length]
# # #         return value

# # #     archive_forum = Archive_forum.objects.create(
# # #         nom=truncate_field(old_forum.nom, 255),
# # #         date_forum=old_forum.date_forum,
# # #         lieu=truncate_field(old_forum.lieu, 100),
# # #         description=truncate_field(old_forum.description, 255),
# # #         recruteurs=old_forum.recruteurs or [],
# # #         nombre_max=old_forum.nombre_max,
# # #         qrcode=old_forum.qrcode,
# # #         date_debut=old_forum.date_debut,
# # #         date_fin=old_forum.date_fin,
# # #         duree=old_forum.duree,
# # #         currentNumber=Candidature_forum.objects.filter(forum_id=old_forum.id).count(),
# # #         entreprise=truncate_field(Recruteur.objects.get(id=old_forum.recruteurs[0]).entreprise, 150)
# # #     )
# # #     archive_forum.save()
   
    

# # #     list_cand = Candidature_forum.objects.filter(forum_id=forum_id)
# # #     for cand in list_cand:
# # #         feedback = Feedback_candidat.objects.filter(candidature=cand).first()
         
# # #         archive_cand=Archive_Candidat.objects.create(
# # #         talent_id=cand.talent.id if cand.talent else None,
# # #         forum_id=forum_id,
# # #         first_name=truncate_field(cand.first_name, 100),
# # #         last_name=truncate_field(cand.last_name, 100),
# # #         email=truncate_field(cand.email, 150),
# # #         cv=cand.cv,
# # #         numero_telephone=truncate_field(cand.numero_telephone, 100),
# # #         image=cand.image,
# # #         presence=cand.presence,
# # #         event_horaire=truncate_field(cand.event_horaire, 255),
# # #         date_inscri=cand.date_inscri,
# # #         note=truncate_field(feedback.note, 255) if feedback and feedback.note else None,
# # #         annotation_candidat=feedback.annotation_candidat if feedback else None,
# # #         etat=truncate_field(feedback.etat, 100) if feedback and feedback.etat else None,
# # #         )
# # #         archive_cand.save()
# # #         print("Hello")


# # #             # Supprimer le feedback et la candidature originale
# # #         if feedback:
# # #             feedback.delete()
# # #         cand.delete()

# # #         # Supprimer le forum original
# # #         old_forum.delete()

# # #         return Response({"message": "Forum et candidatures archivés avec succès"})

# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from datetime import datetime
# # from django.utils.timezone import now

# # # Fonction utilitaire pour tronquer les champs
# # def truncate_field(value, max_length):
# #     if value is not None and len(str(value)) > max_length:
# #         return str(value)[:max_length]
# #     return value

# # @api_view(["POST"])
# # def archive_old_forums_Cands(request):
# #     forum_id = request.data.get("forum_id")
# #     try:
# #         old_forum = Forum.objects.get(id=forum_id)
# #     except Forum.DoesNotExist:
# #         return Response({"error": "Forum introuvable"}, status=404)

# #     # Récupérer currentNumber et entreprise
# #     current_number = Candidature_forum.objects.filter(forum_id=old_forum.id).count()
# #     entreprise = None
# #     if old_forum.recruteurs:
# #         try:
# #             entreprise = Recruteur.objects.get(id=old_forum.recruteurs[0]).entreprise
# #         except Recruteur.DoesNotExist:
# #             entreprise = None

# #     # Créer l'archive du forum avec tronquage
# #     archive_forum = Archive_forum.objects.create(
# #         forum_id=forum_id,
# #         nom=truncate_field(old_forum.nom, 255),
# #         date_forum=old_forum.date_forum,
# #         lieu=truncate_field(old_forum.lieu, 100),
# #         description=truncate_field(old_forum.description, 255),
# #         recruteurs=old_forum.recruteurs or [],
# #         nombre_max=old_forum.nombre_max,
# #         qrcode=old_forum.qrcode,
# #         date_debut=old_forum.date_debut,
# #         date_fin=old_forum.date_fin,
# #         duree=old_forum.duree,
# #         currentNumber=current_number,
# #         entreprise=truncate_field(entreprise, 150) if entreprise else None,
# #     )
# #     archive_forum.save()

# #     # Archiver les candidats
# #     list_cand_to_delete = Candidature_forum.objects.filter(forum_id=forum_id).exclude(presence=True)
   
# #     list_cand_to_delete.delete() # déjà filtré

# #     list_cand = Candidature_forum.objects.filter(forum_id=forum_id)

# #     for cand in list_cand:
# #         feedback = Feedback_candidat.objects.filter(candidature=cand).first()

# #         archive_cand = Archive_Candidat.objects.create(
# #             talent_id=cand.talent.id if cand.talent else None,
# #             forum_id=forum_id,
# #             first_name=truncate_field(cand.first_name, 100),
# #             last_name=truncate_field(cand.last_name, 100),
# #             email=truncate_field(cand.email, 150),
# #             cv=cand.cv,  # si le chemin est trop long, penser à augmenter max_length du FileField
# #             numero_telephone=truncate_field(cand.numero_telephone, 100),
# #             image=cand.image,  # idem que cv
# #             presence=cand.presence,
# #             event_horaire=truncate_field(cand.event_horaire, 255),
# #             date_inscri=cand.date_inscri,
# #             note=truncate_field(feedback.note, 255) if feedback and feedback.note else None,
# #             annotation_candidat=feedback.annotation_candidat if feedback else None,
# #             etat=truncate_field(feedback.etat, 100) if feedback and feedback.etat else None,
# #         )
# #         archive_cand.save()

# #         # Supprimer les données originales
# #         if feedback:
# #             feedback.delete()
# #         cand.delete()

# #     # Supprimer le forum original
# #     old_forum.delete()

# #     return Response({"message": "Forum et candidatures archivés avec succès"})


# # # def archive_old_forums_Cands(request):
# # #     forum_id = request.data.get("forum_id")
# # #     old_forum = Forum.objects.get(id=forum_id)

# # #     list_cand = Candidature_forum.objects.filter(forum_id=forum_id)
    
# # #     for cand in list_cand:
# # #         Archive_talent.objects.create(candidature_id=cand.id)
# # #         cand.delete()
    
   
# # #     Archive_forum.objects.create(forum=old_forum)
    
# # #     old_forum.delete()
    
# # #     return Response("Forum archivé avec succès")

# # # views.py
# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from .models import Feedback_candidat, Candidature_forum
# # from .serializers import FeedbackSerializer

# # @api_view(['GET'])
# # def get_data_feedback(request):
# #     forum_id = request.query_params.get('forum_id')
# #     forum = Forum.objects.get(id=forum_id)

# #     if not forum_id:
# #         forum = Forum.objects.get.All()
# #         forum_data = ForumSerializer(forum).data
# #         return Response(forum_data)

# #     try:
# #         forum_id = int(forum_id)
# #     except ValueError:
# #         return Response({"error": "forum_id invalide"}, status=400)

# #     candidatures = Candidature_forum.objects.filter(forum_id=forum_id)

# #     forum_data = ForumSerializer(forum).data
     

# #     feedbacks = Feedback_candidat.objects.filter(
# #     candidature__in=candidatures,             # filtre sur les candidatures
# #     etat__in=["Strongly yes", "Yes"]     # filtre sur les réponses désirées
# #     ).annotate(
# #         priority=Case(
# #             When(etat="Strongly yes", then=Value(1)),
# #             When(etat="Yes", then=Value(2)),
# #             output_field=IntegerField(),
# #         )
# #     ).order_by("priority")

# #     feedbacks_No = Feedback_candidat.objects.filter(
# #         candidature__in=candidatures,
# #         etat__in=["No"]
# #     )   

# #     feed_data = FeedbackSerializer(feedbacks, many=True).data
# #     count_strongly_yes = feedbacks.filter(etat="Strongly yes").count()
# #     count_yes = feedbacks.filter(etat="Yes").count()
# #     count_no = feedbacks_No.count()


# #     print(count_no)

# #     return Response({
# #         "forum": forum_data,
# #         "feedbacks":feed_data,
# #         "stats": {
# #             "strongly_yes": count_strongly_yes,
# #             "yes": count_yes,
# #             "no": count_no,
# #             "treated_total": count_strongly_yes + count_yes,
# #             "untreated_total": count_no
# #         }
# #     })

# # def get_data_feedback_statistics(request):
# #     queryset = Feedback_candidat.objects.all()
# #     serializer = FeedbackSerializer(queryset, many=True)  # Sérialise plusieurs objets
# #     return JsonResponse(serializer.data, safe=False)

# # @api_view(['GET'])
# # def get_data_candidature_forum_statistics(request):
# #     forum_id = request.query_params.get('forum_id')
# #     candidatures = Candidature_forum.objects.all()

# #     # 🔹 On filtre uniquement si forum_id existe
# #     if forum_id:
# #        forum_id = int(forum_id)  # s'assurer que c'est un entier
# #        candidatures = candidatures.filter(forum_id=forum_id)
       
# #     serializer = CandidatureforumSerializer(candidatures, many=True)
# #     return Response(serializer.data)

# # from rest_framework.decorators import api_view
# # from rest_framework.response import Response
# # from .models import Archive_forum, Archive_Candidat
# # from .serializers import ArchiveForumSerializer, ArchiveCandidatSerializer

# # @api_view(["GET"])
# # @permission_classes([IsAuthenticated])
# # def get_archive_forums(request):
# #     user = request.user
# #     print(user)    
# #     if isinstance(user, Recruteur):
# #         forums = Archive_forum.objects.filter(
# #             recruteurs__contains=[user.id]
# #         )
# #     serializer = ArchiveForumSerializer(forums, many=True)
# #     return Response(serializer.data, status=status.HTTP_200_OK)


# # @api_view(["GET"])
# # def get_archive_candidats(request):
# #     candidats = Archive_Candidat.objects.all()
# #     serializer = ArchiveCandidatSerializer(candidats, many=True)
# #     return Response(serializer.data)





























# from email.message import EmailMessage
# from django.shortcuts import render
# from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from django.contrib.auth import authenticate
# from django.core.mail import BadHeaderError, send_mail
# from App.backends import MultiUserJWTAuthentication,MultiUserBackend
# from django.db.models import Q
# from django.contrib.auth import get_user_model

# import random
# import string
# from django.conf import settings
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework import serializers,status
# from rest_framework.views import APIView
# from rest_framework.decorators import api_view,permission_classes
# from django.contrib.auth.hashers import make_password
# from django.http import JsonResponse
# from .models import Talent,Recruteur,Candidature_forum
# from django.forms.models import model_to_dict

# import qrcode
# from io import BytesIO
# from django.core.files.base import ContentFile
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Forum, Feedback_candidat,Archive_Candidat, Archive_forum
# from .serializers import FeedbackSerializer, ForumSerializer,CandidatureforumSerializer
# from django.core import serializers
# from rest_framework.permissions import IsAuthenticated
# from django.contrib.auth import authenticate
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Talent, Recruteur
# from rest_framework.permissions import AllowAny
# from django.db.models import Case, When, Value, IntegerField


# @api_view(['POST'])
# def signup(request):
#     first_name = request.POST.get("first_name")
#     last_name = request.POST.get("last_name")
#     email = request.POST.get("email")
#     numero_telephone = request.POST.get("numero_telephone")
#     password = request.POST.get("password")
#     cv = request.FILES.get("cv")
#     if cv is None:
#         recruteur = Recruteur(
#             first_name=request.data.get('first_name'),
#             last_name=request.data.get('last_name'),
#             email=request.data.get('email'),
#             entreprise=request.data.get('Entreprise'),
#             numero_telephone = request.data.get("numero_telephone"),
#             image = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
#             password=make_password(request.data.get('password')),
#         )
#         recruteur.save()
#         return JsonResponse({"message": "Recruteur créé avec succès"})
#     else:
#         talent = Talent(
#             first_name=first_name,
#             last_name=last_name,
#             email=email,
#             image = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
#             numero_telephone=numero_telephone,
#             password=make_password(password),
#             cv=cv,
#         )
#         talent.save()
#         return JsonResponse({"message": "Talent créé avec succès"})

# def create_jwt_token_for_user(user):
#     """
#     Crée un token JWT pour n'importe quel modèle d'utilisateur
#     """
#     refresh = RefreshToken()
#     refresh['email'] = user.email
    
#     try:
#         Talent.objects.get(email=user.email)
#         refresh['user_type'] = 'talent'
#     except Talent.DoesNotExist:
#         refresh['user_type'] = 'recruteur'
    
#     return refresh

# class AuthentificationUsers(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')
#         user = authenticate(username=email, password=password)

#         if not user:
#             raise serializers.ValidationError("Identifiants invalides.")

#         refresh = create_jwt_token_for_user(user)
#         user_type = refresh['user_type']

#         if user_type == "talent":
#             data = {
#                 "refresh": str(refresh),
#                 "access": str(refresh.access_token),
#                 "user_type": user_type,
#                 "user": {
#                     "id": user.id,
#                     "email": user.email,
#                     "first_name": user.first_name,
#                     "last_name": user.last_name,
                    
#                 }
#             }
#         if user_type == "recruteur":
#             data = {
#                 "refresh": str(refresh),
#                 "access": str(refresh.access_token),
#                 "user_type": user_type,
#                 "user": {
#                     "id": user.id,
#                     "email": user.email,
#                     "first_name": user.first_name,
#                     "last_name": user.last_name,
#                     "entreprise":user.entreprise
#                 }
#             }
#         return Response(data, status=status.HTTP_200_OK)




# # @api_view(['POST'])
# # def forgot_password(request):
# #     """Endpoint pour demander la réinitialisation du mot de passe"""
# #     email = request.data.get('email')
    
# #     print(f"=== REQUÊTE REÇUE ===")
# #     print(f"Email: {email}")
    
# #     if not email:
# #         return Response({"message": "L'email est requis"}, status=400)
    
# #     # Générer un token unique
# #     token = ''.join(random.choices(string.ascii_letters + string.digits, k=50))
    
# #     # Sauvegarder le token (en mémoire pour l'instant)
# #     # Dans un vrai projet, sauvegardez dans un modèle ResetPasswordToken
# #     request.session['reset_token'] = token
# #     request.session['reset_email'] = email
# #     request.session.set_expiry(3600)  # Expire dans 1 heure
    
# #     # Créer le lien de réinitialisation
# #     reset_link = f"http://localhost:3001/reset-password?token={token}&email={email}"
    
# #     print(f"Lien de réinitialisation: {reset_link}")
    
# #     # Version simplifiée - retourne le lien (pour le développement)
# #     return Response({
# #         "message": f"Un lien de réinitialisation a été envoyé à {email}",
# #         "reset_link": reset_link,  # Pour le développement
# #         "success": True
# #     }, status=200)


# # @api_view(['POST'])
# # def reset_password(request):
#     # """Endpoint pour réinitialiser le mot de passe avec un token"""
#     # token = request.data.get('token')
#     # email = request.data.get('email')
#     # new_password = request.data.get('new_password')
#     # confirm_password = request.data.get('confirm_password')
    
#     # print(f"=== RESET PASSWORD REÇU ===")
#     # print(f"Token: {token}")
#     # print(f"Email: {email}")
    
#     # # Vérifications
#     # if not token or not email or not new_password:
#     #     return Response({"message": "Tous les champs sont requis"}, status=400)
    
#     # if new_password != confirm_password:
#     #     return Response({"message": "Les mots de passe ne correspondent pas"}, status=400)
    
#     # if len(new_password) < 6:
#     #     return Response({"message": "Le mot de passe doit contenir au moins 6 caractères"}, status=400)
    
#     # # Pour le développement, on accepte n'importe quel token
#     # # En production, vérifiez dans la base de données
    
#     # try:
#     #     # Chercher l'utilisateur
#     #     user = None
#     #     try:
#     #         user = Talent.objects.get(email=email)
#     #         print(f"Talent trouvé: {user.email}")
#     #     except Talent.DoesNotExist:
#     #         try:
#     #             user = Recruteur.objects.get(email=email)
#     #             print(f"Recruteur trouvé: {user.email}")
#     #         except Recruteur.DoesNotExist:
#     #             pass
        
#     #     if not user:
#     #         return Response({"message": "Utilisateur non trouvé"}, status=404)
        
#     #     # Mettre à jour le mot de passe
#     #     user.password = make_password(new_password)
#     #     user.save()
        
#     #     print(f"Mot de passe réinitialisé avec succès pour: {email}")
        
#     #     return Response({"message": "Mot de passe réinitialisé avec succès"}, status=200)
        
#     # except Exception as e:
#     #     print(f"Erreur dans reset_password: {e}")
#     #     return Response({"message": f"Erreur: {str(e)}"}, status=500)


# import random
# import string
# from django.core.mail import send_mail
# from django.conf import settings
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from django.contrib.auth.hashers import make_password
# from .models import Talent, Recruteur, PasswordResetCode

# # Dictionnaire pour stocker les codes de vérification (en mémoire)
# from datetime import datetime, timedelta

# from django.utils import timezone

# @api_view(['POST'])
# def send_verification_code(request):
#     """Envoyer un code de vérification par email"""
#     email = request.data.get('email')
    
#     if not email:
#         return Response({"message": "L'email est requis"}, status=400)
    
#     # Vérifier si l'utilisateur existe (optionnel)
#     user_exists = Talent.objects.filter(email=email).exists() or Recruteur.objects.filter(email=email).exists()
#     if not user_exists:
#         return Response({
#             "message": "Si un compte existe avec cet email, vous recevrez un code de vérification"
#         }, status=200)
    
#     # Générer un code à 6 chiffres
#     code = ''.join(random.choices(string.digits, k=6))
    
#     # Stocker le code en mémoire
#     PasswordResetCode.objects.filter(email=email, verified=False).delete()
#     PasswordResetCode.objects.create(email=email, code=code)
    
#     # Nettoyer les anciens codes (plus de 10 minutes)
#     PasswordResetCode.objects.filter(created_at__lt=timezone.now() - timedelta(minutes=10)).delete()
    
#     # Afficher le code dans la console (pour le développement)
#     print(f"\n" + "="*50)
#     print(f"🔐 CODE DE VÉRIFICATION")
#     print(f"📧 Email: {email}")
#     print(f"🔢 Code: {code}")
#     print(f"⏰ Valable 10 minutes")
#     print("="*50 + "\n")
    
#     # Essayer d'envoyer l'email
#     try:
#         send_mail(
#             'Code de vérification - JobGate',
#             f'Votre code de vérification est : {code}\n\nCe code est valable 10 minutes.\n\nSi vous n\'êtes pas à l\'origine de cette demande, ignorez cet email.\n\nCordialement,\nL\'équipe JobGate',
#             settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER or 'noreply@jobgate.com',
#             [email],
#             fail_silently=False,
#         )
#         print(f"Code de vérification envoyé à {email}")
#     except Exception as exc:
#         print(f"Erreur d'envoi du code de vérification à {email}: {exc}")
#         return Response({
#             "message": "Impossible d'envoyer le code de vérification. Vérifiez la configuration de l'email.",
#             "error": str(exc)
#         }, status=500)
    
#     return Response({
#         "message": "Un code de vérification a été envoyé à votre email",
#         "email": email
#     }, status=200)

# @api_view(['POST'])
# def verify_code(request):
#     email = request.data.get('email')
#     code = request.data.get('code')
#     print("SESSION KEY:", request.session.session_key)
#     print("SESSION DATA:", dict(request.session.items()))
#     if not email or not code:
#         return Response(
#             {"message": "Email et code requis"},
#             status=400
#         )

#     try:
#         reset_code = PasswordResetCode.objects.get(
#             email=email,
#             code=code,
#             verified=False
#         )

#         if reset_code.is_expired():
#             return Response(
#                 {"message": "Code expiré"},
#                 status=400
#             )

#         reset_code.verified = True
#         temp_token = ''.join(
#             random.choices(
#                 string.ascii_letters + string.digits,
#                 k=50
#             )
#         )
#         reset_code.reset_token = temp_token
#         reset_code.save()

#         return Response({
#             "message": "Code vérifié avec succès",
#             "reset_token": temp_token,
#             "email": email
#         })

#     except PasswordResetCode.DoesNotExist:
#         return Response(
#             {"message": "Code invalide"},
#             status=400
#         )

# @api_view(['POST'])
# def reset_password_with_code(request):
#     """Réinitialiser le mot de passe après vérification du code"""
#     token = request.data.get('token')
#     email = request.data.get('email')
#     new_password = request.data.get('new_password')
#     confirm_password = request.data.get('confirm_password')

#     if not token or not email:
#         return Response({"message": "Email et token requis"}, status=400)

#     if new_password != confirm_password:
#         return Response({"message": "Les mots de passe ne correspondent pas"}, status=400)

#     if len(new_password) < 6:
#         return Response({"message": "Le mot de passe doit contenir au moins 6 caractères"}, status=400)

#     try:
#         reset_code = PasswordResetCode.objects.get(
#             email=email,
#             reset_token=token,
#             verified=True
#         )

#         if reset_code.is_expired():
#             return Response({"message": "Le token de réinitialisation a expiré"}, status=400)

#         # Chercher l'utilisateur
#         user = None
#         try:
#             user = Talent.objects.get(email=email)
#         except Talent.DoesNotExist:
#             try:
#                 user = Recruteur.objects.get(email=email)
#             except Recruteur.DoesNotExist:
#                 pass

#         if not user:
#             return Response({"message": "Utilisateur non trouvé"}, status=404)

#         # Mettre à jour le mot de passe
#         user.password = make_password(new_password)
#         user.save()

#         # Supprimer le code utilisé
#         reset_code.delete()

#         print(f"✅ Mot de passe réinitialisé avec succès pour: {email}")

#         return Response({"message": "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."}, status=200)

#     except PasswordResetCode.DoesNotExist:
#         return Response({"message": "Token invalide ou code non vérifié"}, status=400)
#     except Exception as e:
#         print(f"❌ Erreur lors de la réinitialisation: {e}")
#         return Response({"message": f"Erreur: {str(e)}"}, status=500)

# # @api_view(['POST'])
# # def send_verification_code(request):
# #     """Envoyer un code de vérification par email"""
# #     email = request.data.get('email')
    
# #     if not email:
# #         return Response({"message": "L'email est requis"}, status=400)
    
# #     # Vérifier si l'utilisateur existe
# #     user_exists = False
# #     try:
# #         if Talent.objects.filter(email=email).exists() or Recruteur.objects.filter(email=email).exists():
# #             user_exists = True
# #     except:
# #         pass
    
# #     if not user_exists:
# #         # Pour des raisons de sécurité, on retourne un message générique
# #         return Response({
# #             "message": "Si un compte existe avec cet email, vous recevrez un code de vérification"
# #         }, status=200)
    
# #     # Générer un code à 6 chiffres
# #     code = ''.join(random.choices(string.digits, k=6))
    
# #     # Sauvegarder le code dans la base de données
# #     # Supprimer les anciens codes pour cet email
# #     PasswordResetCode.objects.filter(email=email, is_used=False).delete()
    
# #     reset_code = PasswordResetCode.objects.create(
# #         email=email,
# #         code=code
# #     )
    
# #     # Envoyer l'email avec le code
# #     subject = 'Code de vérification - JobGate'
# #     message = f"""
# # Bonjour,

# # Vous avez demandé la réinitialisation de votre mot de passe.

# # Votre code de vérification est : {code}

# # Ce code est valable pendant 10 minutes.

# # Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

# # Cordialement,
# # L'équipe JobGate
# # """
    
# #     try:
# #         send_mail(
# #             subject,
# #             message,
# #             settings.DEFAULT_FROM_EMAIL or 'noreply@jobgate.com',
# #             [email],
# #             fail_silently=False,
# #         )
# #         print(f"Code de vérification envoyé à {email}: {code}")
# #     except Exception as e:
# #         print(f"Erreur d'envoi: {e}")
    
# #     return Response({
# #         "message": "Un code de vérification a été envoyé à votre email",
# #         "email": email
# #     }, status=200)


# # @api_view(['POST'])
# # def verify_code(request):
# #     """Vérifier le code et permettre la réinitialisation"""
# #     email = request.data.get('email')
# #     code = request.data.get('code')
    
# #     if not email or not code:
# #         return Response({"message": "Email et code requis"}, status=400)
    
# #     try:
# #         reset_code = PasswordResetCode.objects.get(email=email, code=code, is_used=False)
        
# #         if not reset_code.is_valid():
# #             return Response({"message": "Code expiré. Veuillez demander un nouveau code."}, status=400)
        
# #         # Marquer le code comme utilisé
# #         reset_code.is_used = True
# #         reset_code.save()
        
# #         # Générer un token temporaire pour la réinitialisation
# #         temp_token = ''.join(random.choices(string.ascii_letters + string.digits, k=50))
        
# #         # Stocker le token dans la session
# #         request.session['reset_token'] = temp_token
# #         request.session['reset_email'] = email
# #         request.session.set_expiry(600)  # 10 minutes
        
# #         return Response({
# #             "message": "Code vérifié avec succès",
# #             "reset_token": temp_token,
# #             "email": email
# #         }, status=200)
        
# #     except PasswordResetCode.DoesNotExist:
# #         return Response({"message": "Code invalide"}, status=400)


# # @api_view(['POST'])
# # def reset_password_with_code(request):
#     """Réinitialiser le mot de passe après vérification du code"""
#     token = request.data.get('token')
#     email = request.data.get('email')
#     new_password = request.data.get('new_password')
#     confirm_password = request.data.get('confirm_password')
    
#     # Vérifier le token de session
#     session_token = request.session.get('reset_token')
#     session_email = request.session.get('reset_email')
    
#     if not session_token or not session_email:
#         return Response({"message": "Session expirée. Veuillez recommencer."}, status=400)
    
#     if session_token != token or session_email != email:
#         return Response({"message": "Token invalide"}, status=400)
    
#     if new_password != confirm_password:
#         return Response({"message": "Les mots de passe ne correspondent pas"}, status=400)
    
#     if len(new_password) < 6:
#         return Response({"message": "Le mot de passe doit contenir au moins 6 caractères"}, status=400)
    
#     try:
#         # Chercher l'utilisateur
#         user = None
#         try:
#             user = Talent.objects.get(email=email)
#         except Talent.DoesNotExist:
#             try:
#                 user = Recruteur.objects.get(email=email)
#             except Recruteur.DoesNotExist:
#                 pass
        
#         if not user:
#             return Response({"message": "Utilisateur non trouvé"}, status=404)
        
#         # Mettre à jour le mot de passe
#         user.password = make_password(new_password)
#         user.save()
        
#         # Nettoyer la session
#         del request.session['reset_token']
#         del request.session['reset_email']
        
#         return Response({"message": "Mot de passe réinitialisé avec succès"}, status=200)
        
#     except Exception as e:
#         return Response({"message": f"Erreur: {str(e)}"}, status=500)

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from django.core.mail import EmailMessage

# @api_view(['POST'])
# def sendmail(request):
#     file = request.FILES.get("file")
#     user = request.user
#     forum_nom = request.data.get("forum_nom")
#     print(forum_nom)
#     # Sujet dynamique
#     subject = f"Registration Confirmed for Forum: {forum_nom}"

#     body_html = f"""
#     <html>
#     <body>
#         <p style="color: #1F2937; font-size: 16px;">
#             Hello <strong>{user.last_name} {user.first_name}</strong>,
#         </p>
#         <p style="color: #008000; font-size: 16px;">
#             Your registration for the forum <strong>{forum_nom}</strong> has been successfully recorded ✅
#         </p>
#         <p style="color: #374151; font-size: 14px;">
#             Please find attached a PDF containing all the necessary details.
#         </p>
#         <p style="color: #DC2626; font-weight: bold;">
#             Don't forget to attend the event on the scheduled day.
#         </p>
#         <p style="color: #6B7280; font-size: 14px;">
#             Best regards,<br>
#             JobGate
#         </p>
#     </body>
#     </html>
#     """


#     # Création de l'email
#     email = EmailMessage(
#         subject,
#         "",  # texte brut vide ou tu peux mettre un résumé simple
#         from_email="noreply@monsite.com",
#         to=[user.email],
#     )

#     # Indiquer que le corps est en HTML
#     email.content_subtype = "html"
#     email.body = body_html

#     # Attacher le fichier PDF si présent
#     if file:
#         email.attach(file.name, file.read(), file.content_type)

#     # Envoyer l'email
#     email.send()

#     return Response("Email envoyé avec succès")

# from datetime import date,timedelta
# def list_forums_candidature_demain(request):
#     aujourdhui = date.today() + timedelta(days=1)
#     forums = Forum.objects.filter(date_forum=aujourdhui)
    
#     # Récupérer toutes les candidatures en une seule requête
#     forum_ids = forums.values_list('id', flat=True)
#     candidatures = Candidature_forum.objects.filter(forum_id__in=forum_ids)
    
#     for cand in candidatures:
#         subject = f"📅 REMINDER: Forum {cand.forum.nom} Tomorrow!"

#         body_html = f"""
#         <html>
#         <head>
#             <style>
#             body {{
#                 font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
#                 line-height: 1.6;
#                 color: #333;
#                 max-width: 600px;
#                 margin: 0 auto;
#                 padding: 20px;
#             }}
#             .header {{
#                 background-color: #2563EB;
#                 color: white;
#                 padding: 20px;
#                 text-align: center;
#                 border-radius: 8px 8px 0 0;
#             }}
#             .content {{
#                 background-color: #F9FAFB;
#                 padding: 20px;
#                 border-radius: 0 0 8px 8px;
#             }}
#             .important {{
#                 background-color: #FEF3C7;
#                 padding: 15px;
#                 border-left: 4px solid #D97706;
#                 margin: 15px 0;
#                 border-radius: 4px;
#             }}
#             .footer {{
#                 margin-top: 20px;
#                 padding-top: 20px;
#                 border-top: 1px solid #E5E7EB;
#                 color: #6B7280;
#                 font-size: 14px;
#             }}
#             .button {{
#                 display: inline-block;
#                 background-color: #2563EB;
#                 color: white;
#                 padding: 12px 24px;
#                 text-decoration: none;
#                 border-radius: 6px;
#                 margin: 15px 0;
#             }}
#             </style>
#         </head>
#         <body>
#             <div class="header">
#             <h1>📅 Important Reminder</h1>
#             </div>
            
#             <div class="content">
#             <p>Hello <strong>{cand.first_name} {cand.last_name}</strong>,</p>
            
#             <p>This is a reminder that the forum <strong>{cand.forum.nom}</strong> will take place <strong>tomorrow</strong>!</p>
            
#             <div class="important">
#                 <h3>🗓️ Event Details:</h3>
#                 <p><strong>Date:</strong> {cand.forum.date_forum}</p>
#                 <p><strong>Location:</strong> {cand.forum.lieu}</p>
#             </div>
            
#             <p>Get ready and be prepared to meet recruiters from top companies!</p>
            
#             <p>We recommend:</p>
#             <ul>
#                 <li>👔 Wearing professional attire</li>
#                 <li>⏰ Arriving 15 minutes early</li>
#             </ul>       
#             <p>We look forward to seeing you tomorrow!</p>
#             </div>
            
#             <div class="footer">
#             <p>Best regards,<br>
#             <strong>The JobGate Team</strong></p>
#             <p><em>This email was sent automatically, please do not reply.</em></p>
#             </div>
#         </body>
#         </html>
#         """

#         text_content = f"""
#         REMINDER: Forum {cand.forum.nom} Tomorrow!

#         Hello {cand.first_name} {cand.last_name},

#         This is a reminder that the forum {cand.forum.nom} will take place tomorrow!

#         Event Details:
#         - Date: {cand.forum.date_forum}
#         - Location: {cand.forum.lieu}

#         Be prepared to meet recruiters!

#         Recommendations:
#         - Wear professional attire
#         - Arrive 15 minutes early

#         Best regards,
#         The JobGate Team
#         """

#                 # Créer et envoyer l'email
            
#         email = EmailMessage(
#             subject,
#             body_html,
#             from_email="noreply@jobgate.com",
#             to=[cand.email],
#         )
#         email.content_subtype = "html"
#         email.send()

#     return Response(f"Emails de rappel envoyés avec succès à {candidatures.count()} candidats")

# @api_view(["POST"])
# def user_conn(request):
#     user = request.user
#     if isinstance(user, Talent):
#             data = {
#                 "id": user.id,
#                 "role": "talent",
#                 "email": user.email,
#                 "first_name": user.first_name,
#                 "last_name": user.last_name,
#             }
#     elif isinstance(user, Recruteur):
#             data = {
#                 "id": user.id,
#                 "role": "recruteur",
#                 "email": user.email,
#                 "first_name": user.first_name,
#                 "last_name": user.last_name,
#                 "entreprise": user.entreprise,
#             }
#     else:
#             return Response({"detail": "Utilisateur inconnu"}, status=400)
#     return JsonResponse(data,safe=False)


# from io import BytesIO
# from reportlab.lib.pagesizes import A4
# from reportlab.lib.units import cm
# from reportlab.pdfgen import canvas


# def generate_confirmation_pdf(candidature, forum):
#     """Genere un PDF recapitulatif de l'inscription a un forum."""
#     buffer = BytesIO()
#     pdf = canvas.Canvas(buffer, pagesize=A4)
#     width, height = A4

#     pdf.setFillColorRGB(0.31, 0.27, 0.90)  # couleur primary (#4f46e5)
#     pdf.setFont("Helvetica-Bold", 20)
#     pdf.drawString(2 * cm, height - 3 * cm, "Confirmation d'inscription")

#     pdf.setFillColorRGB(0, 0, 0)
#     pdf.setFont("Helvetica", 12)
#     y = height - 5 * cm
#     line_height = 0.8 * cm

#     lines = [
#         f"Forum : {forum.nom}",
#         f"Date : {forum.date_forum}",
#         f"Lieu : {forum.lieu}",
#     ]
#     if candidature.event_horaire:
#         lines.append(f"Creneau horaire : {candidature.event_horaire}")
#     lines += [
#         "",
#         f"Candidat : {candidature.first_name} {candidature.last_name}",
#         f"Email : {candidature.email}",
#     ]

#     for line in lines:
#         pdf.drawString(2 * cm, y, line)
#         y -= line_height

#     pdf.setFont("Helvetica-Oblique", 10)
#     pdf.drawString(2 * cm, 2 * cm, "Merci de vous presenter le jour du forum avec ce document.")

#     pdf.showPage()
#     pdf.save()
#     buffer.seek(0)
#     return buffer


# def send_confirmation_email(candidature, forum):
#     """Envoie un email de confirmation d'inscription avec un PDF en piece jointe."""
#     pdf_buffer = generate_confirmation_pdf(candidature, forum)

#     subject = f"Inscription confirmee - {forum.nom}"
#     body_html = f"""
#     <html>
#     <body>
#         <p style="color: #1F2937; font-size: 16px;">
#             Bonjour <strong>{candidature.first_name} {candidature.last_name}</strong>,
#         </p>
#         <p style="color: #16A34A; font-size: 16px;">
#             Votre inscription au forum <strong>{forum.nom}</strong> a bien ete enregistree
#         </p>
#         <p style="color: #374151; font-size: 14px;">
#             Vous trouverez en piece jointe un PDF recapitulant les details de votre inscription.
#         </p>
#         <p style="color: #DC2626; font-weight: bold;">
#             Pensez a vous presenter le jour de l'evenement.
#         </p>
#         <p style="color: #6B7280; font-size: 14px;">
#             Cordialement,<br>
#             L'equipe JobGate
#         </p>
#     </body>
#     </html>
#     """

#     email = EmailMessage(
#         subject,
#         body_html,
#         from_email="noreply@jobgate.com",
#         to=[candidature.email],
#     )
#     email.content_subtype = "html"
#     email.attach(
#         f"confirmation_{forum.nom}.pdf",
#         pdf_buffer.read(),
#         "application/pdf",
#     )
#     email.send(fail_silently=True)


# #Remplir Candidature
# @api_view(['POST'])
# def InscriptionForum(request):

#     user = request.user
#     forum = Forum.objects.get(nom=request.data.get("forum_nom"))
#     if user.is_authenticated :
#         if forum.duree == 0 :
#             Candidature = Candidature_forum(
#                 talent_id = user.id,
#                 forum_id = forum.id,
#                 first_name = user.first_name,
#                 last_name = user.last_name,
#                 email = user.email,
#                 cv = user.cv,
#                 numero_telephone = user.numero_telephone,
#                 image = user.image,
#             )
#         else :
#             Candidature = Candidature_forum(
#                 talent_id = user.id,
#                 forum_id = forum.id,
#                 first_name = user.first_name,
#                 last_name = user.last_name,
#                 email = user.email,
#                 cv = user.cv,
#                 numero_telephone = user.numero_telephone,
#                 image = user.image,
#                 event_horaire = request.data.get("horaire")
#             )

#         Candidature.save()

#         # Envoi de l'email de confirmation avec le PDF en piece jointe.
#         # Encapsule dans un try/except pour ne jamais faire echouer
#         # l'inscription si l'envoi d'email pose probleme (SMTP down, etc.)
#         try:
#             send_confirmation_email(Candidature, forum)
#         except Exception as e:
#             print(f"Erreur lors de l'envoi de l'email de confirmation: {e}")

#         serializer = CandidatureforumSerializer(Candidature)
#         return JsonResponse({"message": "Candidature creee !!", "data": serializer.data}, status=200)
#     return Response("Talent non connecte !!",status=400)

    
# @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# def create_forum(request):
   
#         data = request.data

#         # # Récupération de l'université associée
        
    
#         # Génération du QR code avec un lien d'inscription par exemple
#         # qr = qrcode.QRCode(version=1, box_size=10, border=5)
#         # qr_data = f"http://localhost:3000/forums/{data.get('nom').replace(' ', '_')}"
#         # qr.add_data(qr_data)
#         # qr.make(fit=True)
#         # img = qr.make_image(fill='black', back_color='white')

#         # # Sauvegarde de l'image en mémoire
#         # buffer = BytesIO()
#         # img.save(buffer, format="PNG")
#         # file_name = f"{data.get('nom')}_qrcode.png"

#         # Création du forum

#         # recruteurs_list = json.loads(request.POST.get('recruteurs'))
#         # return JsonResponse(type(recruteurs_list), status=200, safe=False)

#         forum = Forum(
#             nom=data.get("nom"),
#             date_forum=data.get("date_forum"),
#             lieu=data.get("lieu"),
#             description=data.get("description"),
#             recruteurs=data.get("recruteurs"),
#             nombre_max=data.get("nombre_max"),
#             date_debut=data.get("date_debut"),
#             date_fin=data.get("date_fin"),
#             duree=data.get("duree"),
#             qrcode=request.FILES.get("qrcode"),
#         )


#         # Ajouter le QR code
#         # forum.qrcode_img.save(file_name, ContentFile(buffer.getvalue()))
#         forum.save()

#         # # serializer = ForumSerializer(data=request.data)
#         # if serializer.is_valid():
#         #         serializer.save()

#         return Response(status=status.HTTP_201_CREATED)
#         # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     # except Universite.DoesNotExist:
#     #     return Response({"error": "Université introuvable"}, status=status.HTTP_400_BAD_REQUEST)
#     # except Exception as e:
#     #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# from .serializers import ForumSerializer, RecruteurSerializer
# from rest_framework.decorators import permission_classes
# import json; 

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_data_rec(request):
#     user = request.user
#     queryset = Recruteur.objects.filter(entreprise = user.entreprise)
#     serializer = RecruteurSerializer(queryset, many=True)
#     return JsonResponse(serializer.data, safe=False)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def list_forums(request):
#     user = request.user
#     print(user)    
#     if isinstance(user, Recruteur):
#         forums = Forum.objects.filter(
#             recruteurs__contains=[user.id]
#         ).order_by('-date_forum')
#     serializer = ForumSerializer(forums, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)



# def get_data_candidature(request):
#     queryset = Candidature_forum.objects.all()
#     serializer = CandidatureforumSerializer(queryset, many=True)  # Sérialise plusieurs objets
#     return JsonResponse(serializer.data, safe=False)     

# @api_view(['GET'])
# def get_data_candidature_forum(request):
#     forum_id = request.query_params.get('forum_id')
#     candidatures = Candidature_forum.objects.all()
#     forum = Forum.objects.get(id=forum_id)


#     # 🔹 On filtre uniquement si forum_id existe
#     if forum_id:
#        forum_id = int(forum_id)  # s'assurer que c'est un entier
#        candidatures = candidatures.filter(forum_id=forum_id)
       
#     forum_data = ForumSerializer(forum).data
#     cand_data = CandidatureforumSerializer(candidatures, many=True).data

#     return Response({
#         "forum": forum_data,
#         "candidatures": cand_data
#     })


# @api_view(['GET'])
# def list_forums_talent(request):
#     forums = Forum.objects.all().order_by('-date_forum')  # les forums récents d'abord
#     serializer = ForumSerializer(forums, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)



# @api_view(["POST"])
# def add_feedback(request):
#     try:
#         feeback = Feedback_candidat(
#             note = request.data.get("note"),
#             annotation_candidat=request.data.get("annotation_candidat"),
#             candidature_id=request.data.get("candidature_id"),
#             etat = request.data.get("etat")
#         )
#         feeback.save()
#         return Response("Feedback crée",status=200)
#     except :
#         return Response("Feedback non crée",status=400)
    

# @api_view(["PUT"])
# def alter_presence(request,candidature_id):
#     candidature = Candidature_forum.objects.get(id=candidature_id)
#     candidature.presence = not candidature.presence
#     candidature.save()
#     return Response("Candidature modifie")  



# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Forum, Candidature_forum, Feedback_candidat, Archive_forum, Archive_Candidat, Recruteur

# # @api_view(["POST"])

# # def archive_old_forums_Cands(request):
# #     forum_id = request.data.get("forum_id")
    
# #     # Vérifier que le forum existe
# #     try:
# #         old_forum = Forum.objects.get(id=forum_id)
# #     except Forum.DoesNotExist:
# #         return Response({"error": "Forum introuvable"}, status=404)
    

# #     # Créer l'archive du forum
# #     def truncate_field(value, max_length):
# #         if value and len(str(value)) > max_length:
# #             return str(value)[:max_length]
# #         return value

# #     archive_forum = Archive_forum.objects.create(
# #         nom=truncate_field(old_forum.nom, 255),
# #         date_forum=old_forum.date_forum,
# #         lieu=truncate_field(old_forum.lieu, 100),
# #         description=truncate_field(old_forum.description, 255),
# #         recruteurs=old_forum.recruteurs or [],
# #         nombre_max=old_forum.nombre_max,
# #         qrcode=old_forum.qrcode,
# #         date_debut=old_forum.date_debut,
# #         date_fin=old_forum.date_fin,
# #         duree=old_forum.duree,
# #         currentNumber=Candidature_forum.objects.filter(forum_id=old_forum.id).count(),
# #         entreprise=truncate_field(Recruteur.objects.get(id=old_forum.recruteurs[0]).entreprise, 150)
# #     )
# #     archive_forum.save()
   
    

# #     list_cand = Candidature_forum.objects.filter(forum_id=forum_id)
# #     for cand in list_cand:
# #         feedback = Feedback_candidat.objects.filter(candidature=cand).first()
         
# #         archive_cand=Archive_Candidat.objects.create(
# #         talent_id=cand.talent.id if cand.talent else None,
# #         forum_id=forum_id,
# #         first_name=truncate_field(cand.first_name, 100),
# #         last_name=truncate_field(cand.last_name, 100),
# #         email=truncate_field(cand.email, 150),
# #         cv=cand.cv,
# #         numero_telephone=truncate_field(cand.numero_telephone, 100),
# #         image=cand.image,
# #         presence=cand.presence,
# #         event_horaire=truncate_field(cand.event_horaire, 255),
# #         date_inscri=cand.date_inscri,
# #         note=truncate_field(feedback.note, 255) if feedback and feedback.note else None,
# #         annotation_candidat=feedback.annotation_candidat if feedback else None,
# #         etat=truncate_field(feedback.etat, 100) if feedback and feedback.etat else None,
# #         )
# #         archive_cand.save()
# #         print("Hello")


# #             # Supprimer le feedback et la candidature originale
# #         if feedback:
# #             feedback.delete()
# #         cand.delete()

# #         # Supprimer le forum original
# #         old_forum.delete()

# #         return Response({"message": "Forum et candidatures archivés avec succès"})

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from datetime import datetime
# from django.utils.timezone import now

# # Fonction utilitaire pour tronquer les champs
# def truncate_field(value, max_length):
#     if value is not None and len(str(value)) > max_length:
#         return str(value)[:max_length]
#     return value

# @api_view(["POST"])
# def archive_old_forums_Cands(request):
#     forum_id = request.data.get("forum_id")
#     try:
#         old_forum = Forum.objects.get(id=forum_id)
#     except Forum.DoesNotExist:
#         return Response({"error": "Forum introuvable"}, status=404)

#     # Récupérer currentNumber et entreprise
#     current_number = Candidature_forum.objects.filter(forum_id=old_forum.id).count()
#     entreprise = None
#     if old_forum.recruteurs:
#         try:
#             entreprise = Recruteur.objects.get(id=old_forum.recruteurs[0]).entreprise
#         except Recruteur.DoesNotExist:
#             entreprise = None

#     # Créer l'archive du forum avec tronquage
#     archive_forum = Archive_forum.objects.create(
#         forum_id=forum_id,
#         nom=truncate_field(old_forum.nom, 255),
#         date_forum=old_forum.date_forum,
#         lieu=truncate_field(old_forum.lieu, 100),
#         description=truncate_field(old_forum.description, 255),
#         recruteurs=old_forum.recruteurs or [],
#         nombre_max=old_forum.nombre_max,
#         qrcode=old_forum.qrcode,
#         date_debut=old_forum.date_debut,
#         date_fin=old_forum.date_fin,
#         duree=old_forum.duree,
#         currentNumber=current_number,
#         entreprise=truncate_field(entreprise, 150) if entreprise else None,
#     )
#     archive_forum.save()

#     # Archiver les candidats
#     list_cand_to_delete = Candidature_forum.objects.filter(forum_id=forum_id).exclude(presence=True)
   
#     list_cand_to_delete.delete() # déjà filtré

#     list_cand = Candidature_forum.objects.filter(forum_id=forum_id)

#     for cand in list_cand:
#         feedback = Feedback_candidat.objects.filter(candidature=cand).first()

#         archive_cand = Archive_Candidat.objects.create(
#             talent_id=cand.talent.id if cand.talent else None,
#             forum_id=forum_id,
#             first_name=truncate_field(cand.first_name, 100),
#             last_name=truncate_field(cand.last_name, 100),
#             email=truncate_field(cand.email, 150),
#             cv=cand.cv,  # si le chemin est trop long, penser à augmenter max_length du FileField
#             numero_telephone=truncate_field(cand.numero_telephone, 100),
#             image=cand.image,  # idem que cv
#             presence=cand.presence,
#             event_horaire=truncate_field(cand.event_horaire, 255),
#             date_inscri=cand.date_inscri,
#             note=truncate_field(feedback.note, 255) if feedback and feedback.note else None,
#             annotation_candidat=feedback.annotation_candidat if feedback else None,
#             etat=truncate_field(feedback.etat, 100) if feedback and feedback.etat else None,
#         )
#         archive_cand.save()

#         # Supprimer les données originales
#         if feedback:
#             feedback.delete()
#         cand.delete()

#     # Supprimer le forum original
#     old_forum.delete()

#     return Response({"message": "Forum et candidatures archivés avec succès"})


# # def archive_old_forums_Cands(request):
# #     forum_id = request.data.get("forum_id")
# #     old_forum = Forum.objects.get(id=forum_id)

# #     list_cand = Candidature_forum.objects.filter(forum_id=forum_id)
    
# #     for cand in list_cand:
# #         Archive_talent.objects.create(candidature_id=cand.id)
# #         cand.delete()
    
   
# #     Archive_forum.objects.create(forum=old_forum)
    
# #     old_forum.delete()
    
# #     return Response("Forum archivé avec succès")

# # views.py
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Feedback_candidat, Candidature_forum
# from .serializers import FeedbackSerializer

# @api_view(['GET'])
# def get_data_feedback(request):
#     forum_id = request.query_params.get('forum_id')
#     forum = Forum.objects.get(id=forum_id)

#     if not forum_id:
#         forum = Forum.objects.get.All()
#         forum_data = ForumSerializer(forum).data
#         return Response(forum_data)

#     try:
#         forum_id = int(forum_id)
#     except ValueError:
#         return Response({"error": "forum_id invalide"}, status=400)

#     candidatures = Candidature_forum.objects.filter(forum_id=forum_id)

#     forum_data = ForumSerializer(forum).data
     

#     feedbacks = Feedback_candidat.objects.filter(
#     candidature__in=candidatures,             # filtre sur les candidatures
#     etat__in=["Strongly yes", "Yes"]     # filtre sur les réponses désirées
#     ).annotate(
#         priority=Case(
#             When(etat="Strongly yes", then=Value(1)),
#             When(etat="Yes", then=Value(2)),
#             output_field=IntegerField(),
#         )
#     ).order_by("priority")

#     feedbacks_No = Feedback_candidat.objects.filter(
#         candidature__in=candidatures,
#         etat__in=["No"]
#     )   

#     feed_data = FeedbackSerializer(feedbacks, many=True).data
#     count_strongly_yes = feedbacks.filter(etat="Strongly yes").count()
#     count_yes = feedbacks.filter(etat="Yes").count()
#     count_no = feedbacks_No.count()


#     print(count_no)

#     return Response({
#         "forum": forum_data,
#         "feedbacks":feed_data,
#         "stats": {
#             "strongly_yes": count_strongly_yes,
#             "yes": count_yes,
#             "no": count_no,
#             "treated_total": count_strongly_yes + count_yes,
#             "untreated_total": count_no
#         }
#     })

# def get_data_feedback_statistics(request):
#     queryset = Feedback_candidat.objects.all()
#     serializer = FeedbackSerializer(queryset, many=True)  # Sérialise plusieurs objets
#     return JsonResponse(serializer.data, safe=False)

# @api_view(['GET'])
# def get_data_candidature_forum_statistics(request):
#     forum_id = request.query_params.get('forum_id')
#     candidatures = Candidature_forum.objects.all()

#     # 🔹 On filtre uniquement si forum_id existe
#     if forum_id:
#        forum_id = int(forum_id)  # s'assurer que c'est un entier
#        candidatures = candidatures.filter(forum_id=forum_id)
       
#     serializer = CandidatureforumSerializer(candidatures, many=True)
#     return Response(serializer.data)

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Archive_forum, Archive_Candidat
# from .serializers import ArchiveForumSerializer, ArchiveCandidatSerializer

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_archive_forums(request):
#     user = request.user
#     print(user)    
#     if isinstance(user, Recruteur):
#         forums = Archive_forum.objects.filter(
#             recruteurs__contains=[user.id]
#         )
#     serializer = ArchiveForumSerializer(forums, many=True)
#     return Response(serializer.data, status=status.HTTP_200_OK)


# @api_view(["GET"])
# def get_archive_candidats(request):
#     candidats = Archive_Candidat.objects.all()
#     serializer = ArchiveCandidatSerializer(candidats, many=True)
#     return Response(serializer.data)




from email.message import EmailMessage
import os
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.core.mail import BadHeaderError, send_mail
from App.backends import MultiUserJWTAuthentication,MultiUserBackend
from django.db.models import Q
from django.contrib.auth import get_user_model

import random
import string
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers,status
from rest_framework.views import APIView
from rest_framework.decorators import api_view,permission_classes
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from .models import Talent,Recruteur,Candidature_forum
from django.forms.models import model_to_dict

import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework import status
from .models import Forum, Feedback_candidat,Archive_Candidat, Archive_forum
from .serializers import FeedbackSerializer, ForumSerializer,CandidatureforumSerializer
from django.core import serializers
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Talent, Recruteur
from rest_framework.permissions import AllowAny
from django.db.models import Case, When, Value, IntegerField


@api_view(['POST'])
def signup(request):
    first_name = request.POST.get("first_name")
    last_name = request.POST.get("last_name")
    email = request.POST.get("email")
    numero_telephone = request.POST.get("numero_telephone")
    password = request.POST.get("password")
    cv = request.FILES.get("cv")
    if cv is None:
        recruteur = Recruteur(
            first_name=request.data.get('first_name'),
            last_name=request.data.get('last_name'),
            email=request.data.get('email'),
            entreprise=request.data.get('Entreprise'),
            numero_telephone = request.data.get("numero_telephone"),
            image = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
            password=make_password(request.data.get('password')),
        )
        recruteur.save()
        return JsonResponse({"message": "Recruteur créé avec succès"})
    else:
        talent = Talent(
            first_name=first_name,
            last_name=last_name,
            email=email,
            image = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
            numero_telephone=numero_telephone,
            password=make_password(password),
            cv=cv,
        )
        talent.save()
        return JsonResponse({"message": "Talent créé avec succès"})

def create_jwt_token_for_user(user):
    """
    Crée un token JWT pour n'importe quel modèle d'utilisateur
    """
    refresh = RefreshToken()
    refresh['email'] = user.email
    
    try:
        Talent.objects.get(email=user.email)
        refresh['user_type'] = 'talent'
    except Talent.DoesNotExist:
        refresh['user_type'] = 'recruteur'
    
    return refresh

class AuthentificationUsers(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError("Identifiants invalides.")

        refresh = create_jwt_token_for_user(user)
        user_type = refresh['user_type']

        if user_type == "talent":
            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_type": user_type,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    
                }
            }
        if user_type == "recruteur":
            data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_type": user_type,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "entreprise":user.entreprise
                }
            }
        return Response(data, status=status.HTTP_200_OK)




# @api_view(['POST'])
# def forgot_password(request):
#     """Endpoint pour demander la réinitialisation du mot de passe"""
#     email = request.data.get('email')
    
#     print(f"=== REQUÊTE REÇUE ===")
#     print(f"Email: {email}")
    
#     if not email:
#         return Response({"message": "L'email est requis"}, status=400)
    
#     # Générer un token unique
#     token = ''.join(random.choices(string.ascii_letters + string.digits, k=50))
    
#     # Sauvegarder le token (en mémoire pour l'instant)
#     # Dans un vrai projet, sauvegardez dans un modèle ResetPasswordToken
#     request.session['reset_token'] = token
#     request.session['reset_email'] = email
#     request.session.set_expiry(3600)  # Expire dans 1 heure
    
#     # Créer le lien de réinitialisation
#     reset_link = f"http://localhost:3001/reset-password?token={token}&email={email}"
    
#     print(f"Lien de réinitialisation: {reset_link}")
    
#     # Version simplifiée - retourne le lien (pour le développement)
#     return Response({
#         "message": f"Un lien de réinitialisation a été envoyé à {email}",
#         "reset_link": reset_link,  # Pour le développement
#         "success": True
#     }, status=200)


# @api_view(['POST'])
# def reset_password(request):
    # """Endpoint pour réinitialiser le mot de passe avec un token"""
    # token = request.data.get('token')
    # email = request.data.get('email')
    # new_password = request.data.get('new_password')
    # confirm_password = request.data.get('confirm_password')
    
    # print(f"=== RESET PASSWORD REÇU ===")
    # print(f"Token: {token}")
    # print(f"Email: {email}")
    
    # # Vérifications
    # if not token or not email or not new_password:
    #     return Response({"message": "Tous les champs sont requis"}, status=400)
    
    # if new_password != confirm_password:
    #     return Response({"message": "Les mots de passe ne correspondent pas"}, status=400)
    
    # if len(new_password) < 6:
    #     return Response({"message": "Le mot de passe doit contenir au moins 6 caractères"}, status=400)
    
    # # Pour le développement, on accepte n'importe quel token
    # # En production, vérifiez dans la base de données
    
    # try:
    #     # Chercher l'utilisateur
    #     user = None
    #     try:
    #         user = Talent.objects.get(email=email)
    #         print(f"Talent trouvé: {user.email}")
    #     except Talent.DoesNotExist:
    #         try:
    #             user = Recruteur.objects.get(email=email)
    #             print(f"Recruteur trouvé: {user.email}")
    #         except Recruteur.DoesNotExist:
    #             pass
        
    #     if not user:
    #         return Response({"message": "Utilisateur non trouvé"}, status=404)
        
    #     # Mettre à jour le mot de passe
    #     user.password = make_password(new_password)
    #     user.save()
        
    #     print(f"Mot de passe réinitialisé avec succès pour: {email}")
        
    #     return Response({"message": "Mot de passe réinitialisé avec succès"}, status=200)
        
    # except Exception as e:
    #     print(f"Erreur dans reset_password: {e}")
    #     return Response({"message": f"Erreur: {str(e)}"}, status=500)


import random
import string
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import Talent, Recruteur, PasswordResetCode

# Dictionnaire pour stocker les codes de vérification (en mémoire)
from datetime import datetime, timedelta

from django.utils import timezone

@api_view(['POST'])
def send_verification_code(request):
    """Envoyer un code de vérification par email"""
    email = request.data.get('email')
    
    if not email:
        return Response({"message": "L'email est requis"}, status=400)
    
    # Vérifier si l'utilisateur existe (optionnel)
    user_exists = Talent.objects.filter(email=email).exists() or Recruteur.objects.filter(email=email).exists()
    if not user_exists:
        return Response({
            "message": "Si un compte existe avec cet email, vous recevrez un code de vérification"
        }, status=200)
    
    # Générer un code à 6 chiffres
    code = ''.join(random.choices(string.digits, k=6))
    
    # Stocker le code en mémoire
    PasswordResetCode.objects.filter(email=email, verified=False).delete()
    PasswordResetCode.objects.create(email=email, code=code)
    
    # Nettoyer les anciens codes (plus de 10 minutes)
    PasswordResetCode.objects.filter(created_at__lt=timezone.now() - timedelta(minutes=10)).delete()
    
    # Afficher le code dans la console (pour le développement)
    print(f"\n" + "="*50)
    print(f"🔐 CODE DE VÉRIFICATION")
    print(f"📧 Email: {email}")
    print(f"🔢 Code: {code}")
    print(f"⏰ Valable 10 minutes")
    print("="*50 + "\n")
    
    # Essayer d'envoyer l'email
    try:
        send_mail(
            'Code de vérification - JobGate',
            f'Votre code de vérification est : {code}\n\nCe code est valable 10 minutes.\n\nSi vous n\'êtes pas à l\'origine de cette demande, ignorez cet email.\n\nCordialement,\nL\'équipe JobGate',
            settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER or 'noreply@jobgate.com',
            [email],
            fail_silently=False,
        )
        print(f"Code de vérification envoyé à {email}")
    except Exception as exc:
        print(f"Erreur d'envoi du code de vérification à {email}: {exc}")
        return Response({
            "message": "Impossible d'envoyer le code de vérification. Vérifiez la configuration de l'email.",
            "error": str(exc)
        }, status=500)
    
    return Response({
        "message": "Un code de vérification a été envoyé à votre email",
        "email": email
    }, status=200)

@api_view(['POST'])
def verify_code(request):
    email = request.data.get('email')
    code = request.data.get('code')
    print("SESSION KEY:", request.session.session_key)
    print("SESSION DATA:", dict(request.session.items()))
    if not email or not code:
        return Response(
            {"message": "Email et code requis"},
            status=400
        )

    try:
        reset_code = PasswordResetCode.objects.get(
            email=email,
            code=code,
            verified=False
        )

        if reset_code.is_expired():
            return Response(
                {"message": "Code expiré"},
                status=400
            )

        reset_code.verified = True
        temp_token = ''.join(
            random.choices(
                string.ascii_letters + string.digits,
                k=50
            )
        )
        reset_code.reset_token = temp_token
        reset_code.save()

        return Response({
            "message": "Code vérifié avec succès",
            "reset_token": temp_token,
            "email": email
        })

    except PasswordResetCode.DoesNotExist:
        return Response(
            {"message": "Code invalide"},
            status=400
        )

@api_view(['POST'])
def reset_password_with_code(request):
    """Réinitialiser le mot de passe après vérification du code"""
    token = request.data.get('token')
    email = request.data.get('email')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    if not token or not email:
        return Response({"message": "Email et token requis"}, status=400)

    if new_password != confirm_password:
        return Response({"message": "Les mots de passe ne correspondent pas"}, status=400)

    if len(new_password) < 6:
        return Response({"message": "Le mot de passe doit contenir au moins 6 caractères"}, status=400)

    try:
        reset_code = PasswordResetCode.objects.get(
            email=email,
            reset_token=token,
            verified=True
        )

        if reset_code.is_expired():
            return Response({"message": "Le token de réinitialisation a expiré"}, status=400)

        # Chercher l'utilisateur
        user = None
        try:
            user = Talent.objects.get(email=email)
        except Talent.DoesNotExist:
            try:
                user = Recruteur.objects.get(email=email)
            except Recruteur.DoesNotExist:
                pass

        if not user:
            return Response({"message": "Utilisateur non trouvé"}, status=404)

        # Mettre à jour le mot de passe
        user.password = make_password(new_password)
        user.save()

        # Supprimer le code utilisé
        reset_code.delete()

        print(f"✅ Mot de passe réinitialisé avec succès pour: {email}")

        return Response({"message": "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."}, status=200)

    except PasswordResetCode.DoesNotExist:
        return Response({"message": "Token invalide ou code non vérifié"}, status=400)
    except Exception as e:
        print(f"❌ Erreur lors de la réinitialisation: {e}")
        return Response({"message": f"Erreur: {str(e)}"}, status=500)

# @api_view(['POST'])
# def send_verification_code(request):
#     """Envoyer un code de vérification par email"""
#     email = request.data.get('email')
    
#     if not email:
#         return Response({"message": "L'email est requis"}, status=400)
    
#     # Vérifier si l'utilisateur existe
#     user_exists = False
#     try:
#         if Talent.objects.filter(email=email).exists() or Recruteur.objects.filter(email=email).exists():
#             user_exists = True
#     except:
#         pass
    
#     if not user_exists:
#         # Pour des raisons de sécurité, on retourne un message générique
#         return Response({
#             "message": "Si un compte existe avec cet email, vous recevrez un code de vérification"
#         }, status=200)
    
#     # Générer un code à 6 chiffres
#     code = ''.join(random.choices(string.digits, k=6))
    
#     # Sauvegarder le code dans la base de données
#     # Supprimer les anciens codes pour cet email
#     PasswordResetCode.objects.filter(email=email, is_used=False).delete()
    
#     reset_code = PasswordResetCode.objects.create(
#         email=email,
#         code=code
#     )
    
#     # Envoyer l'email avec le code
#     subject = 'Code de vérification - JobGate'
#     message = f"""
# Bonjour,

# Vous avez demandé la réinitialisation de votre mot de passe.

# Votre code de vérification est : {code}

# Ce code est valable pendant 10 minutes.

# Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

# Cordialement,
# L'équipe JobGate
# """
    
#     try:
#         send_mail(
#             subject,
#             message,
#             settings.DEFAULT_FROM_EMAIL or 'noreply@jobgate.com',
#             [email],
#             fail_silently=False,
#         )
#         print(f"Code de vérification envoyé à {email}: {code}")
#     except Exception as e:
#         print(f"Erreur d'envoi: {e}")
    
#     return Response({
#         "message": "Un code de vérification a été envoyé à votre email",
#         "email": email
#     }, status=200)


# @api_view(['POST'])
# def verify_code(request):
#     """Vérifier le code et permettre la réinitialisation"""
#     email = request.data.get('email')
#     code = request.data.get('code')
    
#     if not email or not code:
#         return Response({"message": "Email et code requis"}, status=400)
    
#     try:
#         reset_code = PasswordResetCode.objects.get(email=email, code=code, is_used=False)
        
#         if not reset_code.is_valid():
#             return Response({"message": "Code expiré. Veuillez demander un nouveau code."}, status=400)
        
#         # Marquer le code comme utilisé
#         reset_code.is_used = True
#         reset_code.save()
        
#         # Générer un token temporaire pour la réinitialisation
#         temp_token = ''.join(random.choices(string.ascii_letters + string.digits, k=50))
        
#         # Stocker le token dans la session
#         request.session['reset_token'] = temp_token
#         request.session['reset_email'] = email
#         request.session.set_expiry(600)  # 10 minutes
        
#         return Response({
#             "message": "Code vérifié avec succès",
#             "reset_token": temp_token,
#             "email": email
#         }, status=200)
        
#     except PasswordResetCode.DoesNotExist:
#         return Response({"message": "Code invalide"}, status=400)


# @api_view(['POST'])
# def reset_password_with_code(request):
    """Réinitialiser le mot de passe après vérification du code"""
    token = request.data.get('token')
    email = request.data.get('email')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    # Vérifier le token de session
    session_token = request.session.get('reset_token')
    session_email = request.session.get('reset_email')
    
    if not session_token or not session_email:
        return Response({"message": "Session expirée. Veuillez recommencer."}, status=400)
    
    if session_token != token or session_email != email:
        return Response({"message": "Token invalide"}, status=400)
    
    if new_password != confirm_password:
        return Response({"message": "Les mots de passe ne correspondent pas"}, status=400)
    
    if len(new_password) < 6:
        return Response({"message": "Le mot de passe doit contenir au moins 6 caractères"}, status=400)
    
    try:
        # Chercher l'utilisateur
        user = None
        try:
            user = Talent.objects.get(email=email)
        except Talent.DoesNotExist:
            try:
                user = Recruteur.objects.get(email=email)
            except Recruteur.DoesNotExist:
                pass
        
        if not user:
            return Response({"message": "Utilisateur non trouvé"}, status=404)
        
        # Mettre à jour le mot de passe
        user.password = make_password(new_password)
        user.save()
        
        # Nettoyer la session
        del request.session['reset_token']
        del request.session['reset_email']
        
        return Response({"message": "Mot de passe réinitialisé avec succès"}, status=200)
        
    except Exception as e:
        return Response({"message": f"Erreur: {str(e)}"}, status=500)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import EmailMessage

@api_view(['POST'])
def sendmail(request):
    file = request.FILES.get("file")
    user = request.user
    forum_nom = request.data.get("forum_nom")
    print(forum_nom)
    # Sujet dynamique
    subject = f"Registration Confirmed for Forum: {forum_nom}"

    body_html = f"""
    <html>
    <body>
        <p style="color: #1F2937; font-size: 16px;">
            Hello <strong>{user.last_name} {user.first_name}</strong>,
        </p>
        <p style="color: #008000; font-size: 16px;">
            Your registration for the forum <strong>{forum_nom}</strong> has been successfully recorded ✅
        </p>
        <p style="color: #374151; font-size: 14px;">
            Please find attached a PDF containing all the necessary details.
        </p>
        <p style="color: #DC2626; font-weight: bold;">
            Don't forget to attend the event on the scheduled day.
        </p>
        <p style="color: #6B7280; font-size: 14px;">
            Best regards,<br>
            JobGate
        </p>
    </body>
    </html>
    """


    # Création de l'email
    email = EmailMessage(
        subject,
        "",  # texte brut vide ou tu peux mettre un résumé simple
        from_email="noreply@monsite.com",
        to=[user.email],
    )

    # Indiquer que le corps est en HTML
    email.content_subtype = "html"
    email.body = body_html

    # Attacher le fichier PDF si présent
    if file:
        email.attach(file.name, file.read(), file.content_type)

    # Envoyer l'email
    email.send()

    return Response("Email envoyé avec succès")

from datetime import date,timedelta
def list_forums_candidature_demain(request):
    aujourdhui = date.today() + timedelta(days=1)
    forums = Forum.objects.filter(date_forum=aujourdhui)
    
    # Récupérer toutes les candidatures en une seule requête
    forum_ids = forums.values_list('id', flat=True)
    candidatures = Candidature_forum.objects.filter(forum_id__in=forum_ids)
    
    for cand in candidatures:
        subject = f"📅 REMINDER: Forum {cand.forum.nom} Tomorrow!"

        body_html = f"""
        <html>
        <head>
            <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background-color: #2563EB;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }}
            .content {{
                background-color: #F9FAFB;
                padding: 20px;
                border-radius: 0 0 8px 8px;
            }}
            .important {{
                background-color: #FEF3C7;
                padding: 15px;
                border-left: 4px solid #D97706;
                margin: 15px 0;
                border-radius: 4px;
            }}
            .footer {{
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #E5E7EB;
                color: #6B7280;
                font-size: 14px;
            }}
            .button {{
                display: inline-block;
                background-color: #2563EB;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                margin: 15px 0;
            }}
            </style>
        </head>
        <body>
            <div class="header">
            <h1>📅 Important Reminder</h1>
            </div>
            
            <div class="content">
            <p>Hello <strong>{cand.first_name} {cand.last_name}</strong>,</p>
            
            <p>This is a reminder that the forum <strong>{cand.forum.nom}</strong> will take place <strong>tomorrow</strong>!</p>
            
            <div class="important">
                <h3>🗓️ Event Details:</h3>
                <p><strong>Date:</strong> {cand.forum.date_forum}</p>
                <p><strong>Location:</strong> {cand.forum.lieu}</p>
            </div>
            
            <p>Get ready and be prepared to meet recruiters from top companies!</p>
            
            <p>We recommend:</p>
            <ul>
                <li>👔 Wearing professional attire</li>
                <li>⏰ Arriving 15 minutes early</li>
            </ul>       
            <p>We look forward to seeing you tomorrow!</p>
            </div>
            
            <div class="footer">
            <p>Best regards,<br>
            <strong>The JobGate Team</strong></p>
            <p><em>This email was sent automatically, please do not reply.</em></p>
            </div>
        </body>
        </html>
        """

        text_content = f"""
        REMINDER: Forum {cand.forum.nom} Tomorrow!

        Hello {cand.first_name} {cand.last_name},

        This is a reminder that the forum {cand.forum.nom} will take place tomorrow!

        Event Details:
        - Date: {cand.forum.date_forum}
        - Location: {cand.forum.lieu}

        Be prepared to meet recruiters!

        Recommendations:
        - Wear professional attire
        - Arrive 15 minutes early

        Best regards,
        The JobGate Team
        """

                # Créer et envoyer l'email
            
        email = EmailMessage(
            subject,
            body_html,
            from_email="noreply@jobgate.com",
            to=[cand.email],
        )
        email.content_subtype = "html"
        email.send()

    return Response(f"Emails de rappel envoyés avec succès à {candidatures.count()} candidats")

@api_view(["POST"])
def user_conn(request):
    user = request.user
    if isinstance(user, Talent):
            data = {
                "id": user.id,
                "role": "talent",
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
    elif isinstance(user, Recruteur):
            data = {
                "id": user.id,
                "role": "recruteur",
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "entreprise": user.entreprise,
            }
    else:
            return Response({"detail": "Utilisateur inconnu"}, status=400)
    return JsonResponse(data,safe=False)


from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader, simpleSplit
from reportlab.pdfgen import canvas


# Chemin vers le logo JobGate utilise dans le PDF de confirmation.
# A adapter si le fichier se trouve ailleurs sur le serveur.
LOGO_PATH = os.path.join(settings.BASE_DIR, "App", "static", "img", "logoJG.png")


def generate_confirmation_pdf(candidature, forum):
    """
    Reproduit exactement le design du PDF qui etait genere cote frontend
    (jsPDF, dans l'ancien forum2.jsx) : memes textes, memes couleurs,
    meme mise en page -- mais genere desormais cote serveur.
    """
    buffer = BytesIO()
    page_width_mm, page_height_mm = 210, 297  # A4 en mm (comme jsPDF par defaut)
    pdf = canvas.Canvas(buffer, pagesize=A4)

    margin = 20
    content_width = page_width_mm - 2 * margin

    # Couleurs identiques a celles du jsPDF d'origine
    midnight_blue = (44 / 255, 62 / 255, 80 / 255)
    black = (0, 0, 0)
    light_blue = (1 / 255, 136 / 255, 223 / 255)
    green = (0, 128 / 255, 0)
    red = (1, 0, 0)

    def y(value_mm):
        """Convertit une coordonnee Y 'depuis le haut' (comme jsPDF) en
        coordonnee 'depuis le bas' utilisee nativement par reportlab."""
        return (page_height_mm - value_mm) * mm

    def x(value_mm):
        return value_mm * mm

    # === Logo JobGate (haut gauche) ===
    logo_size = 40
    try:
        pdf.drawImage(
            ImageReader(LOGO_PATH),
            x(0),
            y(-9 + logo_size),
            width=logo_size * mm,
            height=logo_size * mm,
            mask="auto",
        )
    except Exception as exc:
        print(f"Logo PDF introuvable ({LOGO_PATH}): {exc}")

    # === Header ===
    pdf.setFillColorRGB(*midnight_blue)
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawCentredString(x(page_width_mm / 2), y(30), "REGISTRATION CONFIRMATION")

    pdf.setFillColorRGB(*light_blue)
    pdf.setFont("Helvetica", 16)
    pdf.drawCentredString(x(page_width_mm / 2), y(45), "REGISTRATION SUCCESSFUL")

    pdf.setFillColorRGB(*green)
    pdf.setFont("Helvetica", 12)
    pdf.drawCentredString(
        x(page_width_mm / 2), y(55), "Your registration has been successfully recorded"
    )

    pdf.setStrokeColorRGB(*light_blue)
    pdf.setLineWidth(0.5 * mm)
    pdf.line(x(margin), y(65), x(page_width_mm - margin), y(65))

    # === Participant Information ===
    pdf.setFillColorRGB(*midnight_blue)
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(x(margin), y(80), "Participant Information")

    pdf.setStrokeColorRGB(*light_blue)
    pdf.setLineWidth(0.2 * mm)
    pdf.line(x(margin), y(83), x(margin + 80), y(83))

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(x(margin), y(95), "Full Name:")
    pdf.setFont("Helvetica", 12)
    pdf.drawString(x(margin + 35), y(95), f"{candidature.first_name} {candidature.last_name}")

    # === Event Details ===
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(x(margin), y(115), "Event Details")
    pdf.line(x(margin), y(118), x(margin + 85), y(118))

    current_y = 130

    # Entreprise = entreprise du premier recruteur du forum (meme logique
    # que celle deja utilisee dans archive_old_forums_Cands)
    entreprise = None
    if forum.recruteurs:
        try:
            entreprise = Recruteur.objects.get(id=forum.recruteurs[0]).entreprise
        except Recruteur.DoesNotExist:
            entreprise = None

    def field(label, value, label_width):
        nonlocal current_y
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(x(margin), y(current_y), label)
        pdf.setFont("Helvetica", 12)
        pdf.drawString(x(margin + label_width), y(current_y), str(value) if value else "")

    field("Name:", forum.nom or "JobGate Career Forum 2024", 20)
    current_y += 10
    field("Location: ", forum.lieu, 35)
    current_y += 10
    field("Date:", forum.date_forum, 20)
    current_y += 10
    field("Company:", entreprise or "", 35)
    current_y += 10
    field("Time:", f"{forum.date_debut} - {forum.date_fin}", 25)

    if candidature.event_horaire:
        current_y += 10
        field("Slot:", candidature.event_horaire, 25)

    current_y += 10
    field("Organizer:", "JobGate Events", 35)

    # === Event Description ===
    current_y += 20
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(x(margin), y(current_y), "Event Description")
    pdf.line(x(margin), y(current_y + 3), x(margin + 115), y(current_y + 3))

    current_y += 15
    pdf.setFont("Helvetica", 11)
    description = forum.description or (
        "A must-attend event for students and recent graduates seeking "
        "professional opportunities, covering technology, finance, "
        "marketing, and more. Workshops and lectures will be held by "
        "industry experts."
    )
    wrapped_lines = simpleSplit(description, "Helvetica", 11, content_width * mm)
    for line in wrapped_lines:
        pdf.drawString(x(margin), y(current_y), line)
        current_y += 4.5

    # === QR code du forum ===
    qr_size = 30
    qr_x = page_width_mm - margin - qr_size
    qr_y = 130
    if forum.qrcode:
        try:
            forum.qrcode.open("rb")
            qr_image = ImageReader(BytesIO(forum.qrcode.read()))
            pdf.drawImage(
                qr_image,
                x(qr_x),
                y(qr_y + qr_size),
                width=qr_size * mm,
                height=qr_size * mm,
                mask="auto",
            )
            pdf.setFont("Helvetica-Oblique", 10)
            pdf.drawCentredString(
                x(qr_x + qr_size / 2), y(qr_y + qr_size + 5), "Verification Code"
            )
        except Exception as exc:
            print(f"Erreur chargement QR code dans le PDF: {exc}")
        finally:
            try:
                forum.qrcode.close()
            except Exception:
                pass

    # === Phrase rouge en bas de page ===
    pdf.setFillColorRGB(*red)
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawCentredString(
        x(page_width_mm / 2),
        y(page_height_mm - 35),
        "Please arrive 15 minutes before the event starts",
    )

    # === Pied de page : date/heure de generation ===
    now = datetime.now()
    formatted_date = now.strftime("%A, %B %d, %Y")
    formatted_time = now.strftime("%I:%M %p")
    pdf.setFillColorRGB(*black)
    pdf.setFont("Helvetica-Oblique", 10)
    pdf.drawCentredString(
        x(page_width_mm / 2),
        y(page_height_mm - 20),
        f"Document generated on {formatted_date} at {formatted_time}",
    )

    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer


def send_confirmation_email(candidature, forum):
    """Envoie un email de confirmation d'inscription avec le PDF en piece jointe."""
    pdf_buffer = generate_confirmation_pdf(candidature, forum)

    subject = f"Inscription confirmee - {forum.nom}"
    body_html = f"""
    <html>
    <body>
        <p style="color: #1F2937; font-size: 16px;">
            Bonjour <strong>{candidature.first_name} {candidature.last_name}</strong>,
        </p>
        <p style="color: #16A34A; font-size: 16px;">
            Votre inscription au forum <strong>{forum.nom}</strong> a bien ete enregistree
        </p>
        <p style="color: #374151; font-size: 14px;">
            Vous trouverez en piece jointe un PDF recapitulant les details de votre inscription.
        </p>
        <p style="color: #DC2626; font-weight: bold;">
            Pensez a vous presenter le jour de l'evenement.
        </p>
        <p style="color: #6B7280; font-size: 14px;">
            Cordialement,<br>
            L'equipe JobGate
        </p>
    </body>
    </html>
    """

    email = EmailMessage(
        subject,
        body_html,
        from_email="noreply@jobgate.com",
        to=[candidature.email],
    )
    email.content_subtype = "html"
    email.attach(
        f"Confirmation_{candidature.first_name}_{candidature.last_name}_{forum.nom}.pdf",
        pdf_buffer.read(),
        "application/pdf",
    )
    email.send(fail_silently=True)


#Remplir Candidature
@api_view(['POST'])
def InscriptionForum(request):

    user = request.user
    forum = Forum.objects.get(nom=request.data.get("forum_nom"))
    if user.is_authenticated :
        if forum.duree == 0 :
            Candidature = Candidature_forum(
                talent_id = user.id,
                forum_id = forum.id,
                first_name = user.first_name,
                last_name = user.last_name,
                email = user.email,
                cv = user.cv,
                numero_telephone = user.numero_telephone,
                image = user.image,
            )
        else :
            Candidature = Candidature_forum(
                talent_id = user.id,
                forum_id = forum.id,
                first_name = user.first_name,
                last_name = user.last_name,
                email = user.email,
                cv = user.cv,
                numero_telephone = user.numero_telephone,
                image = user.image,
                event_horaire = request.data.get("horaire")
            )

        Candidature.save()

        # Envoi de l'email de confirmation avec le PDF en piece jointe.
        # Encapsule dans un try/except pour ne jamais faire echouer
        # l'inscription si l'envoi d'email pose probleme (SMTP down, etc.)
        try:
            send_confirmation_email(Candidature, forum)
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'email de confirmation: {e}")

        serializer = CandidatureforumSerializer(Candidature)
        return JsonResponse({"message": "Candidature creee !!", "data": serializer.data}, status=200)
    return Response("Talent non connecte !!",status=400)

    
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def create_forum(request):
   
        data = request.data

        # # Récupération de l'université associée
        
    
        # Génération du QR code avec un lien d'inscription par exemple
        # qr = qrcode.QRCode(version=1, box_size=10, border=5)
        # qr_data = f"http://localhost:3000/forums/{data.get('nom').replace(' ', '_')}"
        # qr.add_data(qr_data)
        # qr.make(fit=True)
        # img = qr.make_image(fill='black', back_color='white')

        # # Sauvegarde de l'image en mémoire
        # buffer = BytesIO()
        # img.save(buffer, format="PNG")
        # file_name = f"{data.get('nom')}_qrcode.png"

        # Création du forum

        # recruteurs_list = json.loads(request.POST.get('recruteurs'))
        # return JsonResponse(type(recruteurs_list), status=200, safe=False)

        forum = Forum(
            nom=data.get("nom"),
            date_forum=data.get("date_forum"),
            lieu=data.get("lieu"),
            description=data.get("description"),
            recruteurs=data.get("recruteurs"),
            nombre_max=data.get("nombre_max"),
            date_debut=data.get("date_debut"),
            date_fin=data.get("date_fin"),
            duree=data.get("duree"),
            qrcode=request.FILES.get("qrcode"),
        )


        # Ajouter le QR code
        # forum.qrcode_img.save(file_name, ContentFile(buffer.getvalue()))
        forum.save()

        # # serializer = ForumSerializer(data=request.data)
        # if serializer.is_valid():
        #         serializer.save()

        return Response(status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # except Universite.DoesNotExist:
    #     return Response({"error": "Université introuvable"}, status=status.HTTP_400_BAD_REQUEST)
    # except Exception as e:
    #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from .serializers import ForumSerializer, RecruteurSerializer
from rest_framework.decorators import permission_classes
import json; 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_data_rec(request):
    user = request.user
    queryset = Recruteur.objects.filter(entreprise = user.entreprise)
    serializer = RecruteurSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_forums(request):
    user = request.user
    print(user)    
    if isinstance(user, Recruteur):
        forums = Forum.objects.filter(
            recruteurs__contains=[user.id]
        ).order_by('-date_forum')
    serializer = ForumSerializer(forums, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



def get_data_candidature(request):
    queryset = Candidature_forum.objects.all()
    serializer = CandidatureforumSerializer(queryset, many=True)  # Sérialise plusieurs objets
    return JsonResponse(serializer.data, safe=False)     

@api_view(['GET'])
def get_data_candidature_forum(request):
    forum_id = request.query_params.get('forum_id')
    candidatures = Candidature_forum.objects.all()
    forum = Forum.objects.get(id=forum_id)


    # 🔹 On filtre uniquement si forum_id existe
    if forum_id:
       forum_id = int(forum_id)  # s'assurer que c'est un entier
       candidatures = candidatures.filter(forum_id=forum_id)
       
    forum_data = ForumSerializer(forum).data
    cand_data = CandidatureforumSerializer(candidatures, many=True).data

    return Response({
        "forum": forum_data,
        "candidatures": cand_data
    })


@api_view(['GET'])
def list_forums_talent(request):
    forums = Forum.objects.all().order_by('-date_forum')  # les forums récents d'abord
    serializer = ForumSerializer(forums, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["POST"])
def add_feedback(request):
    try:
        feeback = Feedback_candidat(
            note = request.data.get("note"),
            annotation_candidat=request.data.get("annotation_candidat"),
            candidature_id=request.data.get("candidature_id"),
            etat = request.data.get("etat")
        )
        feeback.save()
        return Response("Feedback crée",status=200)
    except :
        return Response("Feedback non crée",status=400)
    

@api_view(["PUT"])
def alter_presence(request,candidature_id):
    candidature = Candidature_forum.objects.get(id=candidature_id)
    candidature.presence = not candidature.presence
    candidature.save()
    return Response("Candidature modifie")  



from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Forum, Candidature_forum, Feedback_candidat, Archive_forum, Archive_Candidat, Recruteur

# @api_view(["POST"])

# def archive_old_forums_Cands(request):
#     forum_id = request.data.get("forum_id")
    
#     # Vérifier que le forum existe
#     try:
#         old_forum = Forum.objects.get(id=forum_id)
#     except Forum.DoesNotExist:
#         return Response({"error": "Forum introuvable"}, status=404)
    

#     # Créer l'archive du forum
#     def truncate_field(value, max_length):
#         if value and len(str(value)) > max_length:
#             return str(value)[:max_length]
#         return value

#     archive_forum = Archive_forum.objects.create(
#         nom=truncate_field(old_forum.nom, 255),
#         date_forum=old_forum.date_forum,
#         lieu=truncate_field(old_forum.lieu, 100),
#         description=truncate_field(old_forum.description, 255),
#         recruteurs=old_forum.recruteurs or [],
#         nombre_max=old_forum.nombre_max,
#         qrcode=old_forum.qrcode,
#         date_debut=old_forum.date_debut,
#         date_fin=old_forum.date_fin,
#         duree=old_forum.duree,
#         currentNumber=Candidature_forum.objects.filter(forum_id=old_forum.id).count(),
#         entreprise=truncate_field(Recruteur.objects.get(id=old_forum.recruteurs[0]).entreprise, 150)
#     )
#     archive_forum.save()
   
    

#     list_cand = Candidature_forum.objects.filter(forum_id=forum_id)
#     for cand in list_cand:
#         feedback = Feedback_candidat.objects.filter(candidature=cand).first()
         
#         archive_cand=Archive_Candidat.objects.create(
#         talent_id=cand.talent.id if cand.talent else None,
#         forum_id=forum_id,
#         first_name=truncate_field(cand.first_name, 100),
#         last_name=truncate_field(cand.last_name, 100),
#         email=truncate_field(cand.email, 150),
#         cv=cand.cv,
#         numero_telephone=truncate_field(cand.numero_telephone, 100),
#         image=cand.image,
#         presence=cand.presence,
#         event_horaire=truncate_field(cand.event_horaire, 255),
#         date_inscri=cand.date_inscri,
#         note=truncate_field(feedback.note, 255) if feedback and feedback.note else None,
#         annotation_candidat=feedback.annotation_candidat if feedback else None,
#         etat=truncate_field(feedback.etat, 100) if feedback and feedback.etat else None,
#         )
#         archive_cand.save()
#         print("Hello")


#             # Supprimer le feedback et la candidature originale
#         if feedback:
#             feedback.delete()
#         cand.delete()

#         # Supprimer le forum original
#         old_forum.delete()

#         return Response({"message": "Forum et candidatures archivés avec succès"})

from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from django.utils.timezone import now

# Fonction utilitaire pour tronquer les champs
def truncate_field(value, max_length):
    if value is not None and len(str(value)) > max_length:
        return str(value)[:max_length]
    return value

@api_view(["POST"])
def archive_old_forums_Cands(request):
    forum_id = request.data.get("forum_id")
    try:
        old_forum = Forum.objects.get(id=forum_id)
    except Forum.DoesNotExist:
        return Response({"error": "Forum introuvable"}, status=404)

    # Récupérer currentNumber et entreprise
    current_number = Candidature_forum.objects.filter(forum_id=old_forum.id).count()
    entreprise = None
    if old_forum.recruteurs:
        try:
            entreprise = Recruteur.objects.get(id=old_forum.recruteurs[0]).entreprise
        except Recruteur.DoesNotExist:
            entreprise = None

    # Créer l'archive du forum avec tronquage
    archive_forum = Archive_forum.objects.create(
        forum_id=forum_id,
        nom=truncate_field(old_forum.nom, 255),
        date_forum=old_forum.date_forum,
        lieu=truncate_field(old_forum.lieu, 100),
        description=truncate_field(old_forum.description, 255),
        recruteurs=old_forum.recruteurs or [],
        nombre_max=old_forum.nombre_max,
        qrcode=old_forum.qrcode,
        date_debut=old_forum.date_debut,
        date_fin=old_forum.date_fin,
        duree=old_forum.duree,
        currentNumber=current_number,
        entreprise=truncate_field(entreprise, 150) if entreprise else None,
    )
    archive_forum.save()

    # Archiver les candidats
    list_cand_to_delete = Candidature_forum.objects.filter(forum_id=forum_id).exclude(presence=True)
   
    list_cand_to_delete.delete() # déjà filtré

    list_cand = Candidature_forum.objects.filter(forum_id=forum_id)

    for cand in list_cand:
        feedback = Feedback_candidat.objects.filter(candidature=cand).first()

        archive_cand = Archive_Candidat.objects.create(
            talent_id=cand.talent.id if cand.talent else None,
            forum_id=forum_id,
            first_name=truncate_field(cand.first_name, 100),
            last_name=truncate_field(cand.last_name, 100),
            email=truncate_field(cand.email, 150),
            cv=cand.cv,  # si le chemin est trop long, penser à augmenter max_length du FileField
            numero_telephone=truncate_field(cand.numero_telephone, 100),
            image=cand.image,  # idem que cv
            presence=cand.presence,
            event_horaire=truncate_field(cand.event_horaire, 255),
            date_inscri=cand.date_inscri,
            note=truncate_field(feedback.note, 255) if feedback and feedback.note else None,
            annotation_candidat=feedback.annotation_candidat if feedback else None,
            etat=truncate_field(feedback.etat, 100) if feedback and feedback.etat else None,
        )
        archive_cand.save()

        # Supprimer les données originales
        if feedback:
            feedback.delete()
        cand.delete()

    # Supprimer le forum original
    old_forum.delete()

    return Response({"message": "Forum et candidatures archivés avec succès"})


# def archive_old_forums_Cands(request):
#     forum_id = request.data.get("forum_id")
#     old_forum = Forum.objects.get(id=forum_id)

#     list_cand = Candidature_forum.objects.filter(forum_id=forum_id)
    
#     for cand in list_cand:
#         Archive_talent.objects.create(candidature_id=cand.id)
#         cand.delete()
    
   
#     Archive_forum.objects.create(forum=old_forum)
    
#     old_forum.delete()
    
#     return Response("Forum archivé avec succès")

# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Feedback_candidat, Candidature_forum
from .serializers import FeedbackSerializer

@api_view(['GET'])
def get_data_feedback(request):
    forum_id = request.query_params.get('forum_id')
    forum = Forum.objects.get(id=forum_id)

    if not forum_id:
        forum = Forum.objects.get.All()
        forum_data = ForumSerializer(forum).data
        return Response(forum_data)

    try:
        forum_id = int(forum_id)
    except ValueError:
        return Response({"error": "forum_id invalide"}, status=400)

    candidatures = Candidature_forum.objects.filter(forum_id=forum_id)

    forum_data = ForumSerializer(forum).data
     

    feedbacks = Feedback_candidat.objects.filter(
    candidature__in=candidatures,             # filtre sur les candidatures
    etat__in=["Strongly yes", "Yes"]     # filtre sur les réponses désirées
    ).annotate(
        priority=Case(
            When(etat="Strongly yes", then=Value(1)),
            When(etat="Yes", then=Value(2)),
            output_field=IntegerField(),
        )
    ).order_by("priority")

    feedbacks_No = Feedback_candidat.objects.filter(
        candidature__in=candidatures,
        etat__in=["No"]
    )   

    feed_data = FeedbackSerializer(feedbacks, many=True).data
    count_strongly_yes = feedbacks.filter(etat="Strongly yes").count()
    count_yes = feedbacks.filter(etat="Yes").count()
    count_no = feedbacks_No.count()


    print(count_no)

    return Response({
        "forum": forum_data,
        "feedbacks":feed_data,
        "stats": {
            "strongly_yes": count_strongly_yes,
            "yes": count_yes,
            "no": count_no,
            "treated_total": count_strongly_yes + count_yes,
            "untreated_total": count_no
        }
    })

def get_data_feedback_statistics(request):
    queryset = Feedback_candidat.objects.all()
    serializer = FeedbackSerializer(queryset, many=True)  # Sérialise plusieurs objets
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_data_candidature_forum_statistics(request):
    forum_id = request.query_params.get('forum_id')
    candidatures = Candidature_forum.objects.all()

    # 🔹 On filtre uniquement si forum_id existe
    if forum_id:
       forum_id = int(forum_id)  # s'assurer que c'est un entier
       candidatures = candidatures.filter(forum_id=forum_id)
       
    serializer = CandidatureforumSerializer(candidatures, many=True)
    return Response(serializer.data)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Archive_forum, Archive_Candidat
from .serializers import ArchiveForumSerializer, ArchiveCandidatSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_archive_forums(request):
    user = request.user
    print(user)    
    if isinstance(user, Recruteur):
        forums = Archive_forum.objects.filter(
            recruteurs__contains=[user.id]
        )
    serializer = ArchiveForumSerializer(forums, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_archive_candidats(request):
    candidats = Archive_Candidat.objects.all()
    serializer = ArchiveCandidatSerializer(candidats, many=True)
    return Response(serializer.data)