import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAxios from "../hooks/useAxios";
import { useAuth } from "../hooks/useAuth";
import avater from "../assets/avater.webp";
import { QuizResultContext } from "../Context/index";
import { useContext } from "react";
function QuizPage() {
  const { setQuizResult } = useContext(QuizResultContext);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { quizSetId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const api = useAxios();
  const params = useParams()
  function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(
          `http://localhost:5000/api/quizzes/${params?.quizId}`
        );
  
        const quiz = response?.data?.data || null;
  
        if (quiz) {
          // Shuffle options for each question
          quiz.questions = quiz.questions.map((question) => ({
            ...question,
            options: shuffleArray(question.options),
          }));
        }
  
        setQuizData(quiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuiz();
  }, [api, quizSetId, params?.quizId]);
  

  const handleOptionChange = (option) => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (!selectedAnswers[currentQuestion.id]) {
      alert("Please select an answer before proceeding.");
      return;
    }

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitQuiz(); // Submit quiz on the last question
    }
  };

  const handleSubmitQuiz = async () => {
    const requestBody = { answers: selectedAnswers };

    try {
      const response = await api.post(
        `http://localhost:5000/api/quizzes/${params?.quizId}/attempt`,
        requestBody
      );


      const submissionResult = response.data;
      const resultData = {
        quizTitle: quizData.title,
        totalQuestions: quizData.questions.length,
        totalMarks: submissionResult.data.quiz.total_marks,
        percentage: submissionResult.data.percentage,
        submittedAnswers: submissionResult.data.submitted_answers,
        correctAnswers: submissionResult.data.correct_answers,
      };
      console.log(resultData.submittedAnswers,resultData.correctAnswers)
      setQuizResult(quizData)
      navigate(`/result/${params?.quizId}`, { state: resultData });

    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit the quiz. You Already Sumitted This Quiz Set Before....");
    }
  };


  if (loading) {
    return <div className="text-center">Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!quizData) {
    return <div className="text-center">No quiz found</div>;
  }

  const { title, description, stats, questions } = quizData;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-[#F5F3FF] min-h-screen">
      <div className="container mx-auto py-3">
   
        

        {/* Main Content */}
        <main className="max-w-8xl mx-auto h-[calc(100vh-10rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-full">
            {/* Left Column */}
            <div className="lg:col-span-1 bg-white rounded-md p-6 h-full flex flex-col">
              <div>
                <h2 className="text-4xl font-bold mb-4">{title}</h2>
                <p className="text-gray-600 mb-4">{description}</p>

                <div className="flex flex-col">
                  <div className="w-fit bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Total number of questions: {stats?.total_questions || 0}
                  </div>

                  <div className="w-fit bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Participation: {stats?.total_attempts || 0}
                  </div>

                  <div className="w-fit bg-gray-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Highest Score: {stats?.highest_score || 0}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex items-center">
                <img
                  src={avater}
                  alt="Author Avatar"
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <span className="text-black font-semibold">
                  {auth?.user?.full_name || "Guest"}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 bg-white">
              <div className="bg-white p-6 !pb-2 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold">
                    {currentQuestionIndex + 1}. {currentQuestion.question}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center space-x-3 py-3 px-4 bg-primary/5 rounded-md text-lg ${
                        selectedAnswers[currentQuestion.id] === option
                          ? "bg-indigo-100 text-indigo-900"
                          : "text-gray-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`answer${currentQuestion.id}`}
                        value={option}
                        checked={selectedAnswers[currentQuestion.id] === option}
                        onChange={() => handleOptionChange(option)}
                        className="form-radio text-buzzr-purple"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-1/2 text-center ml-auto block bg-primary text-white space-x-3 py-3 px-4 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-6 font-semibold my-8"
              >
                {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-6 mb-3 opacity-40 text-center">
        Copyright &copy; 2024 Learn With Sumit | All Rights Reserved
      </footer>
    </div>
  );
}

export default QuizPage;
