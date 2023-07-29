from django import template

register = template.Library()

@register.simple_tag
def short_name(chapitre):
    if chapitre.matiere == 'phy':
        return f'P{chapitre.numero}'
    elif chapitre.matiere == 'chi':
        return f'C{chapitre.numero}'

@register.simple_tag
def categories(animation):
    categories = []
    for category in animation.categories.all():
        categories.append(category.category)
    return " ".join(categories)

@register.filter
def niveau_clean(niveau):
    if niveau == '2e':
        return '2<sup>e</sup>'
    elif niveau == '1re':
        return '1<sup>re</sup> spécialité'
    elif niveau == '1ES':
        return '1<sup>re</sup> enseignement scientifique'.safe()
    elif niveau == 'Term':
        return 'Terminale spécialité'
    elif niveau == 'TES':
        return 'Terminale enseignement scientifique'
    elif niveau == 'TSTL':
        return 'Terminale STL'
