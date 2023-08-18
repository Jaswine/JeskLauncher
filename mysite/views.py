from django.shortcuts import render, redirect


def privacy_policy(request):
    return render(request, 'special/privacy_police.html', {
        'title': 'Privacy Policy'
    })

def terms_of_use(request):
    return render(request, 'special/terms_of_use.html', {
        'title': 'Terms of Use'
    })

def delete_instructions(request):
    return render(request, 'special/delete_instructions.html', {
        'title': 'Delete Instructions'
    })