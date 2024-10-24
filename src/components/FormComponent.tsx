import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormSchema } from "@/lib/formSchema";
import { subjects, topics } from "@/lib/storage";

type FormComponentProps = {
  onSubmit: (data: any) => void;
};

export function FormComponent({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      questionsDone: 0,
      selectedOption: "questions",
      subject: "",
      topic: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="selectedOption"
          render={({ field }) => (
            <FormItem className="m-auto max-w-[300px] text-center">
              <FormLabel>Select Action</FormLabel>
              <RadioGroup defaultValue="questions" onValueChange={field.onChange}>
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

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="mx-auto max-w-[180px] text-center">
              <FormLabel>Select Subject</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem className="max-w-[180px] mx-auto text-center">
              <FormLabel>Select Topic</FormLabel>
              <Select onValueChange={field.onChange} disabled={!form.watch("subject")}>
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
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("selectedOption") === "questions" && (
          <FormField
            control={form.control}
            name="questionsDone"
            render={({ field }) => (
              <FormItem className="max-w-[180px] text-center mx-auto">
                <FormLabel>Number of Questions Done</FormLabel>
                <Input type="number" placeholder="Enter number" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="ml-[calc(50%-36px-8px)]">Submit</Button>
      </form>
    </Form>
  );
};
