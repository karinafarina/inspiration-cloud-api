const knex = require('knex');
const app = require('../src/app');
const { makeMessagesArray } = require('./test-helpers.js');

describe.only('Message Endpoints', function() {
  let db;

  this.beforeAll('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  const testMessages = makeMessagesArray();

  after('disconnect fro db', () => db.destroy())

  before('clean the table', () => db('messages').truncate())

  afterEach('cleanup', () => db('messages').truncate())

  describe('GET /api/messages', () => {
    context('Given no messages', () => {
      it('responds with 200 and an emply list', () => {
        return supertest(app)
          .get('/api/messages')
          .expect(200, [])
      })
    })
    context('Given there are messages', () => {
      beforeEach('insert messages', () => {
        return db
          .into('messages')
          .insert(testMessages)
      })
      it('responds with 200 and all of the messages', () => {
        return supertest(app)
          .get('/api/messages')
          .expect(200, testMessages)
      })
    })
  })

  describe('GET /api/messages/:messageId', () => {
    context('Given no messages', () => {
      it('responds with 404', () => {
        const messageId = 123456
        return supertest(app)
          .get(`/api/messages/${messageId}`)
          .expect(404, { error: { message: `Message Not Found` } })
      })
    })

    context('Given there are messages in database', () => {

      beforeEach('insert messages', () => {
        return db
          .into('messages')
          .insert(testMessages)
      })

      it('responds with 200 and the specified message', () => {
        const messageId = 2
        const expectedMessage = testMessages[messageId - 1]
        return supertest(app)
          .get(`/api/messages/${messageId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedMessage)
      })
    })
  })
  
  describe('POST /api/messages', () => {
    it('creates a message, responding with 201 and the new message', () => {
      const newMessage = {
        message: 'Test New Message'
      }
      return supertest(app)
        .post('/api/messages')
        .send(newMessage)
        .expect(201)
        .expect(res => {
          console.log('response', res.body.message, newMessage.message)
          expect(res.body.message).to.eql(newMessage.message)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/messages/${res.body.id}`)
        })
        .then(res => {
          console.log('res', res.body)
          return supertest(app)
            .get(`/api/messages/${res.body.id}`)
            .expect(res.body)
        })
    })
  })
  
  describe(`DELETE /api/messages/:messageId`, () => {
    context(`Given no message`, () => {
      it(`responds with 404`, () => {
        const messageId = 123456;
        return supertest(app)
          .delete(`/api/messages/${messageId}`)
          .expect(404, { error: { message: `Message Not Found` } })
      })
    })
    context('Given there are messages in the database', () => {
      const testMessages = makeMessagesArray();

      beforeEach('insert messages', () => {
        return db
          .into('messages')
          .insert(testMessages);
      })

      it('responds with 204 and removes the message', () => {
        const idToRemove = 2
        const expectedMessage = testMessages.filter(message => message.id !== idToRemove)
        return supertest(app)
          .delete(`/api/messages/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/messages`)
              .expect(expectedMessage)
          )
          .catch(error => console.log(error))
      })
    })
  })
  
  describe(`PATCH /api/messages/:messageId`, () => {
    context(`Given no messages`, () => {
      it(`responds with 404`, () => {
        const messageId = 123456
        return supertest(app)
          .delete(`/api/messages/${messageId}`)
          .expect(404, { error: { message: `Message Not Found` } })
      })
    })

    context('Given there are messages in the database', () => {
      const testMessage = makeMessagesArray()

      beforeEach('insert messages', () => {
        return db
          .into('messages')
          .insert(testMessage)
      })

      it('responds with 204 and updates the message', () => {
        const idToUpdate = 2
        const updateMessage = {
          message: 'updated message',
        }
        const expectedMessage = {
          ...testMessage[idToUpdate - 1],
          ...updateMessage
        }
        return supertest(app)
          .patch(`/api/messages/${idToUpdate}`)
          .send(updateMessage)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/messages/${idToUpdate}`)
              .expect(expectedMessage)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/messages/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(400, {
            error: {
              message: `Request body must contain 'message'`
            }
          })
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateMessage = {
          message: 'updated message',
        }
        const expectedMessage = {
         ...testMessage[idToUpdate - 1],
          ...updateMessage
        }

        return supertest(app)
          .patch(`/api/messages/${idToUpdate}`)
          .send({
            ...updateMessage,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/messages/${idToUpdate}`)
              .expect(expectedMessage)
          )
      })
    })
  })
})