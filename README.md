# fetch-x
[![Build Status](https://travis-ci.org/cuining/fetch-x.svg?branch=master)](https://travis-ci.org/cuining/fetch-x)

A wrapper around the new fetch API

## Install
```
$ npm install fetch-x
```
## Usage
```javascript
import fetchX from 'fetch-x';
```
`GET` request
```javascript
fetchX.get('/xxx?query=12345')
.then(json => console.log(json))
.catch(error => console.error(error));
```
`POST` request
> the default `Content-Type` is `application/x-www-form-urlencoded`
```javascript
fetchX.post('/xxx', {
  param1: 'jack',
  param2: 'pony'
})
.then(json => console.log(json))
.catch(error => console.error(error));
```

## Methods
> the default `credentials` option is `include`)  

```javascript
fetchX.fetch(url[, options]

fetchX.get(url[, data[, options]])

fetchX.delete(url[, options])

fetchX.head(url[, options])

fetchX.post(url[, data[, options]])

fetchX.put(url[, data[, options]])

fetchX.patch(url[, data[, options]])  

fetchX.create([options])

const myfetch = fetchX.create({
  headers: {
    'Authorization': 'Bearer ' + getAPIToken(),
    'X-My-Custom-Header': 'CustomHeader'
  }
});

myfetch.get(url)
.then(res => res.json())
.then(json => console.log(json))
.catch(error => console.error(error));
  ```

## Middleware
> add middleware to intercept response

```javascript
fetchX.applyMiddleware({
  response: [res => res.json(), json => {
    if (json.code === 'xxx') {
      // do something...
    } else if (...) {
      // do something...
    } else {
      // do something...
      return json;
    }
  }],
  request: [request => {
    request.url = xxx + request.url;
    return request;
  }]
})
```
