import React, { useState } from "react";

export default function Navbar({
  user,
  currentPage,
  onLogin,
  onHistory,
  onHome,
  onProfile,
  onHowItWorks,
  onAbout,
  onLogout,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  const initial = userName.charAt(0).toUpperCase();

  const closeMobile = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="header">

      {/* BRAND */}
      <button
        className="brand"
        onClick={() => {
          closeMobile();
          onHome();
        }}
      >
        <span className="brand-mark">▤</span>

        <span>
          Document <b>Summary Assistant</b>
        </span>
      </button>


      {/* DESKTOP NAVIGATION */}
      <nav className="desktop-nav">

        {/* HOME */}
        <button
          className={
            currentPage === "home"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={onHome}
        >
          ⌂ <span>Home</span>
        </button>


        {/* HOW IT WORKS */}
        <button
          className={
            currentPage === "how"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={onHowItWorks}
        >
          ⓘ <span>How It Works</span>
        </button>


        {/* ABOUT */}
        <button
          className={
            currentPage === "about"
              ? "nav-link active"
              : "nav-link"
          }
          onClick={onAbout}
        >
          ♙ <span>About</span>
        </button>


        {/* LOGGED IN */}
        {user ? (
          <>
            {/* HISTORY */}
            <button
              className={
                currentPage === "history"
                  ? "nav-link active"
                  : "nav-link"
              }
              onClick={onHistory}
            >
              ▣ <span>History</span>
            </button>


            {/* PROFILE */}
            <div
              className="profile-menu"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                className={
                  currentPage === "profile"
                    ? "profile-trigger profile-active"
                    : "profile-trigger"
                }
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <span className="profile-avatar-small">
                  {initial}
                </span>

                <span className="profile-name">
                  {userName}
                </span>

                <span className="profile-arrow">
                  ▾
                </span>
              </button>


              {profileOpen && (
                <div className="profile-dropdown">

                  <div className="dropdown-user">

                    <div className="dropdown-avatar">
                      {initial}
                    </div>

                    <div>
                      <strong>{userName}</strong>
                      <span>{userEmail}</span>
                    </div>

                  </div>


                  <div className="dropdown-divider" />


                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      onProfile();
                    }}
                  >
                    <span>♙</span>
                    <span>View Profile</span>
                  </button>


                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      onHistory();
                    }}
                  >
                    <span>▣</span>
                    <span>My History</span>
                  </button>


                  <div className="dropdown-divider" />


                  <button
                    className="dropdown-item logout-item"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                  >
                    <span>↪</span>
                    <span>Logout</span>
                  </button>

                </div>
              )}
            </div>
          </>
        ) : (
          <button
            className="login-button"
            onClick={onLogin}
          >
            Login
          </button>
        )}

      </nav>


      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-button"
        onClick={() => {
          setMobileOpen(!mobileOpen);
          setProfileOpen(false);
        }}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>


      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="mobile-nav">

          {/* HOME */}
          <button
            className={
              currentPage === "home"
                ? "mobile-nav-link active"
                : "mobile-nav-link"
            }
            onClick={() => {
              closeMobile();
              onHome();
            }}
          >
            <span>⌂</span>
            <span>Home</span>
          </button>


          {/* HOW IT WORKS */}
          <button
            className={
              currentPage === "how"
                ? "mobile-nav-link active"
                : "mobile-nav-link"
            }
            onClick={() => {
              closeMobile();
              onHowItWorks();
            }}
          >
            <span>ⓘ</span>
            <span>How It Works</span>
          </button>


          {/* ABOUT */}
          <button
            className={
              currentPage === "about"
                ? "mobile-nav-link active"
                : "mobile-nav-link"
            }
            onClick={() => {
              closeMobile();
              onAbout();
            }}
          >
            <span>♙</span>
            <span>About</span>
          </button>


          {user ? (
            <>

              {/* HISTORY */}
              <button
                className={
                  currentPage === "history"
                    ? "mobile-nav-link active"
                    : "mobile-nav-link"
                }
                onClick={() => {
                  closeMobile();
                  onHistory();
                }}
              >
                <span>▣</span>
                <span>History</span>
              </button>


              {/* PROFILE */}
              <button
                className={
                  currentPage === "profile"
                    ? "mobile-nav-link active"
                    : "mobile-nav-link"
                }
                onClick={() => {
                  closeMobile();
                  onProfile();
                }}
              >
                <span>♙</span>
                <span>Profile</span>
              </button>


              <div className="mobile-nav-divider" />


              {/* LOGOUT */}
              <button
                className="mobile-nav-link mobile-logout"
                onClick={() => {
                  closeMobile();
                  onLogout();
                }}
              >
                <span>↪</span>
                <span>Logout</span>
              </button>

            </>
          ) : (
            <>
              <div className="mobile-nav-divider" />

              <button
                className="mobile-login-button"
                onClick={() => {
                  closeMobile();
                  onLogin();
                }}
              >
                Login
              </button>
            </>
          )}

        </div>
      )}

    </header>
  );
}
