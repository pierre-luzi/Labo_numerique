from django import forms
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import datetime
import json

class Chapitre(models.Model):
    """Modèle de chapitre."""
    
    class Matiere(models.TextChoices):
        """Choix de matière pour le chapitre."""
        PHYSIQUE = 'phy'
        CHIMIE = 'chi'
    
    class Niveau(models.TextChoices):
        """Choix de niveau pour le chapitre."""
        SECONDE = '2e'
        PREMIÈRE_SPÉCIALITÉ = '1re'
        PREMIÈRE_ENSEIGNEMENT_SCIENTIFIQUE = '1ES'
        TERMINALE_SPÉCIALITÉ = 'Term'
        TERMINALE_ENSEIGNEMENT_SCIENTIFIQUE = 'TES'
        TERMINALE_STL = 'TSTL'
    
    def defaultJSON():
        """Fichier JSON par défaut pour la fiche de révision."""
        entree = [
            {
                "type": "notion",
                "contenu": "",
                "textA": "<p></p>",
                "textB": "<p></p>",
                "textC": "<p></p>"
            },
            {
                "type": "capacite",
                "contenu": "",
                "textA": "<p></p>",
                "textB": "<p></p>",
                "textC": "<p></p>"
            },
        ]
        return entree
    
    numero = models.fields.IntegerField()
    titre = models.fields.CharField(max_length=150)
    matiere = models.fields.CharField(choices=Matiere.choices, max_length=3)
    niveau = models.fields.CharField(choices=Niveau.choices, max_length=4, default='2e')
    description = models.TextField(max_length=500, null=True, blank=True)
    notions = models.JSONField(default=list)
    fiche_revision = models.JSONField(default=defaultJSON)
    exercices = models.FileField(upload_to='uploads/exercices/', null=True, blank=True)
    cours = models.FileField(upload_to='uploads/cours/', null=True, blank=True)
    
    def niveau_formatte(self):
        niveau = self.niveau
        if niveau == '2e':
            return '2<sup>e</sup>'
        elif niveau == '1re' or niveau == '1ES':
            return '1<sup>re</sup>'
        elif niveau == 'Term' or niveau == 'TES':
            return 'Terminale'
        elif niveau == 'TSTL':
            return 'TSTL'
    
    def __str__(self):
        """Fonction définissant l'affichage du chapitre."""
        niveau = self.niveau        
        matiere = self.matiere
        if niveau == '1ES':
            return f'1<sup>re</sup> enseignement scientifique - Chapitre {self.numero}'
        elif niveau == 'TES':
            return f'Terminale enseignement scientifique - Chapitre {self.numero}'
        else:
            if niveau == '2e':
                niveau = '2<sup>e</sup'
            elif niveau == '1re':
                niveau = '1<sup>re</sup>'
            elif niveau == 'Term':
                niveau = 'Terminale'
            if self.matiere == 'phy':
                return f'{niveau} - P{self.numero}'
            elif self.matiere == 'chi':
                return f'{niveau} - C{self.numero}'
        return self.__str__

class Activite(models.Model):
    """Modèle de document.
    Le champ 'contenu' permet de renseigner des informations sur le contenu et les objectifs de l'activité.
    Un fichier peut être joint."""
    
    class Type(models.TextChoices):
        EXPÉRIMENTALE = 'exp'
        NUMÉRIQUE = 'num'
        DOCUMENTAIRE = 'doc'
    
    type_activite = models.fields.CharField(choices=Type.choices, max_length=6, default='doc')
    numero = models.fields.IntegerField(null=True, blank=True)
    titre = models.fields.CharField(max_length=150)
    contenu = models.TextField(max_length=500, null=True, blank=True)
    fichier = models.FileField(upload_to='uploads/activites/', null=True, blank=True)
    chapitre = models.ForeignKey(Chapitre, on_delete=models.CASCADE, null=True)

class Annale(models.Model):
    """Modèle pour créer un sujet d'annale.
    Il peut s'agit d'un sujet complet ou d'un exercice extrait, ce qui est précisé
    grâce au BooleanField sujet_complet.
    Les chapitres abordés dans le sujet ou dans l'exercice sont liés à l'annale
    grâce à un ManyToManyField."""
    class Lieu(models.TextChoices):
        MÉTROPOLE = 'métropole'
        POLYNÉSIE = 'polynésie'
        MAYOTTE = 'mayotte'
        AMÉRIQUE_DU_SUD = 'amérique_du_sud'
        AMÉRIQUE_DU_NORD = 'amérique_du_nord'
        ANTILLES = 'antilles'
        PONDICHÉRY = 'pondichéry'
        ASIE = 'asie'
        
    titre = models.fields.CharField(max_length=100)
    lieu = models.fields.CharField(max_length=50, choices=Lieu.choices)
    annee = models.fields.IntegerField(
        default=2023, 
        validators=[
            MinValueValidator(2013),
            MaxValueValidator(datetime.now().year)
        ]
    )
    description = models.TextField(max_length=500, null=True)
    chapitres = models.ManyToManyField(Chapitre)
    sujet_complet = models.BooleanField(default=False)
    fichier = models.FileField(upload_to='uploads/annales/', null=False, blank=False)

class AnimationCategory(models.Model):
    """Modèle pour enregistrer les catégories des animations.
    Les catégories sont notées en minuscule et utilisées comme classes HTML
    pour filtrer les animations avec JavaScript sur la page qui les liste."""
    category = models.fields.CharField(max_length=50, verbose_name="catégorie")
    
    class Meta:
        verbose_name = "Catégorie d'animation"
        verbose_name_plural = "Catégories d'animation"
        db_table = "db_animations_categorie"
        
    def __str__(self):
        """Fonction définissant l'affichage de la catégorie."""
        return f'{self.category}'
    
class Animation(models.Model):
    """Modèle pour enregistrer une animation.
    Le slug doit être le nom du fichier HTML de l'animation."""
    titre = models.fields.CharField(max_length=150)
    description = models.fields.TextField(max_length=150, blank=True, null=True)
    slug = models.SlugField(null=False, unique=True)
    img = models.ImageField(upload_to='uploads/miniatures_anim/', null=True, blank=True)
    categories = models.ManyToManyField(AnimationCategory)
    visible = models.BooleanField(default=False);
    date = models.DateTimeField(default=datetime.now, blank=True);
    
    class Meta:
        db_table = "db_animation"

class Genially(models.Model):
    """Modèle pour enregistrer un Genially."""
    titre = models.CharField(max_length=150)
    description = models.TextField(max_length=300, blank=True, null=True)
    slug = models.SlugField(null=False, unique=True)
    img = models.ImageField(upload_to='uploads/miniatures_anim/', null=True, blank=True)
    url = models.URLField(max_length=300)
    
    class Meta:
        db_table = "db_genially"
        verbose_name_plural = "geniallies"
    
    def __str__(self):
        return self.titre