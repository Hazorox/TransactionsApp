import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup"; // Corrected import statement
import TransactionPage from "./pages/transaction";
import NotFound from "./pages/notFound";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  const authUser = false;
  return (
    <>
      {authUser && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} /> // Corrected component
        name
        <Route path="/transaction/:id" element={<TransactionPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {authUser && <Footer />}
    </>
  );
}
