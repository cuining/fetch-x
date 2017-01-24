const querystring = require('querystring'); // node api https://nodejs.org/dist/latest-v6.x/docs/api/querystring.html
const fetch = require('isomorphic-fetch');

class Fetch {
  constructor(config = {}) {
    this.config = config;
  }

  _creatRequest(url, options = {}, method, data) {
    options = Object.assign({}, this.config, options);
    const defaultMethod = !data && !options.body ? 'GET' : 'POST';
    options.method = method || options.method || defaultMethod;
    options.headers = options.headers || {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (options.body instanceof FormData || data instanceof FormData) {
      delete options.headers;
    }
    options.credentials = 'include';

    if (data) {
      if (typeof data === 'string') {
        options.body = data;
      } else {
        try {
          options.body = JSON.stringify(data);
        } catch (e) {
          options.body = data;
        }
      }
    }
    return {
      url, options,
    };
  }

  _request(url, ...options) {
    const request = this._creatRequest(url, ...options);
    return fetch(request.url, request.options).then(res => res.json()).then(json => {
      if (json.code === '401') {
        window.location.href = `${ATFCAPI.HOME}?from=${window.location.href}`;
      } else {
        return json;
      }
    });
  }

  fetch(url, options) {
    return this._request(url, options);
  }

  get(url, data, options) {
    if (data) {
      url = url + '?' + querystring.stringify(data);
    }
    return this._request(url, options, 'GET');
  }

  post(url, data, options) {
    return this._request(url, options, 'POST', querystring.stringify(data));
  }

  patch(url, data, options) {
    return this._request(url, options, 'PATCH', data);
  }

  put(url, data, options) {
    return this._request(url, options, 'PUT', querystring.stringify(data));
  }

  delete(url, options) {
    return this._request(url, options, 'DELETE');
  }

  head(url, options) {
    return this._request(url, options, 'HEAD');
  }
}

class FetchFactory {
  constructor() {
    this.instance = new Fetch();
  }

  create(config) {
    return new Fetch(config);
  }

  fetch(...args) {
    return this.instance.fetch(...args);
  }

  get(...args) {
    return this.instance.get(...args);
  }

  post(...args) {
    return this.instance.post(...args);
  }

  patch(...args) {
    return this.instance.patch(...args);
  }

  put(...args) {
    return this.instance.put(...args);
  }

  delete(...args) {
    return this.instance.delete(...args);
  }

  head(...args) {
    return this.instance.head(...args);
  }

}

module.exports = new FetchFactory();
