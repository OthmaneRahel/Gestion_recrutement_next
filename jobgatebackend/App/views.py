from email.message import EmailMessage
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from App.backends import MultiUserJWTAuthentication,MultiUserBackend
from django.db.models import Q
from django.contrib.auth import get_user_model


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
            Candidature.save()    
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
        

        serializer = CandidatureforumSerializer(Candidature)
        return JsonResponse({"message": "Candidature créée !!", "data": serializer.data}, status=200)
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

