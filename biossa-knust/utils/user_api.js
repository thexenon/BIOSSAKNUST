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
export const forgotPass = async (reqData) => {
  try {
    const result = await ApiManager("/api/v1/users/forgotPassword", {
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

export const submitComment = async (reqData, reqParams) => {
  try {
    const result = await ApiManager(`/api/v1/${reqParams}/comments`, {
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

export const submitPost = async (reqData, reqParams) => {
  try {
    const result = await ApiManager(`/api/v1/${reqParams}`, {
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

export const submitArray = async (reqData, reqParams) => {
  try {
    const result = await ApiManager(`/api/v1/${reqParams}`, {
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
