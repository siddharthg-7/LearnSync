import { initializeMockData } from './mockData';
import * as firestoreService from '../services/firestore';

/**
 * Seeds Firestore with initial mock data.
 * Student/mentor documents are stored at their canonical string IDs
 * (e.g. 'student_1', 'mentor_1') which match what AppContext expects.
 */
export const seedFirestore = async () => {
  try {
    console.log('Starting Firestore seeding...');

    const mockData = initializeMockData();

    // Seed Students — use student.id directly (already 'student_1', etc.)
    console.log('Seeding students...');
    for (const student of mockData.students) {
      await firestoreService.createUser(student.id, {
        ...student,
        role: 'student',
      });
    }

    // Seed Mentors — use mentor.id directly (already 'mentor_1', etc.)
    console.log('Seeding mentors...');
    for (const mentor of mockData.mentors) {
      await firestoreService.createUser(mentor.id, {
        ...mentor,
        role: 'mentor',
      });
    }

    // Seed Courses
    console.log('Seeding courses...');
    for (const course of mockData.courses) {
      await firestoreService.createCourse(course);
    }

    // Seed Chapters
    console.log('Seeding chapters...');
    for (const chapter of mockData.chapters) {
      await firestoreService.createChapter(chapter);
    }

    // Seed Topics
    console.log('Seeding topics...');
    for (const topic of mockData.topics) {
      await firestoreService.createTopic(topic);
    }

    // Seed Sessions
    console.log('Seeding sessions...');
    for (const session of mockData.sessions) {
      await firestoreService.createSession(session);
    }

    // Seed Doubts
    console.log('Seeding doubts...');
    for (const doubt of mockData.doubts) {
      await firestoreService.createDoubt(doubt);
    }

    // Seed Study Plans
    console.log('Seeding study plans...');
    for (const plan of mockData.studyPlans) {
      await firestoreService.createStudyPlan(plan.studentId, plan);
    }

    console.log('✅ Firestore seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };

  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if database is empty (needs seeding)
 */
export const isDatabaseEmpty = async () => {
  try {
    const result = await firestoreService.getUsersByRole('student');
    return result.success && result.data.length === 0;
  } catch (error) {
    console.error('Error checking database:', error);
    return true;
  }
};
