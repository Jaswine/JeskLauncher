from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User


@login_required(login_url='base:sign-in')
def delete_account(request):
    if request.method == 'POST':
        user =  User.objects.get(username=request.user.username)
        user.delete()
        return redirect('base:sign-in')
        
    return render(request, 'base/delete.html')
