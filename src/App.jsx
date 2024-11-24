import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage ";
import LeaderboardPage from "./Pages/LeaderboardPage";
import LoginPage from "./Pages/LoginPage";
import NotFoundPage from "./Pages/NotFoundPage";
import QuizPage from "./Pages/QuizPage";
import RegistrationPage from "./Pages/RegistrationPage";
import ResultPage from "./Pages/ResultPage";
import PrivateRoutes from "./routes/PrivateRoutes";
import Dashboard from "./PagesAdmin/Dashboard";
import Quiz_Set_Entry_Page from "./PagesAdmin/Quiz_Set_Entry_Page";
import Quiz_Set_Page from "./PagesAdmin/Quiz_Set_Page";
import QuizProvider from "./provider/QuizProvider";
import { QuizResultProvider } from "./provider/QuizResultProvider";

export default function App() {
  return (
    <QuizResultProvider>
    <QuizProvider>
      <Routes>
        {/* User Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/:quizId" element={<QuizPage />} />
          
          <Route path="/leaderboard/" element={<LeaderboardPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoutes isAdmin={true} />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Quiz_Set_Page" element={<Quiz_Set_Page />} />
          <Route path="/Quiz_Set_Entry_Page" element={<Quiz_Set_Entry_Page />} />
          <Route path="/result/:quizId" element={<ResultPage />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/result/:quizId" element={<ResultPage />} />
      </Routes>
    </QuizProvider>
    </QuizResultProvider>
  );
}
