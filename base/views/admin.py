from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import Http404, HttpResponse

from ..models import TestUser
from django.contrib.auth.models import User

# from openpyxl import Workbook

""" Admin Panel """
@login_required(login_url='base:sign-in')
def admin(request):
    if request.user.is_superuser:
        users = User.objects.all()
        testUsers = TestUser.objects.all()
        
        return render(request, 'base/admin.html', {
            'testUsers': testUsers,
            'users': users,
        })
    else:
        raise Http404
  
""" Download test users excel """
@login_required(login_url='base:sign-in')
def download_test_users_excel(request):
    if request.user.is_superuser:
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="data.xlsx"'

        # Создаем новую рабочую книгу Excel
        wb = Workbook()
        ws = wb.active

        # Добавляем заголовки
        ws.append(["Username", "Email"])

        # Добавляем данные
        for user in TestUser.objects.all():
            ws.append([user.name, user.email])

        # Сохраняем данные в HttpResponse
        wb.save(response)
        return response
    else:
        raise Http404
   
""" Download test users text """
@login_required(login_url='base:sign-in') 
def download_test_users_text(request):
    if request.user.is_superuser:
        response = HttpResponse(content_type='text/plain')
        response['Content-Disposition'] = 'attachment; filename="data.txt"'

        # Создаем текстовый файл и записываем данные
        with open('data.txt', 'w') as file:
            for user in TestUser.objects.all():
                file.write(f"Username: {user.name}, Email: {user.email}\n")

        # Читаем данные из файла и добавляем их в HttpResponse
        with open('data.txt', 'r') as file:
            response.write(file.read())

        return response
    else:
        raise Http404
    
""" Download users excel """
@login_required(login_url='base:sign-in')
def download_users_excel(request):
    if request.user.is_superuser:
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="data.xlsx"'

        # Создаем новую рабочую книгу Excel
        wb = Workbook()
        ws = wb.active

        # Добавляем заголовки
        ws.append(["Username", "Email"])

        # Добавляем данные
        for user in User.objects.all():
            ws.append([user.name, user.email])

        # Сохраняем данные в HttpResponse
        wb.save(response)
        return response
    else:
        raise Http404
    
""" Download users test """
@login_required(login_url='base:sign-in')   
def download_users_text(request):
    if request.user.is_superuser:
        response = HttpResponse(content_type='text/plain')
        response['Content-Disposition'] = 'attachment; filename="data.txt"'

        # Создаем текстовый файл и записываем данные
        with open('data.txt', 'w') as file:
            for user in User.objects.all():
                file.write(f"Username: {user.name}, Email: {user.email}\n")

        # Читаем данные из файла и добавляем их в HttpResponse
        with open('data.txt', 'r') as file:
            response.write(file.read())

        return response
    else:
        raise Http404