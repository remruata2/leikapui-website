import axios from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDeviceInfo = async () => {
  try {
    const deviceId =
      window.navigator.userAgent +
      Date.now() +
      Math.random().toString(36).substring(2);
    return {
      deviceId: await crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(deviceId))
        .then((buffer) =>
          Array.from(new Uint8Array(buffer))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("")
        ),
      deviceBrand: "Web Browser",
      platform: window.navigator.platform,
      userAgent: window.navigator.userAgent,
      language: window.navigator.language,
      online: window.navigator.onLine,
    };
  } catch (error) {
    console.error("Error getting device info:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return false;

  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = tokenData.exp * 1000;
    const currentTime = Date.now();

    // If token is expired, logout the user
    if (currentTime >= expiryTime) {
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const authenticateWithBackend = async (
  credential,
  provider = "google",
  retryCount = 0
) => {
  try {
    const deviceInfo = await getDeviceInfo();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/${provider}`,
      {
        credential,
        deviceInfo,
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Service: "leikapui-api",
        },
      }
    );

    if (!response.data.success || !response.data.isAuthenticated) {
      throw new Error(response.data.message || "Authentication failed");
    }

    localStorage.setItem("jwtToken", response.data.token);
    localStorage.setItem("userData", JSON.stringify(response.data.user));
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    axios.defaults.headers.common["Service"] = "leikapui-api";

    return response.data;
  } catch (error) {
    console.error("Authentication error:", error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(error.response.data.message || "Authentication failed");
    }

    // Retry logic for network errors
    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY * Math.pow(2, retryCount));
      return authenticateWithBackend(credential, provider, retryCount + 1);
    }

    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      // Already logged out
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // 5 second timeout
        }
      );
    } catch (error) {
      console.error("Logout request failed:", error);
      // Continue with local logout even if server request fails
    }
  } finally {
    // Always clear local storage and headers
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userData");
    delete axios.defaults.headers.common["Authorization"];
    delete axios.defaults.headers.common["Service"];
    window.dispatchEvent(new Event("authChange"));
  }
};

// Set up axios interceptors
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we get a 401 error, it means the token is invalid or expired
    if (error.response?.status === 401) {
      // Logout the user and redirect to login page
      await logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
