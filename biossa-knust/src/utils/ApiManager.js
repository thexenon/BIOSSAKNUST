import axios from 'axios';

const link = 'https://biossaknust.onrender.com';
// const link = 'http://192.168.1.123:3000';

const ApiManager = axios.create({
  baseURL: `${link}`,
  responseType: 'json',
  withCredentials: true,
});

export default ApiManager;
