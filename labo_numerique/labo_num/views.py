from django.shortcuts import render, get_object_or_404, get_list_or_404
from labo_num.models import *

def accueil(request):
    chapitres = Chapitre.objects.all()
    return render(request, 'phychim/accueil.html', {'chapitres': chapitres})

def liste_chapitres(request, classe):
    chapitres = get_list_or_404(Chapitre, niveau=classe)
    return render(
        request,
        'labo_num/liste_chapitres.html',
        {'chapitres': chapitres, 'niveau': classe}
    )

def contenu_chapitre(request, classe, matiere, numero):
    chapitre = get_object_or_404(Chapitre, niveau=classe, matiere=matiere, numero=numero)
    chapitres = get_list_or_404(Chapitre, niveau=classe)
    activites = Activite.objects.filter(chapitre__id=chapitre.id)
    return render(
        request,
        'labo_num/contenu_chapitre.html',
        {'chapitre': chapitre, 'chapitres': chapitres, 'activites': activites}
    )

def fiche_revision(request, classe, matiere, numero):
    chapitre = get_object_or_404(Chapitre, niveau=classe, matiere=matiere, numero=numero)
    return render(
        request,
        'labo_num/fiche_revision.html',
        {'chapitre': chapitre}
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
    print(template_path)
    return render(request, template_path, {'animation': animation,})

def liste_animations(request):
    animations = Animation.objects.all()
    return render(request, 'labo_num/liste_animations.html', {'animations': animations})

def liste_geniallies(request):
    geniallies = Genially.objects.all()
    return render(request, 'labo_num/liste_geniallies.html', {'geniallies': geniallies})

def genially(request, slug):
    genially = get_object_or_404(Genially, slug=slug)
    return render(request, 'labo_num/genially.html', {'genially': genially})