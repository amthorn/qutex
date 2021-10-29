module.exports = {
  async up(db) {
    await db.collection('people').createIndex({'email': 1}, {'sparse': true})
    await db.collection('people').updateMany({}, { $set: {
      email: null,
      passwordHash: null
    }});
  },

  async down(db) {
    await db.collection('people').updateMany({}, { $unset: {
      email: null,
      passwordHash: null
    }});
    await db.collection('people').dropIndex({'email_1': 1})
  }
};
