module.exports = {
  async up(db, client) {
    await db.collection('conversations').createIndex({ created_by: 1 });
    await db.collection('conversations').createIndex({ organization_id: 1 });
    await db.collection('conversations').createIndex({ name: 'text' });
    await db.collection('conversations').createIndex({ created_by: 1, organization_id: 1 });
  },

  async down(db, client) {
    await db.collection('conversations').drop();
  }
};
