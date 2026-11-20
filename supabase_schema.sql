-- ExamPrep AI - Supabase PostgreSQL Schema DDL
-- Database script for Banking, Railway, and SSC Competitive Exam Prep

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    target_exam_id UUID,
    streak_count INT DEFAULT 0,
    current_main_level TEXT DEFAULT 'Medium',
    current_sub_level TEXT DEFAULT 'L3',
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- e.g. 'SBI_PO', 'SSC_CGL'
    name TEXT NOT NULL, -- e.g. 'SBI PO'
    category TEXT NOT NULL CHECK (category IN ('Banking', 'Railway', 'SSC')),
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- Quantitative Aptitude, Reasoning Ability, English, etc.
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Topics Table
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- Percentage, Profit & Loss, Syllogism, etc.
    code TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (subject_id, code)
);

-- 5. Data-Driven 25 Difficulty Levels Table (5 Main Levels x 5 Sublevels)
CREATE TABLE IF NOT EXISTS difficulty_levels (
    id INT PRIMARY KEY, -- 1 to 25
    main_level TEXT NOT NULL CHECK (main_level IN ('Easy', 'Medium', 'Intermediate', 'Hard', 'Expert')),
    sub_level TEXT NOT NULL CHECK (sub_level IN ('L1', 'L2', 'L3', 'L4', 'L5')),
    display_name TEXT NOT NULL, -- e.g. "Medium L3"
    sort_order INT NOT NULL,
    required_questions INT DEFAULT 10,
    required_accuracy NUMERIC(5,2) DEFAULT 75.00,
    description TEXT,
    UNIQUE(main_level, sub_level)
);

-- Populate 25 Data-Driven Difficulty Levels
INSERT INTO difficulty_levels (id, main_level, sub_level, display_name, sort_order, required_questions, required_accuracy, description) VALUES
(1,  'Easy',         'L1', 'Easy L1',         1,  0,  0.00,  'Basic formula and core concept understanding'),
(2,  'Easy',         'L2', 'Easy L2',         2,  5,  65.00, 'Simple 1-step direct applications'),
(3,  'Easy',         'L3', 'Easy L3',         3,  10, 70.00, 'Standard easy level problems'),
(4,  'Easy',         'L4', 'Easy L4',         4,  15, 72.00, 'Upper easy tier questions'),
(5,  'Easy',         'L5', 'Easy L5',         5,  20, 75.00, 'Strongest easy level practice'),

(6,  'Medium',       'L1', 'Medium L1',       6,  25, 75.00, 'Entry medium level concepts'),
(7,  'Medium',       'L2', 'Medium L2',       7,  30, 75.00, 'Standard 2-step moderate calculations'),
(8,  'Medium',       'L3', 'Medium L3',       8,  35, 78.00, 'Core standard exam practice'),
(9,  'Medium',       'L4', 'Medium L4',       9,  40, 80.00, 'Strong medium reasoning & quant'),
(10, 'Medium',       'L5', 'Medium L5',       10, 45, 80.00, 'Upper medium difficulty'),

(11, 'Intermediate', 'L1', 'Intermediate L1', 11, 50, 80.00, 'Standard prelims exam benchmark'),
(12, 'Intermediate', 'L2', 'Intermediate L2', 12, 55, 82.00, 'Moderate multi-concept questions'),
(13, 'Intermediate', 'L3', 'Intermediate L3', 13, 60, 82.00, 'Solid competitive exam difficulty'),
(14, 'Intermediate', 'L4', 'Intermediate L4', 14, 65, 84.00, 'Challenging prelims questions'),
(15, 'Intermediate', 'L5', 'Intermediate L5', 15, 70, 85.00, 'Top intermediate exam level'),

(16, 'Hard',         'L1', 'Hard L1',         16, 75, 85.00, 'Mains entry level problems'),
(17, 'Hard',         'L2', 'Hard L2',         17, 80, 85.00, 'Complex puzzles and multi-variable DI'),
(18, 'Hard',         'L3', 'Hard L3',         18, 85, 86.00, 'High-difficulty analytical reasoning'),
(19, 'Hard',         'L4', 'Hard L4',         19, 90, 88.00, 'Advanced calculations and speed tests'),
(20, 'Hard',         'L5', 'Hard L5',         20, 95, 90.00, 'Peak hard mains level questions'),

(21, 'Expert',       'L1', 'Expert L1',       21, 100, 90.00, 'Expert tier entry level'),
(22, 'Expert',       'L2', 'Expert L2',       22, 110, 92.00, 'Advanced high-level puzzles'),
(23, 'Expert',       'L3', 'Expert L3',       23, 120, 94.00, 'Mastery level data interpretation'),
(24, 'Expert',       'L4', 'Expert L4',       24, 130, 95.00, 'Ultra-hard competitive challenges'),
(25, 'Expert',       'L5', 'Expert L5',       25, 150, 96.00, 'Highest internal practice difficulty')
ON CONFLICT (id) DO NOTHING;

-- 6. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    difficulty INT REFERENCES difficulty_levels(id) DEFAULT 8, -- 1..25
    main_level TEXT DEFAULT 'Medium',
    sub_level TEXT DEFAULT 'L3',
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN (
        'Multiple Choice', 'True/False', 'Numerical Answer', 
        'Fill in the Blank', 'Assertion & Reason', 'Data Interpretation', 
        'Puzzles', 'Reading Comprehension'
    )),
    passage_text TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    shortcut TEXT,
    concept TEXT,
    estimated_time INT DEFAULT 60,
    language TEXT DEFAULT 'English',
    is_ai_generated BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'approved' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Question Options Table
CREATE TABLE IF NOT EXISTS question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_key TEXT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (question_id, option_key)
);

-- 8. Previous Year Papers Table (With Validation System)
CREATE TABLE IF NOT EXISTS previous_year_papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    year INT NOT NULL CHECK (year >= 2020 AND year <= 2030),
    stage TEXT NOT NULL, -- Prelims, Mains, Tier 1, Tier 2, CBT-1, CBT-2
    shift TEXT NOT NULL, -- Shift 1, Shift 2, Shift 3
    exam_date DATE,
    duration INT NOT NULL, -- Minutes
    total_questions INT NOT NULL,
    expected_questions INT NOT NULL DEFAULT 100,
    total_marks NUMERIC(5,2) NOT NULL,
    negative_marking NUMERIC(4,2) DEFAULT 0.25,
    source TEXT NOT NULL DEFAULT 'Official Memory-Based Paper',
    publication_status TEXT DEFAULT 'Ready' CHECK (publication_status IN ('Ready', 'Incomplete', 'Draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Previous Year Questions Table
CREATE TABLE IF NOT EXISTS previous_year_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID NOT NULL REFERENCES previous_year_papers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    question_number INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT DEFAULT 'Multiple Choice',
    passage_text TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    shortcut TEXT,
    concept TEXT,
    difficulty INT REFERENCES difficulty_levels(id) DEFAULT 8,
    main_level TEXT DEFAULT 'Medium',
    sub_level TEXT DEFAULT 'L3',
    source_reference TEXT DEFAULT 'Authentic Exam Sourced Question',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Mock Tests Table
CREATE TABLE IF NOT EXISTS mock_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    description TEXT,
    duration INT NOT NULL,
    total_questions INT NOT NULL,
    total_marks NUMERIC(6,2) NOT NULL,
    negative_marking NUMERIC(4,2) DEFAULT 0.25,
    difficulty_level INT DEFAULT 8,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
