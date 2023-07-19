from django.shortcuts import render, redirect


def privacy_policy(request):
    return render(request, 'special/privacy_police.html')

def terms_of_use(request):
    return render(request, 'special/terms_of_use.html')

def delete_instructions(request):
    return render(request, 'special/delete_instructions.html')