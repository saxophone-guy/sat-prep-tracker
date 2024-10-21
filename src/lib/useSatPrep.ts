// @/lib/useSatPrep.ts
import { useState, useEffect } from 'react';

type Activity = {
  date: string;
  subject: string;
  topic: string;
  type: 'questions' | 'coverage';
  questionsDone?: number;
};

// Simple hook that manages the state
export function useSatPrep() {
  const [activities, setActivities] = useState<Record<string, Activity[]>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('satPrepData');
    if (savedData) {
      setActivities(JSON.parse(savedData));
    }
  }, []);

  // Save to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem('satPrepData', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity: Activity) => {
  setActivities(prev => {
    const updatedActivities = {
      ...prev,
      [activity.date]: [...(prev[activity.date] || []), activity]
    };
    
    console.log("Updated activities:", updatedActivities); // Log to check the updated activities
    return updatedActivities;
  });
};


  const removeActivity = (date: string, index: number) => {
    setActivities(prev => {
      const newActivities = { ...prev };
      if (newActivities[date]) {
        newActivities[date] = newActivities[date].filter((_, i) => i !== index);
        if (newActivities[date].length === 0) {
          delete newActivities[date];
        }
      }
      return newActivities;
    });
  };

  const getDailyActivities = (date: string): Activity[] => {
    return activities[date] || [];
  };

  return {
    activities,
    addActivity,
    removeActivity,
    getDailyActivities,
  };
}
