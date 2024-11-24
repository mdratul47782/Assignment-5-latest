import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import SideBar from "./SideBar";

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await api.get("http://localhost:5000/api/admin/quizzes");
        console.log(response.data);
        setQuizzes(response?.data || []); // Adjust based on API response structure
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [api]);

  const handleUnpublishQuiz = async (quizId) => {
    try {
      const response = await api.patch(
        `http://localhost:5000/api/admin/quizzes/${quizId}`,
        { status: "draft" }
      );
      console.log("Unpublish Response:", response.data);

      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === quizId ? { ...quiz, status: "draft" } : quiz
        )
      );
    } catch (err) {
      console.error("Error unpublishing quiz:", err);
      alert("Failed to unpublish the quiz. Please try again.");
    }
  };

  const handlePublishQuiz = async (quizSetId) => {
    try {
      const response = await api.patch(
        `http://localhost:5000/api/admin/quizzes/${quizSetId}`,
        { status: "published" }
      );
      console.log("Publish Response:", response.data);

      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === quizSetId ? { ...quiz, status: "published" } : quiz
        )
      );
    } catch (err) {
      console.error("Error publishing quiz:", err);
      alert("Failed to publish the quiz. Please try again.");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return; // Exit if the user cancels
    }

    try {
      const response = await api.delete(
        `http://localhost:5000/api/admin/quizzes/${quizId}`
      );
      console.log("Delete Response:", response.data);

      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz.id !== quizId)
      );

      alert("Quiz deleted successfully!");
    } catch (err) {
      console.error("Error deleting quiz:", err);
      alert("Failed to delete the quiz. Please try again.");
    }
  };

  const handleCreateQuiz = () => {
    navigate("/Quiz_Set_Page"); // Route to the page for creating a new quiz
  };

  const navigateToQuizSetPage = (id, title, description) => {
    navigate(`/Quiz_Set_Page`, {
      state: { quizId: id, quizTitle: title, quizDescription: description },
    });
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-grow p-10">
        <header className="mb-8">
          <h2 className="text-2xl font-semibold">Hey There 👋!</h2>
          <h1 className="text-4xl font-bold">Welcome Back To Your Quiz Hub!</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Create New Quiz Card */}
          <div className="group cursor-pointer" onClick={handleCreateQuiz}>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-buzzr-purple mb-4 group-hover:scale-105 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:scale-105 transition-all">
                Create a new quiz
              </h3>
              <p className="text-gray-600 text-sm group-hover:scale-105 transition-all">
                Build from the ground up
              </p>
            </div>
          </div>

          {/* Render Quizzes */}
          {quizzes.map((quiz) => (
            <div
              onClick={() =>
                navigateToQuizSetPage(quiz.id, quiz.title, quiz.description)
              }
              key={quiz.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group cursor-pointer"
            >
              <div className="text-buzzr-purple mb-4 group-hover:scale-105 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M20 7.5v9l-4 2.25l-4 2.25l-4 -2.25l-4 -2.25v-9l4 -2.25l4 -2.25l4 2.25z" />
                  <path d="M12 12l4 -2.25l4 -2.25" />
                  <path d="M12 12l0 9" />
                  <path d="M12 12l-4 -2.25l-4 -2.25" />
                  <path d="M20 12l-4 2v4.75" />
                  <path d="M4 12l4 2l0 4.75" />
                  <path d="M8 5.25l4 2.25l4 -2.25" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:scale-105 transition-all">
                {quiz.title}
              </h3>
              <p className="text-gray-600 text-sm group-hover:scale-105 transition-all">
                {quiz.description}
              </p>
              <div className="mt-4 flex gap-2">
                {quiz.status === "draft" ? (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handlePublishQuiz(quiz.id);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleUnpublishQuiz(quiz.id);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Unpublish
                  </button>
                )}
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteQuiz(quiz.id);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
