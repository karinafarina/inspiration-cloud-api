const knex = require('knex');
const app = require('../src/app');
const { makeMessagesArray } = require('./test-helpers.js');

describe('Message Endpoints', function() {
  let db;

  this.beforeAll('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect fro db', () => db.destroy())

  before('clean the table', () => 
    db.raw('TRUNCATE messages RESTART IDENTITY CASCADE')
  )

  afterEach('cleanup', () =>
    db.raw('TRUNCATE messages RESTART IDENTITY CASCADE')
  )

  describe('GET /api/messages', () => {
    context('Given no messages', () => {
      it('responds with 200 and an emply list', () => {
        return supertest(app)
          .get('/api/message')
          .expect(200, [])
      })
    })
    
  })

})