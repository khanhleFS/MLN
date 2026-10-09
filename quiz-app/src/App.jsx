import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  GraduationCap,
  Bookmark,
  HelpCircle,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Search,
  Check,
  X,
  AlertCircle,
  Keyboard,
  ExternalLink,
  Award,
  Sparkles,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  Zap,
  Crown,
  Star,
  ShieldCheck,
  Lock
} from 'lucide-react';
import rawQuestions from './data/questions.json';
import {
  playClickSound,
  playCorrectSound,
  playWrongSound,
  playComboSound,
  playLevelUpSound,
  isAudioMuted,
  setAudioMuted
} from './utils/sound';

const CHAPTERS = [
  { id: 'all', title: 'Tất cả 598 câu', short: 'Tất cả' },
  { id: 1, title: 'Chương 1: Khái luận về triết học và TH Mác - Lênin', short: 'Chương 1' },
  { id: 2, title: 'Chương 2: Chủ nghĩa duy vật biện chứng', short: 'Chương 2' },
  { id: 3, title: 'Chương 3: Chủ nghĩa duy vật lịch sử', short: 'Chương 3' },
];

const TOPICS = [
  { id: 'all', chapter: 'all', title: 'Tất cả đề mục' },
  { id: '1.1', chapter: 1, title: '1.1. Triết học & Vấn đề cơ bản của triết học (Trang 11-47)' },
  { id: '1.2', chapter: 1, title: '1.2. Triết học Mác - Lênin và vai trò (Trang 47-116)' },
  { id: '2.1', chapter: 2, title: '2.1. Vật chất và ý thức (Trang 117-182)' },
  { id: '2.2', chapter: 2, title: '2.2. Phép biện chứng duy vật (Trang 182-257)' },
  { id: '2.3', chapter: 2, title: '2.3. Lý luận nhận thức duy vật biện chứng (Trang 257-283)' },
  { id: '3.1', chapter: 3, title: '3.1. Học thuyết hình thái KT - XH (Trang 284-329)' },
  { id: '3.2', chapter: 3, title: '3.2. Giai cấp và dân tộc (Trang 329-384)' },
  { id: '3.3', chapter: 3, title: '3.3. Nhà nước và cách mạng xã hội (Trang 384-419)' },
  { id: '3.4', chapter: 3, title: '3.4. Ý thức xã hội (Trang 419-447)' },
  { id: '3.5', chapter: 3, title: '3.5. Triết học về con người (Trang 447-489)' },
];

const LEVEL_TITLES = [
  'Tập sự Biện chứng',
  'Người tìm Chân lý',
  'Học giả Duy vật',
  'Chiến sĩ Thực tiễn',
  'Bậc thầy Nhận thức',
  'Nhà tư tưởng Hình thái',
  'Lý luận gia Cốt cán',
  'Đại Triết gia Thượng thừa'
];

function getLevelTitle(level) {
  const idx = Math.min(Math.max(0, level - 1), LEVEL_TITLES.length - 1);
  return LEVEL_TITLES[idx];
}

const BADGES = [
  { id: 'first_correct', title: 'Bước Chân Đầu Tiên', desc: 'Trả lời đúng câu hỏi đầu tiên trong ngân hàng', icon: 'zap' },
  { id: 'streak_3', title: 'Khí Thế Sôi Sục', desc: 'Đạt chuỗi Combo 3 câu đúng liên tiếp', icon: 'flame' },
  { id: 'streak_7', title: 'Bất Khả Chiến Bại', desc: 'Đạt chuỗi Combo 7 câu đúng liên tiếp', icon: 'crown' },
  { id: 'exp_500', title: 'Tích Lũy Tri Thức', desc: 'Đạt từ 500 điểm kinh nghiệm (EXP) trở lên', icon: 'star' },
  { id: 'century', title: 'Bách Khoa 100 Câu', desc: 'Đã hoàn thành 100 câu hỏi trắc nghiệm', icon: 'award' },
  { id: 'bookmarker', title: 'Cẩn Tắc Vô Ưu', desc: 'Đã đánh dấu lưu trữ ít nhất 5 câu hỏi khó', icon: 'bookmark' },
  { id: 'exam_passed', title: 'Vượt Ải Khảo Thí', desc: 'Hoàn thành bài thi thử 50 câu đạt từ 7.0 điểm', icon: 'shield' },
  { id: 'exam_rank_s', title: 'Đại Triết Gia Rank S', desc: 'Đạt Rank S xuất sắc (từ 9.0 điểm trở lên) trong bài thi', icon: 'trophy' },
];

function getInitialStreak() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('mln_last_streak_date');
    const savedStreak = parseInt(localStorage.getItem('mln_streak_count') || '1', 10);
    if (!lastDate) {
      localStorage.setItem('mln_last_streak_date', today);
      localStorage.setItem('mln_streak_count', '1');
      return 1;
    }
    if (lastDate === today) {
      return savedStreak;
    }
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastDate === yesterday) {
      const nextStreak = savedStreak + 1;
      localStorage.setItem('mln_last_streak_date', today);
      localStorage.setItem('mln_streak_count', String(nextStreak));
      return nextStreak;
    } else {
      localStorage.setItem('mln_last_streak_date', today);
      localStorage.setItem('mln_streak_count', '1');
      return 1;
    }
  } catch {
    return 1;
  }
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('mln_theme') || 'dark');
  
  // App Mode: 'study' | 'exam'
  const [mode, setMode] = useState('study');

  // Gamification States
  const [exp, setExp] = useState(() => {
    try {
      return parseInt(localStorage.getItem('mln_player_exp') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [streak] = useState(getInitialStreak);
  const [combo, setCombo] = useState(0);
  const [isMuted, setIsMuted] = useState(() => isAudioMuted());
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Unlocked Badges (Set of IDs)
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('mln_unlocked_badges');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Calculate Level and EXP Progress
  const level = useMemo(() => Math.floor(exp / 100) + 1, [exp]);
  const expInLevel = useMemo(() => exp % 100, [exp]);

  // Study filters
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Bookmarks (Set of question ids)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('mln_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Study answers record: { [questionId]: { selected: ['A'], isCorrect: true } }
  const [studyAnswers, setStudyAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem('mln_study_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Multi-choice temporary selection in study mode
  const [tempMultiSelections, setTempMultiSelections] = useState([]);
  
  // Explanation visibility
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Modal for shortcuts help
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Mobile question matrix modal
  const [showMobileMatrixModal, setShowMobileMatrixModal] = useState(false);

  // Jump to question input
  const [jumpInput, setJumpInput] = useState('');

  // Touch swipe gesture handlers for mobile devices
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum swipe distance 45px and predominantly horizontal
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped left -> Next question
        if (mode === 'study') {
          if (safeCurrentIndex < filteredQuestions.length - 1) {
            playClickSound();
            setCurrentIndex((prev) => prev + 1);
            setShowExplanation(false);
          }
        } else if (mode === 'exam' && examStatus === 'active') {
          if (examCurrentIndex < examQuestions.length - 1) {
            playClickSound();
            setExamCurrentIndex((prev) => prev + 1);
          }
        }
      } else {
        // Swiped right -> Previous question
        if (mode === 'study') {
          if (safeCurrentIndex > 0) {
            playClickSound();
            setCurrentIndex((prev) => prev - 1);
            setShowExplanation(false);
          }
        } else if (mode === 'exam' && examStatus === 'active') {
          if (examCurrentIndex > 0) {
            playClickSound();
            setExamCurrentIndex((prev) => prev - 1);
          }
        }
      }
    }
  };

  // ---------------- EXAM STATE ----------------
  const [examStatus, setExamStatus] = useState('intro'); // 'intro' | 'active' | 'result'
  const [examQuestions, setExamQuestions] = useState([]);
  const [examCurrentIndex, setExamCurrentIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState({}); // { [questionId]: ['A'] }
  const [examBookmarks, setExamBookmarks] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [examEarnedExp, setExamEarnedExp] = useState(0);

  // Helper to trigger gamified toast notification
  const triggerToast = useCallback((title, subtitle) => {
    setToast({ title, subtitle });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Helper to unlock badges
  const unlockBadge = useCallback((badgeId) => {
    setUnlockedBadges((prev) => {
      if (prev.has(badgeId)) return prev;
      const next = new Set(prev);
      next.add(badgeId);
      localStorage.setItem('mln_unlocked_badges', JSON.stringify(Array.from(next)));
      const badgeObj = BADGES.find(b => b.id === badgeId);
      if (badgeObj) {
        playLevelUpSound();
        triggerToast('🏆 MỞ KHÓA HUY HIỆU!', badgeObj.title);
      }
      return next;
    });
  }, [triggerToast]);

  // Helper to add EXP and detect Level-Up
  const addExp = useCallback((amount) => {
    setExp((prev) => {
      const next = prev + amount;
      localStorage.setItem('mln_player_exp', String(next));
      const oldLevel = Math.floor(prev / 100) + 1;
      const newLevel = Math.floor(next / 100) + 1;
      if (newLevel > oldLevel) {
        playLevelUpSound();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.3 }
        });
        triggerToast(`🎉 THĂNG CẤP: LEVEL ${newLevel}!`, `Danh hiệu: ${getLevelTitle(newLevel)}`);
      }
      if (next >= 500) {
        unlockBadge('exp_500');
      }
      return next;
    });
  }, [triggerToast, unlockBadge]);

  // Sync theme to root DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mln_theme', theme);
  }, [theme]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('mln_bookmarks', JSON.stringify(Array.from(bookmarks)));
    if (bookmarks.size >= 5) {
      unlockBadge('bookmarker');
    }
  }, [bookmarks, unlockBadge]);

  // Sync study answers to localStorage
  useEffect(() => {
    localStorage.setItem('mln_study_answers', JSON.stringify(studyAnswers));
    const count = Object.keys(studyAnswers).length;
    if (count >= 100) {
      unlockBadge('century');
    }
  }, [studyAnswers, unlockBadge]);

  // Filter questions for Study Mode
  const filteredQuestions = useMemo(() => {
    return rawQuestions.filter((q) => {
      if (selectedChapter !== 'all' && q.chapter !== Number(selectedChapter)) return false;
      if (selectedTopic !== 'all' && q.topicId !== selectedTopic) return false;
      if (onlyBookmarked && !bookmarks.has(q.id)) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inQuestion = q.question.toLowerCase().includes(query);
        const inId = q.id.toString() === query;
        const inOptions = q.options.some(o => o.text.toLowerCase().includes(query));
        if (!inQuestion && !inId && !inOptions) return false;
      }
      return true;
    });
  }, [selectedChapter, selectedTopic, onlyBookmarked, searchQuery, bookmarks]);

  // Handle Chapter filter change
  const handleChapterChange = (chapterId) => {
    setSelectedChapter(chapterId);
    setCurrentIndex(0);
    setShowExplanation(false);
    playClickSound();
    if (selectedTopic !== 'all') {
      const currentTopicObj = TOPICS.find((t) => t.id === selectedTopic);
      if (chapterId !== 'all' && currentTopicObj?.chapter !== chapterId) {
        setSelectedTopic('all');
      }
    }
  };

  // Handle Subtopic filter change
  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    setCurrentIndex(0);
    setShowExplanation(false);
    playClickSound();
    if (topicId !== 'all') {
      const topicObj = TOPICS.find((t) => t.id === topicId);
      if (topicObj && topicObj.chapter && topicObj.chapter !== 'all') {
        setSelectedChapter(topicObj.chapter);
      }
    }
  };

  // Ensure currentIndex stays in bound when filters change
  const activeQuestionsCount = filteredQuestions.length;
  const safeCurrentIndex = activeQuestionsCount > 0 ? Math.min(currentIndex, activeQuestionsCount - 1) : 0;
  const currentQ = activeQuestionsCount > 0 ? filteredQuestions[safeCurrentIndex] : null;

  // Toggle bookmark helper
  const toggleBookmark = (id) => {
    playClickSound();
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Submit & Calculate Exam Results
  const finishExam = useCallback(() => {
    setExamStatus('result');
    setShowSubmitConfirm(false);
    
    // Calculate score
    let correctCount = 0;
    examQuestions.forEach((q) => {
      const userSelected = examAnswers[q.id] || [];
      const isCorrect = 
        userSelected.length === q.correctAnswers.length &&
        userSelected.every(ans => q.correctAnswers.includes(ans));
      if (isCorrect) correctCount++;
    });

    const scoreNum = Number(((correctCount / examQuestions.length) * 10).toFixed(1));
    let earned = 80;

    if (scoreNum >= 9.0) {
      earned = 350;
      unlockBadge('exam_rank_s');
      unlockBadge('exam_passed');
      playLevelUpSound();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
    } else if (scoreNum >= 8.0) {
      earned = 250;
      unlockBadge('exam_passed');
      playLevelUpSound();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (scoreNum >= 7.0) {
      earned = 180;
      unlockBadge('exam_passed');
    } else if (scoreNum >= 5.0) {
      earned = 120;
    }

    setExamEarnedExp(earned);
    addExp(earned);
  }, [examQuestions, examAnswers, unlockBadge, addExp]);

  // Exam Timer Effect
  useEffect(() => {
    let timer = null;
    if (mode === 'exam' && examStatus === 'active') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, examStatus, finishExam]);

  // Start new 60min Exam with 50 random questions
  const startExam = () => {
    playClickSound();
    const shuffled = [...rawQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 50);
    setExamQuestions(selected);
    setExamCurrentIndex(0);
    setExamAnswers({});
    setExamBookmarks(new Set());
    setTimeLeft(60 * 60);
    setExamStatus('active');
    setReviewMode(false);
  };

  // Handle study mode answer selection
  const handleSelectOptionStudy = useCallback((optionId) => {
    if (!currentQ) return;
    const isMulti = currentQ.correctAnswers.length > 1;

    if (isMulti) {
      playClickSound();
      setTempMultiSelections((prev) => {
        if (prev.includes(optionId)) return prev.filter((k) => k !== optionId);
        return [...prev, optionId].sort();
      });
    } else {
      // Single choice question: immediate commit
      const isCorrect = currentQ.correctAnswers.includes(optionId);
      if (isCorrect) {
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        playComboSound(nextCombo);
        addExp(10);
        unlockBadge('first_correct');
        if (nextCombo >= 3) unlockBadge('streak_3');
        if (nextCombo >= 7) unlockBadge('streak_7');
      } else {
        setCombo(0);
        playWrongSound();
      }

      setStudyAnswers((prev) => ({
        ...prev,
        [currentQ.id]: {
          selected: [optionId],
          isCorrect
        }
      }));
      setShowExplanation(true);
    }
  }, [currentQ, combo, addExp, unlockBadge]);

  // Submit multi-choice answer in study mode
  const handleConfirmMultiStudy = useCallback(() => {
    if (!currentQ || tempMultiSelections.length === 0) return;
    const isCorrect =
      tempMultiSelections.length === currentQ.correctAnswers.length &&
      tempMultiSelections.every(k => currentQ.correctAnswers.includes(k));

    if (isCorrect) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      playComboSound(nextCombo);
      addExp(15);
      unlockBadge('first_correct');
      if (nextCombo >= 3) unlockBadge('streak_3');
      if (nextCombo >= 7) unlockBadge('streak_7');
    } else {
      setCombo(0);
      playWrongSound();
    }

    setStudyAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selected: tempMultiSelections,
        isCorrect
      }
    }));
    setShowExplanation(true);
  }, [currentQ, tempMultiSelections, combo, addExp, unlockBadge]);

  // Handle exam option selection
  const handleSelectOptionExam = useCallback((optionId) => {
    const q = examQuestions[examCurrentIndex];
    if (!q) return;
    playClickSound();
    const isMulti = q.correctAnswers.length > 1;

    setExamAnswers((prev) => {
      const current = prev[q.id] || [];
      if (isMulti) {
        const next = current.includes(optionId)
          ? current.filter(k => k !== optionId)
          : [...current, optionId].sort();
        return { ...prev, [q.id]: next };
      } else {
        return { ...prev, [q.id]: [optionId] };
      }
    });
  }, [examQuestions, examCurrentIndex]);

  // Sound Mute Toggle
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setAudioMuted(nextMuted);
    if (!nextMuted) {
      playCorrectSound();
    }
  };

  // Keyboard EventListeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();

      // Navigation shortcuts
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'j') {
        playClickSound();
        if (mode === 'study') {
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          setShowExplanation(false);
        } else if (mode === 'exam' && examStatus === 'active') {
          setExamCurrentIndex((prev) => Math.max(0, prev - 1));
        }
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'k') {
        playClickSound();
        if (mode === 'study') {
          setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
          setShowExplanation(false);
        } else if (mode === 'exam' && examStatus === 'active') {
          setExamCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1));
        }
      }
      // Toggle Bookmark: 'M'
      else if (key === 'M') {
        if (mode === 'study' && currentQ) {
          toggleBookmark(currentQ.id);
        } else if (mode === 'exam' && examQuestions[examCurrentIndex]) {
          const qid = examQuestions[examCurrentIndex].id;
          playClickSound();
          setExamBookmarks((prev) => {
            const next = new Set(prev);
            if (next.has(qid)) next.delete(qid);
            else next.add(qid);
            return next;
          });
        }
      }
      // Toggle Explanation: Space
      else if (e.key === ' ') {
        e.preventDefault();
        setShowExplanation((prev) => !prev);
      }
      // Options shortcuts: 1-4 or A-D
      else if (['1', '2', '3', '4', 'A', 'B', 'C', 'D'].includes(key)) {
        const keyMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D' };
        const optLetter = keyMap[key];
        if (mode === 'study' && currentQ) {
          const exists = currentQ.options.some(o => o.id === optLetter);
          if (exists) handleSelectOptionStudy(optLetter);
        } else if (mode === 'exam' && examStatus === 'active' && examQuestions[examCurrentIndex]) {
          const q = examQuestions[examCurrentIndex];
          const exists = q.options.some(o => o.id === optLetter);
          if (exists) handleSelectOptionExam(optLetter);
        }
      }
      // Help Modal: '?'
      else if (e.key === '?') {
        setShowShortcutsModal(prev => !prev);
      }
      // Escape
      else if (e.key === 'Escape') {
        setShowShortcutsModal(false);
        setShowSubmitConfirm(false);
        setShowBadgesModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, examStatus, currentQ, filteredQuestions.length, examQuestions, examCurrentIndex, handleSelectOptionStudy, handleSelectOptionExam]);

  // Jump to specific question
  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num)) {
      const idx = filteredQuestions.findIndex(q => q.id === num);
      if (idx !== -1) {
        setCurrentIndex(idx);
        setShowExplanation(false);
        setJumpInput('');
        playClickSound();
      } else {
        alert(`Không tìm thấy Câu ${num} trong bộ lọc hiện tại!`);
      }
    }
  };

  // Study statistics
  const studyStats = useMemo(() => {
    let answeredCount = 0;
    let correctCount = 0;
    let wrongCount = 0;

    Object.values(studyAnswers).forEach((ans) => {
      answeredCount++;
      if (ans.isCorrect) correctCount++;
      else wrongCount++;
    });

    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return { answeredCount, correctCount, wrongCount, accuracy };
  }, [studyAnswers]);

  // Exam statistics
  const examStats = useMemo(() => {
    if (examQuestions.length === 0) return { correct: 0, total: 50, score: '0.0' };
    let correct = 0;
    examQuestions.forEach((q) => {
      const userSelected = examAnswers[q.id] || [];
      const isCorrect =
        userSelected.length === q.correctAnswers.length &&
        userSelected.every(ans => q.correctAnswers.includes(ans));
      if (isCorrect) correct++;
    });
    const score = ((correct / examQuestions.length) * 10).toFixed(1);
    return { correct, total: examQuestions.length, score };
  }, [examQuestions, examAnswers]);

  // Exam Rank Evaluation
  const examRankInfo = useMemo(() => {
    const s = Number(examStats.score);
    if (s >= 9.0) return { rank: 'S', title: 'Đại Triết Gia Xuất Chúng', class: 'rank-s' };
    if (s >= 8.0) return { rank: 'A', title: 'Bậc Thầy Lý Luận', class: 'rank-a' };
    if (s >= 6.5) return { rank: 'B', title: 'Nhà Duy Vật Tiềm Năng', class: 'rank-b' };
    if (s >= 5.0) return { rank: 'C', title: 'Đạt Chuẩn Cần Cố Gắng', class: 'rank-c' };
    return { rank: 'D', title: 'Cần Ôn Luyện Lại', class: 'rank-d' };
  }, [examStats.score]);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      {/* Top Header with Gamified Player HUD */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <GraduationCap size={24} />
            </div>
            <div>
              <div className="brand-title">
                TRIẾT HỌC MÁC – LÊNIN
                <span className="brand-badge">MLN111</span>
              </div>
              <div className="brand-subtitle">598 Câu Trắc Nghiệm Chuẩn & Giáo Trình 2021</div>
            </div>
          </div>

          {/* Gamified Player HUD */}
          <div className="player-hud">
            {/* Level Pill */}
            <div
              className="hud-level-chip"
              onClick={() => setShowBadgesModal(true)}
              title="Nhấn để xem Thành tựu & Huy hiệu"
            >
              <Crown size={15} />
              <span>{getLevelTitle(level)}</span>
              <span className="hud-level-num">Lv.{level}</span>
            </div>

            {/* EXP Progress Box */}
            <div className="hud-exp-box" title={`Tổng EXP: ${exp} điểm`}>
              <div className="hud-exp-text">
                <span>EXP</span>
                <span>{expInLevel}/100</span>
              </div>
              <div className="hud-exp-bar">
                <div
                  className="hud-exp-fill"
                  style={{ width: `${expInLevel}%` }}
                />
              </div>
            </div>

            {/* Streak Flame */}
            <div className="hud-streak-chip" title="Chuỗi ngày học liên tục">
              <Flame size={15} />
              <span>{streak} ngày</span>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="nav-modes">
            <button
              className={`mode-btn ${mode === 'study' ? 'active' : ''}`}
              onClick={() => {
                setMode('study');
                setShowExplanation(false);
                playClickSound();
              }}
            >
              <BookOpen size={16} />
              Học Tập (598 Câu)
            </button>
            <button
              className={`mode-btn ${mode === 'exam' ? 'active' : ''}`}
              onClick={() => {
                setMode('exam');
                playClickSound();
              }}
            >
              <Clock size={16} />
              Thi Thử 60P
            </button>
          </div>

          {/* Header Controls */}
          <div className="header-actions">
            {/* Audio Toggle */}
            <button
              className="icon-btn"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              onClick={toggleSound}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Badges Modal Trigger */}
            <button
              className="icon-btn"
              title="Huy hiệu & Thành tựu"
              onClick={() => {
                setShowBadgesModal(true);
                playClickSound();
              }}
            >
              <Trophy size={18} color="#f59e0b" />
            </button>

            {/* Keyboard Shortcuts */}
            <button
              className="icon-btn btn-keyboard-shortcut"
              title="Phím tắt & Hướng dẫn (?)"
              onClick={() => {
                setShowShortcutsModal(true);
                playClickSound();
              }}
            >
              <Keyboard size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              className="icon-btn"
              title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
                playClickSound();
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="main-wrapper">
        {mode === 'study' ? (
          /* =========================================================================
             STUDY MODE (598 QUESTIONS)
             ========================================================================= */
          <>
            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="filter-row-top">
                {/* Chapter Pills */}
                <div className="chapter-pills">
                  {CHAPTERS.map((ch) => {
                    const count = ch.id === 'all'
                      ? rawQuestions.length
                      : rawQuestions.filter(q => q.chapter === ch.id).length;
                    return (
                      <button
                        key={ch.id}
                        className={`pill-btn ${selectedChapter === ch.id ? 'active' : ''}`}
                        onClick={() => handleChapterChange(ch.id)}
                      >
                        {ch.short}
                        <span className="pill-count">{count}</span>
                      </button>
                    );
                  })}

                  {/* Bookmark Filter Pill */}
                  <button
                    className={`pill-btn ${onlyBookmarked ? 'active' : ''}`}
                    onClick={() => {
                      setOnlyBookmarked(!onlyBookmarked);
                      setCurrentIndex(0);
                      playClickSound();
                    }}
                    style={{
                      borderColor: onlyBookmarked ? 'var(--bookmark)' : undefined,
                      backgroundColor: onlyBookmarked ? 'var(--bookmark)' : undefined,
                      color: onlyBookmarked ? '#000000' : undefined
                    }}
                  >
                    <Bookmark size={14} fill={onlyBookmarked ? 'currentColor' : 'none'} />
                    Đã đánh dấu
                    <span className="pill-count">{bookmarks.size}</span>
                  </button>
                </div>

                {/* Subtopic Dropdown with Grouping */}
                <select
                  className="topic-select"
                  value={selectedTopic}
                  onChange={(e) => handleTopicChange(e.target.value)}
                >
                  {selectedChapter === 'all' ? (
                    <>
                      <option value="all">Tất cả đề mục ({rawQuestions.length} câu)</option>
                      <optgroup label="── Chương 1: Khái luận về triết học ──">
                        {TOPICS.filter((t) => t.chapter === 1).map((top) => {
                          const cnt = rawQuestions.filter((q) => q.topicId === top.id).length;
                          return (
                            <option key={top.id} value={top.id}>
                              {top.title} ({cnt} câu)
                            </option>
                          );
                        })}
                      </optgroup>
                      <optgroup label="── Chương 2: Chủ nghĩa duy vật biện chứng ──">
                        {TOPICS.filter((t) => t.chapter === 2).map((top) => {
                          const cnt = rawQuestions.filter((q) => q.topicId === top.id).length;
                          return (
                            <option key={top.id} value={top.id}>
                              {top.title} ({cnt} câu)
                            </option>
                          );
                        })}
                      </optgroup>
                      <optgroup label="── Chương 3: Chủ nghĩa duy vật lịch sử ──">
                        {TOPICS.filter((t) => t.chapter === 3).map((top) => {
                          const cnt = rawQuestions.filter((q) => q.topicId === top.id).length;
                          return (
                            <option key={top.id} value={top.id}>
                              {top.title} ({cnt} câu)
                            </option>
                          );
                        })}
                      </optgroup>
                    </>
                  ) : (
                    <>
                      <option value="all">
                        Tất cả đề mục Chương {selectedChapter} ({rawQuestions.filter((q) => q.chapter === selectedChapter).length} câu)
                      </option>
                      {TOPICS.filter((t) => t.chapter === selectedChapter).map((top) => {
                        const cnt = rawQuestions.filter((q) => q.topicId === top.id).length;
                        return (
                          <option key={top.id} value={top.id}>
                            {top.title} ({cnt} câu)
                          </option>
                        );
                      })}
                    </>
                  )}
                </select>
              </div>

              {/* Search & Jump Row */}
              <div className="filter-row-search">
                <div className="search-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm nội dung câu hỏi, từ khóa triết học..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentIndex(0);
                    }}
                  />
                </div>

                {/* Jump to question */}
                <form onSubmit={handleJumpSubmit} className="jump-box">
                  <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Tới câu:</span>
                  <input
                    type="number"
                    min="1"
                    max="598"
                    className="jump-input"
                    placeholder="1-598"
                    value={jumpInput}
                    onChange={(e) => setJumpInput(e.target.value)}
                  />
                  <button type="submit" className="pill-btn" style={{ padding: '0.5rem 0.8rem' }}>
                    Nhảy
                  </button>
                  <button
                    type="button"
                    className="pill-btn mobile-matrix-trigger-btn"
                    onClick={() => {
                      playClickSound();
                      setShowMobileMatrixModal(true);
                    }}
                    title="Mở ma trận 598 câu hỏi"
                  >
                    <BookOpen size={14} />
                    Ma trận ({filteredQuestions.length})
                  </button>
                </form>
              </div>
            </div>

            {/* Study Layout: Question Card (Left) & Sidebar (Right) */}
            {filteredQuestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                <AlertCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3>Không tìm thấy câu hỏi phù hợp</h3>
                <p>Vui lòng thử bỏ chọn các bộ lọc hoặc tìm kiếm bằng từ khóa khác.</p>
                <button
                  className="pill-btn"
                  style={{
                    margin: '1.25rem auto 0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.25rem'
                  }}
                  onClick={() => {
                    setSelectedChapter('all');
                    setSelectedTopic('all');
                    setOnlyBookmarked(false);
                    setSearchQuery('');
                  }}
                >
                  <RotateCcw size={15} /> Đặt lại tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="study-layout">
                {/* Active Question Card (Mecha HUD with Spring Physics) */}
                {currentQ && (() => {
                  const savedAnswer = studyAnswers[currentQ.id];
                  const hasAnswered = !!savedAnswer;
                  const isMulti = currentQ.correctAnswers.length > 1;
                  const isBookmarked = bookmarks.has(currentQ.id);

                  return (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, y: 14, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -14, scale: 0.985 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className="question-card"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                      >
                        {/* Mobile Swipe Hint */}
                        <div className="mobile-swipe-hint">👈 Vuốt ngang màn hình để chuyển câu 👉</div>

                        {/* Sci-Fi Tech Status Line */}
                        <div className="mecha-hud-status">// PROTOCOL_MLN111 // COMBAT_INTERFACE</div>

                        {/* Top Meta */}
                        <div className="card-top">
                          <div className="meta-tags">
                            <span className="tag-chapter">{currentQ.chapterTitle.split(':')[0]}</span>
                            <span className="tag-topic">{currentQ.topicTitle.split('(')[0]}</span>
                            <span className="tag-topic" style={{ opacity: 0.8 }}>{currentQ.pageReference}</span>
                            
                            {/* Combo Badge */}
                            {combo >= 2 && (
                              <span className="combo-badge">
                                <Flame size={14} />
                                Combo x{combo}! (+{combo * 5} EXP)
                              </span>
                            )}

                            {isMulti && (
                              <span className="tag-chapter" style={{ background: 'var(--warning-bg)', color: '#d97706', borderColor: 'var(--warning-border)' }}>
                                Nhiều đáp án đúng ({currentQ.correctAnswers.length})
                              </span>
                            )}
                          </div>

                          {/* Bookmark Button */}
                          <button
                            className={`btn-bookmark ${isBookmarked ? 'bookmarked' : ''}`}
                            onClick={() => toggleBookmark(currentQ.id)}
                            title="Đánh dấu câu hỏi để xem lại sau (Phím M)"
                          >
                            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                            {isBookmarked ? 'Đã ghim' : 'Đánh dấu'}
                            <span className="kbd-badge">M</span>
                          </button>
                        </div>

                        {/* Question Text */}
                        <div className="question-title-wrap">
                          <div className="question-num">
                            <Zap size={15} color="var(--primary)" />
                            CÂU HỎI {currentQ.id} / 598
                          </div>
                          <h2 className="question-text">{currentQ.question}</h2>
                        </div>

                        {/* Extra Notes */}
                        {currentQ.extraNotes && currentQ.extraNotes.length > 0 && (
                          <div className="extra-notes-box">
                            <strong>Ghi chú mở rộng:</strong>
                            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                              {currentQ.extraNotes.map((note, idx) => (
                                <li key={idx}>{note}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Options Grid (Mecha Energy Buttons) */}
                        <div className="options-grid">
                          {currentQ.options.map((opt) => {
                            const isCorrect = currentQ.correctAnswers.includes(opt.id);
                            const isSelected = hasAnswered && savedAnswer.selected.includes(opt.id);
                            const isTempSelected = !hasAnswered && isMulti && tempMultiSelections.includes(opt.id);

                            let stateClass = '';
                            if (hasAnswered) {
                              if (isCorrect && isSelected) {
                                stateClass = 'state-correct';
                              } else if (!isCorrect && isSelected) {
                                stateClass = 'state-wrong';
                              } else if (isCorrect && !isSelected) {
                                stateClass = 'state-revealed-correct';
                              }
                            } else if (isTempSelected) {
                              stateClass = 'state-correct';
                            }

                            return (
                              <button
                                key={opt.id}
                                className={`option-btn ${stateClass}`}
                                onClick={() => handleSelectOptionStudy(opt.id)}
                              >
                                <div className="option-left">
                                  <div className="option-badge">
                                    {hasAnswered && isCorrect ? (
                                      <Check size={18} />
                                    ) : hasAnswered && isSelected && !isCorrect ? (
                                      <X size={18} />
                                    ) : (
                                      opt.id
                                    )}
                                  </div>
                                  <span className="option-text">{opt.text}</span>
                                </div>
                                <span className="kbd-badge">{opt.id}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Multi-choice Confirmation Button */}
                        {isMulti && !hasAnswered && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <button
                              className="btn-nav btn-nav-primary"
                              onClick={handleConfirmMultiStudy}
                              disabled={tempMultiSelections.length === 0}
                            >
                              Xác nhận chọn ({tempMultiSelections.length} đáp án)
                            </button>
                          </div>
                        )}

                        {/* Explanation Section */}
                        {hasAnswered && (
                          <div className="explanation-card">
                            <div
                              className="explanation-header"
                              onClick={() => {
                                setShowExplanation(!showExplanation);
                                playClickSound();
                              }}
                            >
                              <div className="exp-title-row">
                                <HelpCircle size={20} />
                                <span>Giải Thích Chi Tiết Từ Giáo Trình</span>
                                <span className="exp-citation-tag">{currentQ.pageReference}</span>
                              </div>
                              <span style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 700 }}>
                                {showExplanation ? 'Thu gọn ▲' : 'Xem chi tiết (+2 EXP) ▼'}
                              </span>
                            </div>

                            {showExplanation && (
                              <div className="explanation-body">
                                <p>{currentQ.explanation}</p>
                                <div className="citation-book">
                                  <ExternalLink size={14} />
                                  <span>{currentQ.textbook} ({currentQ.pageReference})</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bottom Navigation Buttons */}
                        <div className="card-bottom-actions">
                          <div className="nav-buttons-group">
                            <button
                              className="btn-nav"
                              disabled={safeCurrentIndex === 0}
                              onClick={() => {
                                playClickSound();
                                setCurrentIndex(prev => Math.max(0, prev - 1));
                                setShowExplanation(false);
                              }}
                            >
                              <ChevronLeft size={16} /> Câu trước
                              <span className="kbd-badge">←</span>
                            </button>

                            <button
                              className="btn-nav btn-nav-primary"
                              disabled={safeCurrentIndex === filteredQuestions.length - 1}
                              onClick={() => {
                                playClickSound();
                                setCurrentIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1));
                                setShowExplanation(false);
                              }}
                            >
                              Câu tiếp <ChevronRight size={16} />
                              <span className="kbd-badge">→</span>
                            </button>
                          </div>

                          {/* Reset Question Answer */}
                          {hasAnswered && (
                            <button
                              className="btn-nav"
                              onClick={() => {
                                playClickSound();
                                setStudyAnswers((prev) => {
                                  const next = { ...prev };
                                  delete next[currentQ.id];
                                  return next;
                                });
                                setTempMultiSelections([]);
                                setShowExplanation(false);
                              }}
                              title="Làm lại câu này"
                            >
                              <RotateCcw size={15} /> Làm lại câu này
                            </button>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  );
                })()}

                {/* Sidebar Stats & Gem Crystal Matrix */}
                <div className="sidebar-panel">
                  {/* Progress Stats */}
                  <div className="stats-card">
                    <div className="stats-header">
                      <span>Tiến Độ Học Tập</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 800 }}>
                        {studyStats.accuracy}% Chuẩn
                      </span>
                    </div>

                    <div className="stats-grid">
                      <div className="stat-box">
                        <span className="stat-value" style={{ color: 'var(--primary)' }}>
                          {studyStats.answeredCount}
                        </span>
                        <span className="stat-label">Đã trả lời / 598</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-value" style={{ color: 'var(--success)' }}>
                          {studyStats.correctCount}
                        </span>
                        <span className="stat-label">Trả lời đúng</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-value" style={{ color: 'var(--error)' }}>
                          {studyStats.wrongCount}
                        </span>
                        <span className="stat-label">Trả lời sai</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-value" style={{ color: 'var(--bookmark)' }}>
                          {bookmarks.size}
                        </span>
                        <span className="stat-label">Đã đánh dấu</span>
                      </div>
                    </div>

                    <div className="progress-bar-wrap">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${(studyStats.answeredCount / 598) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Gem Matrix Navigator Card */}
                  <div className="navigator-card">
                    <div className="nav-grid-header">
                      <span>Ma Trận Câu Hỏi ({filteredQuestions.length})</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Câu #{currentQ ? currentQ.id : 0}
                      </span>
                    </div>

                    <div className="nav-grid-scroll">
                      {filteredQuestions.map((q, idx) => {
                        const ans = studyAnswers[q.id];
                        const isCurrent = idx === safeCurrentIndex;
                        const isBookmarked = bookmarks.has(q.id);

                        let chipClass = 'nav-chip';
                        if (isCurrent) chipClass += ' chip-current';
                        else if (ans && ans.isCorrect) chipClass += ' chip-correct';
                        else if (ans && !ans.isCorrect) chipClass += ' chip-wrong';
                        if (isBookmarked) chipClass += ' chip-bookmarked';

                        return (
                          <button
                            key={q.id}
                            className={chipClass}
                            onClick={() => {
                              playClickSound();
                              setCurrentIndex(idx);
                              setShowExplanation(false);
                            }}
                            title={`Câu ${q.id}: ${q.question.slice(0, 50)}...`}
                          >
                            {q.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* =========================================================================
             EXAM MODE (BOSS CHALLENGE 60 MINUTES - 50 QUESTIONS)
             ========================================================================= */
          <>
            {examStatus === 'intro' && (
              <div className="result-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <div className="brand-icon" style={{ width: 68, height: 68, borderRadius: 16 }}>
                    <GraduationCap size={38} />
                  </div>
                </div>
                <h2>THI THỬ TRIẾT HỌC MÁC – LÊNIN (MLN111)</h2>
                <p style={{ color: 'var(--text-muted)' }}>
                  Thử thách 50 câu trắc nghiệm mô phỏng phòng thi thật • Chinh phục Rank S
                </p>

                <div className="stats-grid" style={{ maxWidth: 520, margin: '1rem auto' }}>
                  <div className="stat-box">
                    <span className="stat-value">50</span>
                    <span className="stat-label">Số câu hỏi (ngẫu nhiên từ 598 câu)</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">60:00</span>
                    <span className="stat-label">Thời gian làm bài (Phút)</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">Rank S</span>
                    <span className="stat-label">Cấp bậc tối đa (≥ 9.0 Điểm)</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">+350</span>
                    <span className="stat-label">EXP Thưởng tối đa</span>
                  </div>
                </div>

                <div style={{ textAlign: 'left', backgroundColor: 'var(--bg-tertiary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={18} color="var(--primary)" /> Quy chế & Hướng dẫn:
                  </h4>
                  <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <li>Hệ thống bốc ngẫu nhiên 50 câu từ ngân hàng 598 câu chuẩn.</li>
                    <li>Trong lúc làm bài, đáp án đúng sẽ <strong>không hiển thị</strong> để đảm bảo tính khách quan.</li>
                    <li>Có thể đánh dấu những câu phân vân để kiểm tra lại trước khi bấm nộp bài.</li>
                    <li>Hết 60 phút hệ thống sẽ tự động thu bài và hiển thị kết quả phân loại Rank kèm trích dẫn giáo trình.</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    className="btn-submit-exam"
                    style={{ fontSize: '1.1rem', padding: '0.9rem 2.8rem' }}
                    onClick={startExam}
                  >
                    Bắt Đầu Thi Ngay
                  </button>
                </div>
              </div>
            )}

            {examStatus === 'active' && examQuestions.length > 0 && (() => {
              const currentExamQ = examQuestions[examCurrentIndex];
              const selectedOpts = examAnswers[currentExamQ.id] || [];
              const isMulti = currentExamQ.correctAnswers.length > 1;
              const isBookmarked = examBookmarks.has(currentExamQ.id);

              const answeredExamCount = Object.keys(examAnswers).length;

              let timerClass = 'timer-box';
              if (timeLeft <= 300) timerClass += ' danger';
              else if (timeLeft <= 600) timerClass += ' warning';

              return (
                <div>
                  {/* Top Exam Header Banner */}
                  <div className="exam-header-banner">
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={22} /> PHÒNG THI THỬ TRẮC NGHIỆM MLN111
                      </h3>
                      <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                        Đã làm: {answeredExamCount} / 50 câu &bull; Đã đánh dấu: {examBookmarks.size} câu
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className={timerClass}>
                        <Clock size={24} />
                        <span>{formatTime(timeLeft)}</span>
                      </div>

                      <button
                        className="btn-submit-exam"
                        onClick={() => {
                          playClickSound();
                          setShowSubmitConfirm(true);
                        }}
                      >
                        Nộp Bài Thi
                      </button>
                    </div>
                  </div>

                  {/* Exam Question Card & Grid with Motion */}
                  <div className="study-layout">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentExamQ.id}
                        initial={{ opacity: 0, y: 14, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -14, scale: 0.985 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className="question-card"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                      >
                        {/* Mobile Swipe Hint */}
                        <div className="mobile-swipe-hint">👈 Vuốt ngang màn hình để chuyển câu 👉</div>

                        <div className="mecha-hud-status">// TIME_TRIAL_EXAM // 50_QUESTIONS</div>

                        <div className="card-top">
                          <div className="meta-tags">
                            <span className="tag-chapter">{currentExamQ.chapterTitle.split(':')[0]}</span>
                            <span className="tag-topic">{currentExamQ.topicTitle.split('(')[0]}</span>
                            {isMulti && (
                              <span className="tag-chapter" style={{ background: 'var(--warning-bg)', color: '#d97706', borderColor: 'var(--warning-border)' }}>
                                Chọn {currentExamQ.correctAnswers.length} đáp án đúng
                              </span>
                            )}
                          </div>

                          <button
                            className={`btn-bookmark ${isBookmarked ? 'bookmarked' : ''}`}
                            onClick={() => {
                              playClickSound();
                              setExamBookmarks((prev) => {
                                const next = new Set(prev);
                                if (next.has(currentExamQ.id)) next.delete(currentExamQ.id);
                                else next.add(currentExamQ.id);
                                return next;
                              });
                            }}
                            title="Đánh dấu câu này để xem lại trước khi nộp bài (Phím M)"
                          >
                            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                            {isBookmarked ? 'Đã đánh dấu xem lại' : 'Đánh dấu xem lại'}
                          </button>
                        </div>

                        <div className="question-title-wrap">
                          <div className="question-num">
                            CÂU HỎI {examCurrentIndex + 1} / 50 (GỐC: CÂU #{currentExamQ.id})
                          </div>
                          <h2 className="question-text">{currentExamQ.question}</h2>
                        </div>

                        {/* Options Grid */}
                        <div className="options-grid">
                          {currentExamQ.options.map((opt) => {
                            const isSelected = selectedOpts.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                className={`option-btn ${isSelected ? 'state-correct' : ''}`}
                                onClick={() => handleSelectOptionExam(opt.id)}
                              >
                                <div className="option-left">
                                  <div className="option-badge">
                                    {isSelected ? <Check size={18} /> : opt.id}
                                  </div>
                                  <span className="option-text">{opt.text}</span>
                                </div>
                                <span className="kbd-badge">{opt.id}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Bottom Nav */}
                        <div className="card-bottom-actions">
                          <div className="nav-buttons-group">
                            <button
                              className="btn-nav"
                              disabled={examCurrentIndex === 0}
                              onClick={() => {
                                playClickSound();
                                setExamCurrentIndex(prev => Math.max(0, prev - 1));
                              }}
                            >
                              <ChevronLeft size={16} /> Câu trước
                            </button>

                            <button
                              className="btn-nav btn-nav-primary"
                              disabled={examCurrentIndex === examQuestions.length - 1}
                              onClick={() => {
                                playClickSound();
                                setExamCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1));
                              }}
                            >
                              Câu tiếp <ChevronRight size={16} />
                            </button>
                          </div>

                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Dùng phím số 1-4 hoặc A-D để chọn đáp án
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* 50 Questions Map */}
                    <div className="sidebar-panel">
                      <div className="navigator-card" style={{ maxHeight: 'none' }}>
                        <div className="nav-grid-header">
                          <span>Bảng 50 Câu Hỏi</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {answeredExamCount}/50 đã chọn
                          </span>
                        </div>

                        <div className="nav-grid-scroll exam-nav-grid">
                          {examQuestions.map((q, idx) => {
                            const isAnswered = !!examAnswers[q.id];
                            const isCurrent = idx === examCurrentIndex;
                            const isBookmarked = examBookmarks.has(q.id);

                            let chipClass = 'nav-chip';
                            if (isCurrent) chipClass += ' chip-current';
                            else if (isAnswered) chipClass += ' chip-correct';
                            if (isBookmarked) chipClass += ' chip-bookmarked';

                            return (
                              <button
                                key={q.id}
                                className={chipClass}
                                onClick={() => {
                                  playClickSound();
                                  setExamCurrentIndex(idx);
                                }}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Exam Results / Victory Screen with Motion Rank Badge */}
            {examStatus === 'result' && (
              <div>
                {!reviewMode ? (
                  <div className="result-card">
                    {/* Rank Crest Badge with Motion Spring */}
                    <motion.div
                      initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 220 }}
                      className={`rank-crest-wrap ${examRankInfo.class}`}
                    >
                      <span className="rank-letter">{examRankInfo.rank}</span>
                      <span className="rank-title">{examRankInfo.title}</span>
                    </motion.div>

                    <h2>BẢNG TỔNG KẾT BÀI THI</h2>
                    
                    {/* EXP Reward Banner */}
                    <div className="exp-reward-banner">
                      <Sparkles size={18} />
                      <span>+{examEarnedExp} EXP Kinh Nghiệm Đã Nhận!</span>
                    </div>

                    <div className="stats-grid">
                      <div className="stat-box">
                        <span className="stat-value" style={{ color: 'var(--success)' }}>
                          {examStats.correct} / 50
                        </span>
                        <span className="stat-label">Số câu trả lời đúng</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-value" style={{ color: 'var(--error)' }}>
                          {50 - examStats.correct} / 50
                        </span>
                        <span className="stat-label">Số câu sai hoặc bỏ trống</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-value">
                          {formatTime(60 * 60 - timeLeft)}
                        </span>
                        <span className="stat-label">Thời gian hoàn thành</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-value" style={{ color: 'var(--primary)' }}>
                          {examStats.score} / 10
                        </span>
                        <span className="stat-label">Điểm số đạt được</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                      <button
                        className="btn-nav btn-nav-primary"
                        style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
                        onClick={() => {
                          playClickSound();
                          setReviewMode(true);
                        }}
                      >
                        <HelpCircle size={18} />
                        Xem Lời Giải Chi Tiết 50 Câu
                      </button>

                      <button
                        className="btn-nav"
                        style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
                        onClick={startExam}
                      >
                        <RotateCcw size={18} />
                        Thi Đề Mới (50 Câu Khác)
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Review Mode for Exam */
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3>XEM LẠI BÀI THI ({examStats.correct}/50 CÂU ĐÚNG)</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          Màu xanh: Đáp án đúng &bull; Màu đỏ: Đáp án bạn đã chọn sai &bull; Kèm giải thích giáo trình
                        </p>
                      </div>
                      <button
                        className="btn-nav"
                        onClick={() => {
                          playClickSound();
                          setReviewMode(false);
                        }}
                      >
                        Quay lại bảng điểm
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {examQuestions.map((q, idx) => {
                        const userSelected = examAnswers[q.id] || [];
                        const isCorrect =
                          userSelected.length === q.correctAnswers.length &&
                          userSelected.every(ans => q.correctAnswers.includes(ans));

                        return (
                          <div
                            key={q.id}
                            className="question-card"
                            style={{
                              borderLeft: `5px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`
                            }}
                          >
                            <div className="card-top">
                              <div className="meta-tags">
                                <span className="tag-chapter">CÂU {idx + 1} / 50</span>
                                <span className="tag-topic">{q.chapterTitle.split(':')[0]}</span>
                                <span className="tag-topic">{q.pageReference}</span>
                                {isCorrect ? (
                                  <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.85rem' }}>
                                    ✓ ĐÚNG (+10 EXP)
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--error)', fontWeight: 800, fontSize: '0.85rem' }}>
                                    ✕ SAI (Bạn chọn: {userSelected.join(', ') || 'Chưa chọn'})
                                  </span>
                                )}
                              </div>

                              <button
                                className={`btn-bookmark ${bookmarks.has(q.id) ? 'bookmarked' : ''}`}
                                onClick={() => toggleBookmark(q.id)}
                              >
                                <Bookmark size={15} fill={bookmarks.has(q.id) ? 'currentColor' : 'none'} />
                                Lưu vào câu hỏi khó
                              </button>
                            </div>

                            <h3 className="question-text">{q.question}</h3>

                            <div className="options-grid">
                              {q.options.map((opt) => {
                                const isAnsCorrect = q.correctAnswers.includes(opt.id);
                                const isUserPicked = userSelected.includes(opt.id);

                                let stateClass = '';
                                if (isAnsCorrect && isUserPicked) stateClass = 'state-correct';
                                else if (!isAnsCorrect && isUserPicked) stateClass = 'state-wrong';
                                else if (isAnsCorrect && !isUserPicked) stateClass = 'state-revealed-correct';

                                return (
                                  <div key={opt.id} className={`option-btn ${stateClass}`} style={{ cursor: 'default' }}>
                                    <div className="option-left">
                                      <div className="option-badge">
                                        {isAnsCorrect ? <Check size={18} /> : isUserPicked ? <X size={18} /> : opt.id}
                                      </div>
                                      <span className="option-text">{opt.text}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation Card */}
                            <div className="explanation-card">
                              <div className="exp-title-row">
                                <HelpCircle size={18} />
                                <span>Trích dẫn Giáo trình Triết học Mác – Lênin (2021) - {q.pageReference}</span>
                              </div>
                              <p className="explanation-body" style={{ marginTop: '0.5rem' }}>
                                {q.explanation}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Confirmation Modal to Submit Exam */}
      {showSubmitConfirm && (
        <div className="modal-overlay" onClick={() => setShowSubmitConfirm(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={22} color="var(--warning)" />
              Xác nhận nộp bài thi?
            </h3>
            <p>
              Bạn đã hoàn thành <strong>{Object.keys(examAnswers).length}</strong> trên tổng số <strong>50</strong> câu hỏi.
              {50 - Object.keys(examAnswers).length > 0 && (
                <span style={{ color: 'var(--error)', display: 'block', marginTop: '0.5rem', fontWeight: 600 }}>
                  Lưu ý: Còn {50 - Object.keys(examAnswers).length} câu chưa chọn đáp án!
                </span>
              )}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                className="btn-nav"
                onClick={() => {
                  playClickSound();
                  setShowSubmitConfirm(false);
                }}
              >
                Tiếp tục làm bài
              </button>
              <button
                className="btn-submit-exam"
                onClick={finishExam}
              >
                Đồng ý nộp bài
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Badges / Achievements Modal with Motion */}
      {showBadgesModal && (
        <div className="modal-overlay" onClick={() => setShowBadgesModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={22} color="#f59e0b" /> Bộ Huy Hiệu Triết Học ({unlockedBadges.size}/{BADGES.length})
              </h3>
              <button
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setShowBadgesModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="badges-grid">
              {BADGES.map((b) => {
                const isUnlocked = unlockedBadges.has(b.id);
                return (
                  <div key={b.id} className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <div className="badge-icon-box">
                      {isUnlocked ? (
                        b.icon === 'zap' ? <Zap size={22} /> :
                        b.icon === 'flame' ? <Flame size={22} /> :
                        b.icon === 'crown' ? <Crown size={22} /> :
                        b.icon === 'star' ? <Star size={22} /> :
                        b.icon === 'award' ? <Award size={22} /> :
                        b.icon === 'shield' ? <ShieldCheck size={22} /> :
                        b.icon === 'bookmark' ? <Bookmark size={22} /> :
                        <Trophy size={22} />
                      ) : (
                        <Lock size={20} />
                      )}
                    </div>
                    <div className="badge-info">
                      <h4>{b.title}</h4>
                      <p>{b.desc}</p>
                      <span className="badge-status-tag">
                        {isUnlocked ? '✓ ĐÃ ĐẠT' : 'CHƯA MỞ KHÓA'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <button
                className="btn-nav btn-nav-primary"
                onClick={() => setShowBadgesModal(false)}
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="modal-overlay" onClick={() => setShowShortcutsModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Keyboard size={20} /> Phím Tắt Hỗ Trợ
              </h3>
              <button
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setShowShortcutsModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
                📱 Thao Tác Cảm Ứng (Điện Thoại)
              </div>
              <div className="shortcut-row">
                <span>Vuốt sang trái (←)</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-sub)' }}>Chuyển câu tiếp</span>
              </div>
              <div className="shortcut-row">
                <span>Vuốt sang phải (→)</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-sub)' }}>Quay lại câu trước</span>
              </div>
              <div className="shortcut-row">
                <span>Chạm vào đáp án A, B, C, D</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-sub)' }}>Chọn & xem giải thích</span>
              </div>
              <div className="shortcut-row">
                <span>Nút "Ma trận câu" hoặc Nút Nổi</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-sub)' }}>Mở bảng nhảy nhanh câu hỏi</span>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem', marginTop: '0.5rem' }}>
                ⌨️ Phím Tắt Bàn Phím (Máy Tính)
              </div>
              <div className="shortcut-row">
                <span>Chọn đáp án A, B, C, D</span>
                <div>
                  <span className="kbd-badge">A</span> <span className="kbd-badge">B</span> <span className="kbd-badge">C</span> <span className="kbd-badge">D</span> hoặc <span className="kbd-badge">1</span>-<span className="kbd-badge">4</span>
                </div>
              </div>
              <div className="shortcut-row">
                <span>Chuyển câu hỏi trước / sau</span>
                <div>
                  <span className="kbd-badge">←</span> <span className="kbd-badge">→</span> hoặc <span className="kbd-badge">J</span> / <span className="kbd-badge">K</span>
                </div>
              </div>
              <div className="shortcut-row">
                <span>Đánh dấu (Bookmark) câu hỏi</span>
                <span className="kbd-badge">M</span>
              </div>
              <div className="shortcut-row">
                <span>Ẩn / Hiện giải thích chi tiết</span>
                <span className="kbd-badge">Space</span>
              </div>
              <div className="shortcut-row">
                <span>Mở hộp phím tắt trợ giúp</span>
                <span className="kbd-badge">?</span>
              </div>
              <div className="shortcut-row">
                <span>Đóng cửa sổ modal / hủy</span>
                <span className="kbd-badge">Esc</span>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <button
                className="btn-nav btn-nav-primary"
                onClick={() => setShowShortcutsModal(false)}
              >
                Đã hiểu
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Gamified Toast Notification with Motion */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="gamify-toast"
          >
            <Sparkles size={24} color="#facc15" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{toast.title}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{toast.subtitle}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Matrix Trigger for Mobile Learners */}
      {mode === 'study' && currentQ && (
        <button
          className="mobile-floating-matrix-btn"
          onClick={() => {
            playClickSound();
            setShowMobileMatrixModal(true);
          }}
          title="Mở ma trận câu hỏi"
        >
          <BookOpen size={16} />
          <span>Câu #{currentQ.id} / 598 📑</span>
        </button>
      )}

      {/* Mobile Matrix Navigator Bottom Sheet Modal */}
      {showMobileMatrixModal && (
        <div className="modal-overlay" onClick={() => setShowMobileMatrixModal(false)}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="modal-content mobile-matrix-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                <BookOpen size={20} color="var(--primary)" />
                Bảng Câu Hỏi ({filteredQuestions.length} câu)
              </h3>
              <button
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setShowMobileMatrixModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Stats in Mobile Modal */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
              <div className="stat-box" style={{ padding: '0.4rem', textAlign: 'center' }}>
                <span className="stat-value" style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>{studyStats.answeredCount}</span>
                <span className="stat-label" style={{ fontSize: '0.65rem' }}>Đã làm</span>
              </div>
              <div className="stat-box" style={{ padding: '0.4rem', textAlign: 'center' }}>
                <span className="stat-value" style={{ fontSize: '1.05rem', color: 'var(--success)' }}>{studyStats.correctCount}</span>
                <span className="stat-label" style={{ fontSize: '0.65rem' }}>Đúng</span>
              </div>
              <div className="stat-box" style={{ padding: '0.4rem', textAlign: 'center' }}>
                <span className="stat-value" style={{ fontSize: '1.05rem', color: 'var(--error)' }}>{studyStats.wrongCount}</span>
                <span className="stat-label" style={{ fontSize: '0.65rem' }}>Sai</span>
              </div>
              <div className="stat-box" style={{ padding: '0.4rem', textAlign: 'center' }}>
                <span className="stat-value" style={{ fontSize: '1.05rem', color: 'var(--bookmark)' }}>{bookmarks.size}</span>
                <span className="stat-label" style={{ fontSize: '0.65rem' }}>Ghim</span>
              </div>
            </div>

            {/* Question Chips Grid in Mobile Modal */}
            <div className="nav-grid-scroll mobile-nav-grid">
              {filteredQuestions.map((q, idx) => {
                const ans = studyAnswers[q.id];
                const isCurrent = idx === safeCurrentIndex;
                const isBookmarked = bookmarks.has(q.id);

                let chipClass = 'nav-chip';
                if (isCurrent) chipClass += ' chip-current';
                else if (ans && ans.isCorrect) chipClass += ' chip-correct';
                else if (ans && !ans.isCorrect) chipClass += ' chip-wrong';
                if (isBookmarked) chipClass += ' chip-bookmarked';

                return (
                  <button
                    key={q.id}
                    className={chipClass}
                    onClick={() => {
                      playClickSound();
                      setCurrentIndex(idx);
                      setShowExplanation(false);
                      setShowMobileMatrixModal(false);
                    }}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
              <button
                className="btn-nav btn-nav-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setShowMobileMatrixModal(false)}
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
