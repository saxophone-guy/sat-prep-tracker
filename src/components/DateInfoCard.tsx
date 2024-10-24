type DateInfoCardProps = {
  date: Date;
  formData: any[];
};

export function DateInfoCard({ date, formData }) {
  const formattedDate = date.toLocaleDateString();
  const dateEntries = formData.filter(
    (entry) => entry.date === formattedDate
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-sm">
      <h2 className="text-lg font-semibold mb-2">Details for {formattedDate}</h2>
      {dateEntries.length > 0 ? (
        <ul>
          {dateEntries.map((entry, index) => (
            <li key={index} className="mb-2">
              <p>
                <strong>Subject:</strong> {entry.subject}
              </p>
              <p>
                <strong>Topic:</strong> {entry.topic}
              </p>
              <p>
                <strong>Questions Done:</strong> {entry.questionsDone}
              </p>
              <p>
                <strong>Action:</strong> {entry.selectedOption === "questions" ? "Recorded Questions" : "Covered Topic"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data recorded for this day.</p>
      )}
    </div>
  );
};
