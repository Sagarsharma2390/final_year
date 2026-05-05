import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SectionSettings {
  marksPerQuestion: number;
  minimumMarks: number;
  questionsToAttend: number;
}

export interface SubjectSettings {
  subject: string;
  sectionA: SectionSettings;
  sectionB: SectionSettings;
  sectionC: SectionSettings;
  sectionD: SectionSettings;
}

export interface Teacher {
  firstName: string;
  lastName: string;
  teacherId: string;
  stream: string;
  phoneNumber: string;
  email: string;
  faceData?: string;
}

export interface StudentResult {
  id: string;
  studentName: string;
  subject: string;
  totalMarks: number;
  scoredMarks: number;
  sectionScores: {
    sectionA: number;
    sectionB: number;
    sectionC: number;
    sectionD: number;
  };
  evaluatedAt: string;
}

interface EvaluationContextType {
  teacher: Teacher | null;
  setTeacher: (teacher: Teacher | null) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  subjectSettings: SubjectSettings | null;
  setSubjectSettings: (settings: SubjectSettings) => void;
  results: StudentResult[];
  addResult: (result: StudentResult) => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const EvaluationProvider = ({ children }: { children: ReactNode }) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subjectSettings, setSubjectSettings] = useState<SubjectSettings | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);

  const login = (email: string, password: string): boolean => {
    if (teacher && teacher.email === email && password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addResult = (result: StudentResult) => {
    setResults((prev) => [...prev, result]);
  };

  return (
    <EvaluationContext.Provider
      value={{
        teacher,
        setTeacher,
        isAuthenticated,
        login,
        logout,
        subjectSettings,
        setSubjectSettings,
        results,
        addResult,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error("useEvaluation must be used within EvaluationProvider");
  }
  return context;
};
