import { useEffect } from "react";

// Dependencies
import { useLocation } from "react-router-dom";

// Scroller component
const ScrollerComponent = () => {
  // Hooks
  const { pathname } = useLocation();

  // Functions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Export
export default ScrollerComponent;
