import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const response = await fetch(`${API_URL}/api/auth/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to send OTP.");
        }

        setMessage(data.message);
        setStep("otp");
      } else {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed.");
        }

        onLogin(data.user);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP.");
      }

      onLogin(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to resend OTP.");
      }

      setMessage(data.message);
      setOtp("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setStep("form");
    setError("");
    setMessage("");
    setOtp("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {step === "form" ? (
          <>
            <p className="section-label">
              {mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
            </p>

            <h2>
              {mode === "login"
                ? "Login to your account"
                : "Create a new account"}
            </h2>

            <form onSubmit={submit}>
              {mode === "signup" && (
                <>
                  <label>Full name</label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </>
              )}

              <label>Email address</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
              />

              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />

              {error && <p className="auth-error">{error}</p>}

              <button
                className="generate full-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Login"
                    : "Send OTP"}
              </button>
            </form>

            <button className="switch-auth" onClick={switchMode}>
              {mode === "login"
                ? "Don't have an account? Create one"
                : "Already have an account? Login"}
            </button>
          </>
        ) : (
          <>
            <p className="section-label">EMAIL VERIFICATION</p>

            <h2>Verify your email</h2>

            <p className="muted">
              Enter the OTP sent to <b>{email}</b>.
            </p>

            <input
              className="otp-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              placeholder="000000"
              inputMode="numeric"
              autoFocus
            />

            {error && <p className="auth-error">{error}</p>}

            {message && <p className="auth-success">{message}</p>}

            <button
              className="generate full-button"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              className="switch-auth"
              onClick={resendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>

            <button
              className="switch-auth"
              onClick={() => {
                setStep("form");
                setOtp("");
                setError("");
                setMessage("");
              }}
            >
              Change email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
