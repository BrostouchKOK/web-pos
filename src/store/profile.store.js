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
  // convert string json to object
  var profile = localStorage.getItem("profile");
  try {
    if (profile !== "" && profile !== null && profile !== undefined) {
      return JSON.parse(profile);
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};
