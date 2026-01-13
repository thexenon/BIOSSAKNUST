// TODO: Remove the fetching functions from the pages it is called to here
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const link = 'https://biossaknust.onrender.com';
// const link = 'http://192.168.1.123:3000';

const ApiManager = axios.create({
  baseURL: `${link}`,
  responseType: 'json',
  withCredentials: true,
});

const getHeadersWithJwt = async () => {
  const jwt = await AsyncStorage.getItem('jwt');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`,
  };
};

export const user_login = async (reqData) => {
  try {
    const result = await ApiManager('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    const result = await ApiManager('/api/v1/users/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    const result = await ApiManager('/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      data: reqData,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteAccount = async () => {
  const headers = await getHeadersWithJwt();
  try {
    const result = await ApiManager('/api/v1/users/deleteMe', {
      method: 'DELETE',
      headers,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const submitPost = async (reqData, reqParams) => {
  const headers = await getHeadersWithJwt();
  try {
    const result = await ApiManager(`/api/v1/${reqParams}`, {
      method: 'POST',
      headers,
      data: reqData,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const submitUserUpdate = async (reqData, reqParams) => {
  const headers = await getHeadersWithJwt();
  try {
    const result = await ApiManager(`/api/v1/${reqParams}`, {
      method: 'PATCH',
      headers,
      data: reqData,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const getItems = async (reqParams, query = {}) => {
  const headers = await getHeadersWithJwt();
  let url = `/api/v1/${reqParams}`;
  if (query && Object.keys(query).length > 0) {
    const params = new URLSearchParams(query).toString();
    url += `?${params}`;
    console.log('====================================');
    console.log(`GET Request URL: ${url}`);
    console.log('====================================');
  }
  try {
    const result = await ApiManager(url, {
      method: 'GET',
      headers,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteItems = async (reqParams) => {
  const headers = await getHeadersWithJwt();
  try {
    const result = await ApiManager(`/api/v1/${reqParams}`, {
      method: 'DELETE',
      headers,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const getItemById = async (reqParams, id) => {
  const headers = await getHeadersWithJwt();
  try {
    const result = await ApiManager(`/api/v1/${reqParams}/${id}`, {
      method: 'GET',
      headers,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const updateItem = async (reqParams, id, reqData) => {
  const headers = await getHeadersWithJwt();
  try {
    const result = await ApiManager(`/api/v1/${reqParams}/${id}`, {
      method: 'PATCH',
      headers,
      data: reqData,
    });
    return result;
  } catch (error) {
    return error.response.data;
  }
};
