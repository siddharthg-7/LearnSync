// AI-based mentor allocation system

export const allocateMentor = (student, mentors) => {
  if (!student || !mentors || mentors.length === 0) {
    return null;
  }

  // Filter mentors by subject match
  const matchingMentors = mentors.filter(mentor =>
    student.subjects.some(subject => mentor.subjects.includes(subject))
  );

  if (matchingMentors.length === 0) {
    return mentors[0]; // Fallback to first mentor
  }

  // Allocation rules based on student profile
  let scoredMentors = matchingMentors.map(mentor => {
    let score = 0;

    // Rule 1: Beginner students → More experienced mentors
    if (student.detectedLevel === 'beginner' && mentor.experience >= 3) {
      score += 30;
    }

    // Rule 2: Younger students (Foundation mode) → Patient mentors
    if (student.age <= 10 && mentor.teachingExperience) {
      score += 25;
    }

    // Rule 3: Advanced students → Subject-specialized mentors
    if (student.detectedLevel === 'advanced' && mentor.skillLevel === 'advanced') {
      score += 35;
    }

    // Rule 4: Subject expertise match
    const subjectMatch = student.subjects.filter(s => mentor.subjects.includes(s)).length;
    score += subjectMatch * 10;

    // Rule 5: Mentor availability match
    const availabilityMatch = student.availability.some(slot =>
      mentor.availability.includes(slot)
    );
    if (availabilityMatch) {
      score += 20;
    }

    // Rule 6: Prefer mentors with fewer assigned students (load balancing)
    if (mentor.assignedStudents.length < 3) {
      score += 15;
    }

    // Rule 7: Consider mentor ratings
    const avgRating = Object.values(mentor.ratings).reduce((a, b) => a + b, 0) / Object.values(mentor.ratings).length;
    score += avgRating * 5;

    return { mentor, score };
  });

  // Sort by score and return best match
  scoredMentors.sort((a, b) => b.score - a.score);
  return scoredMentors[0].mentor;
};

// Get class-based subjects
export const getSubjectsByClass = (classLevel) => {
  const classNum = parseInt(classLevel);

  if (classNum <= 5) {
    // Lower classes
    return ['Math', 'English', 'EVS'];
  } else if (classNum <= 10) {
    // Middle classes
    return ['Math', 'Science', 'English', 'Social Studies'];
  } else {
    // Higher classes
    return ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'];
  }
};
