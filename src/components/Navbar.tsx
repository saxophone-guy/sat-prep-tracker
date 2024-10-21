import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, Settings, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function isActive(path: string) {
    return location.pathname === path;
  }

  const navItems = [
    { path: "/", label: "Home", icon: <Home className="w-4 h-4 mr-2" /> },
    {
      path: "/settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold flex items-center">
            <img src="/book.svg" className="w-7 h-7 mr-2 my-auto block" />
            actually good prep tracker
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm flex items-center ${
                  isActive(item.path)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 -m-2 text-muted-foreground hover:text-primary"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu panel */}
        <motion.div
          className="md:hidden overflow-hidden border-t"
          initial={{ maxHeight: 0, opacity: 0 }}
          animate={{
            maxHeight: isMenuOpen ? 800 : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block my-4 px-4 text-sm flex items-center ${
                isActive(item.path)
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </nav>
  );
}

export default Navbar;
