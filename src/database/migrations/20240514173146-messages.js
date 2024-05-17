module.exports = {
  async up(db, client) {
    await db.collection('messages').createIndex({ user_send_id: 1, conversation_id: 1 });
    await db.collection('messages').createIndex({ conversation_id: 1, parent_id: 1 })
    await db.collection('messages').createIndex({ content: 'text' })
  },

  async down(db, client) {
    await db.collection('messages').drop();
  }
};
