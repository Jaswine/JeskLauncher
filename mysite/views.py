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

# 404 error
def tr_handler404(request, exception):
    return render(request, 'errors/error_page.html', {
        'title': 'Error 404',
        'text': 'Page not found'
    }, status=404)

# 403 error
def tr_handler403(request, exception):
    return render(request, 'errors/error_page.html', {
        'title': 'Error 403',
        'text': 'You do not have the necessary permissions to access the requested resource'
    }, status=403)

# 401 error
def tr_handler401(request, exception):
    return render(request, 'errors/error_page.html', {
        'title': 'Error 401',
        'text': "You don't authorized to access the requested resource"
    }, status=401)

# 500 error
def tr_handler500(request):
    return render(request, 'errors/error_page.html', {
        'title': 'Error 500',
        'text': "..."
    }, status=500)