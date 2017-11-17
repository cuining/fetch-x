const isFormData = o => toString.call(o) === '[object FormData]'

const encode = (val) => {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']')
}

const buildUrl = (url, params) => {
  if (!params) return url
  const query = []
  const delimiter = '&'
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      let value = encode(JSON.stringify(key))
      query.push(`${encode(key)}=${value}`)
    }
  }

  if (query.length) {
    url += (url.includes('?') ? delimiter : '?') + query.join(delimiter)
  }

  return url
}

class Fetch {
  constructor(config = {}) {
    this.config = config
    this.middlewares = []
  }

  genOptions (options = {}, method, data) {
    options = Object.assign({}, this.config, options)

    const defaultMethod = !data && !options.body ? 'GET' : 'POST'
    options.method = method || options.method || defaultMethod
    options.headers = options.headers || {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    if (isFormData(options.body)) {
      delete options.headers
    }

    if (data) {
      if (typeof data === 'string' || isFormData(data)) {
        options.body = data
      } else {
        try {
          options.body = JSON.stringify(data)
        } catch (e) {
          options.body = data
        }
      }
    }
    return options
  }

  applyMiddleware = middlewares => {
    this.middlewares = middlewares
  }

  request (url, ...args) {
    const options = this.genOptions(...args)
    let chain = [() => fetch(url, options)]
    let promise = Promise.resolve(options)

    if (this.middlewares.request) {
      chain.unshift(...[].concat(this.middlewares.request))
    }

    if (this.middlewares.response) {
      chain.push(...[].concat(this.middlewares.response))
    }

    while (!!chain.length) {
      promise = promise.then(chain.shift())
    }

    return promise
  }

  get = (url, data, options) => {
    url = buildUrl(url, data)
    return this.request(url, options, 'GET')
  }

  post = (url, data, options) => {
    return this.request(url, options, 'POST', data)
  }

  patch = (url, data, options) => {
    return this.request(url, options, 'PATCH', data)
  }

  put = (url, data, options) => {
    return this.request(url, options, 'PUT', data)
  }

  delete = (url, options) => {
    return this.request(url, options, 'DELETE')
  }

  head = (url, options) => {
    return this.request(url, options, 'HEAD')
  }
}

const fetchX = new Fetch()

fetchX.create = config => new Fetch(config)

export default fetchX
