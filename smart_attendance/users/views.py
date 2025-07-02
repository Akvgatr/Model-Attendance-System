from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.utils import timezone

from .models import CustomUser,Attendance,AttendanceSession
from .serializers import RegisterSerializer, LoginSerializer,AttendanceSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializers import LoginSerializer 

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,   # ✅ added
                'role': user.role            # already present
            })
        return Response(serializer.errors, status=400)

from rest_framework.permissions import IsAuthenticated
from .models import Classroom, Enrollment
from .serializers import ClassroomSerializer, EnrollmentSerializer
import uuid

class CreateClassroomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can create classes'}, status=403)

        serializer = ClassroomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(teacher=request.user, join_code=uuid.uuid4().hex[:8])
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class JoinClassroomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get('join_code')
        try:
            classroom = Classroom.objects.get(join_code=code)
        except Classroom.DoesNotExist:
            return Response({'error': 'Invalid code'}, status=404)

        if request.user.role != 'student':
            return Response({'error': 'Only students can join classes'}, status=403)

        enrollment, _ = Enrollment.objects.get_or_create(
            classroom=classroom,
            student=request.user
        )
        return Response({
            'message': 'Joined class successfully',
            'classroom_id': str(classroom.id),
            'class_name': classroom.class_name,
        })
    






from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Classroom, AttendanceSession, Attendance
from .serializers import AttendanceSerializer

class MarkAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'student':
            return Response({'error': 'Only students can mark attendance'}, status=403)

        classroom_id = request.data.get('classroom')
        if not classroom_id:
            return Response({'error': 'Classroom ID is required'}, status=400)

        try:
            classroom = Classroom.objects.get(id=classroom_id)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=404)

        now = timezone.now()
        active_sessions = AttendanceSession.objects.filter(
            classroom=classroom,
            start_time__lte=now,
            end_time__gte=now
        )

        if not active_sessions.exists():
            return Response({'error': 'No active attendance session'}, status=400)

        session = active_sessions.first()

        # Check if attendance already marked
        if Attendance.objects.filter(session=session, student=request.user).exists():
            return Response({'error': 'Attendance already marked'}, status=400)

        # ✅ Only pass serializer fields
        filtered_data = {
            'location': request.data.get('location'),
            'face_id': request.data.get('face_id'),
            'voice_note_url': request.data.get('voice_note_url'),
        }

        serializer = AttendanceSerializer(data=filtered_data)
        if serializer.is_valid():
            serializer.save(student=request.user, session=session)
            return Response({'message': 'Attendance marked successfully'}, status=201)

        return Response(serializer.errors, status=400)







# class CreateAttendanceSessionView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         if request.user.role != 'teacher':
#             return Response({'error': 'Only teachers can start attendance sessions'}, status=403)

#         classroom_id = request.data.get('classroom_id')
#         start_time = request.data.get('start_time')
#         end_time = request.data.get('end_time')

#         if not all([classroom_id, start_time, end_time]):
#             return Response({'error': 'Missing fields'}, status=400)

#         try:
#             classroom = Classroom.objects.get(id=classroom_id, teacher=request.user)
#         except Classroom.DoesNotExist:
#             return Response({'error': 'Classroom not found or unauthorized'}, status=404)

#         # ✅ Directly use the string values (Django handles parsing)
#         session = AttendanceSession.objects.create(
#             classroom=classroom,
#             start_time=start_time,
#             end_time=end_time
#         )

#         return Response({
#             'message': 'Attendance session created',
#             'session_id': session.id,
#             'start_time': session.start_time,
#             'end_time': session.end_time
#         }, status=201)





from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Classroom, AttendanceSession
from dateutil import parser

class CreateAttendanceSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can start attendance sessions'}, status=403)

        classroom_id = request.data.get('classroom_id')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')

        if not all([classroom_id, start_time, end_time]):
            return Response({'error': 'Missing fields'}, status=400)

        try:
            classroom = Classroom.objects.get(id=classroom_id, teacher=request.user)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found or unauthorized'}, status=404)

        try:
            # Parse start and end times
            start_dt = parser.parse(start_time)
            end_dt = parser.parse(end_time)

            # Ensure both are timezone-aware
            if timezone.is_naive(start_dt):
                start_dt = timezone.make_aware(start_dt, timezone.get_current_timezone())
            if timezone.is_naive(end_dt):
                end_dt = timezone.make_aware(end_dt, timezone.get_current_timezone())

            # Convert both to UTC
            start_dt = start_dt.astimezone(timezone.utc)
            end_dt = end_dt.astimezone(timezone.utc)

        except Exception as e:
            return Response({'error': f'Invalid datetime format: {str(e)}'}, status=400)

        # Create the session
        session = AttendanceSession.objects.create(
            classroom=classroom,
            start_time=start_dt,
            end_time=end_dt
        )

        return Response({
            'message': 'Attendance session created',
            'session_id': str(session.id),
            'start_time': session.start_time,
            'end_time': session.end_time
        }, status=201)











class ActiveSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, classroom_id):
        now = timezone.now()
        try:
            classroom = Classroom.objects.get(id=classroom_id)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found'}, status=404)

        session = AttendanceSession.objects.filter(
            classroom=classroom,
            start_time__lte=now,
            end_time__gte=now
        ).first()

        if not session:
            return Response({'message': 'No active session'}, status=200)

        return Response({
            'session_id': session.id,
            'start_time': session.start_time,
            'end_time': session.end_time
        })


class AttendanceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can view attendance'}, status=403)

        try:
            session = AttendanceSession.objects.get(id=session_id)
        except AttendanceSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=404)

        data = [{
            'student': att.student.username,
            'timestamp': att.timestamp
        } for att in session.attendances.all()]

        return Response(data)




class MyJoinedClassesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'student':
            return Response({'error': 'Only students can access this'}, status=403)

        enrollments = Enrollment.objects.filter(student=request.user)
        data = [{
            'classroom_id': str(e.classroom.id),
            'class_name': e.classroom.class_name,
            'subject': e.classroom.subject
        } for e in enrollments]

        return Response(data)


class MyTeachingClassesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can access this'}, status=403)

        classes = Classroom.objects.filter(teacher=request.user)
        data = [{
            'classroom_id': str(cls.id),
            'class_name': cls.class_name,
            'subject': cls.subject,
            'join_code': cls.join_code
        } for cls in classes]

        return Response(data)


class ClassroomSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, classroom_id):
        try:
            classroom = Classroom.objects.get(id=classroom_id, teacher=request.user)
            sessions = AttendanceSession.objects.filter(classroom=classroom).order_by('-start_time')
            data = [{
                'id': s.id,
                'start_time': s.start_time,
                'end_time': s.end_time
            } for s in sessions]
            return Response(data)
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom not found or unauthorized'}, status=404)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import AttendanceSession, Classroom
from django.utils.timezone import now as dj_now

class AllActiveSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'teacher':
            return Response({'error': 'Only teachers can view active sessions'}, status=403)

        now = dj_now()
        print("🔍 Request User:", request.user.username)
        print("🔍 Current Time (UTC):", now)

        classrooms = Classroom.objects.filter(teacher=request.user)
        print("🔍 Found Classrooms:", list(classrooms))

        active_sessions = AttendanceSession.objects.filter(
            classroom__in=classrooms,
            start_time__lte=now,
            end_time__gte=now
        ).select_related('classroom')

        print("🔍 Active Sessions:", list(active_sessions))

        data = [{
            'session_id': str(session.id),
            'classroom_id': str(session.classroom.id),
            'class_name': session.classroom.class_name,
            'subject': session.classroom.subject,
            'start_time': session.start_time,
            'end_time': session.end_time,
        } for session in active_sessions]

        print("✅ Returning Sessions:", data)

        return Response(data)
