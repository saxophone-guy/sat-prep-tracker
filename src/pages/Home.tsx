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

export function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questionsDone: 0,
      selectedOption: "questions",
      subject: "",
      topic: "",
    },
  });

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [formData, setFormData] = React.useState<any[]>(() => {
    const storedData = localStorage.getItem("satPrepData");
    return storedData ? JSON.parse(storedData) : [];
  });

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    const newEntry = {
      date: date?.toLocaleDateString(),
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
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(newEntry, null, 2)}
          </code>
        </pre>
      ),
    });
  };

  const calculateProgress = (subject: string) => {
    const totalQuestions = {
      English: 70,
      Math: 70,
      Reading: 70,
      Writing: 70,
    };

    const total = totalQuestions[subject];
    const completed = formData.reduce(
      (acc, entry) =>
        entry.subject === subject ? acc + entry.questionsDone : acc,
      0,
    );

    return (completed / total) * 100;
  };

  return (
    <div className="max-w-full xl:max-w-screen-lg lg:max-w-screen-md md:max-w-screen-sm sm:max-w-screen-xs flex justify-center p-8 mx-auto">
      <div>
        <h1 className="text-4xl font-bold mb-4 text-center">
          SAT Prep Tracker
        </h1>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow mb-8 max-w-64 mx-auto"
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
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

            {/* Subject Dropdown */}
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

            {/* Topic Dropdown */}
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
                  <FormItem className="max-w-[180px] text-center mx-auto text-center">
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
            <Button type="submit" className="ml-[calc(50%-36px-8px)]">
              Submit
            </Button>
          </form>
        </Form>
      </div>

      {/* Display Date Information */}
      {date && (
        <div className="w-1/3 ml-4">
          <h2 className="text-4xl font-bold text-center">Date Info</h2>
          <div className="p-4 rounded-md shadow text-center">
            <p className="font-semibold">Selected Date:</p>
            <p>{date.toLocaleDateString()}</p>

            {formData.length > 0 && (
              <>
                <p className="font-semibold mt-2">Previous Entries:</p>
                <ul className="list-disc ml-5">
                  {formData
                    .filter((entry) => entry.date === date.toLocaleDateString())
                    .map((entry, index) => (
                      <li key={index}>
                        {entry.selectedOption === "questions"
                          ? `${entry.questionsDone} questions in ${entry.subject} - ${entry.topic}`
                          : `Covered ${entry.topic} in ${entry.subject}`}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
          {/* Display Progress Overview */}
          {subjects.map((subject) => (
            <div key={subject} className="my-4 max-w-[360px] mx-auto">
              <p className="font-semibold">{subject}:</p>
              {/* Use the Progress component here */}
              <Progress value={calculateProgress(subject)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
