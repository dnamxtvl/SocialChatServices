module.exports = {
  async up(db, client) {
    await db.collection('user_conversation').createIndex({ user_id: 1 });
    await db.collection('user_conversation').createIndex({ no_unread_message: 1 });
  },

  async down(db, client) {
    await db.collection('user_conversation').drop();
  }
};
