import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

import {
  PrismaClient,
  Role,
  Gender,
  DayOfWeek,
  AttendanceStatus,
  EnrollmentStatus,
  Grade,
} from '@prisma/client';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {

  console.log('🌱 Starting database seed...');

  // ------------------------------
  // 1. DEPARTMENTS
  // ------------------------------
  const csDept = await prisma.department.create({
    data: {
      name: 'Computer Science',
      code: 'CS',
    },
  });

  const bioDept = await prisma.department.create({
    data: {
      name: 'Biology',
      code: 'BIO',
    },
  });

  // ------------------------------
  // 2. USERS (Admin, Faculty, Students)
  // ------------------------------
  const superAdmin = await prisma.user.create({
    data: {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@example.com',
      password: 'hashedpassword', // replace with actual hash
      role: Role.SUPER_ADMIN,
      departmentId: csDept.id,
      isVerified: true,
    },
  });

  const facultyUser = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.faculty@example.com',
      password: 'hashedpassword',
      role: Role.FACULTY,
      gender: Gender.FEMALE,
      departmentId: csDept.id,
      isVerified: true,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.student@example.com',
      password: 'hashedpassword',
      role: Role.STUDENT,
      gender: Gender.MALE,
      departmentId: csDept.id,
      isVerified: true,
    },
  });

  // ------------------------------
  // 3. FACULTY PROFILE
  // ------------------------------
  const faculty = await prisma.faculty.create({
    data: {
      userId: facultyUser.id,
      designation: 'Assistant Professor',
      specialization: 'Artificial Intelligence',
    },
  });

  // ------------------------------
  // 4. PROGRAMS
  // ------------------------------
  const bsCS = await prisma.program.create({
    data: {
      name: 'Bachelors in Computer Science',
      code: 'BSCS',
      departmentId: csDept.id,
    },
  });

  // ------------------------------
  // 5. STUDENT PROFILE
  // ------------------------------
  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      programId: bsCS.id,
    },
  });

  // ------------------------------
  // 6. SEMESTERS
  // ------------------------------
  const semester1 = await prisma.semester.create({
    data: {
      name: 'Fall 2025',
      number: 1,
      programId: bsCS.id,
    },
  });

  // ------------------------------
  // 7. COURSES
  // ------------------------------
  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction to Programming',
      code: 'CS101',
      description: 'Basics of programming and problem solving.',
      creditHours: 3,
      semesterId: semester1.id,
      departmentId: csDept.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Data Structures',
      code: 'CS102',
      description: 'Core data structures and algorithms.',
      creditHours: 3,
      semesterId: semester1.id,
      departmentId: csDept.id,
    },
  });

  // ------------------------------
  // 8. SECTIONS
  // ------------------------------
  const sectionA = await prisma.section.create({
    data: {
      name: 'A',
      courseId: course1.id,
      facultyId: faculty.id,
    },
  });

  // ------------------------------
  // 9. CLASS SCHEDULE
  // ------------------------------
  await prisma.classSchedule.createMany({
    data: [
      {
        sectionId: sectionA.id,
        day: DayOfWeek.MONDAY,
        startTime: new Date('2025-09-01T09:00:00Z'),
        endTime: new Date('2025-09-01T10:30:00Z'),
      },
      {
        sectionId: sectionA.id,
        day: DayOfWeek.WEDNESDAY,
        startTime: new Date('2025-09-03T09:00:00Z'),
        endTime: new Date('2025-09-03T10:30:00Z'),
      },
    ],
  });

  // ------------------------------
  // 10. ENROLLMENT
  // ------------------------------
  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: student.id,
      sectionId: sectionA.id,
      status: EnrollmentStatus.ENROLLED,
      semester: 1,
    },
  });

  // ------------------------------
  // 11. ATTENDANCE
  // ------------------------------
  await prisma.attendance.create({
    data: {
      studentId: student.id,
      sectionId: sectionA.id,
      date: new Date('2025-09-01'),
      status: AttendanceStatus.PRESENT,
    },
  });

  // ------------------------------
  // 12. ASSIGNMENT
  // ------------------------------
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Programming Assignment 1',
      description: 'Write a basic calculator program.',
      dueDate: new Date('2025-09-10'),
      sectionId: sectionA.id,
    },
  });

  // ------------------------------
  // 13. ASSIGNMENT SUBMISSION
  // ------------------------------
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment.id,
      studentId: student.id,
      fileUrl: 'http://example.com/submissions/bob_assignment1.pdf',
      marks: 95,
      feedback: 'Excellent work!',
    },
  });

  // ------------------------------
  // 14. GRADE RECORD
  // ------------------------------
  await prisma.gradeRecord.create({
    data: {
      studentId: student.id,
      sectionId: sectionA.id,
      grade: Grade.A,
      marks: 92,
      remarks: 'Great performance',
    },
  });

  // ------------------------------
  // 15. NOTIFICATIONS
  // ------------------------------
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUser.id,
        title: 'Welcome to the University',
        message: 'Your student account has been activated.',
      },
      {
        userId: facultyUser.id,
        title: 'New Section Assigned',
        message: 'You are assigned to teach CS101 - Section A.',
      },
    ],
  });

  // ------------------------------
  // 16. AUDIT LOGS
  // ------------------------------
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: 'SYSTEM_INITIALIZED',
      metadata: { seed: true },
    },
  });

  console.log('🌱 Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
