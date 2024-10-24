export const subjects = ["Math", "English", "Reading", "Writing"];

export const topics = {
  Math: ["Algebra", "Geometry", "Statistics"],
  English: ["Grammar", "Vocabulary", "Comprehension"],
  Reading: ["Passage Analysis", "Literary Devices"],
  Writing: ["Essay Writing", "Grammar", "Punctuation"],
};

export const getStoredData = () => {
  const storedData = localStorage.getItem("satPrepData");
  return storedData ? JSON.parse(storedData) : [];
};

export const setStoredData = (data: any[]) => {
  localStorage.setItem("satPrepData", JSON.stringify(data));
};

