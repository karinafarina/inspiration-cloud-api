const MessagesService = {
  getAllMessages(knex) {
    return knex.select('*').from('messages')
  },

  insertMessage(knex, newMessage) {
    return knex
      .insert(newMessage)
      .into('messages')
      .returning('*')
      .then(rows => {
        return rows[0]
      });
  },

  getById(knex, messageId) {
    return knex
      .from('messages')
      .select('*')
      .where('id', parseInt(messageId, 10))
      .first()
  },

  deleteMessage(knex, messageId) {
    return knex('messages')
      //Make sure id is an integer
      .where('id', parseInt(messageId, 10))
      .delete()
  },

  updateMessage(knex, id, newMessageFields) {
    return knex('messages')
      .where({ id })
      .update(newMessageFields)
  }
}

module.exports = MessagesService;