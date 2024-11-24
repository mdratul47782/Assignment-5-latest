// Provider তৈরি
import {useState} from "react";
import { QuizResultContext } from "../Context";
export const QuizResultProvider = ({ children }) => {
  const [quizResult, setQuizResult] = useState(null); // রেজাল্ট স্টেট

  return (
    <QuizResultContext.Provider value={{ quizResult, setQuizResult }}>
      {children}
    </QuizResultContext.Provider>
  );
};
