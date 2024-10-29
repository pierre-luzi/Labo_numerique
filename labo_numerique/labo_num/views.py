from django.shortcuts import render, redirect, get_object_or_404
from django.http import Http404
from labo_num.models import *
from labo_num.forms import *

def accueil(request):
    chapitres = Chapitre.objects.all()
    return render(request, 'phychim/accueil.html', {'chapitres': chapitres})

def liste_chapitres(request, classe):
    if not classe in Chapitre.Niveau:
        raise Http404
    chapitres_physique = Chapitre.objects.filter(niveau=classe, matiere='phy')
    chapitres_chimie = Chapitre.objects.filter(niveau=classe, matiere='chi')
    return render(
        request,
        'labo_num/liste_chapitres.html',
        {
            'chapitres_physique': chapitres_physique,
            'chapitres_chimie': chapitres_chimie,
            'niveau': classe
        }
    )

def contenu_chapitre(request, classe, matiere, numero):
    chapitre = get_object_or_404(Chapitre, niveau=classe, matiere=matiere, numero=numero)
    chapitres = Chapitre.objects.filter(niveau=classe)
    activites = Activite.objects.filter(chapitre__id=chapitre.id)
    if not Flashcard.objects.filter(chapitre__id=chapitre.id):
        flashcards = False
    else:
        flashcards = True        
    return render(
        request,
        'labo_num/contenu_chapitre.html',
        {'chapitre': chapitre, 'chapitres': chapitres, 'activites': activites, 'flashcards': flashcards}
    )

def fiche_revision(request, classe, matiere, numero):
    chapitre = get_object_or_404(Chapitre, niveau=classe, matiere=matiere, numero=numero)
    return render(
        request,
        'labo_num/fiche_revision.html',
        {'chapitre': chapitre}
    )

def flashcards(request, classe, matiere, numero):
    chapitre = get_object_or_404(Chapitre, niveau=classe, matiere=matiere, numero=numero)
    flashcards = Flashcard.objects.filter(chapitre__id=chapitre.id)
    return render(
        request,
        'labo_num/flashcards.html',
        {'chapitre': chapitre, 'flashcards': flashcards}
    )

def annales(request):
    chapitres = Chapitre.objects.filter(niveau='TSTL')
    sujets = Annale.objects.filter(sujet_complet=True)
    exercices = Annale.objects.filter(sujet_complet=False)
    return render(
        request,
        'labo_num/annales.html',
        {
            'sujets': sujets,
            'exercices': exercices,
            'chapitres': chapitres,
        }
    )

def animation(request, slug):
    animation = get_object_or_404(Animation, slug=slug)
    template_path = 'labo_num/animations/' + slug + '.html'
    return render(request, template_path, {'animation': animation})

def liste_animations(request):
    animations = Animation.objects.all()
    return render(request, 'labo_num/liste_animations.html', {'animations': animations})

def liste_geniallies(request):
    geniallies = Genially.objects.all()
    return render(request, 'labo_num/liste_geniallies.html', {'geniallies': geniallies})

def genially(request, slug):
    genially = get_object_or_404(Genially, slug=slug)
    return render(request, 'labo_num/genially.html', {'genially': genially})

def article(request, slug):
    article = get_object_or_404(Article, slug=slug)
    template_path = 'labo_num/articles/' + slug + '.html'
    return render(request, template_path, {'article': article})

def donnees(request, slug):
    ressource = get_object_or_404(Ressource, slug=slug)
    with ressource.fichier.open('r') as file:
            contenu_html = file.read()
    return render(request, 'labo_num/ressource.html', {'ressource': ressource, 'contenu_html': contenu_html})

def liste_donnees(request):
    ressources = Ressource.objects.all()
    return render(request, 'labo_num/liste_donnees.html', {'ressources': ressources})

def punition(request, type_punition):
    if not type_punition in Punition.Type:
        raise Http404

    if request.method == 'POST':    # réponse lorsque le formulaire est envoyé
        form = PunitionForm(request.POST)
        if form.is_valid():
            punition = form.save()
            return redirect('confirmer_punition')
    else:                           # réponse lorsque la page est appelée
        form = PunitionForm()
    return render(request, 'labo_num/punition.html', {'form': form, 'type_punition': type_punition})

def punition_valide(request):
    return render(request, 'labo_num/punition_valide.html')