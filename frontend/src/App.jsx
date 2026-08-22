import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import History from "./pages/History";
import HowItWorks from "./pages/HowItWorks";
import Profile from "./pages/Profile";
import About from "./pages/About";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => {
  try {
    const savedUser = localStorage.getItem("docpilot_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
});
  const [authOpen, setAuthOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [homeKey, setHomeKey] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const loadHistory = async (account = user) => {
    if (!account?.id) {
      setHistory([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/history/${account.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load history.");
      }

      setHistory(data.history || []);
    } catch (error) {
      console.error("History load error:", error);
    }
  };

  useEffect(() => {
    const openHistory = () => setPage("history");
    const openHow = () => setPage("how");

    window.addEventListener("open-history", openHistory);
    window.addEventListener("open-how", openHow);

    return () => {
      window.removeEventListener("open-history", openHistory);
      window.removeEventListener("open-how", openHow);
    };
  }, []);
  useEffect(() => {
    if (user) {
      loadHistory(user);
    } else {
      setHistory([]);
    }
  }, [user]);

  const login = (account) => {
  localStorage.setItem("docpilot_user", JSON.stringify(account));
  setUser(account);
  setPage("home");
};

  const logout = () => {
  localStorage.removeItem("docpilot_user");
  setUser(null);
  setHistory([]);
  setPage("home");
};

  const goHome = () => {
    setHomeKey((key) => key + 1);
    setPage("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteHistory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/history/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete history item.");
      }

      setHistory((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("History delete error:", error);
      alert("Unable to delete this history item.");
    }
  };

  return (
    <div className="app">
      <Navbar
        user={user}
        currentPage={page}
        onLogin={() => setAuthOpen(true)}
        onHistory={() => setPage("history")}
        onHome={goHome}
        onProfile={() => setPage("profile")}
        onHowItWorks={() => {
          setPage("how");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onAbout={() => {
          setPage("about");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onLogout={logout}
      />

      {page === "home" && (
        <Home
          key={homeKey}
          user={user}
          onLogin={() => setAuthOpen(true)}
          onHistorySaved={() => loadHistory(user)}
        />
      )}

      {page === "history" && (
        <History history={history} onDelete={deleteHistory} />
      )}

      {page === "how" && <HowItWorks />}
      {page === "about" && <About />}

      {page === "profile" && user && (
        <Profile
          user={user}
          history={history}
          onHistory={() => setPage("history")}
        />
      )}

      <Footer
        user={user}
        onHome={goHome}
        onHowItWorks={() => {
          setPage("how");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onAbout={() => {
          setPage("about");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onHistory={() => {
          setPage("history");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onProfile={() => {
          setPage("profile");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      {authOpen && (
        <AuthModal onClose={() => setAuthOpen(false)} onLogin={login} />
      )}
    </div>
  );
}
