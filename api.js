import axios from 'axios';

// eslint-disable-next-line
const BASEURL_PROD = 'https://us-central1-sweartax.cloudfunctions.net';

// eslint-disable-next-line
const BASEURL_TEST = 'https://us-central1-pennywall.cloudfunctions.net';

class API {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        baseURL: BASEURL_PROD,
      },
      options,
    );

    const baseURL = this.options.baseURL || BASEURL_PROD;
    this.axios = axios.create({
      baseURL,
      timeout: 20000,
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('PennyJar API at', baseURL);
  }

  create(params) {
    return this.axios
      .post('/create', params)
      .then(response => response.data)
      .catch(e => e.response);
  }

  donate(params) {
    return this.axios
      .post('/donate', params)
      .then(response => response.data)
      .catch(e => e.response);
  }

  lookup(params) {
    return this.axios
      .post('/lookup', params)
      .then(response => response.data)
      .catch(e => e.response);
  }
}

export default API;
