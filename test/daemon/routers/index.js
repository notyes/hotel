/* global describe, before, after, it */
const request = require('supertest')
const assert = require('assert')
const helper = require('../helper')

describe('routers/index', () => {
  let app
  before(() => app = helper.before())
  after(helper.after)

  describe('GET /proxy.pac', () => {
    it('should serve /proxy.pac', done => {
      request(app)
        .get('/proxy.pac')
        .expect(200, done)
    })
  })

  describe('GET http://localhost:2000/node', () => {
    it('should redirect to node server', done => {
      // temporary disable this test on AppVeyor
      // Randomly fails
      if (process.env.APPVEYOR) return done()
      request(app)
        .get('/node')
        .set('Host', 'localhost')
        .expect('location', /http:\/\/localhost:51234/)
        .expect(302, (err, res) => {
          if (err) throw err
          assert.equal(app.group.get('node').status, 'running')
          done()
        })
    })
  })

  describe('GET http://127.0.0.1:2000/node', () => {
    it('should use the same hostname to redirect', done => {
      // temporary disable this test on AppVeyor
      // Randomly fails
      if (process.env.APPVEYOR) return done()
      request(app)
        .get('/node')
        .expect('location', /http:\/\/127.0.0.1:51234/)
        .expect(302, done)
    })
  })
})
