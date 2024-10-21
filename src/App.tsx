import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Home, Settings, NotFound } from "@/pages";
import { ThemeToggle } from "@/components/ThemeToggle";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <ThemeToggle />
        <main className="overflow-hidden">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
