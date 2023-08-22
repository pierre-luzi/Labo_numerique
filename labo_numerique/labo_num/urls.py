from django.urls import path, include
import labo_num.views

urlpatterns = [
    path('', labo_num.views.liste_animations, name='home'),
    path('ressources/<str:classe>/', labo_num.views.liste_chapitres, name='ressources'),
    path('ressources/<str:classe>/<str:matiere>/<int:numero>/', labo_num.views.contenu_chapitre, name='chapitre'),
    path('ressources/<str:classe>/<str:matiere>/<int:numero>/fiche_revision/', labo_num.views.fiche_revision, name='fiche_revision'),
    path('ressources/<str:classe>/<str:matiere>/<int:numero>/flashcards/', labo_num.views.flashcards, name='flashcards'),
    path('annales/', labo_num.views.annales, name='annales'),
    path('animations/<slug:slug>/', labo_num.views.animation, name='animation'),
    path('animations/', labo_num.views.liste_animations, name='liste_animations'),
    path('genially/', labo_num.views.liste_geniallies, name='liste_geniallies'),
    path('genially/<slug:slug>', labo_num.views.genially, name='genially'),
    path('confirmation/punition/', labo_num.views.punition_valide, name='confirmer_punition'),
    path('punition/<str:type_punition>/', labo_num.views.punition, name='punition'),
]