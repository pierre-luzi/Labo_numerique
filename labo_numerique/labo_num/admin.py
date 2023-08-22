from django.contrib import admin
from labo_num.models import *
from django.forms import TextInput, Textarea
from django.db import models
from django.db.models.fields.json import JSONField
from jsoneditor.forms import JSONEditor
  
class ActiviteInline(admin.StackedInline):
    model = Activite
    extra = 0
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows':5, 'cols':100})},
    }

class FlashcardInline(admin.StackedInline):
    model = Flashcard
    extra = 0
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows':5, 'cols':100})},
        JSONField: {'widget': JSONEditor(attrs={'style': 'height: 300px;'})}
    }

@admin.register(Chapitre)
class ChapitreAdmin(admin.ModelAdmin):
    fields = (
        'niveau',
        'matiere',
        'numero',
        'titre',
        'description',
        'notions',
        'exercices',
        'cours',
        'fiche_revision',
    )
    ordering = ['niveau', 'matiere', 'numero',]
    list_display = ('niveau', '__str__', 'titre',)
    list_filter = ('matiere', 'niveau',)
    inlines = [
        ActiviteInline,
        FlashcardInline,
    ]
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows':5, 'cols':100})},
        JSONField: {'widget': JSONEditor(attrs={'style': 'height: 300px;'})}
    }

@admin.register(Annale)
class AnnaleAdmin(admin.ModelAdmin):
    ordering = ['-annee', 'lieu', 'titre',]
    list_display = ('titre', 'annee', 'lieu', 'sujet_complet',)
    list_filter = ('annee', 'lieu', 'sujet_complet',)

@admin.register(Animation)
class AnimationAdmin(admin.ModelAdmin):
    list_display = ('titre', 'visible',)
    prepopulated_fields = {'slug': ('titre',)}
    formfield_overrides = {
        models.CharField: {'widget': TextInput(attrs={'size':'100'})},
        models.TextField: {'widget': Textarea(attrs={'rows':4, 'cols':40})},
    }

@admin.register(AnimationCategory)
class AnimationCategoryAdmin(admin.ModelAdmin):
    list_display = ('category',)

@admin.register(Genially)
class GeniallyAdmin(admin.ModelAdmin):
    list_display = ('titre',)
    prepopulated_field = {'slug': ('titre',)}

@admin.register(Punition)
class PunitionAdmin(admin.ModelAdmin):
    readonly_fields = ('nom', 'prenom', 'type_punition', 'date',)