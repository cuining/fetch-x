const querystring = require('querystring'); // node api https://nodejs.org/dist/latest-v6.x/docs/api/querystring.html
const fetch = require('isomorphic-fetch');

function isFormData(o) {
  return toString.call(o) === '[object FormData]'
}

class Fetch {
  constructor(config = {}) {
    this.config = config;
    this.middlewares = [];
  }

  _creatRequest(url, options = {}, method, data) {
    options = Object.assign({}, this.config, options);
    const defaultMethod = !data && !options.body ? 'GET' : 'POST';
    options.method = method || options.method || defaultMethod;
    options.headers = options.headers || {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (isFormData(options.body)) {
      delete options.headers;
    }

    options.credentials = 'include';

    if (data) {
      if (typeof data === 'string' || isFormData(data)) {
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
    let chain = [function(){ fetch(request.url, request.options) }];
    let promise = Promise.resolve(request);
    if (this.middlewares.request) {
      chain.unshift(...[].concat(his.middlewares.request));
    }

    if (this.middlewares.response) {
      chain.push(...[].concat(this.middlewares.response));
    }

    while (!!chain.length) {
      promise = promise.then(chain.shift());
    }
    return promise;
  }

  applyMiddleware(middlewares) {
    this.middlewares = middlewares;
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

  applyMiddleware(middlewares) {
    this.instance.applyMiddleware(middlewares);
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
