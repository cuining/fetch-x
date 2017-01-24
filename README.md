# fetch-x

A wrapper around the new fetch API

# Install
    $ npm install fetch-x
# Usage
    import fetchX from 'fetch-x';

`GET` request

    fetchX.get('/xxx?query=12345')
    .then(json => console.log(json))
    .catch(error => console.error(error));

`POST` request
> the default `Content-Type` is `application/x-www-form-urlencoded`

    fetchX.post('/xxx', {
      param1: 'jack',
      param2: 'pony'
    })
    .then(json => console.log(json))
    .catch(error => console.error(error));


#Methods
> the default `credentials` option is `include`)    
    fetchX.fetch(url[, options]

    fetchX.get(url[, data[, options]])

    fetchX.delete(url[, options])

    fetchX.head(url[, options])

    fetchX.post(url[, data[, options]])

    fetchX.put(url[, data[, options]])

    fetchX.patch(url[, data[, options]])  
