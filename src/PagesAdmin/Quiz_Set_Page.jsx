import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import useAxios from "../hooks/useAxios";
import { QuizContext } from "../Context/index";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SideBar from "./SideBar";


function Quiz_Set_Page() {
  const { auth } = useAuth();
  const location = useLocation();
  const { quizId: initialQuizId, quizTitle: initialQuizTitle, quizDescription: initialQuizDescription } = location.state || {};
  const { setQuizId } = useContext(QuizContext);
  const [title, setTitle] = useState(initialQuizTitle || "");
  const [description, setDescription] = useState(initialQuizDescription || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const api = useAxios();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post("http://localhost:5000/api/admin/quizzes", {
        title,
        description,
      });
      setQuizId(response?.data?.data.id);

      if (response.status === 201) {
        // Navigate to the Quiz_Set_Entry_Page upon success
        navigate("/Quiz_Set_Entry_Page", {
          state: { quizId_Edit: response.data.data.id, title, description },
        });
      }
    } catch (err) {
      console.error("Error creating quiz:", err);
      setError(err.response?.data?.message || "Failed to create quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F3FF] min-h-screen flex">
   <SideBar/>

      <main className="md:flex-grow px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Give your quiz title and description</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  id="quiz-title"
                  name="quiz-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-buzzr-purple focus:border-buzzr-purple"
                  placeholder="Quiz"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="quiz-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="quiz-description"
                  name="quiz-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-buzzr-purple focus:border-buzzr-purple"
                  placeholder="Description"
                ></textarea>
              </div>

              {error && <div className="text-red-500 text-center mb-4">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? "Creating..." : "Next"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Quiz_Set_Page;
