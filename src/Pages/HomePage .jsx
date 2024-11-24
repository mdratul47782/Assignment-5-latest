import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useEffect, useState,useContext } from "react";
import useAxios from "../hooks/useAxios";
import avater from "../assets/avater.webp";
import bg from "../assets/bg.jpg"
import {QuizContext} from "../Context/index"
function HomePage() {
  const { quizId, setQuizId } = useContext(QuizContext); 
  const [status, setStatus] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useAxios();
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await api.get("http://localhost:5000/api/quizzes");

        setQuizzes(response?.data?.data || []);
        setStatus(response?.data?.status);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [api]);

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  console.log(quizzes);

  return (
    <>
      <body className="bg-[#F5F3FF] min-h-screen">
        <div className="container mx-auto py-3">
          {/* User Profile Section */}
          <div className="text-center mb-12">
            <img
              src={avater} // Provide fallback image path
              alt="Profile Picture"
              className="w-32 h-32 rounded-full border-4 border-primary mx-auto mb-4 object-cover"
            />
            <p className="text-xl text-gray-600">Welcome</p>
            <h2
              className="text-4xl font-bold text-gray-700"
              style={{ fontFamily: "Jaro" }}
            >
              {auth?.user?.full_name || "Guest"}
            </h2>
          </div>

          <main className="bg-white p-6 rounded-md h-full">
            <section>
              <h3 className="text-2xl font-bold mb-6">
                Participate In Quizzes
              </h3>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quizzes.map((quiz) => (
                  <a
                    key={quiz.id}
                    onClick={() => {
                      setQuizId(quiz.id); // Set the quizId
                      navigate(`/${quiz.id}`); // Navigate to the quiz page
                    }} // Adjust the URL for quiz navigation
                    className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow max-h-[450px] relative group cursor-pointer"
                  >
                    <div className="group-hover:scale-105 absolute transition-all text-white text-center top-1/2 -translate-y-1/2 px-4">
                      <h1 className="text-5xl" style={{ fontFamily: "Jaro" }}>
                        {quiz.title}
                      </h1>
                      <p className="mt-2 text-lg">{quiz.description}</p>
                    </div>
                    {quiz.is_attempted && (
                      <div className="hidden absolute transition-all bg-black/80 w-full h-full left-0 top-0 text-white group-hover:grid place-items-center">
                        <div>
                          <h1 className="text-3xl font-bold">
                            Already Participated
                          </h1>
                          <p className="text-center">
                            Questions: {quiz.total_questions}, Attempts:{" "}
                            {quiz.total_attempts}
                          </p>
                        </div>
                      </div>
                    )}
                    <img
                      src={bg || quiz.thumbnail} // Provide fallback image path
                      alt={quiz.title}
                      className="w-full h-full object-cover rounded mb-4"
                    />
                  </a>
                ))}
              </div>
            </section>
          </main>
        </div>
      </body>
      <Footer />
    </>
  );
}

export default HomePage;
