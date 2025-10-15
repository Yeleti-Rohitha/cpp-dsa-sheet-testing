"use client";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import {
  FaCode, FaRegListAlt, FaSortAlphaDown, FaLink, FaTree, FaProjectDiagram,
  FaBrain, FaChartLine, FaSitemap, FaHeart
} from "react-icons/fa";
import { MdSort, MdOutlineLeaderboard } from "react-icons/md";
import { GiPathDistance, GiStack, GiCycle } from "react-icons/gi";
import { BsDiagram3, BsGrid3X3GapFill } from "react-icons/bs";
import { PiMathOperationsFill } from "react-icons/pi";
import { HiOutlineQueueList } from "react-icons/hi2";
import { RiGitBranchLine } from "react-icons/ri";
import { FiPackage } from "react-icons/fi";
import { CgFileDocument } from "react-icons/cg";
import { motion } from "framer-motion";

type NoteTopic = {
  title: string;
  link: string;
  status?: "available" | "coming-soon";
  icon: React.ReactNode;
};

const supremeNotesList: NoteTopic[] = [
  { title: "Basics of Programming", link: "https://topmate.io/saumyayadav/1604053", icon: <FaCode /> },
  { title: "Patterns", link: "https://topmate.io/saumyayadav/1604073", icon: <BsGrid3X3GapFill /> },
  { title: "Arrays, Time and Space Complexity", link: "https://topmate.io/saumyayadav/1604081", icon: <FaRegListAlt /> },
  { title: "Searching and Sorting", link: "https://topmate.io/saumyayadav/1604085", icon: <MdSort /> },
  { title: "Cpp STL", link: "https://topmate.io/saumyayadav/1604098", icon: <FiPackage /> },
  { title: "Char Arrays and Strings", link: "https://topmate.io/saumyayadav/1605701", icon: <FaSortAlphaDown /> },
  { title: "Basic Maths and Pointers", link: "https://topmate.io/saumyayadav/1605727", icon: <PiMathOperationsFill /> },
  { title: "Recursion", link: "https://topmate.io/saumyayadav/1605740", icon: <GiCycle /> },
  { title: "Backtracking and DnC", link: "https://topmate.io/saumyayadav/1605744", icon: <GiPathDistance /> },
  { title: "OOPS concepts", link: "https://topmate.io/saumyayadav/1605766", icon: <BsDiagram3 /> },
  { title: "Linked List", link: "https://topmate.io/saumyayadav/1606894", icon: <FaLink /> },
  { title: "Stacks", link: "https://topmate.io/saumyayadav/1606913", icon: <GiStack /> },
  { title: "Queues", link: "https://topmate.io/saumyayadav/1606923", icon: <HiOutlineQueueList /> },
  { title: "Generic and Binary Trees", link: "https://topmate.io/saumyayadav/1606934", icon: <FaTree /> },
  { title: "Binary Search Trees", link: "https://topmate.io/saumyayadav/1606945", icon: <RiGitBranchLine /> },
  { title: "Heaps", link: "https://topmate.io/saumyayadav/1606958", icon: <MdOutlineLeaderboard /> },
  { title: "Maps and Tries", link: "https://topmate.io/saumyayadav/1606881", icon: <FaSitemap /> },
  { title: "DP", link: "https://topmate.io/saumyayadav/1606967", icon: <FaBrain /> },
  { title: "Graphs", link: "https://topmate.io/saumyayadav/1600383", icon: <FaProjectDiagram /> },
  { title: "Greedy / Sliding Window / Bit Manipulation", link: "https://topmate.io/saumyayadav/1606846", icon: <FaChartLine /> },
  { title: "COMPLETE NOTES", link: "https://topmate.io/saumyayadav/1606989", icon: <CgFileDocument /> },
];

const patternWiseNotesList: NoteTopic[] = [
  { title: "Sample Pattern Notes", link: "https://topmate.io/saumyayadav/1741509", icon: <CgFileDocument/> },
  { title: "Two Pointers & Sliding Window", link: "#", status: "coming-soon", icon: <BsGrid3X3GapFill /> },
  { title: "Sorting/Greedy & Binary Search", link: "#", status: "coming-soon", icon: <GiPathDistance /> },
  { title: "Linked List & Stack/Queue", link: "#", status: "coming-soon", icon: <FaRegListAlt /> },
  { title: "Trees/BST & Graphs", link: "#", status: "coming-soon", icon: <FaTree /> },
  { title: "Heaps & DP & Backtracking", link: "#", status: "coming-soon", icon: <FaBrain /> },
  { title: "COMPLETE PATTERN NOTES", link: "#", status: "coming-soon", icon: <FiPackage /> },
];

export default function NotesPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favourites, setFavourites] = useState<string[]>([]);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [filter, setFilter] = useState<"Supreme" | "Pattern">("Supreme");
  const streak = 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedFaves = JSON.parse(localStorage.getItem("favourites") || "[]");
    setFavourites(savedFaves);
  }, []);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (title: string) => {
    setFavourites((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const currentNotesList = filter === "Supreme" ? supremeNotesList : patternWiseNotesList;

  const filteredNotes = currentNotesList.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = showFavouritesOnly ? favourites.includes(note.title) : true;
    return matchesSearch && matchesFav;
  });

  return (
    <>
      <Navbar />
      <div className="w-full">  {/* remove mx-auto or text-center */}
  <nav className="flex justify-start px-16 pt-22 mb-2" aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
      <li className="inline-flex items-center">
        <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
          <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
          </svg>
        Home
      </a>
    </li>
    <li>
      <div className="flex items-center">
        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
        </svg>
        <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Learning Tools</a>
      </div>
    </li>
    <li aria-current="page">
      <div className="flex items-center">
        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
        </svg>
        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Notes</span>
      </div>
    </li>
  </ol>
</nav>
</div>

      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white dark:bg-[#0d0f16] text-gray-900 dark:text-white px-6 md:px-20 py-2"
      >
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              Comprehensive DSA Notes
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Handwritten notes from the{" "}
              <span className="font-semibold text-blue-400 dark:text-blue-400">
                Supreme 3.0 DSA course
              </span>{" "}
              to help you revise concepts quickly and effectively.
            </motion.p>
            
            {/* Enhanced Form Link */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-600/30 rounded-xl max-w-md mx-auto"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                📌 <span className="font-semibold">Help us improve!</span>
              </p>
              <a
                href="https://forms.gle/57g5XWCqjXAng8mK9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline decoration-2 underline-offset-2"
              >
                Fill out this quick feedback form
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  🙌
                </motion.span>
              </a>
            </motion.div>

            {/* Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-2 mb-8 mt-8"
            >
              <button
                onClick={() => setFilter("Supreme")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filter === "Supreme"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Supreme 3.0
              </button>
              <button
                onClick={() => setFilter("Pattern")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filter === "Pattern"
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Pattern-wise
              </button>
            </motion.div>

            {/* Search + Favourites Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-96 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
              <button
                onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
                className={`px-4 py-2 rounded-lg font-medium transition-all 0.5 ease-in-out hover:scale-110 ${
                  showFavouritesOnly
                    ? "bg-pink-600 text-white hover:bg-pink-500 shadow-lg shadow-pink-500/25"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                {showFavouritesOnly ? "Show All" : "Show Favourites"}
              </button>
            </div>
          </div>

          {/* Notes Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredNotes.length > 0 ? (
              filteredNotes.map(({ title, link, status, icon }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="relative group cursor-pointer"
                >
                  {/* Heart Button */}
                  <button
                    onClick={() => toggleFavourite(title)}
                    className={`absolute top-4 right-4 text-xl z-20 ${
                      favourites.includes(title) ? "text-pink-500" : "text-gray-400"
                    } hover:scale-110 transition-transform`}
                  >
                    <FaHeart />
                  </button>

                  {/* Animated border gradient */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20"></div>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-pulse bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40"></div>

                  {/* Main card */}
                  <div className="relative bg-white dark:bg-[#181b27] h-52 border border-gray-300 dark:border-gray-800/50 group-hover:border-gray-400 dark:group-hover:border-gray-700 rounded-2xl p-7 shadow-md dark:shadow-xl dark:shadow-blue-500/10 group-hover:shadow-lg dark:group-hover:shadow-blue-500/20 transition-all duration-500 overflow-hidden">
                    {/* Background glow effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-10 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Icon container with enhanced styling */}
                    <div className="flex items-start gap-5 mb-6">
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative p-4 bg-gradient-to-br from-blue-600/10 to-blue-500/5 rounded-xl text-blue-600 dark:text-blue-400 group-hover:from-blue-600/20 group-hover:to-blue-500/10 group-hover:text-blue-400 transition-all duration-300 border border-blue-600/10 dark:border-blue-600/20 group-hover:border-blue-400/20"
                      >
                        {/* Icon glow effect */}
                        <div className="absolute inset-0 bg-blue-500/10 rounded-xl group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                        <div className="relative z-10">{icon}</div>
                      </motion.div>

                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                          {title}
                        </h2>
                      </div>
                    </div>

                    {/* Status or Link */}
                    <div className="mt-auto">
                      {status === "coming-soon" ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-500 rounded-xl text-sm font-medium border border-yellow-600/30">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          Coming Soon
                        </div>
                      ) : (
                        <motion.a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-white text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                        >
                          <span>View Notes</span>
                          <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </motion.svg>
                        </motion.a>
                      )}
                    </div>

                    {/* Subtle corner decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                No notes found.
              </p>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-500 dark:text-gray-400 mt-12 text-sm transition-colors duration-300"
          >
            *These notes are completely optional resources to supplement your learning. Happy coding! 💙
          </motion.p>
        </div>
      </motion.main>
    </>
  );
}