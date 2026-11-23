-- ====================================================================
-- ExamPrep AI - MySQL Database Schema (schema-mysql.sql)
-- AI-Powered Mock Test System & TNPSC Previous Year Question Paper Archive
-- ====================================================================

CREATE DATABASE IF NOT EXISTS examprep_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE examprep_db;

-- --------------------------------------------------------------------
-- 1. Question Papers Table (TNPSC Group 2 & Group 4 Uploaded PDF Papers)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_papers (
    id VARCHAR(100) PRIMARY KEY,
    exam_group VARCHAR(50) NOT NULL, -- 'Group 2', 'Group 4'
    exam_year INT NOT NULL,
    exam_type VARCHAR(50) NOT NULL, -- 'Prelims', 'Mains', 'Objective'
    language VARCHAR(50) NOT NULL, -- 'Tamil', 'English', 'Bilingual'
    title VARCHAR(255) NOT NULL,
    total_questions INT DEFAULT 200,
    duration_minutes INT DEFAULT 180,
    total_marks INT DEFAULT 300,
    pdf_file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    publication_status VARCHAR(50) DEFAULT 'Ready', -- 'Ready', 'Incomplete', 'Draft'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_group_year (exam_group, exam_year),
    INDEX idx_language (language),
    INDEX idx_exam_type (exam_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Questions Bank Table (Verified PYQs & AI-Generated Question Bank)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(100) PRIMARY KEY,
    question_text LONGTEXT NOT NULL,
    question_text_ta LONGTEXT,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer VARCHAR(10) NOT NULL,
    explanation LONGTEXT,
    explanation_ta LONGTEXT,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    exam_group VARCHAR(50) NOT NULL, -- 'Group 2', 'Group 4', 'Banking', 'SSC'
    exam_year INT,
    language VARCHAR(50) DEFAULT 'Bilingual', -- 'Tamil', 'English', 'Bilingual'
    question_source VARCHAR(50) DEFAULT 'PREVIOUS_YEAR', -- 'PREVIOUS_YEAR', 'AI_GENERATED'
    pdf_id VARCHAR(100),
    pdf_page_number INT,
    question_number INT,
    verification_status VARCHAR(50) DEFAULT 'VERIFIED', -- 'VERIFIED', 'PENDING_VERIFICATION', 'REJECTED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pdf_id) REFERENCES question_papers(id) ON DELETE SET NULL,
    INDEX idx_exam_topic (exam_group, subject, topic),
    INDEX idx_source_status (question_source, verification_status),
    INDEX idx_pdf (pdf_id),
    INDEX idx_exam_year (exam_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Mock Tests Table (Configured Mock Tests: PYQ, AI-Generated, Mixed)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mock_tests (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    exam_group VARCHAR(50) NOT NULL,
    subject VARCHAR(100),
    topic VARCHAR(100),
    total_questions INT NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- 'PYQ', 'AI_GENERATED', 'MIXED'
    pyq_percentage INT DEFAULT 100,
    duration_minutes INT DEFAULT 60,
    total_marks DOUBLE DEFAULT 100,
    negative_marking DOUBLE DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_test_type (exam_group, test_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Mock Test Questions Mapping Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mock_test_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mock_test_id VARCHAR(100) NOT NULL,
    question_id VARCHAR(100) NOT NULL,
    question_order INT DEFAULT 1,
    FOREIGN KEY (mock_test_id) REFERENCES mock_tests(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_mock_q (mock_test_id, question_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Weak Sections Table (AI-Detected Weak Areas)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weak_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    topic_name VARCHAR(100),
    accuracy DOUBLE,
    weakness_level VARCHAR(50) NOT NULL, -- 'Weak', 'Needs Improvement', 'Good', 'Excellent'
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    wrong_answers INT DEFAULT 0,
    recommendations TEXT,
    detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_section (student_id, section_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. Performance Analyses Table (OpenAI Structured Evaluations)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS performance_analyses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    test_attempt_id VARCHAR(100),
    analysis_json LONGTEXT,
    overall_accuracy DOUBLE,
    total_questions INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    skipped_count INT DEFAULT 0,
    repeated_mistake_topics TEXT,
    strong_concepts TEXT,
    weak_concepts TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_created (student_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. AI Generated Questions Table (Strictly from Weak Sections)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_generated_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    topic_name VARCHAR(100),
    difficulty_level VARCHAR(20) DEFAULT 'MEDIUM',
    question_text LONGTEXT NOT NULL,
    question_text_en LONGTEXT,
    question_text_ta LONGTEXT,
    options_json LONGTEXT NOT NULL,
    correct_answer VARCHAR(10) NOT NULL,
    explanation LONGTEXT,
    explanation_en LONGTEXT,
    explanation_ta LONGTEXT,
    language VARCHAR(50) DEFAULT 'Both',
    shortcut VARCHAR(255),
    concept VARCHAR(255),
    estimated_time_seconds INT DEFAULT 60,
    status VARCHAR(30) DEFAULT 'PENDING',
    reviewed_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_status (student_id, status),
    INDEX idx_section (section_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. AI Test Attempts Table (History & Score Comparisons)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_test_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    test_title VARCHAR(255),
    section_name VARCHAR(100),
    total_questions INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    skipped_count INT DEFAULT 0,
    score DOUBLE DEFAULT 0,
    max_score DOUBLE DEFAULT 0,
    accuracy_percentage DOUBLE DEFAULT 0,
    time_taken_seconds INT DEFAULT 0,
    questions_json LONGTEXT,
    answers_json LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_test (student_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 9. AI Tutor Sessions Table (Saved Explanations & Formula Guides)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_tutor_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    section_name VARCHAR(100) NOT NULL,
    topic_name VARCHAR(100),
    tutor_response_json LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_tutor (student_id, section_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 10. User Streaks Table (Daily Activity & Streak Tracking in Asia/Kolkata)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_streaks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL UNIQUE,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    last_activity_timestamp DATETIME,
    total_active_days INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_streak (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 11. User Streak Activities Table (Historical Activity Logs)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_streak_activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    activity_date DATE NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_details VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_activity_date (user_id, activity_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DATA: Verified Official TNPSC Group 2 & Group 4 Question Papers
-- ====================================================================
INSERT INTO question_papers (id, exam_group, exam_year, exam_type, language, title, total_questions, duration_minutes, total_marks, pdf_file_path, publication_status)
VALUES
('tnpsc-g4-2011', 'Group 4', 2011, 'Objective', 'Bilingual', 'TNPSC Group 4 - 2011 General Knowledge & General English', 200, 180, 300, '/pdfs/tnpsc_group4_2011.pdf', 'Ready'),
('tnpsc-g4-2012', 'Group 4', 2012, 'Objective', 'Bilingual', 'TNPSC Group 4 - 2012 General Studies & General Tamil/English', 200, 180, 300, '/pdfs/tnpsc_group4_2012.pdf', 'Ready'),
('tnpsc-g4-2018', 'Group 4', 2018, 'Objective', 'Bilingual', 'TNPSC Group 4 - 2018 General Studies & General Tamil/English', 200, 180, 300, '/pdfs/tnpsc_group4_2018.pdf', 'Ready'),
('tnpsc-g4-2019', 'Group 4', 2019, 'Objective', 'Bilingual', 'TNPSC Group 4 - 2019 General Studies & General Tamil/English', 200, 180, 300, '/pdfs/tnpsc_group4_2019.pdf', 'Ready'),
('tnpsc-g4-2022', 'Group 4', 2022, 'Objective', 'Bilingual', 'TNPSC Group 4 - 2022 General Studies & General Tamil/English', 200, 180, 300, '/pdfs/tnpsc_group4_2022.pdf', 'Ready'),
('tnpsc-g4-2024', 'Group 4', 2024, 'Objective', 'Bilingual', 'TNPSC Group 4 - 2024 General Studies & General Tamil/English', 200, 180, 300, '/pdfs/tnpsc_group4_2024.pdf', 'Ready'),
('tnpsc-g2-2022', 'Group 2', 2022, 'Prelims', 'Bilingual', 'TNPSC Group 2 - 2022 Combined Civil Services Prelims', 200, 180, 300, '/pdfs/tnpsc_group2_2022.pdf', 'Ready'),
('tnpsc-g2-2024', 'Group 2', 2024, 'Prelims', 'Bilingual', 'TNPSC Group 2 - 2024 Combined Civil Services Prelims & Mains', 200, 180, 300, '/pdfs/tnpsc_group2_2024.pdf', 'Ready')
ON DUPLICATE KEY UPDATE title=VALUES(title), pdf_file_path=VALUES(pdf_file_path);

-- ====================================================================
-- SEED DATA: Verified TNPSC Questions Bank (Tamil & English Preserved)
-- ====================================================================
INSERT INTO questions (id, question_text, question_text_ta, option_a, option_b, option_c, option_d, correct_answer, explanation, explanation_ta, subject, topic, exam_group, exam_year, language, question_source, pdf_id, pdf_page_number, question_number, verification_status)
VALUES
('tnpsc-q-101', 
 'Which Article of the Indian Constitution provides for the Finance Commission?',
 'இந்திய அரசியலமைப்பின் எந்த உறுப்பு நிதிக் குழுவினைப் பற்றி குறிப்பிடுகிறது?',
 'Article 275', 'Article 280', 'Article 282', 'Article 285',
 'B',
 'Article 280 of the Constitution provides that the President of India shall constitute a Finance Commission at the expiration of every fifth year.',
 'அரசியலமைப்பு உறுப்பு 280 ஒவ்வொரு ஐந்து ஆண்டுகளின் முடிவிலும் குடியரசுத் தலைவர் நிதிக் குழுவை அமைக்க வேண்டும் என்று கூறுகிறது.',
 'General Knowledge', 'Indian Polity & Constitution', 'Group 4', 2011, 'Bilingual', 'PREVIOUS_YEAR', 'tnpsc-g4-2011', 2, 1, 'VERIFIED'),

('tnpsc-q-102',
 'In a certain school, 20% of students are below 8 years of age. The number of students above 8 years of age is 2/3 of the number of students of 8 years age which is 48. What is the total number of students in the school?',
 'ஒரு பள்ளியில் 20% மாணவர்கள் 8 வயதுக்குட்பட்டவர்கள். 8 வயதுக்கு மேற்பட்ட மாணவர்களின் எண்ணிக்கை 8 வயது மாணவர்களின் எண்ணிக்கையில் 2/3 பங்கு ஆகும் (இது 48). எனில் பள்ளியின் மொத்த மாணவர் எண்ணிக்கை என்ன?',
 '72', '80', '100', '120',
 'C',
 'Students of 8 years = 48. Students above 8 years = (2/3) * 48 = 32. Total >= 8 years = 48 + 32 = 80. Since below 8 years is 20%, 80 represents 80%. Therefore Total Students = 80 / 0.8 = 100.',
 '8 வயது மாணவர்கள் = 48. 8 வயதுக்கு மேற்பட்டோர் = 32. மொத்தம் = 80. 80% = 80 எனில் மொத்த மாணவர்கள் = 100.',
 'General Mental Ability', 'Percentage', 'Group 4', 2011, 'Bilingual', 'PREVIOUS_YEAR', 'tnpsc-g4-2011', 5, 2, 'VERIFIED'),

('tnpsc-q-103',
 'Select the correct sentence with the appropriate preposition: "The examination will commence _____ 10.00 a.m."',
 'சரியான முன்னிடைச்சொல்லைத் தேர்ந்தெடுக்க: "The examination will commence _____ 10.00 a.m."',
 'at', 'on', 'in', 'by',
 'A',
 'Preposition "at" is used for specific times of the day (e.g., at 10.00 a.m., at noon).',
 'குறிப்பிட்ட நேரத்தைக் குறிக்க "at" என்ற முன்னிடைச்சொல் பயன்படுத்தப்படுகிறது.',
 'General English', 'Prepositions & Phrasal Verbs', 'Group 4', 2011, 'English', 'PREVIOUS_YEAR', 'tnpsc-g4-2011', 8, 3, 'VERIFIED'),

('tnpsc-q-104',
 'Who among the following was known as "Kappalottiya Thamizhan"?',
 '"கப்பலோட்டிய தமிழன்" என்று அழைக்கப்படுபவர் யார்?',
 'V.O. Chidambaram Pillai', 'Subramania Bharati', 'Vanchinathan', 'Tiruppur Kumaran',
 'A',
 'V. O. Chidambaram Pillai founded the Swadeshi Steam Navigation Company in 1906 to compete against British monopoly, earning the title Kappalottiya Thamizhan.',
 '1906 இல் சுதேசி நீராவி கப்பல் நிறுவனத்தை நிறுவிய வ.உ.சிதம்பரனார் "கப்பலோட்டிய தமிழன்" எனப் போற்றப்படுகிறார்.',
 'General Knowledge', 'Indian History & Culture', 'Group 4', 2018, 'Bilingual', 'PREVIOUS_YEAR', 'tnpsc-g4-2018', 12, 4, 'VERIFIED'),

('tnpsc-q-105',
 'Find the Highest Common Factor (HCF) of 36, 54, and 72.',
 '36, 54 மற்றும் 72 ஆகிய எண்களின் மீப்பெரு பொது வகுத்தி (மீ.பொ.வ) காண்க.',
 '9', '12', '18', '36',
 'C',
 'Prime factors: 36 = 2^2 * 3^2, 54 = 2 * 3^3, 72 = 2^3 * 3^2. Common prime factors: 2^1 * 3^2 = 18.',
 'பகா காரணி: 36 = 2^2 * 3^2, 54 = 2 * 3^3, 72 = 2^3 * 3^2. பொதுவானவை: 2 * 9 = 18.',
 'General Mental Ability', 'Highest Common Factor (HCF) & LCM', 'Group 4', 2019, 'Bilingual', 'PREVIOUS_YEAR', 'tnpsc-g4-2019', 15, 5, 'VERIFIED'),

('tnpsc-q-201',
 'The Planning Commission of India was replaced by NITI Aayog on which date?',
 'இந்திய திட்டக் குழுவிற்குப் பதிலாக எந்தத் தேதியில் நிதி ஆயோக் அமைக்கப்பட்டது?',
 'January 1, 2014', 'January 1, 2015', 'August 15, 2014', 'April 1, 2015',
 'B',
 'NITI Aayog (National Institution for Transforming India) was formed via a cabinet resolution on January 1, 2015.',
 'நிதி ஆயோக் ஜனவரி 1, 2015 அன்று மத்திய அமைச்சரவை தீர்மானம் மூலம் தொடங்கப்பட்டது.',
 'General Knowledge', 'Indian Polity & Administration', 'Group 2', 2022, 'Bilingual', 'PREVIOUS_YEAR', 'tnpsc-g2-2022', 4, 1, 'VERIFIED'),

('tnpsc-q-202',
 'If A can complete a work in 12 days and B can do the same work in 24 days, in how many days can both complete it together?',
 'A ஒரு வேலையை 12 நாட்களிலும், B அதே வேலையை 24 நாட்களிலும் முடித்தால், இருவரும் சேர்ந்து அவ்வேலையை எத்தனை நாட்களில் முடிப்பர்?',
 '6 days', '8 days', '10 days', '18 days',
 'B',
 'Combined 1 day work = 1/12 + 1/24 = 3/24 = 1/8. Both together finish in 8 days.',
 'ஒரு நாள் வேலை = 1/12 + 1/24 = 3/24 = 1/8. இருவரும் சேர்ந்து 8 நாட்களில் முடிப்பார்கள்.',
 'General Mental Ability', 'Time and Work', 'Group 2', 2022, 'Bilingual', 'PREVIOUS_YEAR', 'tnpsc-g2-2022', 7, 2, 'VERIFIED')
ON DUPLICATE KEY UPDATE question_text=VALUES(question_text);
