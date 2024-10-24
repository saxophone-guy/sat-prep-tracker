import { topics } from "@/lib/utils";

export const useProgress = (formData: any[]) => {
  const calculateTopicProgress = (subject: string, topic: string) => {
    const total = 730;
    const completed = formData.reduce(
      (acc, entry) =>
        entry.subject === subject && entry.topic === topic
          ? acc + entry.questionsDone
          : acc,
      0
    );
    return (completed / total) * 100;
  };

  const calculateSubjectProgress = (subject: string) => {
    const totalTopics = topics[subject].length;
    const totalQuestions = totalTopics * 70;

    const completed = formData.reduce(
      (acc, entry) =>
        entry.subject === subject ? acc + entry.questionsDone : acc,
      0
    );
    return (completed / totalQuestions) * 100;
  };

  return { calculateTopicProgress, calculateSubjectProgress };
};

