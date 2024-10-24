import { z } from "zod";

export const FormSchema = z.object({
  questionsDone: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    return Number(val);
  }, z.number().min(0).optional()),
  selectedOption: z.enum(["questions", "coverage"]),
  subject: z.string(),
  topic: z.string(),
});
