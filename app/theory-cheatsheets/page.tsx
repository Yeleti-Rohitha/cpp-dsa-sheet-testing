"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Filter,
  Layers,
  MonitorCog,
  Network,
  Search,
  Sheet,
  Sprout,
  Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import ConceptCard from "@/components/ui/conceptCard";
import Navbar from "@/components/ui/Navbar-interview";
// Flashcards imports (migrated from former /flashcards page)
import Navbar2 from "@/components/Navbar";
import FlashcardComponent from "@/components/FlashcardComponent";
import { motion, AnimatePresence } from "framer-motion";
import {
  flashcards,
  categories,
  difficulties,
  type Flashcard,
} from "@/data/flashcards";
import { ChevronLeft, ChevronRight, RotateCcw, Trophy } from "lucide-react";
// ...removed framer-motion imports and animation configs...

const coreConcept = [
  {
    title: "OOPS",
    description:
      "Object-Oriented Programming focuses on classes, objects, inheritance, polymorphism, and encapsulation.",
    icon: <BookOpen />,
    level: "easy",
    questions: [
      {
        questionTitle: "OOPS belongs to which subject?",
        optionA: "Computer Science",
        optionB: "Geology",
        optionC: "Math",
        optionD: "Zoology",
        level: "hard",
      },
      {
        questionTitle: "Which of these is not a principle of OOPS?",
        optionA: "Inheritance",
        optionB: "Polymorphism",
        optionC: "Encapsulation",
        optionD: "Photosynthesis",
        level: "medium",
      },
    ],
    topic: ["classes", "objects", "inheritance"],
  },
  {
    title: "DBMS",
    description:
      "Database Management System helps in creating, managing, and retrieving data efficiently.",
    icon: <Layers />,
    level: "medium",
    questions: [
      {
        questionTitle: "Which of the following is a DBMS software?",
        optionA: "MySQL",
        optionB: "Photoshop",
        optionC: "MS Word",
        optionD: "Excel",
        level: "easy",
      },
      {
        questionTitle: "What is normalization in DBMS?",
        optionA: "Organizing data to reduce redundancy",
        optionB: "Adding more tables",
        optionC: "Deleting duplicate records",
        optionD: "Converting text to uppercase",
        level: "medium",
      },
    ],
    topic: ["SQL", "normalization", "transactions"],
  },
  {
    title: "Operating System",
    description:
      "An OS manages hardware and software resources, provides services, and enables interaction between user and computer.",
    icon: <MonitorCog />,
    level: "hard",
    questions: [
      {
        questionTitle: "Which of the following is not an OS?",
        optionA: "Linux",
        optionB: "Windows",
        optionC: "MS Excel",
        optionD: "MacOS",
        level: "easy",
      },
      {
        questionTitle: "What is the purpose of a process scheduler?",
        optionA: "Manage memory allocation",
        optionB: "Select process from ready queue",
        optionC: "Format hard disk",
        optionD: "Connect to network",
        level: "hard",
      },
    ],
    topic: ["processing", "memory", "scheduling"],
  },
  {
    title: "Computer Networks",
    description:
      "Computer networks connect multiple devices to share resources, data, and communication services.",
    icon: <Network />,
    level: "easy",
    questions: [
      {
        questionTitle: "Which of these is a networking device?",
        optionA: "Router",
        optionB: "Compiler",
        optionC: "Keyboard",
        optionD: "Printer",
        level: "easy",
      },
      {
        questionTitle: "Which protocol is used for secure web browsing?",
        optionA: "HTTP",
        optionB: "FTP",
        optionC: "HTTPS",
        optionD: "SMTP",
        level: "medium",
      },
    ],
    topic: ["protocols", "OSI model", "topologies"],
  },
];

const totalQuestions = coreConcept.reduce((count, concept) => {
  return count + concept.questions.length;
}, 0);

const rounded = Math.floor(totalQuestions / 50) * 50;
const displayQuestions =
  totalQuestions % 50 === 0 ? `${rounded} Questions` : `${rounded}+ Questions`;

const page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cheatsheets" | "flashcards">(
    "cheatsheets"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Flashcard states (ported)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [reviewedCards, setReviewedCards] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Persist flashcard progress
  useEffect(() => {
    const savedIndex = localStorage.getItem("flashcard_current_index");
    const savedReviewed = localStorage.getItem("flashcard_reviewed");
    const savedCategoryFilter = localStorage.getItem(
      "flashcard_category_filter"
    );
    const savedDifficultyFilter = localStorage.getItem(
      "flashcard_difficulty_filter"
    );
    if (savedIndex) setCurrentIndex(parseInt(savedIndex));
    if (savedReviewed) setReviewedCards(new Set(JSON.parse(savedReviewed)));
    if (savedCategoryFilter) setCategoryFilter(savedCategoryFilter);
    if (savedDifficultyFilter) setDifficultyFilter(savedDifficultyFilter);
  }, []);

  useEffect(() => {
    localStorage.setItem("flashcard_current_index", currentIndex.toString());
    localStorage.setItem(
      "flashcard_reviewed",
      JSON.stringify([...reviewedCards])
    );
    localStorage.setItem("flashcard_category_filter", categoryFilter);
    localStorage.setItem("flashcard_difficulty_filter", difficultyFilter);
  }, [currentIndex, reviewedCards, categoryFilter, difficultyFilter]);

  const filteredCards = flashcards.filter((card) => {
    const categoryMatch =
      categoryFilter === "All" || card.category === categoryFilter;
    const difficultyMatch =
      difficultyFilter === "All" || card.difficulty === difficultyFilter;
    return categoryMatch && difficultyMatch;
  });

  useEffect(() => {
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [filteredCards.length, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [categoryFilter, difficultyFilter]);

  const currentCard = filteredCards[currentIndex];
  const reviewedCount = filteredCards.filter((card) =>
    reviewedCards.has(card.id)
  ).length;
  const progress =
    filteredCards.length > 0 ? (reviewedCount / filteredCards.length) * 100 : 0;

  const handleNext = () => {
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
      setIsFlipped(false);
    }
  };
  const handlePrevious = () => {
    if (filteredCards.length > 0) {
      setCurrentIndex(
        (prev) => (prev - 1 + filteredCards.length) % filteredCards.length
      );
      setIsFlipped(false);
    }
  };
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && currentCard && !reviewedCards.has(currentCard.id)) {
      setReviewedCards((prev) => new Set([...prev, currentCard.id]));
    }
  };
  const resetProgress = () => {
    setReviewedCards(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  const resetFilters = () => {
    setCategoryFilter("All");
    setDifficultyFilter("All");
  };

  // Remove duplicacy in cheatsheets by filtering unique titles
  const filteredSubjects = coreConcept
    .filter(
      (con, idx, arr) => arr.findIndex((c) => c.title === con.title) === idx
    )
    .filter((con) => {
      const matchesSearch =
        con.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        con.topic.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesSubject = !selectedSubject || con.title === selectedSubject;
      return matchesSearch && matchesSubject;
    });

  return (
    <div className="min-h-screen bg-background pt-12">
      <Navbar2 />
      {/* <Navbar icon={<Sheet />} pageTitle="Theory Cheatsheets & Flashcards" onBack="/" page1="Interview-Experiences" page1Link="/interview-experiences" /> */}

      {/* Hero Section */}
      <section className="py-16 px-14 bg-gradient-to-r from-experience/10 to-experience/5">
        <div className="w-full">
          {" "}
          {/* remove mx-auto or text-center */}
          <nav className="flex justify-start m-2" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <a
                    href="#"
                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                  >
                    Learning Tools
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                    Theory Cheatsheets & Flashcards
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Theory Cheatsheets
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Master the fundamentals with our comprehensive collection of
              interview questions and concepts.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{coreConcept.length} Core Topics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>{displayQuestions}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Sprout className="h-4 w-4" />
                <span>Track Progress</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="px-4 pt-6 container mx-auto">
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab("cheatsheets")}
            className={`px-4 py-2 text-sm font-medium relative ${
              activeTab === "cheatsheets"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Cheatsheets
            {activeTab === "cheatsheets" && (
              <span className="absolute left-0 -bottom-px h-0.5 w-full bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("flashcards")}
            className={`px-4 py-2 text-sm font-medium relative ${
              activeTab === "flashcards"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Flashcards
            {activeTab === "flashcards" && (
              <span className="absolute left-0 -bottom-px h-0.5 w-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {activeTab === "cheatsheets" && (
        <>
          {/* Filters (Cheatsheets) */}
          <section className="py-8 px-4 border-b bg-secondary/20">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subjects, topics..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedSubject === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubject(null)}
                    >
                      All Subjects
                    </Button>
                    {coreConcept.slice(0, 3).map((sub) => (
                      <Button
                        key={sub.title}
                        variant={
                          selectedSubject === sub.title ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedSubject(sub.title)}
                      >
                        {sub.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Concept Cards */}
          <section className="flex flex-wrap gap-6 items-stretch justify-center px-4 py-8">
            {filteredSubjects.map((sub) => (
              <ConceptCard
                key={sub.title}
                title={sub.title}
                description={sub.description}
                icon={sub.icon}
                level={sub.level}
                topic={sub.topic}
                noOfQuestion={sub.questions.length}
              />
            ))}
          </section>
        </>
      )}

      {activeTab === "flashcards" && (
        <motion.div
          className="max-w-screen mt-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Control Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-2 h-12 py-1 rounded-xl font-medium transition-all ${
                showFilters
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white/70 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10"
              }`}
            >
              <Filter size={18} />
              Filters
            </button>

            <button
              onClick={resetProgress}
              className="flex items-center gap-2 px-2 h-12 py-1 bg-white/70 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 transition-all"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
          {/* Stats and Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8 ">
            {/* Progress Stats */}
            <div className="flex justify-center items-center flex-col min-w-full md:flex-row gap-4 ">
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border w-40 border-gray-200/50 dark:border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {currentIndex + 1}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Current
                </div>
              </div>
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border w-40 border-gray-200/50 dark:border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {reviewedCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Reviewed
                </div>
              </div>
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm w-40 border border-gray-200/50 dark:border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {filteredCards.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </div>
              </div>
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm w-40 border border-gray-200/50 dark:border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {Math.round(progress)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Progress
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-8 overflow-hidden">
              <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-2xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setCategoryFilter(category)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            categoryFilter === category
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                      Difficulty
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map((difficulty) => (
                        <button
                          key={difficulty}
                          onClick={() => setDifficultyFilter(difficulty)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            difficultyFilter === difficulty
                              ? "bg-green-600 text-white shadow-lg"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* End Filters Section */}

          {/* Elegant Progress Design */}
          <div className="mb-6">
            <div className="max-w-2xl mx-auto">
              {/* Minimalist Progress Header */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-xl">
                  <div className="text-4xl font-light text-gray-900 dark:text-white">
                    {Math.round(progress)}
                    <span className="text-2xl text-gray-500 dark:text-gray-400">
                      %
                    </span>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {reviewedCount}
                      <span className="text-gray-500 dark:text-gray-400">
                        /{filteredCards.length}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Mastered
                    </div>
                  </div>
                </div>
              </div>

              {/* Sophisticated Progress Bar */}
              <div className="relative">
                {/* Background track */}
                <div className="h-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                  {/* Progress fill with gradient */}
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full relative overflow-hidden"
                    // initial={{ width: 0 }}
                    // animate={{ width: `${progress}%` }}
                    // transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    {/* Shimmer effect */}
                    {/* Removed shimmer effect */}
                  </div>
                </div>

                {/* Progress milestones */}
                <div className="absolute -top-1 left-0 right-0 flex justify-between">
                  {[0, 25, 50, 75, 100].map((milestone) => (
                    <div
                      key={milestone}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                        progress >= milestone
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 border-white shadow-lg scale-110"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {progress >= milestone && (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Elegant completion message */}
              {progress === 100 && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full">
                    <div className="text-2xl">🎉</div>
                    <div className="text-lg font-medium text-green-600 dark:text-green-400">
                      All concepts mastered!
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flashcard section: Only show flashcards, not theory cheatsheets */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              {filteredCards.length > 0 && currentCard ? (
                <motion.div
                  key={currentCard.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <FlashcardComponent
                    flashcard={currentCard}
                    isFlipped={isFlipped}
                    onFlip={handleFlip}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="no-flashcard"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full max-w-2xl mx-auto h-80 flex items-center justify-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl"
                >
                  <div className="text-center p-8">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                      No Flashcard Available
                    </h3>
                    <p className="text-red-600 dark:text-red-400">
                      Filtered Cards: {filteredCards.length}, Current Index:{" "}
                      {currentIndex}
                    </p>
                    <p className="text-red-600 dark:text-red-400">
                      Please check your filters or flashcard data source.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6">
            <button
              onClick={handlePrevious}
              disabled={filteredCards.length <= 1}
              className="flex items-center gap-2 px-6 py-3 bg-white/70 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              Previous
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {currentCard && reviewedCards.has(currentCard.id) && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Trophy size={16} />
                  Reviewed
                </span>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={filteredCards.length <= 1}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ...existing code... */}
    </div>
  );
};

export default page;
