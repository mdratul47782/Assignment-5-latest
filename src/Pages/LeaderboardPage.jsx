import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../Context/index";
import avatar from "../assets/avater.webp";
import useAxios from "../hooks/useAxios";
import { useAuth } from "../hooks/useAuth";

function LeaderboardPage() {
  const { quizId } = useContext(QuizContext);
  const api = useAxios();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get(
          `http://localhost:5000/api/quizzes/${quizId}/attempts`
        );
        setLeaderboardData(response.data.data.attempts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load leaderboard");
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [api, quizId]);

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>{error}</p>;

  // Find current user's data
  const currentUser = leaderboardData.find(
    (attempt) => attempt.user.id === auth?.user?.id
  );

  const currentUserPosition =
    leaderboardData.findIndex(
      (attempt) => attempt.user.id === auth?.user?.id
    ) + 1;

  const currentUserMarks = currentUser
    ? currentUser.correct_answers.reduce((sum, ans) => sum + ans.marks, 0)
    : 0;

    const currentUserCorrect = currentUser?.correct_answers ? currentUser.correct_answers.length : 0;
    const currentUserWrong = currentUser?.wrong_answers ? currentUser.wrong_answers.length : 0;
    

  return (
    <main className="min-h-[calc(100vh-50px)] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="bg-primary rounded-lg p-6 text-white">
            <div className="flex flex-col items-center mb-6">
              <img
                src={avatar}
                alt="Profile Pic"
                className="w-20 h-20 rounded-full border-4 border-white mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold">{auth?.user?.full_name || "Ratul"}</h2>
              <p className="text-xl">{currentUserPosition} Position</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm opacity-75">Mark</p>
                <p className="text-2xl font-bold">{currentUserMarks}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-75">Correct</p>
                <p className="text-2xl font-bold">{currentUserCorrect}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-75">Wrong</p>
                <p className="text-2xl font-bold">{currentUserWrong}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="mb-6">React Hooks Quiz</p>
            <ul className="space-y-4">
              {leaderboardData.slice(0, 5).map((attempt, index) => (
                <li key={attempt.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={avatar} // Ensure the avatar path is correct
                      alt={attempt.user.full_name}
                      className="object-cover w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{attempt.user.full_name}</h3>
                      <p className="text-sm text-gray-500">
                        {index + 1}
                        {index === 0
                          ? "st"
                          : index === 1
                          ? "nd"
                          : index === 2
                          ? "rd"
                          : "th"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">
                      {attempt.correct_answers.reduce(
                        (sum, ans) => sum + ans.marks,
                        0
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LeaderboardPage;
