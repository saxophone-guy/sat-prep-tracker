// @/lib/SatPrepContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";

// Types
type Activity = {
  date: string;
  subject: string;
  topic: string;
  type: "questions" | "coverage";
  questionsDone?: number;
};

type DailyData = {
  [date: string]: Activity[];
};

type State = {
  activities: DailyData;
};

type Action =
  | { type: "ADD_ACTIVITY"; payload: Activity }
  | { type: "REMOVE_ACTIVITY"; payload: { date: string; index: number } }
  | { type: "LOAD_DATA"; payload: DailyData }
  | { type: "CLEAR_ALL" };

interface SatPrepContextType {
  state: State;
  addActivity: (activity: Activity) => void;
  removeActivity: (date: string, index: number) => void;
  getDailyActivities: (date: string) => Activity[];
  clearAllActivities: () => void;
}

// Initial state
const initialState: State = {
  activities: {},
};

// Reducer
function satPrepReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ACTIVITY":
      return {
        ...state,
        activities: {
          ...state.activities,
          [action.payload.date]: [
            ...(state.activities[action.payload.date] || []),
            action.payload,
          ],
        },
      };

    case "REMOVE_ACTIVITY": {
      const { date, index } = action.payload;
      const newActivities = { ...state.activities };
      if (newActivities[date]) {
        newActivities[date] = newActivities[date].filter((_, i) => i !== index);
        if (newActivities[date].length === 0) {
          delete newActivities[date];
        }
      }
      return {
        ...state,
        activities: newActivities,
      };
    }

    case "LOAD_DATA":
      return {
        ...state,
        activities: action.payload,
      };

    case "CLEAR_ALL":
      return {
        ...state,
        activities: {},
      };

    default:
      return state;
  }
}

// Context
const SatPrepContext = createContext<SatPrepContextType | undefined>(undefined);

// Provider component
export function SatPrepProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(satPrepReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("satPrepData");
    if (savedData) {
      dispatch({ type: "LOAD_DATA", payload: JSON.parse(savedData) });
    }
  }, []);

  // Save to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem("satPrepData", JSON.stringify(state.activities));
  }, [state.activities]);

  const addActivity = (activity: Activity) => {
    dispatch({ type: "ADD_ACTIVITY", payload: activity });
  };

  const removeActivity = (date: string, index: number) => {
    dispatch({ type: "REMOVE_ACTIVITY", payload: { date, index } });
  };

  const getDailyActivities = (date: string): Activity[] => {
    return state.activities[date] || [];
  };

  const clearAllActivities = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  return (
    <SatPrepContext.Provider
      value={{
        state,
        addActivity,
        removeActivity,
        getDailyActivities,
        clearAllActivities,
      }}
    >
      {children}
    </SatPrepContext.Provider>
  );
}

// Custom hook
export function useSatPrep() {
  const context = useContext(SatPrepContext);
  if (context === undefined) {
    throw new Error("useSatPrep must be used within a SatPrepProvider");
  }
  return context;
}
