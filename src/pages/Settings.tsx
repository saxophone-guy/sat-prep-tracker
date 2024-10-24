import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useState, useEffect } from "react";
import { usePageTransition } from "@/lib/usePageTransition";
import { Settings as SettingsIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/hooks/use-toast";

const subjects = ["Math", "English", "Reading", "Writing"];

const topics = {
  Math: ["Algebra", "Geometry", "Statistics"],
  English: ["Grammar", "Vocabulary", "Comprehension"],
  Reading: ["Passage Analysis", "Literary Devices"],
  Writing: ["Essay Writing", "Grammar", "Punctuation"],
};

// Validation schema for settings form
const FormSchema = z.object({
  questionsPerSubject: z.object(
    Object.fromEntries(subjects.map(subject => [subject, z.number().min(0)]))
  ),
  topics: z.object(
    Object.fromEntries(subjects.map(subject => [subject, z.array(z.string())]))
  ),
});

function SettingsContent() {
  const animation = usePageTransition("/");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questionsPerSubject: subjects.reduce((acc, subject) => {
        acc[subject] = 70; // default questions per subject
        return acc;
      }, {} as Record<string, number>),
      topics: subjects.reduce((acc, subject) => {
        acc[subject] = topics[subject]; // default topics
        return acc;
      }, {} as Record<string, string[]>),
    },
  });

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    // Here you can handle saving settings, e.g., to local storage
    toast({
      title: "Settings Updated",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-stone-900 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  if (!isLoaded) {
    return <SettingsLoading />; // Show loading skeleton while not loaded
  }

  return (
    <motion.div {...animation} className="p-8 2xl:max-w-screen-xl xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm sm:max-w-screen-xs max-w-full mx-auto text-center">
      <div className="flex items-center gap-2 mb-2 mx-auto w-[calc(12rem)] text-center">
        <SettingsIcon className="w-8 h-8" />
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>
      <p className="text-gray-600 my-2">Manage your application settings here.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {subjects.map((subject) => (
            <FormField
              key={subject}
              control={form.control}
              name={`questionsPerSubject.${subject}`}
              render={({ field }) => (
                <FormItem className="max-w-[300px] mx-auto text-center">
                  <FormLabel>{subject} Questions</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">
            Save Settings
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

function SettingsLoading() {
  return (
    <div className="p-8 mx-auto">
      <Skeleton className="h-12 w-48 mb-2" />
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

