'use client'
import { useEffect, useState } from 'react';
function LightDark() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleModeChange = (event) => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="flex flex-col md:flex-row w-full bg-white border border-gray-200 h-svh">
            {/* sidebar */}
            {/* <Sidebar /> */}
            {/* Dashboard */}
            {/* <Dashboard /> */}
            {/* Navbar */}
            <Navbar />
            {/* Quizzes Area */}
            <QuizzesArea />
            {/* Toaster */}
            <Toaster />
            <div>
        <button
          className="px-3 bg-gray-300"
          onClick={() => setIsDarkMode(false)}
        >
          Light
        </button>
        <button
          className="px-3 bg-gray-300"
          onClick={() => setIsDarkMode(true)}
        >
          Dark
        </button>
      </div>
      {/* Box */}
      <div
        className={`bg-white border border-gray-300 shadow-md w-44 h-44 
      ${isDarkMode ? 'dark-theme' : 'light-theme'}`}
      >
        <span>This is a text</span>
        <button className=" text-white p-4">Click me</button>
        <div className="p-4 categories flex gap-2">
          <div className="bg-mainColor p-4 text-white">Icon</div>
          <span>Category 1</span>
        </div>
      </div>
        </div>
    );
}