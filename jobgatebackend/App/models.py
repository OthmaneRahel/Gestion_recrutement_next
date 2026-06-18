from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager, PermissionsMixin, Group, Permission
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser

class Talent(AbstractBaseUser,PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    cv = models.FileField(max_length=255,upload_to='cv')
    image = models.ImageField(max_length=255,upload_to='picturestalent')
    email = models.CharField(max_length=150,unique=True)
    numero_telephone = models.CharField(max_length=100)
    password = models.CharField(max_length=150)
    USERNAME_FIELD = 'email'
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_permissions_set',
        related_query_name='talent_permissions',
    )
   

class Recruteur(AbstractBaseUser,PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    image = models.ImageField(max_length=255,upload_to='picturesrectruteur')
    email = models.EmailField(max_length=150,unique=True)
    password = models.CharField(max_length=150)
    numero_telephone = models.CharField(max_length=100,null=True)
    entreprise = models.CharField(max_length=150,null=True)
    USERNAME_FIELD = 'email'
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='recruteur_set',
        related_query_name='recruteur_user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='recruteur_permissions_set',
        related_query_name='custom_user_permissions',
    )

class Forum(models.Model):
    nom = models.CharField(max_length=255)
    date_forum = models.DateField(max_length=100)
    lieu = models.CharField(max_length=100)
    description = models.TextField(max_length=255)
    recruteurs = ArrayField(models.IntegerField(), blank=False, default=list)
    nombre_max = models.IntegerField() 
    qrcode= models.ImageField(upload_to='codes_QR')    
    date_debut = models.TimeField(max_length=100,blank=True,default=None,null=True)
    date_fin = models.TimeField(max_length=100,blank=True,default=None,null=True)
    duree = models.IntegerField(null=True)

class Candidature_forum(models.Model):
    talent = models.ForeignKey(
        Talent, 
        on_delete=models.CASCADE, 
        related_name='talent_candidature',
        db_constraint=True,
        default=None
    )
    forum = models.ForeignKey(
        Forum, 
        on_delete=models.CASCADE, 
        related_name='forum_candidature',
        db_constraint=True,
        default=None
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=150)
    cv = models.FileField(max_length=255,upload_to='cv_candidats')
    numero_telephone = models.CharField(max_length=100)
    image = models.ImageField(max_length=255,upload_to='image_candidature')
    presence = models.BooleanField(max_length=50,default=False)
    event_horaire = models.CharField(null=True)
    date_inscri= models.DateField(max_length=100,default=datetime.now().date())




class Feedback_candidat(models.Model):
    note = models.TextField(max_length=255)
    annotation_candidat = models.IntegerField()
    candidature = models.ForeignKey(
        Candidature_forum, 
        on_delete=models.CASCADE, 
        related_name='candidature_feedback',
        db_constraint=True,
        default=None
    )
    etat = models.CharField(max_length=100)

from django.db import models
from django.utils.timezone import now
from django.contrib.postgres.fields import ArrayField

class Archive_forum(models.Model):
    forum_id = models.IntegerField(null=True, blank=True)
    nom = models.CharField(max_length=255, default="")  # chaîne vide par défaut
    date_forum = models.DateField(default=now)          # valeur par défaut pour les anciennes lignes
    lieu = models.CharField(max_length=100, default="")
    description = models.TextField(max_length=255, default="")
    recruteurs = ArrayField(models.IntegerField(), blank=True, default=list)  # liste vide
    nombre_max = models.IntegerField(default=0)
    qrcode = models.ImageField(upload_to='codes_QR', null=True, blank=True)    # nullable pour éviter l'erreur
    date_debut = models.TimeField(blank=True, null=True, default=None)
    date_fin = models.TimeField(blank=True, null=True, default=None)
    duree = models.IntegerField(null=True, blank=True)
    currentNumber = models.IntegerField(default=0)
    entreprise = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.nom


class Archive_Candidat(models.Model):
    talent_id = models.IntegerField(null=True, blank=True)
    forum_id = models.IntegerField(null=True, blank=True)
    
    first_name = models.CharField(max_length=100, default="")
    last_name = models.CharField(max_length=100, default="")
    email = models.CharField(max_length=150, default="")
    numero_telephone = models.CharField(max_length=100, default="")
    cv = models.FileField(upload_to='archive/cv_candidats', max_length=255, default="")
    image = models.ImageField(upload_to='archive/image_candidature', max_length=255, null=True, blank=True)
    presence = models.BooleanField(default=False)
    event_horaire = models.CharField(max_length=255, null=True, blank=True)
    date_inscri = models.DateField(default=now)

    # Champs feedback
    note = models.TextField(max_length=255, null=True, blank=True)
    annotation_candidat = models.IntegerField(null=True, blank=True)
    etat = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


from django.utils import timezone
from datetime import timedelta

class PasswordResetCode(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    reset_token = models.CharField(max_length=64, blank=True, null=True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)

    class Meta:
        db_table = 'password_reset_code'