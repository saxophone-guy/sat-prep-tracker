import { Link } from "react-router-dom";
import { usePageTransition } from "@/lib/usePageTransition";
import { motion } from "framer-motion";

export function NotFound() {
  const animation = usePageTransition("/");

  return (
    <motion.div
      {...animation}
      className="flex items-center justify-center min-h-[calc(100vh-4rem-1px)]"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-4">
          The page you're looking for doesn't exist.{" "}
          <Link to="/" className="text-blue-700 dark:text-blue-300">
            Go back?
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
