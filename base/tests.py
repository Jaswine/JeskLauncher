from django.test import TestCase
from django.urls import reverse

from .api.views.social_messages2  import MessagesListView

class MessagesListViewTest(TestCase):
    def test_get_messages_successful(self):
        request = self.client.get(reverse('messages'))
        response = MessagesListView.as_view()(request)

        # Проверяем, что статус равен 200
        self.assertEqual(response.status_code, 200)

        # Проверяем, что в ответе есть данные
        # self.assertIn('messages', response.data)    
        # self.assertIsInstance(response.data['messages'], list)
