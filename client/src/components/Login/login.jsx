import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";

const Login = ({ loginPopup, setLoginPopup }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      
      if (isRegistering) {
        response = await axios.post('http://localhost:4000/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }, { withCredentials: true });
      } else {
        response = await axios.post('http://localhost:4000/api/auth/login', {
          email: formData.email,
          password: formData.password
        }, { withCredentials: true });
      }

      if (response.data.success) {
        setMessage({ type: 'success', text: isRegistering ? 'Registration successful!' : 'Login successful!' });
        setTimeout(() => {
          setLoginPopup(false);
          window.location.reload();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setMessage(null);
  };

  return (
    <>
      {loginPopup && (
        <div className="popup">
          <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[300px]">
              {/* header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1>{isRegistering ? "Register" : "Login"}</h1>
                </div>
                <div>
                  <IoCloseOutline
                    className="text-2xl cursor-pointer"
                    onClick={() => setLoginPopup(false)}
                  />
                </div>
              </div>
              
              {/* form section */}
              <form onSubmit={handleSubmit} className="mt-4">
                {isRegistering && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                    required
                  />
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-2 py-1 mb-4"
                  required
                />
                
                {message && (
                  <div className={`text-center p-2 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                
                <div className="flex justify-center">
                  <button type="submit" className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full">
                    {isRegistering ? "Register" : "Login"}
                  </button>
                </div>
                
                <div className="mt-4 text-center text-sm">
                  <p>
                    {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span
                      className="text-primary cursor-pointer"
                      onClick={toggleMode}
                    >
                      {isRegistering ? "Login" : "Register"}
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;