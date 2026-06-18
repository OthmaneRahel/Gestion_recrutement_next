from django.urls import path,include
from . import views
from .views import AuthentificationUsers
from .views import get_archive_forums, get_archive_candidats


urlpatterns = [

    path('auth/', AuthentificationUsers.as_view(),name='test'),
    path('signup/',views.signup,name='ajouter-talent'),
    path('forums/', views.list_forums, name="list_forums"),
    path('forums_talent/', views.list_forums_talent, name="list_forums_talent"),
    path('forums/create/', views.create_forum, name="create_forum"),
    path('list_rec/', views.get_data_rec, name="get_data_rec"),    
    path('list_cand/', views.get_data_candidature, name="get_data_cand"), 
    path('list_cand_forum/', views.get_data_candidature_forum, name="get_data_cand"),  
    path('list_cand_forum_statistics/', views.get_data_candidature_forum_statistics, name="get_data_cand"),  
    path('list_feedback_forum_statistics/', views.get_data_feedback_statistics, name="get_data_cand"),  
    path('InscriptionForum/', views.InscriptionForum, name="InscriptionForum"), 
    path('send/', views.sendmail, name="email"),    
    path('add_feeback/',views.add_feedback,name="add_feedback"),
    path('alter_presence/<candidature_id>',views.alter_presence,name="alter_presence"),
    path('userconn/',views.user_conn,name="user_conn"),
    path('list_feedback/',views.get_data_feedback,name="get_data_feedback"),
    path('Archive/',views.archive_old_forums_Cands,name="archive_old_forums_Cands"),
    path("archive_forums/", get_archive_forums, name="archive_forums"),
    path("archive_candidats/", get_archive_candidats, name="archive_candidats"),
    path('list_forums_candidature_demain/',views.list_forums_candidature_demain,name="list_forums_candidature_demain"),
    # path('forgot-password/', views.forgot_password, name='forgot-password'),
    # path('reset-password/', views.reset_password, name='reset-password'),
    path('send-verification-code/', views.send_verification_code, name='send_verification_code'),
    path('verify-code/', views.verify_code, name='verify_code'),
    path('reset-password-with-code/', views.reset_password_with_code, name='reset_password_with_code'),
   
]

