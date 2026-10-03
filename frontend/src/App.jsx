import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TermsPolicy from "./pages/TermsPolicy";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import SplashScreen from "./components/SplashScreen";
import AnimatedCursor from "./components/AnimatedCursor";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("splash"); // splash, login, signup, terms_policy, home, dashboard, chatbot
  const [currentUser, setCurrentUser] = useState(null);
  const [createdEmail, setCreatedEmail] = useState("");

  useEffect(() => {
    // Always show the login page before entering the website
    // Prefill the email if previously saved, but require logging in
    const savedUser = localStorage.getItem("velfire_user");
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        if (userObj?.email) {
          setCreatedEmail(userObj.email);
        }
      } catch (e) {
        localStorage.removeItem("velfire_user");
      }
    }
    // Clear user state so authentication is always required on entry
    setCurrentUser(null);
    localStorage.removeItem("velfire_user");
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

  const renderCurrentView = () => {
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

    return <SplashScreen onComplete={() => setCurrentView("login")} />;
  };

  return (
    <>
      <AnimatedCursor />
      {renderCurrentView()}
    </>
  );
}

export default App;