import React from 'react';
import Logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <div>
      {/* upper Navbar */}
      <div>
        <div>
          <div>
            <a href="#">
              <img src={Logo} alt="Logo" />
            </a>
          </div>

          {/* search bar and order button */}
          <div>
            <div className="group">
              <input 
                type="text"
                placeholder="search"
                className="w-[200px] sm:w-[200px] group-hover:w-[300px]"
              />
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600">
              Login
            </button>

        </div>
      </div>

      {/* lower Navbar */}
      <div></div>
    </div>
  );
};

export default Navbar;
