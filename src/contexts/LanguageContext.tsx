import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type LanguageMode = 'Tamil' | 'English' | 'Both';

// ─── Translation Schema ──────────────────────────────────────────────────────
export interface Translations {
  // Navigation
  home: string;
  dashboard: string;
  group2: string;
  group4: string;
  tnpscGroup2: string;
  tnpscGroup4: string;
  practice: string;
  previousPapers: string;
  questionBank: string;
  mockTests: string;
  dailyChallenge: string;
  revision: string;
  performance: string;
  studyMaterials: string;
  currentAffairs: string;
  results: string;
  profile: string;
  settings: string;
  adminPanel: string;
  adminSuiteOn: string;
  login: string;
  logout: string;

  // Landing & Hero
  heroTitle: string;
  heroSubtitle: string;
  startPractice: string;
  explorePapers: string;
  takeMockTest: string;
  yourSuccessOurMission: string;

  // Dashboard
  welcomeBack: string;
  testsCompleted: string;
  avgScore: string;
  accuracy: string;
  studyProgress: string;
  recentResults: string;
  upcomingTests: string;
  recommendedPractice: string;
  startStudying: string;
  solvedQuestions: string;
  studyTime: string;
  daysStreak: string;
  currentTier: string;
  pyqsCompleted: string;

  // Mock Test
  selectMode: string;
  pyqMode: string;
  aiMode: string;
  mixedMode: string;
  generateTest: string;
  startTest: string;
  subjectWisePractice: string;
  topicWisePractice: string;
  fullExamPaper: string;

  // PYQ
  previousYearQuestions: string;
  viewPDF: string;
  downloadPDF: string;
  examYear: string;
  examGroup: string;
  language: string;
  prelims: string;
  mains: string;

  // General & Examination Controls
  search: string;
  filter: string;
  questions: string;
  marks: string;
  duration: string;
  submit: string;
  next: string;
  previous: string;
  clearResponse: string;
  markForReview: string;
  bookmark: string;
  answered: string;
  unanswered: string;
  markedForReview: string;
  correct: string;
  incorrect: string;
  score: string;
  percentage: string;
  timeTaken: string;
  viewSolutions: string;
  retryTest: string;
  backToDashboard: string;
  loading: string;
  noData: string;
  selectSubject: string;
  selectTopic: string;
  numQuestions: string;
  all: string;
  bilingual: string;
  tamil: string;
  english: string;
  both: string;
  explanation: string;
  minutes: string;
}

const translationsTamil: Translations = {
  home: 'முகப்பு',
  dashboard: 'டாஷ்போர்டு',
  group2: 'குரூப் 2',
  group4: 'குரூப் 4',
  tnpscGroup2: 'TNPSC குரூப் 2',
  tnpscGroup4: 'TNPSC குரூப் 4',
  practice: 'பயிற்சி',
  previousPapers: 'முந்தைய வினாத்தாள்',
  questionBank: 'வினா வங்கி',
  mockTests: 'மாதிரி தேர்வு',
  dailyChallenge: 'தினசரி சவால்',
  revision: 'மறுபயிற்சி',
  performance: 'செயல்திறன்',
  studyMaterials: 'பாடக்குறிப்புகள்',
  currentAffairs: 'நடப்பு நிகழ்வுகள்',
  results: 'முடிவுகள்',
  profile: 'சுயவிவரம்',
  settings: 'அமைப்புகள்',
  adminPanel: 'நிர்வாக பலகம்',
  adminSuiteOn: 'நிர்வாகம் இயக்கத்தில்',
  login: 'உள்நுழைக',
  logout: 'வெளியேறுக',

  heroTitle: 'தயார்படு. பயிற்சி செய். வெற்றி பெறு.',
  heroSubtitle: 'TNPSC குரூப் 2 மற்றும் குரூப் 4 தேர்வுகளுக்கான AI-சக்தி வாய்ந்த தயாரிப்பு.',
  startPractice: 'பயிற்சி தொடங்கு',
  explorePapers: 'வினாத்தாள் பார்க்க',
  takeMockTest: 'மாதிரி தேர்வு எழுதுக',
  yourSuccessOurMission: 'உங்கள் வெற்றி, எங்கள் குறிக்கோள்',

  welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
  testsCompleted: 'முடிந்த தேர்வுகள்',
  avgScore: 'சராசரி மதிப்பெண்',
  accuracy: 'துல்லியம்',
  studyProgress: 'படிப்பு முன்னேற்றம்',
  recentResults: 'சமீபத்திய முடிவுகள்',
  upcomingTests: 'வரவிருக்கும் தேர்வுகள்',
  recommendedPractice: 'பரிந்துரைக்கப்பட்ட பயிற்சி',
  startStudying: 'படிப்பு தொடங்கு',
  solvedQuestions: 'தீர்க்கப்பட்ட வினாக்கள்',
  studyTime: 'படித்த நேரம்',
  daysStreak: 'நாட்கள் தொடர்',
  currentTier: 'தற்போதைய நிலை',
  pyqsCompleted: 'முந்தைய வினாத்தாள்கள்',

  selectMode: 'முறை தேர்வு செய்க',
  pyqMode: 'முந்தைய வினா முறை (PYQ)',
  aiMode: 'AI உருவாக்கிய பயிற்சி முறை',
  mixedMode: 'கலவை பயிற்சி முறை',
  generateTest: 'தேர்வு உருவாக்கு',
  startTest: 'தேர்வு தொடங்கு',
  subjectWisePractice: 'பாடம் வாரியான பயிற்சி',
  topicWisePractice: 'தலைப்பு வாரியான பயிற்சி',
  fullExamPaper: 'முழு வினாத்தாள்',

  previousYearQuestions: 'முந்தைய ஆண்டு வினாக்கள்',
  viewPDF: 'PDF பார்க்க',
  downloadPDF: 'PDF பதிவிறக்கம்',
  examYear: 'தேர்வு ஆண்டு',
  examGroup: 'தேர்வு குழு',
  language: 'மொழி',
  prelims: 'தொடக்க நிலை',
  mains: 'முக்கிய நிலை',

  search: 'தேடு',
  filter: 'வடிகட்டு',
  questions: 'வினாக்கள்',
  marks: 'மதிப்பெண்கள்',
  duration: 'காலம்',
  submit: 'சமர்ப்பி',
  next: 'அடுத்து',
  previous: 'முந்தைய',
  clearResponse: 'பதில் அழி',
  markForReview: 'மறுஆய்வுக்கு குறி',
  bookmark: 'புக்மார்க்',
  answered: 'பதிலளிக்கப்பட்டது',
  unanswered: 'பதிலளிக்கப்படாதது',
  markedForReview: 'மறுஆய்வுக்கு குறிக்கப்பட்டது',
  correct: 'சரியானவை',
  incorrect: 'தவறானவை',
  score: 'மதிப்பெண்',
  percentage: 'சதவீதம்',
  timeTaken: 'எடுத்த நேரம்',
  viewSolutions: 'விடைகள் பார்க்க',
  retryTest: 'மீண்டும் முயற்சி',
  backToDashboard: 'டாஷ்போர்டுக்கு திரும்பு',
  loading: 'ஏற்றுகிறது...',
  noData: 'தரவு இல்லை',
  selectSubject: 'பாடம் தேர்வு செய்க',
  selectTopic: 'தலைப்பு தேர்வு செய்க',
  numQuestions: 'வினாக்கள் எண்ணிக்கை',
  all: 'அனைத்தும்',
  bilingual: 'இருமொழி',
  tamil: 'தமிழ்',
  english: 'ஆங்கிலம்',
  both: 'இரண்டும்',
  explanation: 'விளக்கம்',
  minutes: 'நிமிடங்கள்',
};

const translationsEnglish: Translations = {
  home: 'Home',
  dashboard: 'Dashboard',
  group2: 'Group 2',
  group4: 'Group 4',
  tnpscGroup2: 'TNPSC Group 2',
  tnpscGroup4: 'TNPSC Group 4',
  practice: 'Practice',
  previousPapers: 'Previous Papers',
  questionBank: 'Question Bank',
  mockTests: 'Mock Tests',
  dailyChallenge: 'Daily Challenge',
  revision: 'Revision',
  performance: 'Performance',
  studyMaterials: 'Study Materials',
  currentAffairs: 'Current Affairs',
  results: 'Results',
  profile: 'Profile',
  settings: 'Settings',
  adminPanel: 'Admin Panel',
  adminSuiteOn: 'Admin Suite ON',
  login: 'Sign In',
  logout: 'Sign Out',

  heroTitle: 'Prepare Smarter. Practice Better. Crack Your Exam.',
  heroSubtitle: 'AI-powered preparation for TNPSC Group 2 and Group 4 examinations.',
  startPractice: 'Start Practicing Now',
  explorePapers: 'Explore Question Papers',
  takeMockTest: 'Take Mock Test',
  yourSuccessOurMission: 'Your Success, Our Mission',

  welcomeBack: 'Welcome Back',
  testsCompleted: 'Tests Completed',
  avgScore: 'Average Score',
  accuracy: 'Accuracy',
  studyProgress: 'Study Progress',
  recentResults: 'Recent Results',
  upcomingTests: 'Upcoming Tests',
  recommendedPractice: 'Recommended Practice',
  startStudying: 'Start Studying',
  solvedQuestions: 'Solved Questions',
  studyTime: 'Study Time',
  daysStreak: 'Days Streak',
  currentTier: 'Current Tier',
  pyqsCompleted: 'PYQs Completed',

  selectMode: 'Select Mode',
  pyqMode: 'Previous Year Questions (PYQ)',
  aiMode: 'AI Generated Practice',
  mixedMode: 'Mixed Practice Test',
  generateTest: 'Generate Test',
  startTest: 'Start Test',
  subjectWisePractice: 'Subject-wise Practice',
  topicWisePractice: 'Topic-wise Practice',
  fullExamPaper: 'Full Question Paper',

  previousYearQuestions: 'Previous Year Questions',
  viewPDF: 'View PDF',
  downloadPDF: 'Download PDF',
  examYear: 'Exam Year',
  examGroup: 'Exam Group',
  language: 'Language',
  prelims: 'Prelims',
  mains: 'Mains',

  search: 'Search',
  filter: 'Filter',
  questions: 'Questions',
  marks: 'Marks',
  duration: 'Duration',
  submit: 'Submit Examination',
  next: 'Next',
  previous: 'Previous',
  clearResponse: 'Clear Response',
  markForReview: 'Mark for Review',
  bookmark: 'Bookmark',
  answered: 'Answered',
  unanswered: 'Unanswered',
  markedForReview: 'Marked for Review',
  correct: 'Correct',
  incorrect: 'Incorrect',
  score: 'Score',
  percentage: 'Percentage',
  timeTaken: 'Time Taken',
  viewSolutions: 'View Solutions',
  retryTest: 'Retry Test',
  backToDashboard: 'Back to Dashboard',
  loading: 'Loading...',
  noData: 'No data available',
  selectSubject: 'Select Subject',
  selectTopic: 'Select Topic',
  numQuestions: 'Number of Questions',
  all: 'All',
  bilingual: 'Bilingual',
  tamil: 'Tamil',
  english: 'English',
  both: 'Both',
  explanation: 'Explanation',
  minutes: 'Minutes',
};

// Bilingual merges English + Tamil label
const translationsBoth: Translations = Object.fromEntries(
  Object.entries(translationsEnglish).map(([k, v]) => [
    k,
    `${v} / ${translationsTamil[k as keyof Translations] || v}`,
  ])
) as unknown as Translations;

// ─── Context ─────────────────────────────────────────────────────────────────
interface LanguageContextType {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  t: Translations;
  isTamil: boolean;
  isEnglish: boolean;
  isBoth: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'Both',
  setLanguage: () => {},
  t: translationsBoth,
  isTamil: false,
  isEnglish: false,
  isBoth: true,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageMode>(() => {
    return (localStorage.getItem('tnpsc_lang') as LanguageMode) || 'Both';
  });

  const setLanguage = useCallback((lang: LanguageMode) => {
    setLanguageState(lang);
    localStorage.setItem('tnpsc_lang', lang);
  }, []);

  const t =
    language === 'Tamil'
      ? translationsTamil
      : language === 'English'
      ? translationsEnglish
      : translationsBoth;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isTamil: language === 'Tamil',
        isEnglish: language === 'English',
        isBoth: language === 'Both',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
