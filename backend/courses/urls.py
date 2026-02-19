from django.urls import path
from .views import SubjectListView, LessonDetailView

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
]