'use client';
import { useEffect, useState } from 'react';
function Sidebar() {
    const [openMenu, setOpenMenu] = useState(false);
  
    useEffect(() => {
      const handleResize = () => {
        setOpenMenu(false);
      };
  
      window.addEventListener('resize', handleResize);
      handleResize(); // Call the function once initially to set initial state
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    return (
      <div className="bg-red-200 w-full flex flex-row px-5 justify-between md:flex-col md:px-0 md:w-3/12 ">
        {/* Logo */}
        <div className="bg-white p-3 border border-gray-300">Logo</div>
        {/* Menu */}
        <ul
          className={`bg-white ${
            openMenu
              ? 'flex flex-col absolute w-full h-1/2 top-14 left-0'
              : 'hidden'
          } p-3 md:flex md:flex-col gap-2 h-full border border-gray-300`}
        >
          <span>Home</span>
          <span>Blog</span>
          <span>Contact US</span>
        </ul>
        <button
          onClick={() => setOpenMenu((current) => !current)}
          className="md:hidden"
        >
          ...
        </button>
      </div>
    );
  }
export default Sidebar;  