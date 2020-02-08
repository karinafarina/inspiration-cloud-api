const path = require('path');
const express = require('express')
const MessagesService = require('./messages-service')

const messagesRouter = express.Router()
const jsonParser = express.json()

messagesRouter
  .route('/')
  .get((req, res, next) => {
    MessagesService.getAllMessages(
      req.app.get('db')
    )
      .then(messages => {
        res.json(messages)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { message } = req.body;
    const newMessage = { message };
    if(newMessage === null)
      return res.status(400).json({
        error: { message: `Missing message in request body`}
      })

    MessagesService.insertMessage(
      req.app.get('db'),
      newMessage
    )
      .then(message => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${message.id}`))
          .json(message)
      })
      .catch(next)
  })

  messagesRouter
    .route('/:messageId')
    .all((req, res, next) => {
      const { messageId } = req.params;
      const knexInstance = req.app.get('db')
      MessagesService.getById(knexInstance, messageId)
        .then(message => {
          console.log('message', message)
          if (!message) {
            return res.status(404).json({
              error: { message: `Message Not Found` }
            });
          }
          res.message = message
          next()
        })
        .catch(next);
    }) 
    .get((req, res) => {
      res.json(res.message)
    })
    .delete((req, res, next) => {
      const { messageId } = req.params;
      const knexInstance = req.app.get('db');
      MessagesService.deleteMessage(knexInstance, messageId)
        .then(numRowsAffected => {
          res.status(204).json({
            message: true
          })
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
      const { message } = req.body;
      const messageToUpdate = { message }

      const numberOfValues = Object.values(messageToUpdate).filter(Boolean).length
      if(numberOfValues === 0)
        return res.status(400).json({
          error: {
            message: `Request body must contain 'message'`
          }
        })
        MessagesService.updateMessage(
          req.app.get('db'),
          req.params.messageId,
          messageToUpdate
        )
        .then(numRowsAffected => {
          res.status(204).end()
        })
        .catch(next)
    })
  
module.exports = messagesRouter;
