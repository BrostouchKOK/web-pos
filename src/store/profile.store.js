export const setAccessToken = (value) => {
    localStorage.setItem("access_token", value);
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };
  
  export const setProfile = (value) => {
    localStorage.setItem("profile", value);
  };
  export const getProfile = () => {
    return localStorage.getItem("profile");
  };