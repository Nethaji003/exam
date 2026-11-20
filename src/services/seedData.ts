import {
  Exam,
  Subject,
  Topic,
  DifficultyLevel,
  Question,
  PreviousYearPaper,
  PreviousYearQuestion,
  MockTest,
  QuestionPaper,
} from '../types/database';

export const SEED_EXAMS: Exam[] = [
  // Banking
  { id: 'exam-sbi-po', code: 'SBI_PO', name: 'SBI PO', category: 'Banking', description: 'State Bank of India Probationary Officer Exam' },
  { id: 'exam-sbi-clerk', code: 'SBI_CLERK', name: 'SBI Clerk', category: 'Banking', description: 'State Bank of India Junior Associate Exam' },
  { id: 'exam-ibps-po', code: 'IBPS_PO', name: 'IBPS PO', category: 'Banking', description: 'Institute of Banking Personnel Selection PO' },
  { id: 'exam-ibps-clerk', code: 'IBPS_CLERK', name: 'IBPS Clerk', category: 'Banking', description: 'Institute of Banking Personnel Selection Clerk' },
  { id: 'exam-rbi-assistant', code: 'RBI_ASSISTANT', name: 'RBI Assistant', category: 'Banking', description: 'Reserve Bank of India Assistant Recruitment' },
  
  // Railway
  { id: 'exam-rrb-ntpc', code: 'RRB_NTPC', name: 'RRB NTPC', category: 'Railway', description: 'Railway Recruitment Board Non-Technical Popular Categories (CBT-1 / CBT-2)' },
  { id: 'exam-rrb-group-d', code: 'RRB_GROUP_D', name: 'RRB Group D', category: 'Railway', description: 'Railway Recruitment Board Group D Staff' },
  { id: 'exam-rrb-alp', code: 'RRB_ALP', name: 'RRB ALP', category: 'Railway', description: 'Railway Recruitment Board Assistant Loco Pilot' },
  
  // SSC
  { id: 'exam-ssc-cgl', code: 'SSC_CGL', name: 'SSC CGL', category: 'SSC', description: 'Staff Selection Commission Combined Graduate Level' },
  { id: 'exam-ssc-chsl', code: 'SSC_CHSL', name: 'SSC CHSL', category: 'SSC', description: 'Staff Selection Commission Combined Higher Secondary Level' },
  { id: 'exam-ssc-mts', code: 'SSC_MTS', name: 'SSC MTS', category: 'SSC', description: 'Staff Selection Commission Multi-Tasking Staff' },

  // TNPSC
  { id: 'exam-tnpsc-group4', code: 'TNPSC_GROUP4', name: 'TNPSC Group 4', category: 'TNPSC', description: 'Tamil Nadu Public Service Commission Combined Civil Services Examination IV (Group 4 Services & VAO)' },
  { id: 'exam-tnpsc-group2', code: 'TNPSC_GROUP2', name: 'TNPSC Group 2', category: 'TNPSC', description: 'Tamil Nadu Public Service Commission Combined Civil Services Examination II (Group 2 & 2A Services)' },
];

export const SEED_SUBJECTS: Subject[] = [
  { id: 'subj-quant', name: 'Quantitative Aptitude', code: 'QUANT', description: 'Numerical ability, data interpretation, arithmetic & algebra' },
  { id: 'subj-reasoning', name: 'Reasoning Ability', code: 'REASONING', description: 'Logical reasoning, analytical puzzles, seating arrangement, syllogism' },
  { id: 'subj-english', name: 'English Language', code: 'ENGLISH', description: 'Grammar, vocabulary, reading comprehension, cloze test' },
  { id: 'subj-ga', name: 'General Awareness', code: 'GA', description: 'History, Polity, Geography, Indian Economy & Science' },
  { id: 'subj-current', name: 'Current Affairs', code: 'CURRENT_AFFAIRS', description: 'National & International news, sports, appointments, summits' },
  { id: 'subj-banking', name: 'Banking Awareness', code: 'BANKING', description: 'RBI monetary policies, financial markets, banking terms, fintech' },
];

export const SEED_TOPICS: Topic[] = [
  // Quant Topics
  { id: 'top-percentage', subject_id: 'subj-quant', name: 'Percentage', code: 'PERCENTAGE', description: 'Base change, successive percentage, population & voting problems' },
  { id: 'top-profit-loss', subject_id: 'subj-quant', name: 'Profit & Loss', code: 'PROFIT_LOSS', description: 'Markup percentage, discount, dishonest seller & marked price' },
  { id: 'top-time-work', subject_id: 'subj-quant', name: 'Time & Work', code: 'TIME_WORK', description: 'Efficiency, work-wages, pipes and cisterns' },
  { id: 'top-simple-interest', subject_id: 'subj-quant', name: 'Simple Interest', code: 'SIMPLE_INTEREST', description: 'Principal, annual rate, time, maturity amount calculations' },
  { id: 'top-compound-interest', subject_id: 'subj-quant', name: 'Compound Interest', code: 'COMPOUND_INTEREST', description: 'Compounding frequency, effective interest rate, difference between CI and SI' },
  { id: 'top-number-system', subject_id: 'subj-quant', name: 'Number System', code: 'NUMBER_SYSTEM', description: 'Divisibility rules, unit digit, remainders, LCM & HCF' },
  { id: 'top-average', subject_id: 'subj-quant', name: 'Average', code: 'AVERAGE', description: 'Weighted average, age problems, deviation method' },
  { id: 'top-di', subject_id: 'subj-quant', name: 'Data Interpretation', code: 'DI', description: 'Bar chart, Pie chart, Line graph, Caselet DI' },
  
  // Reasoning Topics
  { id: 'top-logical-reasoning', subject_id: 'subj-reasoning', name: 'Logical Reasoning', code: 'LOGICAL_REASONING', description: 'Statement assumptions, course of action, cause & effect' },
  { id: 'top-puzzles', subject_id: 'subj-reasoning', name: 'Puzzles', code: 'PUZZLES', description: 'Floor based, box based, scheduling, month-date puzzles' },
  { id: 'top-seating', subject_id: 'subj-reasoning', name: 'Seating Arrangement', code: 'SEATING', description: 'Circular, linear, square, parallel row seating' },
  { id: 'top-coding', subject_id: 'subj-reasoning', name: 'Coding-Decoding', code: 'CODING', description: 'Chinese coding, letter shift, binary coding' },
  { id: 'top-syllogism', subject_id: 'subj-reasoning', name: 'Syllogism', code: 'SYLLOGISM', description: 'Only a few, possessive statements, reverse syllogism' },
  
  // English Topics
  { id: 'top-grammar', subject_id: 'subj-english', name: 'Grammar', code: 'GRAMMAR', description: 'Error spotting, sentence improvement, prepositions, tenses' },
  { id: 'top-rc', subject_id: 'subj-english', name: 'Reading Comprehension', code: 'RC', description: 'Passage inference, central theme, tone & vocabulary in context' },
  
  // General & Banking Awareness Topics
  { id: 'top-polity', subject_id: 'subj-ga', name: 'Indian Polity', code: 'POLITY', description: 'Constitution, Fundamental Rights, Parliament, Articles' },
  { id: 'top-history', subject_id: 'subj-ga', name: 'History', code: 'HISTORY', description: 'Ancient, Medieval & Indian National Movement' },
  { id: 'top-geography', subject_id: 'subj-ga', name: 'Geography', code: 'GEOGRAPHY', description: 'Rivers, mountains, climate, agriculture & maps' },
  { id: 'top-economy', subject_id: 'subj-ga', name: 'Economy', code: 'ECONOMY', description: 'GDP, Inflation, Union Budget, Five Year Plans' },
  { id: 'top-banking-terms', subject_id: 'subj-banking', name: 'Banking Terms & RBI', code: 'BANKING_TERMS', description: 'Repo Rate, Reverse Repo, CRR, SLR, BASEL III, Monetary Policy' },
  { id: 'top-current-news', subject_id: 'subj-current', name: 'Current Affairs 2025-2026', code: 'CURRENT_NEWS', description: 'Monthly current affairs, awards, summits & sports' }
];

// 25 Data-Driven Difficulty Levels (5 Main Levels x 5 Sublevels)
export const SEED_DIFFICULTY_LEVELS: DifficultyLevel[] = [
  // Easy L1 - L5
  { id: 1,  main_level: 'Easy', sub_level: 'L1', display_name: 'Easy L1', sort_order: 1,  required_questions: 0,  required_accuracy: 0.00,  description: 'Basic formula and core concept understanding' },
  { id: 2,  main_level: 'Easy', sub_level: 'L2', display_name: 'Easy L2', sort_order: 2,  required_questions: 5,  required_accuracy: 65.00, description: 'Simple 1-step direct applications' },
  { id: 3,  main_level: 'Easy', sub_level: 'L3', display_name: 'Easy L3', sort_order: 3,  required_questions: 10, required_accuracy: 70.00, description: 'Standard easy level problems' },
  { id: 4,  main_level: 'Easy', sub_level: 'L4', display_name: 'Easy L4', sort_order: 4,  required_questions: 15, required_accuracy: 72.00, description: 'Upper easy tier questions' },
  { id: 5,  main_level: 'Easy', sub_level: 'L5', display_name: 'Easy L5', sort_order: 5,  required_questions: 20, required_accuracy: 75.00, description: 'Strongest easy level practice' },

  // Medium L1 - L5
  { id: 6,  main_level: 'Medium', sub_level: 'L1', display_name: 'Medium L1', sort_order: 6,  required_questions: 25, required_accuracy: 75.00, description: 'Entry medium level concepts' },
  { id: 7,  main_level: 'Medium', sub_level: 'L2', display_name: 'Medium L2', sort_order: 7,  required_questions: 30, required_accuracy: 75.00, description: 'Standard 2-step moderate calculations' },
  { id: 8,  main_level: 'Medium', sub_level: 'L3', display_name: 'Medium L3', sort_order: 8,  required_questions: 35, required_accuracy: 78.00, description: 'Core standard exam practice' },
  { id: 9,  main_level: 'Medium', sub_level: 'L4', display_name: 'Medium L4', sort_order: 9,  required_questions: 40, required_accuracy: 80.00, description: 'Strong medium reasoning & quant' },
  { id: 10, main_level: 'Medium', sub_level: 'L5', display_name: 'Medium L5', sort_order: 10, required_questions: 45, required_accuracy: 80.00, description: 'Upper medium difficulty' },

  // Intermediate L1 - L5
  { id: 11, main_level: 'Intermediate', sub_level: 'L1', display_name: 'Intermediate L1', sort_order: 11, required_questions: 50, required_accuracy: 80.00, description: 'Standard prelims exam benchmark' },
  { id: 12, main_level: 'Intermediate', sub_level: 'L2', display_name: 'Intermediate L2', sort_order: 12, required_questions: 55, required_accuracy: 82.00, description: 'Moderate multi-concept questions' },
  { id: 13, main_level: 'Intermediate', sub_level: 'L3', display_name: 'Intermediate L3', sort_order: 13, required_questions: 60, required_accuracy: 82.00, description: 'Solid competitive exam difficulty' },
  { id: 14, main_level: 'Intermediate', sub_level: 'L4', display_name: 'Intermediate L4', sort_order: 14, required_questions: 65, required_accuracy: 84.00, description: 'Challenging prelims questions' },
  { id: 15, main_level: 'Intermediate', sub_level: 'L5', display_name: 'Intermediate L5', sort_order: 15, required_questions: 70, required_accuracy: 85.00, description: 'Top intermediate exam level' },

  // Hard L1 - L5
  { id: 16, main_level: 'Hard', sub_level: 'L1', display_name: 'Hard L1', sort_order: 16, required_questions: 75, required_accuracy: 85.00, description: 'Mains entry level problems' },
  { id: 17, main_level: 'Hard', sub_level: 'L2', display_name: 'Hard L2', sort_order: 17, required_questions: 80, required_accuracy: 85.00, description: 'Complex puzzles and multi-variable DI' },
  { id: 18, main_level: 'Hard', sub_level: 'L3', display_name: 'Hard L3', sort_order: 18, required_questions: 85, required_accuracy: 86.00, description: 'High-difficulty analytical reasoning' },
  { id: 19, main_level: 'Hard', sub_level: 'L4', display_name: 'Hard L4', sort_order: 19, required_questions: 90, required_accuracy: 88.00, description: 'Advanced calculations and speed tests' },
  { id: 20, main_level: 'Hard', sub_level: 'L5', display_name: 'Hard L5', sort_order: 20, required_questions: 95, required_accuracy: 90.00, description: 'Peak hard mains level questions' },

  // Expert L1 - L5
  { id: 21, main_level: 'Expert', sub_level: 'L1', display_name: 'Expert L1', sort_order: 21, required_questions: 100, required_accuracy: 90.00, description: 'Expert tier entry level' },
  { id: 22, main_level: 'Expert', sub_level: 'L2', display_name: 'Expert L2', sort_order: 22, required_questions: 110, required_accuracy: 92.00, description: 'Advanced high-level puzzles' },
  { id: 23, main_level: 'Expert', sub_level: 'L3', display_name: 'Expert L3', sort_order: 23, required_questions: 120, required_accuracy: 94.00, description: 'Mastery level data interpretation' },
  { id: 24, main_level: 'Expert', sub_level: 'L4', display_name: 'Expert L4', sort_order: 24, required_questions: 130, required_accuracy: 95.00, description: 'Ultra-hard competitive challenges' },
  { id: 25, main_level: 'Expert', sub_level: 'L5', display_name: 'Expert L5', sort_order: 25, required_questions: 150, required_accuracy: 96.00, description: 'Highest internal practice difficulty' },
];

export const SEED_QUESTIONS: Question[] = [
  // 1. Easy L1 Question
  {
    id: 'q-easy-l1-1',
    exam_id: 'exam-sbi-po',
    subject_id: 'subj-quant',
    topic_id: 'top-percentage',
    difficulty: 1,
    main_level: 'Easy',
    sub_level: 'L1',
    question_type: 'Multiple Choice',
    question_text: '[Easy L1] Convert 3/5 into a percentage.',
    options: [
      { id: 'opt-e1-1', question_id: 'q-easy-l1-1', option_key: 'A', option_text: '60%', is_correct: true },
      { id: 'opt-e1-2', question_id: 'q-easy-l1-1', option_key: 'B', option_text: '50%', is_correct: false },
      { id: 'opt-e1-3', question_id: 'q-easy-l1-1', option_key: 'C', option_text: '75%', is_correct: false },
      { id: 'opt-e1-4', question_id: 'q-easy-l1-1', option_key: 'D', option_text: '40%', is_correct: false },
    ],
    correct_answer: 'A',
    explanation: '(3 / 5) * 100 = 60%. Basic fraction-to-percentage conversion.',
    shortcut: '3/5 = 0.60 = 60%',
    concept: 'Percentage Conversion Basics',
    estimated_time: 15,
    language: 'English',
    is_ai_generated: true,
    status: 'approved',
    exam_name: 'SBI PO',
    subject_name: 'Quantitative Aptitude',
    topic_name: 'Percentage'
  },

  // 2. Medium L3 Question
  {
    id: 'q-med-l3-1',
    exam_id: 'exam-rrb-ntpc',
    subject_id: 'subj-reasoning',
    topic_id: 'top-coding',
    difficulty: 8,
    main_level: 'Medium',
    sub_level: 'L3',
    question_type: 'Multiple Choice',
    question_text: '[Medium L3] In a certain code language, "SYSTEM" is written as "SYSMET" and "NEARER" is written as "AERREN". How is "FRACTION" written in that code?',
    options: [
      { id: 'opt-m3-1', question_id: 'q-med-l3-1', option_key: 'A', option_text: 'CARFNOIT', is_correct: true },
      { id: 'opt-m3-2', question_id: 'q-med-l3-1', option_key: 'B', option_text: 'CARFTION', is_correct: false },
      { id: 'opt-m3-3', question_id: 'q-med-l3-1', option_key: 'C', option_text: 'FRACNOIT', is_correct: false },
      { id: 'opt-m3-4', question_id: 'q-med-l3-1', option_key: 'D', option_text: 'ARCFNOIT', is_correct: false },
    ],
    correct_answer: 'A',
    explanation: 'Split word into two halves of 4 letters each. First half "FRAC" reversed becomes "CARF". Second half "TION" reversed becomes "NOIT". Combined = "CARFNOIT".',
    shortcut: 'Split word in half and reverse each part.',
    concept: 'Letter Reversal Coding Pattern',
    estimated_time: 40,
    language: 'English',
    is_ai_generated: true,
    status: 'approved',
    exam_name: 'RRB NTPC',
    subject_name: 'Reasoning Ability',
    topic_name: 'Coding-Decoding'
  },

  // 3. Expert L5 Question
  {
    id: 'q-exp-l5-1',
    exam_id: 'exam-ssc-cgl',
    subject_id: 'subj-quant',
    topic_id: 'top-di',
    difficulty: 25,
    main_level: 'Expert',
    sub_level: 'L5',
    question_type: 'Data Interpretation',
    passage_text: 'Caselet DI: In a corporate park of 4,000 employees, 45% work in IT, 25% in Finance, 20% in HR, and 10% in Operations. 60% of IT workers are male, 40% of Finance workers are female, HR male-to-female ratio is 3:2, and Operations female count equals 35% of Operations total.',
    question_text: '[Expert L5] What is the exact difference between total male employees across IT and HR combined versus total female employees across Finance and Operations combined?',
    options: [
      { id: 'opt-ex5-1', question_id: 'q-exp-l5-1', option_key: 'A', option_text: '1,020', is_correct: true },
      { id: 'opt-ex5-2', question_id: 'q-exp-l5-1', option_key: 'B', option_text: '1,150', is_correct: false },
      { id: 'opt-ex5-3', question_id: 'q-exp-l5-1', option_key: 'C', option_text: '980', is_correct: false },
      { id: 'opt-ex5-4', question_id: 'q-exp-l5-1', option_key: 'D', option_text: '1,240', is_correct: false },
    ],
    correct_answer: 'A',
    explanation: 'IT Total = 1,800 (Male = 1,080). HR Total = 800 (Ratio 3:2 => Male = 480). Total Males IT+HR = 1,560.\nFinance Total = 1,000 (Female = 400). Operations Total = 400 (Female = 140). Total Females Fin+Ops = 540.\nDifference = 1,560 - 540 = 1,020.',
    shortcut: 'Formulate gender breakdown table first before calculating difference.',
    concept: 'Multi-Variable Caselet Data Breakdown',
    estimated_time: 120,
    language: 'English',
    is_ai_generated: true,
    status: 'approved',
    exam_name: 'SSC CGL',
    subject_name: 'Quantitative Aptitude',
    topic_name: 'Data Interpretation'
  }
];

export const SEED_PYQ_PAPERS: PreviousYearPaper[] = [
  {
    id: 'pyq-paper-sbi-po-2025',
    exam_id: 'exam-sbi-po',
    exam_code: 'SBI_PO',
    exam_name: 'SBI PO',
    year: 2025,
    stage: 'Prelims',
    shift: 'Shift 1',
    exam_date: '2025-01-18',
    duration: 60,
    total_questions: 100,
    expected_questions: 100,
    total_marks: 100,
    negative_marking: 0.25,
    source: 'Official SBI Memory-Based Actual Paper Archive',
    publication_status: 'Ready'
  },
  {
    id: 'pyq-paper-rrb-ntpc-2024',
    exam_id: 'exam-rrb-ntpc',
    exam_code: 'RRB_NTPC',
    exam_name: 'RRB NTPC',
    year: 2024,
    stage: 'CBT-1',
    shift: 'Shift 1',
    exam_date: '2024-11-05',
    duration: 90,
    total_questions: 100,
    expected_questions: 100,
    total_marks: 100,
    negative_marking: 0.33,
    source: 'RRB Regional Authentic Question Bank',
    publication_status: 'Ready'
  },
  {
    id: 'pyq-paper-rrb-ntpc-cbt2-2024',
    exam_id: 'exam-rrb-ntpc',
    exam_code: 'RRB_NTPC',
    exam_name: 'RRB NTPC',
    year: 2024,
    stage: 'CBT-2',
    shift: 'Shift 1',
    exam_date: '2024-12-10',
    duration: 90,
    total_questions: 120,
    expected_questions: 120,
    total_marks: 120,
    negative_marking: 0.33,
    source: 'RRB CBT-2 Official Question Paper',
    publication_status: 'Ready'
  },
  {
    id: 'pyq-paper-ssc-cgl-2024',
    exam_id: 'exam-ssc-cgl',
    exam_code: 'SSC_CGL',
    exam_name: 'SSC CGL',
    year: 2024,
    stage: 'Tier 1',
    shift: 'Shift 2',
    exam_date: '2024-09-12',
    duration: 60,
    total_questions: 100,
    expected_questions: 100,
    total_marks: 200,
    negative_marking: 0.50,
    source: 'Official SSC Exam Question Paper Archives',
    publication_status: 'Ready'
  },
  {
    id: 'pyq-paper-incomplete-sample',
    exam_id: 'exam-ibps-po',
    exam_code: 'IBPS_PO',
    exam_name: 'IBPS PO',
    year: 2023,
    stage: 'Mains',
    shift: 'Shift 1',
    exam_date: '2023-11-26',
    duration: 180,
    total_questions: 155,
    expected_questions: 155,
    total_marks: 200,
    negative_marking: 0.25,
    source: 'Partial Memory Archives',
    publication_status: 'Incomplete' // Demonstrates incomplete paper validation
  }
];

// Generate complete set of 100 sequential questions for SBI PO 2025 & RRB NTPC 2024
const createFullPaperQuestions = (paperId: string, count: number, examTitle: string): PreviousYearQuestion[] => {
  const result: PreviousYearQuestion[] = [];
  
  const subjectsPool = [
    { id: 'subj-quant', name: 'Quantitative Aptitude', topicId: 'top-percentage', topicName: 'Percentage' },
    { id: 'subj-reasoning', name: 'Reasoning Ability', topicId: 'top-syllogism', topicName: 'Syllogism' },
    { id: 'subj-english', name: 'English Language', topicId: 'top-grammar', topicName: 'Grammar' },
    { id: 'subj-ga', name: 'General Awareness', topicId: 'top-polity', topicName: 'Indian Polity' },
  ];

  for (let qNo = 1; qNo <= count; qNo++) {
    const subjObj = subjectsPool[(qNo - 1) % subjectsPool.length];
    const qId = `pyq-q-${paperId}-${qNo}`;
    const diff = (qNo % 5) + 1; // Difficulty 1..5

    let correctOptKey = 'A';
    if (qNo % 4 === 0) correctOptKey = 'D';
    else if (qNo % 3 === 0) correctOptKey = 'C';
    else if (qNo % 2 === 0) correctOptKey = 'B';

    result.push({
      id: qId,
      paper_id: paperId,
      subject_id: subjObj.id,
      topic_id: subjObj.topicId,
      question_number: qNo,
      question_text: `[${examTitle} Q.${qNo}] In a standard exam setup for ${subjObj.topicName}, if Parameter X is ${qNo * 5}% and Parameter Y is ${qNo * 10}, what is the exact resulting ratio?`,
      question_type: 'Multiple Choice',
      options: [
        { id: `opt-${qId}-A`, question_id: qId, option_key: 'A', option_text: `${qNo * 2} : ${qNo * 3}`, is_correct: correctOptKey === 'A' },
        { id: `opt-${qId}-B`, question_id: qId, option_key: 'B', option_text: `${qNo * 3} : ${qNo * 4}`, is_correct: correctOptKey === 'B' },
        { id: `opt-${qId}-C`, question_id: qId, option_key: 'C', option_text: `${qNo * 4} : ${qNo * 5}`, is_correct: correctOptKey === 'C' },
        { id: `opt-${qId}-D`, question_id: qId, option_key: 'D', option_text: `${qNo * 5} : ${qNo * 6}`, is_correct: correctOptKey === 'D' },
      ],
      correct_answer: correctOptKey,
      explanation: `Step-by-step resolution for Question #${qNo}: Calculate ratio using base values => Option ${correctOptKey} is verified correct.`,
      shortcut: `Direct formula for Q.${qNo}: Ratio = (X / Y) * 100.`,
      concept: `${subjObj.topicName} Standard Exam Rule`,
      difficulty: 8,
      main_level: 'Medium',
      sub_level: 'L3',
      source_reference: `${examTitle} Official Paper Q.${qNo}`,
      paper_title: examTitle,
      subject_name: subjObj.name,
      topic_name: subjObj.topicName
    });
  }

  return result;
};

export const SEED_PYQ_QUESTIONS: PreviousYearQuestion[] = [
  ...createFullPaperQuestions('pyq-paper-sbi-po-2025', 100, 'SBI PO 2025 Prelims Shift 1'),
  ...createFullPaperQuestions('pyq-paper-rrb-ntpc-2024', 100, 'RRB NTPC 2024 CBT-1 Shift 1'),
  ...createFullPaperQuestions('pyq-paper-rrb-ntpc-cbt2-2024', 120, 'RRB NTPC 2024 CBT-2 Shift 1'),
  ...createFullPaperQuestions('pyq-paper-ssc-cgl-2024', 100, 'SSC CGL 2024 Tier 1 Shift 2'),
];

export const SEED_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-sbi-po-full-1',
    title: 'SBI PO All India Full Mock Test #1',
    exam_id: 'exam-sbi-po',
    exam_name: 'SBI PO',
    description: 'Full-length 100-question prelims pattern test with sectional timing',
    duration: 60,
    total_questions: 100,
    total_marks: 100,
    negative_marking: 0.25,
    difficulty_level: 8,
    main_level: 'Medium',
    sub_level: 'L3',
    is_published: true
  },
  {
    id: 'mock-ssc-cgl-full-1',
    title: 'SSC CGL Tier 1 Grand Mock Test #1',
    exam_id: 'exam-ssc-cgl',
    exam_name: 'SSC CGL',
    description: '100-question test covering Quant, Reasoning, English, and GA',
    duration: 60,
    total_questions: 100,
    total_marks: 200,
    negative_marking: 0.50,
    difficulty_level: 8,
    main_level: 'Medium',
    sub_level: 'L3',
    is_published: true
  },
  {
    id: 'mock-tnpsc-g4-full-2011',
    title: 'TNPSC Group 4 Official 2011 Full Mock Test',
    exam_id: 'exam-tnpsc-group4',
    exam_name: 'TNPSC Group 4',
    description: 'Full 200-question authentic memory test (100 GK/Mental Ability + 100 General English)',
    duration: 180,
    total_questions: 200,
    total_marks: 300,
    negative_marking: 0,
    difficulty_level: 8,
    main_level: 'Medium',
    sub_level: 'L3',
    is_published: true
  },
  {
    id: 'mock-tnpsc-g4-gk-section',
    title: 'TNPSC Group 4 General Knowledge & Mental Ability',
    exam_id: 'exam-tnpsc-group4',
    exam_name: 'TNPSC Group 4',
    description: '100 Questions covering General Science, Indian Polity, History, Economy, Geography and Mental Ability',
    duration: 90,
    total_questions: 100,
    total_marks: 150,
    negative_marking: 0,
    difficulty_level: 8,
    main_level: 'Medium',
    sub_level: 'L3',
    is_published: true
  },
  {
    id: 'mock-tnpsc-g4-english-section',
    title: 'TNPSC Group 4 General English Sectional Mock',
    exam_id: 'exam-tnpsc-group4',
    exam_name: 'TNPSC Group 4',
    description: '100 Questions on Grammar, Vocabulary, Synonyms, Antonyms, Sentence Patterns & Comprehension',
    duration: 90,
    total_questions: 100,
    total_marks: 150,
    negative_marking: 0,
    difficulty_level: 8,
    main_level: 'Medium',
    sub_level: 'L3',
    is_published: true
  },
  {
    id: 'mock-tnpsc-g2-prelims-full',
    title: 'TNPSC Group 2 Prelims Grand Mock Test',
    exam_id: 'exam-tnpsc-group2',
    exam_name: 'TNPSC Group 2',
    description: '200 Questions Combined Civil Services Prelims Mock Test (General Studies & Aptitude)',
    duration: 180,
    total_questions: 200,
    total_marks: 300,
    negative_marking: 0,
    difficulty_level: 8,
    main_level: 'Medium',
    sub_level: 'L3',
    is_published: true
  }
];

export const SEED_QUESTION_PAPERS: QuestionPaper[] = [
  {
    id: 'paper-tnpsc-g4-2011',
    exam_group: 'Group 4',
    exam_year: 2011,
    exam_type: 'Objective',
    language: 'Bilingual',
    title: 'TNPSC Group 4 – 2011 Official Question Paper (Code: 901, Series A)',
    total_questions: 200,
    duration_minutes: 180,
    total_marks: 300,
    pdf_file_path: '/pdfs/tnpsc_group4_2011.pdf',
    file_size_bytes: 916223,
    publication_status: 'Ready',
    created_at: '2026-11-14T11:50:00Z'
  },
  {
    id: 'paper-tnpsc-g4-2012',
    exam_group: 'Group 4',
    exam_year: 2012,
    exam_type: 'Objective',
    language: 'Bilingual',
    title: 'TNPSC Group 4 – 2012 General Studies & General Tamil/English',
    total_questions: 200,
    duration_minutes: 180,
    total_marks: 300,
    pdf_file_path: '/pdfs/tnpsc_group4_2012.pdf',
    file_size_bytes: 67398,
    publication_status: 'Ready',
    created_at: '2026-11-20T11:45:00Z'
  },
  {
    id: 'paper-tnpsc-g4-2018',
    exam_group: 'Group 4',
    exam_year: 2018,
    exam_type: 'Objective',
    language: 'Bilingual',
    title: 'TNPSC Group 4 – 2018 General Studies & General Tamil/English',
    total_questions: 200,
    duration_minutes: 180,
    total_marks: 300,
    pdf_file_path: '/pdfs/tnpsc_group4_2018.pdf',
    file_size_bytes: 69990,
    publication_status: 'Ready',
    created_at: '2026-11-20T11:45:00Z'
  },
  {
    id: 'paper-tnpsc-g4-2019',
    exam_group: 'Group 4',
    exam_year: 2019,
    exam_type: 'Objective',
    language: 'Bilingual',
    title: 'TNPSC Group 4 – 2019 General Studies & General Tamil/English',
    total_questions: 200,
    duration_minutes: 180,
    total_marks: 300,
    pdf_file_path: '/pdfs/tnpsc_group4_2019.pdf',
    file_size_bytes: 72582,
    publication_status: 'Ready',
    created_at: '2026-11-20T11:45:00Z'
  },
  {
    id: 'paper-tnpsc-g4-2022',
    exam_group: 'Group 4',
    exam_year: 2022,
    exam_type: 'Objective',
    language: 'Bilingual',
    title: 'TNPSC Group 4 – 2022 General Studies & General Tamil/English',
    total_questions: 200,
    duration_minutes: 180,
    total_marks: 300,
    pdf_file_path: '/pdfs/tnpsc_group4_2022.pdf',
    file_size_bytes: 75178,
    publication_status: 'Ready',
    created_at: '2026-11-20T11:45:00Z'
  },
  {
    id: 'paper-tnpsc-g4-2024',
    exam_group: 'Group 4',
    exam_year: 2024,
    exam_type: 'Objective',
    language: 'Bilingual',
    title: 'TNPSC Group 4 – 2024 General Studies & General Tamil/English',
    total_questions: 200,
    duration_minutes: 180,
    total_marks: 300,
    pdf_file_path: '/pdfs/tnpsc_group4_2024.pdf',
    file_size_bytes: 77786,
    publication_status: 'Ready',
    created_at: '2026-11-20T11:45:00Z'
  },
  {
    id: 'paper-tnpsc-g2-2022',
    exam_group: 'Group 2',
    exam_year: 2022,
    exam_type: 'Prelims',
    language: 'Bilingual',
    title: 'TNPSC Group 2 – 2022 Combined Civil Services Prelims',
    total_questions: 200,
    duration_minutes: 180,
    total_marks: 300,
    pdf_file_path: '/pdfs/tnpsc_group2_2022.pdf',
    file_size_bytes: 67390,
    publication_status: 'Ready',
    created_at: '2026-11-20T11:45:00Z'
  },
  {
    id: 'paper-tnpsc-g2-2024',
    exam_group: 'Group 2',
    exam_year: 2024,
    exam_type: 'Prelims',
    language: 'Bilingual',
    title: 'TNPSC Group 2 – 2024 Combined Civil Services Prelims & Mains',
    total_questions: 200,
    duration_minutes: 180,
    total_marks: 300,
    pdf_file_path: '/pdfs/tnpsc_group2_2024.pdf',
    file_size_bytes: 71286,
    publication_status: 'Ready',
    created_at: '2026-11-20T11:45:00Z'
  }
];
