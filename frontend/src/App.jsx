import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TermsPolicy from "./pages/TermsPolicy";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("splash"); // splash, login, signup, terms_policy, home, dashboard, chatbot
  const [currentUser, setCurrentUser] = useState(null);
  const [createdEmail, setCreatedEmail] = useState("");

  useEffect(() => {
    // Check if user is already saved in localStorage for session persistence
    const savedUser = localStorage.getItem("velfire_user");
    
    const timer = setTimeout(() => {
      if (savedUser) {
        try {
          const userObj = JSON.parse(savedUser);
          setCurrentUser(userObj);
          setCurrentView("home");
          return;
        } catch (e) {
          localStorage.removeItem("velfire_user");
        }
      }
      setCurrentView("login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem("velfire_user", JSON.stringify(user));
    setCurrentView("home");
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("velfire_user", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("velfire_user");
    setCurrentView("login");
  };

  const handleNavigateToSignup = () => {
    setCurrentView("signup");
  };

  const handleSignupSuccess = (email) => {
    setCreatedEmail(email);
    setCurrentView("terms_policy");
  };

  const handleAcceptTerms = (email) => {
    setCreatedEmail(email);
    setCurrentView("login");
  };

  const handleNavigateToLogin = (emailToPrefill = "") => {
    if (emailToPrefill) {
      setCreatedEmail(emailToPrefill);
    }
    setCurrentView("login");
  };

  const handleOpenDashboard = () => {
    setCurrentView("dashboard");
  };

  const handleOpenChatbot = () => {
    setCurrentView("chatbot");
  };

  if (currentView === "login") {
    return (
      <Login
        onNavigateToSignup={handleNavigateToSignup}
        onLoginSuccess={handleLoginSuccess}
        initialEmail={createdEmail}
      />
    );
  }

  if (currentView === "signup") {
    return (
      <Signup
        onNavigateToLogin={handleNavigateToLogin}
        onSignupSuccess={handleSignupSuccess}
      />
    );
  }

  if (currentView === "terms_policy") {
    return (
      <TermsPolicy
        createdEmail={createdEmail}
        onAcceptTerms={handleAcceptTerms}
      />
    );
  }

  if (currentView === "chatbot" && currentUser) {
    return (
      <Chatbot
        user={currentUser}
        onLogout={handleLogout}
        onBackToDashboard={() => setCurrentView("dashboard")}
      />
    );
  }

  if (currentView === "dashboard" && currentUser) {
    return (
      <Dashboard
        user={currentUser}
        onLogout={handleLogout}
        onBackToHome={() => setCurrentView("home")}
        onOpenChatbot={handleOpenChatbot}
      />
    );
  }

  if (currentView === "home" && currentUser) {
    return (
      <Home
        user={currentUser}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
        onOpenDashboard={handleOpenDashboard}
      />
    );
  }

  const letters = "VELFIRE".split("");

  return (
    <div className="splash-page">
      <div className="logo">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="logo-letter"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;