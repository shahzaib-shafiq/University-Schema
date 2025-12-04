import { PrismaClient, Role, AccountStatus, Gender, DayOfWeek, RoomType, FeeType, EnrollmentStatus, AttendanceStatus, Grade } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // -------------------------
  // 1. Academic Year
  // -------------------------
  const academicYear = await prisma.academicYear.create({
    data: {
      name: "2024-2025",
      start: new Date("2024-08-01"),
      end: new Date("2025-06-30"),
    }
  });

  // -------------------------
  // 2. Departments
  // -------------------------
  const csDept = await prisma.department.create({
    data: {
      name: "Computer Science",
      code: "CS",
    }
  });

  const engDept = await prisma.department.create({
    data: {
      name: "Engineering",
      code: "ENG",
    }
  });

  // -------------------------
  // 3. Programs
  // -------------------------
  const bsCs = await prisma.program.create({
    data: {
      name: "BS Computer Science",
      code: "BSCS",
      departmentId: csDept.id,
      durationYears: 4,
      totalSemesters: 8
    }
  });

  const bsEng = await prisma.program.create({
    data: {
      name: "BS Engineering",
      code: "BSENG",
      departmentId: engDept.id,
      durationYears: 4,
      totalSemesters: 8
    }
  });

  // -------------------------
  // 4. Semesters
  // -------------------------
  const semester1 = await prisma.semester.create({
    data: {
      name: "Semester 1",
      number: 1,
      programId: bsCs.id,
      academicYearId: academicYear.id,
      startDate: new Date("2024-08-10"),
      endDate: new Date("2024-12-10"),
      isActive: true
    }
  });

  const semester2 = await prisma.semester.create({
    data: {
      name: "Semester 2",
      number: 2,
      programId: bsCs.id,
      academicYearId: academicYear.id,
      startDate: new Date("2025-01-05"),
      endDate: new Date("2025-05-15"),
      isActive: false
    }
  });

  // -------------------------
  // 5. Users (Admins, Faculty, Students)
  // -------------------------
  const superAdmin = await prisma.user.create({
    data: {
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@uni.com",
      password: "hashedpassword",
      role: Role.SUPER_ADMIN,
      status: AccountStatus.ACTIVE,
      gender: Gender.MALE,
      departmentId: csDept.id,
      username: "super1"
    }
  });

  const facultyUser = await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@uni.com",
      password: "hashedpassword",
      role: Role.FACULTY,
      status: AccountStatus.ACTIVE,
      gender: Gender.MALE,
      departmentId: csDept.id,
      username: "john123"
    }
  });

  const studentUser = await prisma.user.create({
    data: {
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@uni.com",
      password: "hashedpassword",
      role: Role.STUDENT,
      gender: Gender.FEMALE,
      departmentId: csDept.id,
      username: "alice1",
      status: AccountStatus.ACTIVE,
    }
  });

  // -------------------------
  // 6. Faculty
  // -------------------------
  const faculty = await prisma.faculty.create({
    data: {
      userId: facultyUser.id,
      designation: "Assistant Professor",
      specialization: "Artificial Intelligence"
    }
  });

  // -------------------------
  // 7. Student
  // -------------------------
  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      programId: bsCs.id
    }
  });

  // -------------------------
  // 8. Courses
  // -------------------------
  const course1 = await prisma.course.create({
    data: {
      code: "CS101",
      title: "Introduction to Programming",
      creditHours: 3,
      semesterId: semester1.id,
      departmentId: csDept.id,
      credits: 3,
      level: 100
    }
  });

  const course2 = await prisma.course.create({
    data: {
      code: "CS102",
      title: "Data Structures",
      creditHours: 3,
      semesterId: semester1.id,
      departmentId: csDept.id,
      credits: 3,
      level: 100
    }
  });

  // -------------------------
  // 9. Sections
  // -------------------------
  const sectionA = await prisma.section.create({
    data: {
      name: "A",
      courseId: course1.id,
      facultyId: faculty.id,
      capacity: 40
    }
  });

  const sectionB = await prisma.section.create({
    data: {
      name: "B",
      courseId: course2.id,
      facultyId: faculty.id,
      capacity: 40
    }
  });

  // -------------------------
  // 10. Rooms
  // -------------------------
  const room101 = await prisma.room.create({
    data: {
      name: "Room 101",
      capacity: 50,
      type: RoomType.CLASSROOM
    }
  });

  // -------------------------
  // 11. Class Schedule
  // -------------------------
  await prisma.classSchedule.create({
    data: {
      sectionId: sectionA.id,
      day: DayOfWeek.MONDAY,
      startTime: new Date("2024-09-01T09:00:00Z"),
      endTime: new Date("2024-09-01T10:30:00Z"),
      roomId: room101.id
    }
  });

  // -------------------------
  // 12. Enrollment
  // -------------------------
  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: student.id,
      sectionId: sectionA.id,
      status: EnrollmentStatus.ENROLLED,
      semester: 1
    }
  });

  // -------------------------
  // 13. Attendance
  // -------------------------
  await prisma.attendance.create({
    data: {
      date: new Date(),
      status: AttendanceStatus.PRESENT,
      studentId: student.id,
      sectionId: sectionA.id
    }
  });

  // -------------------------
  // 14. Exam + GradeRecord
  // -------------------------
  const exam = await prisma.exam.create({
    data: {
      title: "Midterm Exam",
      date: new Date(),
      sectionId: sectionA.id
    }
  });

  await prisma.gradeRecord.create({
    data: {
      studentId: student.id,
      sectionId: sectionA.id,
      examId: exam.id,
      grade: Grade.A,
      marks: 92
    }
  });

  // -------------------------
  // 15. Assignments + Submissions
  // -------------------------
  const assignment = await prisma.assignment.create({
    data: {
      title: "Assignment 1",
      description: "Solve the given problems.",
      dueDate: new Date("2024-10-01"),
      sectionId: sectionA.id
    }
  });

  await prisma.assignmentSubmission.create({
    data: {
      studentId: student.id,
      assignmentId: assignment.id,
      fileUrl: "https://example.com/file.pdf",
      marks: 95,
      feedback: "Excellent work!"
    }
  });

  // -------------------------
  // 16. Notifications
  // -------------------------
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      title: "Assignment Reminder",
      message: "Don't forget to submit Assignment 1!"
    }
  });

  // -------------------------
  // 17. Audit Logs / Activity Logs
  // -------------------------
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: "SYSTEM_BOOT",
      metadata: { info: "System initialized" }
    }
  });

  await prisma.activityLog.create({
    data: {
      userId: studentUser.id,
      action: "LOGIN",
      metadata: { device: "Chrome", ip: "192.168.1.10" }
    }
  });

  // -------------------------
  // 18. Fees
  // -------------------------
  await prisma.fee.create({
    data: {
      studentId: student.id,
      amount: 50000,
      type: FeeType.TUITION,
      dueDate: new Date("2024-09-15")
    }
  });

  console.log("🌱 Database seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
