import { useNavigate,useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Logo from "../assets/logo-white.svg";
import { useContext } from "react";
import { QuizResultContext } from "../Context/index";
import ProgressBar from 'react-customizable-progressbar'


import progressbar from "../assets/icons/circular-progressbar.svg";
import { Flat, Heat, Nested } from "@alptugidin/react-circular-progress-bar";
const ResultPage = () => {
  const { quizResult } = useContext(QuizResultContext);
  const api = useAxios();
  const { quizId } = useParams();
  const location = useLocation();
  const resultData = location.state;
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
 console.log(quizId);
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(
          `http://localhost:5000/api/quizzes/${quizId}`
        );
        setQuizData(response.data.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [api, quizId]);

  if (!resultData) {
    return (
      <div className="text-center text-red-500">
        No result data found.{" "}
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 underline"
        >
          Go back to Home
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!quizData) {
    return (
      <div className="text-center text-red-500">
        Failed to load quiz data.{" "}
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 underline"
        >
          Go back to Home
        </button>
      </div>
    );
  }

  const { questions, title, description } = quizData;
  const { submittedAnswers, correctAnswers } = resultData;

  // Calculate Correct and Wrong Counts
  let correctCount = 0;
  let wrongCount = 0;
  let totalMarks = 0;

  submittedAnswers.forEach((submittedAnswer) => {
    const correctAnswer = correctAnswers.find(
      (answer) => answer.question_id === submittedAnswer.question_id
    );

    if (correctAnswer && submittedAnswer.answer === correctAnswer.answer) {
      correctCount += 1;
      totalMarks += correctAnswer.marks; // Add marks for correct answers
    } else {
      wrongCount += 1;
    }
  });
  const normalizedMarks = (totalMarks / (questions.length * 5)) * 100; // Assuming each question is worth 5 marks
  const renderOptions = (questionId, options, userAnswer, correctAnswer) => {
    return options.map((option, index) => {
      let className = "p-2 rounded-md";
      if (option === correctAnswer) {
        className += " bg-green-100 text-green-600"; // Correct answer
      } else if (option === userAnswer) {
        className += " bg-red-100 text-red-600"; // User's incorrect selection
      } else {
        className += " bg-gray-100 text-gray-800"; // Neutral
      }
      return (
        <li key={`${questionId}-${index}`} className={className}>
          {option}
        </li>
      );
    });
  };

  return (
    <body className="bg-background text-foreground min-h-screen">
      <div className="flex min-h-screen overflow-hidden">
        <img
          src={Logo}
          className="max-h-11 fixed left-6 top-6 z-50"
          alt="Logo"
        />
        {/* Left side */}
        <div className="max-h-screen overflow-hidden hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center p-12 relative">
          <div>
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-2">{title}</h2>
              <p>{description}</p>
              <div className="my-6 flex items-center">
                <div className="w-1/2">
                  <div className="flex gap-6 my-6">
                    <div>
                      <p className="font-semibold text-2xl my-0">
                        {questions.length}
                      </p>
                      <p className="text-gray-300">Questions</p>
                    </div>
                    <div>
                      <p className="font-semibold text-2xl my-0">
                        {correctCount}
                      </p>
                      <p className="text-gray-300">Correct</p>
                    </div>
                    <div>
                      <p className="font-semibold text-2xl my-0">
                        {wrongCount}
                      </p>
                      <p className="text-gray-300">Wrong</p>
                    </div>
                  </div>
                  <a
                   
                    className="bg-secondary py-3 rounded-md hover:bg-secondary/90 transition-colors text-lg font-medium underline text-white"
                    onClick={() => navigate("/leaderboard")}
                  >
                    View Leaderboard
                  </a>
                </div>
                <div className="w-1/2 bg-primary/80 rounded-md border border-white/20 flex items-center p-4">
                  <div className="flex-1">
                    <p className="text-2xl font-bold">
                      {totalMarks}/{questions.length * 5}
                    </p>
                    <p>Your Mark</p>
                  </div>
                  <div>
                    {/* <img
                      src={progressbar}
                      className="h-20"
                      alt="Progress Bar"
                    /> */}
                    {/* <ProgressBar progress={(totalMarks*100/questions.length * 5)} radius={50} children={20}/> */}
                    <ProgressBar
 
  radius={50}
  progress={(totalMarks*100/questions.length * 5)}
  strokeWidth={17}
  strokeColor="#5d9cec"
  strokeLinecap="square"
  trackStrokeWidth={18}
/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="max-h-screen w-full md:w-1/2 flex items-center justify-center h-full p-8">
          <div className="h-[calc(100vh-50px)] overflow-y-scroll">
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            {questions.map((question) => {
              const userAnswer = submittedAnswers.find(
                (answer) => answer.question_id === question.id
              )?.answer;
              const correctAnswer = correctAnswers.find(
                (answer) => answer.question_id === question.id
              )?.answer;
              return (
                <div
                  key={question.id}
                  className="rounded-lg overflow-hidden shadow-sm mb-4 bg-white p-6"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {question.question}
                  </h3>
                  <ul className="space-y-2">
                    {renderOptions(
                      question.id,
                      question.options,
                      userAnswer,
                      correctAnswer
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </body>
  );
};

export default ResultPage;
