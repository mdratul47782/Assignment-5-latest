import { useState } from "react";
import { QuizContext } from "../Context/index";

const QuizProvider = ({ children }) => {
  const [quizId, setQuizId] = useState(null);

  return (
    <QuizContext.Provider value={{ quizId, setQuizId }}>
      {children}
    </QuizContext.Provider>
  );
};

export default QuizProvider;
