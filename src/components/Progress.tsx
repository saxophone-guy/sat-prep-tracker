import { Progress } from "@/components/ui/progress";
import { subjects, topics } from "@/lib/storage";

type ProgressSectionProps = {
  formData: any[];
};

export function ProgressSection({ formData }) {
  const calculateTopicProgressSection = (subject: string, topic: string) => {
    const total = 730;
    const completed = formData.reduce(
      (acc, entry) => entry.subject === subject && entry.topic === topic ? acc + entry.questionsDone : acc,
      0
    );
    return (completed / total) * 100;
  };

  const calculateSubjectProgress = (subject: string) => {
    const totalTopics = topics[subject].length;
    const totalQuestions = totalTopics * 70;
    const completed = formData.reduce(
      (acc, entry) => (entry.subject === subject ? acc + entry.questionsDone : acc),
      0
    );
    return (completed / totalQuestions) * 100;
  };

  return (
    <>
      {subjects.map((subject) => (
        <div key={subject} className="my-4 max-w-[360px] mx-auto">
          <p className="font-semibold">{subject}:</p>
          <Progress value={calculateSubjectProgress(subject)} />
          {topics[subject].map((topic) => (
            <div key={topic} className="ml-4 my-2">
              <p className="text-sm font-medium">{topic}:</p>
              <Progress value={calculateTopicProgress(subject, topic)} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
