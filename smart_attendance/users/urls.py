from django.urls import path
from .views import (
    RegisterView, LoginView,
    CreateClassroomView, JoinClassroomView,
    MarkAttendanceView, CreateAttendanceSessionView,
    ActiveSessionView, AttendanceListView,
    MyTeachingClassesView, MyJoinedClassesView,
    ClassroomSessionsView,AllActiveSessionsView  
)

urlpatterns = [
    # 🔐 Auth
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),

    # 📚 Classrooms
    path('create/', CreateClassroomView.as_view()),
    path('join/', JoinClassroomView.as_view()),

    # ✅ Attendance (for students)
    path('mark-attendance/', MarkAttendanceView.as_view(), name='mark-attendance'),

    # 🧑‍🏫 Session creation & management (for teachers)
    path('teacher/session/start/', CreateAttendanceSessionView.as_view()),
    path('teacher/session/active/<uuid:classroom_id>/', ActiveSessionView.as_view()),
path('teacher/session/list/<int:session_id>/', AttendanceListView.as_view()),
    path('teacher/classrooms/', MyTeachingClassesView.as_view()),

    # 👩‍🎓 Student-related views
    path('my-classes/', MyJoinedClassesView.as_view()),
    path('student/sessions/<uuid:classroom_id>/', ClassroomSessionsView.as_view()),
    path('teacher/session/active/', AllActiveSessionsView.as_view()),



]
