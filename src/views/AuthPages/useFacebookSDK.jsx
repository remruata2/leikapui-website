import { useState, useEffect } from "react";

export const useFacebookSDK = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: "v12.0",
        });
        setIsLoaded(true);
      };

      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    } else {
      setIsLoaded(true);
    }
  }, []);

  return isLoaded;
};
