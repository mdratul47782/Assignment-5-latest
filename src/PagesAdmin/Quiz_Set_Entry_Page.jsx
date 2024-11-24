import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { QuizContext } from "../Context";
import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
function Quiz_Set_Entry_Page() {
  const { quizId } = useContext(QuizContext); // Get quizId from context
  const api = useAxios();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionsList, setQuestionsList] = useState([]);
  const location = useLocation();
  const {quizId_Edit, title, description } = location.state || {};
  console.log(quizId_Edit)
  const { auth } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  if (!quizId || !title || !description) {
    console.error("Quiz data not provided");
    return <div>Quiz data is missing!</div>;
  }

  const handleEditQuestion = async (questionId, updatedQuestion) => {
    try {
      const response = await api.patch(
        `http://localhost:5000/api/admin/questions/${questionId}`,
        updatedQuestion
      );

      if (response?.data?.status === "success") {
        alert("Question updated successfully!");
        setQuestionsList((prev) =>
          prev.map((q) =>
            q.id === questionId ? { ...q, ...updatedQuestion } : q
          )
        );
      } else {
        alert("Failed to update question. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update question.";
      console.error("Error updating question:", errorMessage);
      alert(errorMessage);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    if (
      !question.trim() ||
      options.some((opt) => !opt.trim()) ||
      !correctAnswer.trim()
    ) {
      alert("Please fill in all fields and select the correct answer.");
      return;
    }

    try {
      const response = await api.post(
        `http://localhost:5000/api/admin/quizzes/${quizId}/questions`,
        {
          question,
          options,
          correctAnswer,
        }
      );

      if (response?.data?.data) {
        setQuestionsList((prev) => [...prev, response.data.data]);
        alert("Question added successfully!");
      } else {
        alert("Unexpected API response. Please check your backend.");
      }

      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add question.";
      console.error("Error adding question:", errorMessage);
      alert(errorMessage);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setIsDeleting(true);
      try {
        const response = await api.delete(
          `http://localhost:5000/api/admin/questions/${questionId}`
        );

        if (response?.data?.status === "success" && response.data.data > 0) {
          alert("Question deleted successfully!");
          setQuestionsList((prev) => prev.filter((q) => q.id !== questionId));
        } else {
          alert(
            "Failed to delete question. Please check if the question exists."
          );
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete question.";
        console.error("Error deleting question:", errorMessage);
        alert(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-[#F5F3FF] min-h-screen flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="#" className="text-gray-600 hover:text-buzzr-purple">
                Home
              </a>
              <svg
                className="fill-current w-3 h-3 mx-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
              </svg>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-buzzr-purple"
                aria-current="page"
              >
                Quizzes
              </a>
            </li>
          </ol>
        </nav>
        <div>
          <h2 className="text-3xl font-bold mb-4">Binary Tree Quiz</h2>
          <p className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-4">
            Total number of questions: {questionsList.length}
          </p>

          <div className="flex space-x-4">
            {/* Add Question Form */}
            <div className="w-1/2 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Create Quiz</h2>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full mt-2 p-2 border rounded-md"
                  placeholder="Enter question title"
                />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Add Options</p>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={option}
                      checked={correctAnswer === option}
                      onChange={() => setCorrectAnswer(option)}
                      className="text-primary focus:ring-primary w-4 h-4"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="w-full p-2 border rounded-md"
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary/90 mt-4"
              >
                Save Quiz
              </button>
            </div>

            {/* Render Questions */}
            <div className="w-1/2 overflow-y-auto h-[calc(100vh-50px)]">
              {questionsList.map((q, index) => (
                <div
                  key={q.id}
                  className="rounded-lg overflow-hidden shadow-sm mb-4"
                >
                  <div className="bg-white p-6 !pb-2">
                    <h3 className="text-lg font-semibold mb-4">
                      {index + 1}. {q.question}
                    </h3>
                    <div className="space-y-2">
                      {q.options.map((opt, idx) => (
                        <label
                          key={idx}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="radio"
                            className="form-radio"
                            defaultChecked={q.correctAnswer === opt}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4 bg-primary/10 px-6 py-2">
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditQuestion(q.id, q)}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Quiz_Set_Entry_Page;
