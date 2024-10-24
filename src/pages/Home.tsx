// app/page.tsx
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

const subjects = ["Math", "English", "Reading", "Writing"];

const topics = {
  Math: ["Algebra", "Geometry", "Statistics"],
  English: ["Grammar", "Vocabulary", "Comprehension"],
  Reading: ["Passage Analysis", "Literary Devices"],
  Writing: ["Essay Writing", "Grammar", "Punctuation"],
};

// Validation schema
const FormSchema = z.object({
  questionsDone: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    return Number(val);
  }, z.number().min(0).optional()),
  selectedOption: z.enum(["questions", "coverage"]),
  subject: z.string(),
  topic: z.string(),
});

// Type for form data entries
type FormEntry = {
  date: string;
  questionsDone: number;
  selectedOption: "questions" | "coverage";
  subject: string;
  topic: string;
};

// Type for settings
type Settings = {
  questionsPerSubject: Record<string, number>;
  topics: Record<string, any>;
};

export function Home() {
  // Form initialization with useForm hook
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questionsDone: 0,
      selectedOption: "questions",
      subject: "",
      topic: "",
    },
  });

  // State management
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [formData, setFormData] = React.useState<FormEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem("satPrepData");
      return storedData ? JSON.parse(storedData) : [];
    }
    return [];
  });

  const [settings, setSettings] = React.useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const storedSettings = localStorage.getItem("satPrepSettings");
      return storedSettings ? JSON.parse(storedSettings) : { questionsPerSubject: {}, topics: {} };
    }
    return { questionsPerSubject: {}, topics: {} };
  });

  // Form submission handler
  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    const newEntry = {
      date: date?.toLocaleDateString() || new Date().toLocaleDateString(),
      questionsDone: data.questionsDone || 0,
      selectedOption: data.selectedOption,
      subject: data.subject,
      topic: data.topic,
    };

    setFormData((prevFormData) => {
      const updatedData = [...prevFormData, newEntry];
      localStorage.setItem("satPrepData", JSON.stringify(updatedData));
      return updatedData;
    });

    toast({
      title: "Entry Saved Successfully",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-stone-950 p-4">
          <code className="text-white">{JSON.stringify(newEntry, null, 2)}</code>
        </pre>
      ),
    });

    // Reset form after submission
    form.reset({
      questionsDone: 0,
      selectedOption: "questions",
      subject: "",
      topic: "",
    });
  };

  // Progress calculation functions
  const calculateTopicProgress = (subject: string, topic: string) => {
    const total = settings.questionsPerSubject[subject] || 730;
    const completed = formData.reduce(
      (acc, entry) =>
        entry.subject === subject && entry.topic === topic
          ? acc + entry.questionsDone
          : acc,
      0
    );
    return Math.min((completed / total) * 100, 100);
  };

  const calculateSubjectProgress = (subject: string) => {
    const totalTopics = topics[subject].length;
    const totalQuestions = (settings.questionsPerSubject[subject] || 70) * totalTopics;

    const completed = formData.reduce(
      (acc, entry) =>
        entry.subject === subject ? acc + entry.questionsDone : acc,
      0
    );
    return Math.min((completed / totalQuestions) * 100, 100);
  };

  // Progress visualization component
  const ProgressSection = () => (
    <div className="mt-4 space-y-6">
      {subjects.map((subject) => (
        <Card key={subject} className="p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{subject}</h3>
              <span className="text-sm text-gray-500">
                {Math.round(calculateSubjectProgress(subject))}%
              </span>
            </div>
            <Progress value={calculateSubjectProgress(subject)} className="h-2" />
          </div>
          
          <div className="space-y-3 pl-4">
            {topics[subject].map((topic) => (
              <div key={topic}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{topic}</span>
                  <span className="text-xs text-gray-500">
                    {Math.round(calculateTopicProgress(subject, topic))}%
                  </span>
                </div>
                <Progress 
                  value={calculateTopicProgress(subject, topic)} 
                  className="h-1.5"
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-full xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm sm:max-w-screen-xs flex justify-center p-8 mx-auto">
      {/* Form Section */}
      <div className="w-1/2 pr-4">
        <h1 className="text-4xl font-bold mb-4 text-center">SAT Prep Tracker</h1>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow-md mb-8 max-w-64 mx-auto"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Action Selection */}
            <FormField
              control={form.control}
              name="selectedOption"
              render={({ field }) => (
                <FormItem className="m-auto max-w-[300px] text-center">
                  <FormLabel>Select Action</FormLabel>
                  <RadioGroup
                    defaultValue="questions"
                    onValueChange={field.onChange}
                  >
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="questions" id="questions" />
                        <Label htmlFor="questions">Record Questions</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="coverage" id="coverage" />
                        <Label htmlFor="coverage">Cover Topic</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </FormItem>
              )}
            />

            {/* Subject Selection */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="mx-auto max-w-[180px] text-center">
                  <FormLabel>Select Subject</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Subjects</SelectLabel>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Topic Selection */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="max-w-[180px] mx-auto text-center">
                  <FormLabel>Select Topic</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      disabled={!form.watch("subject")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {form.watch("subject") &&
                            topics[form.watch("subject")].map((topic) => (
                              <SelectItem key={topic} value={topic}>
                                {topic}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Questions Done Input */}
            {form.watch("selectedOption") === "questions" && (
              <FormField
                control={form.control}
                name="questionsDone"
                render={({ field }) => (
                  <FormItem className="max-w-[180px] text-center mx-auto">
                    <FormLabel>Number of Questions Done</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="mx-auto block">
              Submit
            </Button>
          </form>
        </Form>
      </div>

      {/* Progress Tracking Section */}
      <div className="w-1/2 ml-4">
        <h2 className="text-4xl font-bold text-center mb-4">Progress Tracker</h2>
        
        {/* Date Information Card */}
        <Card className="p-4 rounded-md shadow-md text-center mb-4">
          <p className="font-semibold">Selected Date:</p>
          <p>{date?.toLocaleDateString()}</p>

          {formData.length > 0 && (
            <>
              <p className="font-semibold mt-2">Previous Entries:</p>
              <ul className="list-disc ml-5">
                {formData
                  .filter((entry) => entry.date === date?.toLocaleDateString())
                  .map((entry, index) => (
                    <li key={index} className="text-left">
                      {entry.selectedOption === "questions"
                        ? `${entry.questionsDone} questions in ${entry.subject} - ${entry.topic}`
                        : `Covered ${entry.topic} in ${entry.subject}`}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </Card>

        {/* Progress Bars Section */}
        <ProgressSection />
      </div>
    </div>
  );
}
