from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    
    def __str__(self):
        return f"{self.username} ({self.role})"




import uuid

class Classroom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    class_name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='classes')
    join_code = models.CharField(max_length=8, unique=True)

    def __str__(self):
        return f"{self.class_name} - {self.subject}"


class Enrollment(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('classroom', 'student')

from django.db import models
from django.utils import timezone

class AttendanceSession(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='attendance_sessions')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def is_active(self):
        now = timezone.now()
        return self.start_time <= now <= self.end_time

    def __str__(self):
        return f"Attendance session for {self.classroom.class_name} from {self.start_time} to {self.end_time}"


from django.utils import timezone

class Attendance(models.Model):
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='attendances')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    
    location = models.CharField(max_length=255, blank=True, null=True)
    face_id = models.CharField(max_length=255, blank=True, null=True)
    voice_note_url = models.URLField(blank=True, null=True)

    class Meta:
        unique_together = ('session', 'student')  # Prevent duplicate attendance per session

    def __str__(self):
        return f"{self.student.username} - {self.session.classroom.class_name} @ {self.timestamp.strftime('%Y-%m-%d %H:%M')}"