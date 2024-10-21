import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useState, useEffect } from "react";
import { usePageTransition } from "@/lib/usePageTransition";
import { Settings as SettingsIcon } from "lucide-react";

function SettingsContent() {
  const animation = usePageTransition("/");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, Math.random() * 750); // Fake delay

    return () => clearTimeout(timer); // Clear timeout on unmount
  }, []);

  if (!isLoaded) {
    return <SettingsLoading />; // Show loading skeleton while not loaded
  }

  return (
    <motion.div {...animation} className="p-8">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="w-8 h-8" />
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>
      <p className="text-gray-600">Manage your application settings here.</p>
    </motion.div>
  );
}

function SettingsLoading() {
  return (
    <div className="p-8">
      <Skeleton className="h-12 w-48 mb-4" />
      <Skeleton className="h-6 w-80" />
    </div>
  );
}

export function Settings() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  );
}
