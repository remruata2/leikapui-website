import axios from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const TOKEN_KEY = "jwtToken";
const USER_DATA_KEY = "userData";
const DEVICE_INFO_KEY = "deviceInfo";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDeviceInfo = async () => {
  try {
    // Check if we already have stored deviceInfo
    const storedDeviceInfo = localStorage.getItem(DEVICE_INFO_KEY);
    if (storedDeviceInfo) {
      return JSON.parse(storedDeviceInfo);
    }

    // Generate a unique device identifier
    const deviceId =
      window.navigator.userAgent +
      Date.now() +
      Math.random().toString(36).substring(2);
    
    const deviceInfo = {
      deviceId: await crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(deviceId))
        .then((buffer) =>
          Array.from(new Uint8Array(buffer))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("")
        ),
      deviceBrand: "Web Browser",
      modelName: navigator.appName || "Unknown Browser",
      platform: window.navigator.platform,
      osName: getOSName(),
      osVersion: getOSVersion(),
      userAgent: window.navigator.userAgent,
      language: window.navigator.language,
      online: window.navigator.onLine,
      lastLoginAt: new Date().toISOString(),
    };
    
    // Store device info for future use
    localStorage.setItem(DEVICE_INFO_KEY, JSON.stringify(deviceInfo));
    return deviceInfo;
  } catch (error) {
    console.error("Error getting device info:", error);
    return null;
  }
};

// Helper functions to get OS information
function getOSName() {
  const userAgent = window.navigator.userAgent;
  
  if (userAgent.indexOf("Windows") !== -1) return "Windows";
  if (userAgent.indexOf("Mac") !== -1) return "MacOS";
  if (userAgent.indexOf("Linux") !== -1) return "Linux";
  if (userAgent.indexOf("Android") !== -1) return "Android";
  if (userAgent.indexOf("iOS") !== -1 || userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) return "iOS";
  
  return "Unknown";
}

function getOSVersion() {
  const userAgent = window.navigator.userAgent;
  const matches = userAgent.match(/(Windows NT|Mac OS X|Android|iOS) ([0-9._]+)/);
  
  return matches ? matches[2] : "Unknown";
}

// Function to register device with backend
export const registerDevice = async (sessionId) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    
    const deviceInfo = await getDeviceInfo();
    if (!deviceInfo) return;
    
    // Update last login time
    deviceInfo.lastLoginAt = new Date().toISOString();
    localStorage.setItem(DEVICE_INFO_KEY, JSON.stringify(deviceInfo));
    
    // Send device info to backend
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/devices/register`,
      {
        deviceInfo,
        sessionId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Service: "leikapui-api"
        }
      }
    );
    
    console.log("Device registered successfully");
  } catch (error) {
    console.error("Error registering device:", error);
    // Non-critical, don't throw
  }
};

// Function to update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userData = getUserData();
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    if (!userData?._id) {
      throw new Error("User ID not found");
    }

    console.log("Updating user profile with data:", profileData);
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/users/${userData._id}`,
      profileData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          Service: "leikapui-api"
        }
      }
    );

    console.log("Profile update response:", response.data);
    const updatedUserData = response.data;

    // Update the stored user data
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUserData));

    return updatedUserData;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};

export const validateToken = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    // Verify token expiry
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = tokenData.exp * 1000;
    const currentTime = Date.now();

    // If token is within 1 hour of expiring, try to refresh it
    if (expiryTime - currentTime < 3600000) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.token) {
          localStorage.setItem(TOKEN_KEY, response.data.token);
          if (response.data.user) {
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
          }
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
          return true;
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    // Only invalidate if token is actually expired
    if (currentTime >= expiryTime) {
      await logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    await logout();
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

    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    axios.defaults.headers.common["Service"] = "leikapui-api";
    
    // Register device with backend
    if (response.data.user && response.data.user.sessionId) {
      await registerDevice(response.data.user.sessionId);
    }

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
    // Set a flag to prevent interceptors from creating a loop
    window.isLoggingOut = true;
    
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      // Already logged out
      return;
    }

    // Get userData to extract sessionId
    const userData = getUserData();
    const sessionId = userData?.sessionId;

    try {
      // Include sessionId in the request body like in the mobile app
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        { sessionId },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            Service: "leikapui-api"
          },
          timeout: 5000, // 5 second timeout
        }
      );
    } catch (error) {
      console.error("Logout request failed:", error);
      // Continue with local logout even if server request fails
    }
  } finally {
    // Always clear local storage and headers
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(DEVICE_INFO_KEY); // Also clear device info
    delete axios.defaults.headers.common["Authorization"];
    delete axios.defaults.headers.common["Service"];
    window.dispatchEvent(new Event("authChange"));
    // Reset the logging out flag
    window.isLoggingOut = false;
  }
};

export const getUserData = () => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Set up axios interceptors
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Service = "leikapui-api";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Skip auth handling if we're in the process of logging out
    if (error.response?.status === 401 && !window.isLoggingOut) {
      await logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
