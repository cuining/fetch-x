require('es6-promise').polyfill()

import fetchX from './index'
import { expect } from 'chai'

describe('fetch', function() {
  it('should be defined', function() {
    const methods = [
      'head',
      'put',
      'get',
      'post',
      'delete',
      'patch',
      'create'
    ]
    methods.forEach(method => expect(fetchX[method]).to.be.a('function'))
  })

})
