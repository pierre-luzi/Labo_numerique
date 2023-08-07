from django import forms

from labo_num.models import Punition

class PunitionForm(forms.ModelForm):
    class Meta:
        model = Punition
        fields = ('nom', 'prenom',)
        readonly_fields = ('date',)