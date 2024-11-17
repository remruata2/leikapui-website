import React, { memo } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import Logo from "../../components/logo";
import "./LoginPage.css"; // Make sure to create this CSS file

const LoginPage = memo(() => {
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

  const generateDeviceId = async () => {
    const userAgent = navigator.userAgent;
    const timestamp = Date.now();
    const randomNum = Math.random().toString(36).substring(2, 15);

    const rawId = `${userAgent}-${timestamp}-${randomNum}`;

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(rawId)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  const getDeviceInfo = async () => {
    const deviceId = await generateDeviceId();
    const deviceInfo = {
      userAgent: navigator.userAgent,
      deviceBrand: "Desktop App",
      language: navigator.language,
      online: navigator.onLine,
      deviceId: deviceId,
    };
    console.log("Device Info:", deviceInfo);
    return deviceInfo;
  };

  const sendGoogleCredential = async (credential) => {
    const deviceInfo = await getDeviceInfo();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, deviceInfo }),
      }
    );
    return response.json();
  };

  const sendFacebookToken = async (accessToken) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/facebook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      }
    );
    return response.json();
  };

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
      // You can add additional error handling here, such as:
      // - Displaying an error message to the user
      // - Redirecting to an error page
      // - Attempting to navigate again after a delay
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await sendGoogleCredential(
        credentialResponse.credential
      );
      console.log("Google Response:", response);
      if (response.status === "limit_reached") {
        alert(response.message); // Display the message to the user
        return; // Prevent further navigation
      }
      localStorage.setItem("jwtToken", response.token);
      window.dispatchEvent(new Event("authChange"));
      handleNavigation("/");
    } catch (error) {
      console.error("Error:", error);
      // Handle navigation error or show user feedback
    }
  };

  const handleGoogleError = () => {
    console.log("Login Failed");
  };

  const handleFacebookLogin = async (response) => {
    try {
      const data = await sendFacebookToken(response.accessToken);
      localStorage.setItem("jwtToken", data.token);
      window.dispatchEvent(new Event("authChange"));
      handleNavigation("/");
    } catch (error) {
      console.error("Error:", error);
      // Handle navigation error or show user feedback
    }
  };

  return (
    <Container fluid className="login-container">
      <div className="login-card text-center">
        <Logo />
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to start streaming</p>
        <GoogleOAuthProvider clientId={clientId}>
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              shape="rectangular"
              logo_alignment="left"
              width="250px"
            />
          </div>
        </GoogleOAuthProvider>
        <div className="facebook-login-wrapper">
          <FacebookLogin
            appId={facebookAppId}
            onSuccess={handleFacebookLogin}
            onFail={(error) => {
              console.log("Login Failed!", error);
            }}
            onProfileSuccess={(response) => {
              console.log("Get Profile Success!", response);
            }}
            style={{
              backgroundColor: "#4267b2",
              color: "#fff",
              fontSize: "16px",
              padding: "12px 24px",
              border: "none",
              borderRadius: "2px",
              height: "44px",
              width: "270px",
            }}
          >
            Login with Facebook
          </FacebookLogin>
        </div>
      </div>
    </Container>
  );
});

LoginPage.displayName = "LoginPage";
export default LoginPage;
