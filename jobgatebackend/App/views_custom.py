import io
import zipfile
import openpyxl
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count
from django.utils.dateparse import parse_date
from .models import Candidature_forum, Forum, Recruteur

class DashboardStatsView(APIView):
    permission_classes = [AllowAny] # Or IsAuthenticated depending on settings

    def get(self, request):
        forum_id = request.query_params.get('forum_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Base queries
        candidatures = Candidature_forum.objects.all()
        forums = Forum.objects.all()

        # Apply filters
        if forum_id:
            candidatures = candidatures.filter(forum_id=forum_id)
        if start_date:
            candidatures = candidatures.filter(date_inscri__gte=parse_date(start_date))
        if end_date:
            candidatures = candidatures.filter(date_inscri__lte=parse_date(end_date))

        # Metrics
        total_candidats = candidatures.count()
        present_candidats = candidatures.filter(presence=True).count()
        presence_rate = round((present_candidats / total_candidats * 100) if total_candidats > 0 else 0, 1)

        # Inscriptions line chart (by date)
        inscriptions_by_date = candidatures.values('date_inscri').annotate(count=Count('id')).order_by('date_inscri')
        inscriptions_labels = [str(item['date_inscri']) for item in inscriptions_by_date if item['date_inscri']]
        inscriptions_data = [item['count'] for item in inscriptions_by_date if item['date_inscri']]

        # Status pie chart (presence)
        absent_candidats = total_candidats - present_candidats
        status_labels = ['Présent', 'Absent']
        status_data = [present_candidats, absent_candidats]

        # Top forums bar chart
        top_forums = candidatures.values('forum__nom').annotate(count=Count('id')).order_by('-count')[:5]
        top_forums_labels = [item['forum__nom'] for item in top_forums if item['forum__nom']]
        top_forums_data = [item['count'] for item in top_forums if item['forum__nom']]

        return JsonResponse({
            'metrics': {
                'total_candidats': total_candidats,
                'present_candidats': present_candidats,
                'presence_rate': presence_rate,
            },
            'charts': {
                'inscriptions': {
                    'labels': inscriptions_labels,
                    'data': inscriptions_data
                },
                'status': {
                    'labels': status_labels,
                    'data': status_data
                },
                'top_forums': {
                    'labels': top_forums_labels,
                    'data': top_forums_data
                }
            }
        })


class ExportCandidatsExcelView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        candidat_ids = request.data.get('candidat_ids', [])
        candidatures = Candidature_forum.objects.filter(id__in=candidat_ids)

        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.title = "Candidats"

        # Headers
        headers = ["Nom", "Prénom", "Email", "Téléphone", "Forum", "Présence", "Date Inscription"]
        sheet.append(headers)

        for c in candidatures:
            forum_nom = c.forum.nom if c.forum else ""
            presence_str = "Oui" if c.presence else "Non"
            sheet.append([
                c.last_name,
                c.first_name,
                c.email,
                c.numero_telephone,
                forum_nom,
                presence_str,
                str(c.date_inscri)
            ])

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="candidats_export.xlsx"'
        workbook.save(response)
        return response


class ExportCandidatsZipCVView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        candidat_ids = request.data.get('candidat_ids', [])
        candidatures = Candidature_forum.objects.filter(id__in=candidat_ids).exclude(cv__exact='')

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for c in candidatures:
                if c.cv and hasattr(c.cv, 'path'):
                    try:
                        filename = f"{c.first_name}_{c.last_name}_CV.pdf"
                        zip_file.write(c.cv.path, arcname=filename)
                    except Exception as e:
                        # Skip files that don't exist
                        print(f"Failed to zip CV for {c.email}: {e}")

        response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="cv_candidats.zip"'
        return response


class ExportForumsExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not isinstance(user, Recruteur):
            return HttpResponse("Non autorisé", status=403)

        forums = Forum.objects.filter(recruteurs__contains=[user.id]).order_by('-date_forum')

        workbook = openpyxl.Workbook()
        sheet = workbook.active
        sheet.title = "Forums"

        # Headers
        headers = [
            "Nom du Forum", 
            "Date", 
            "Lieu", 
            "Description", 
            "Heure Début", 
            "Heure Fin", 
            "Durée (min)", 
            "Nombre Max Candidats", 
            "Candidats Inscrits"
        ]
        sheet.append(headers)

        for f in forums:
            candidats_inscrits = Candidature_forum.objects.filter(forum_id=f.id).count()
            sheet.append([
                f.nom,
                str(f.date_forum) if f.date_forum else "",
                f.lieu,
                f.description,
                str(f.date_debut) if f.date_debut else "",
                str(f.date_fin) if f.date_fin else "",
                f.duree if f.duree else 0,
                f.nombre_max,
                candidats_inscrits
            ])

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="forums_export.xlsx"'
        workbook.save(response)
        return response

