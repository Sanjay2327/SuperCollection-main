import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import AOS from "aos";
import "aos/dist/aos.css";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import Login from "./components/Login/login.jsx"; // Import the new Login component
import axios from "axios";

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);
  const [loginPopup, setLoginPopup] = React.useState(false); // New state for login popup

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  const handleLoginPopup = () => {
    setLoginPopup(!loginPopup);
  };

  // Configure axios defaults for CORS
  axios.defaults.withCredentials = true;
  
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar handleOrderPopup={handleOrderPopup} handleLoginPopup={handleLoginPopup} />
      <Hero handleOrderPopup={handleOrderPopup} />
      <Products />
      <TopProducts handleOrderPopup={handleOrderPopup} />
      <Banner />
      <Subscribe />
      <Products />
      <Testimonials />
      <Footer />
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      <Login loginPopup={loginPopup} setLoginPopup={setLoginPopup} /> {/* New Login component */}
    </div>
  );
};

export default App;