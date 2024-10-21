import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SunMedium, MoonStar } from "lucide-react";

export function ThemeToggle() {
  // Initialize state based on localStorage or user's system preference
  const getInitialTheme = () => {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else {
      return "light";
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div>
      <motion.div
        className="fixed bottom-4 left-4 hidden items-center lg:flex"
        initial={{ x: -120 }} // Initially off-screen to the right
        whileHover={{ x: -90 }} // Slide in when hovered
        transition={{ type: "spring", ease: "easeInOut", duration: 0.3 }}
      >
        <motion.div
          className="bg-stone-200 dark:bg-stone-900 py-2 pl-20 pr-2 shadow-2xl cursor-pointer flex items-center float-left"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <div>
              <span className="text-sm text-black dark:text-white">
                <SunMedium />
              </span>
            </div>
          ) : (
            <div>
              <span className="text-sm text-black dark:text-white">
                <MoonStar />
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
