import React, { memo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Logo from "../../components/logo";
import { FaArrowLeft } from "react-icons/fa";
import { authenticateWithBackend } from "../../utilities/authUtils";
import "./LoginPage.css";

const LoginPage = memo(() => {
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [isLoading, setIsLoading] = useState(false);
  const loginAttemptInProgress = useRef(false);

  const handleSuccessfulLogin = () => {
    loginAttemptInProgress.current = false;
    setIsLoading(false);
    // Dispatch auth change event to immediately update UI across the app
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // Prevent concurrent login attempts
    if (loginAttemptInProgress.current) {
      console.log("Login attempt already in progress");
      return;
    }

    loginAttemptInProgress.current = true;
    setIsLoading(true);

    try {
      const authResult = await authenticateWithBackend(
        credentialResponse.credential,
        "google"
      );
      if (authResult.success && authResult.isAuthenticated) {
        handleSuccessfulLogin();
      } else {
        throw new Error(authResult.message || "Authentication failed");
      }
    } catch (error) {
      loginAttemptInProgress.current = false;
      alert(error.message || "Failed to authenticate. Please try again.");
    } finally {
      setIsLoading(false);
      loginAttemptInProgress.current = false;
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
    loginAttemptInProgress.current = false;
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="back-to-home-link">
        <Link
          to="/"
          className="d-flex align-items-center mb-4 text-primary"
          style={{
            gap: "0.5rem",
            fontSize: "1rem",
            textDecoration: "none",
          }}
        >
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
      <div className="login-container">
        {/* Left Column - Image/Branding - Hidden on mobile */}
        <div className="login-left">
          <div className="login-left-content">
            <Logo className="large-logo" />
            <h2 className="welcome-text">Welcome to Leikapui Studios</h2>
            <p className="tagline">Home of the best movies and shows</p>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="login-right">
          <div className="login-form-container">
            <div className="mobile-logo-container">
              <Logo className="mobile-logo" />
            </div>
            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">Sign in to continue your journey</p>

            <div className="auth-buttons">
              <GoogleOAuthProvider clientId={clientId}>
                <div className="auth-button google">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    type="standard"
                    shape="rectangular"
                    size="large"
                    width="100%"
                    text="signin_with"
                    logo_alignment="center"
                    useOneTap={false}
                    auto_select={false}
                    context="signin"
                  />
                </div>
              </GoogleOAuthProvider>
            </div>

            <div className="login-footer">
              <p className="terms-text">
                By signing in, you agree to our{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

LoginPage.displayName = "LoginPage";
export default LoginPage;
