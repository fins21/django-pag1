from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import MensajeContacto
from .models import Credenciales
from django import forms
from .models import Usuario

class UsuarioForm(forms.ModelForm):
    confirmar_contraseña = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = Usuario
        fields = ['nombre', 'email', 'telefono', 'contraseña']
        widgets = {
            'contraseña': forms.PasswordInput(),
        }

    def clean(self):
        cleaned_data = super().clean()
        contraseña = cleaned_data.get("contraseña")
        confirmar_contraseña = cleaned_data.get("confirmar_contraseña")

        if contraseña and confirmar_contraseña and contraseña != confirmar_contraseña:
            self.add_error('confirmar_contraseña', "Las contraseñas no coinciden.")

        return cleaned_data
