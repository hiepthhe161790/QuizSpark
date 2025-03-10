'use client';
import { useEffect, useState } from 'react';
function Dashboard() {
    return (
      <div className="bg-yellow-300 h-full  md:w-9/12 p-4 flex flex-col gap-3  ">
        <div className="border border-gray-300">
          <span className="font-bold text-2xl">Hi Ali</span>
        </div>
        {/* Projects */}
        <div className="border border-gray-300 flex flex-col gap-2 md:flex-row">
          <div className="text-buttons w-full md:w-1/2">Project 1</div>
          <div className="bg-red-500 w-full md:w-1/2">Project 2</div>
        </div>
      </div>
    );
  }
  export default Dashboard;
  