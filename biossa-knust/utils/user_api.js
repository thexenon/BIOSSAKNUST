import ApiManager from "./ApiManager";

export const user_login = async (reqData) => {
  try {
    const result = await ApiManager("/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: reqData,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const user_signup = async (reqData) => {
  try {
    const result = await ApiManager("/api/v1/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: reqData,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const submitComment = async (reqData, scriptureID) => {
  try {
    const result = await ApiManager(
      `/api/v1/scriptures/${scriptureID}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: reqData,
      }
    );
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const submitReactionLike = async (reqData, scriptureID) => {
  try {
    const result = await ApiManager(`/api/v1/scriptures/${scriptureID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: reqData,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};
