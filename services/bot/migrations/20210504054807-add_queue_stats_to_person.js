module.exports = {
  async up(db) {
    await db.collection('people').updateMany({}, { $set: {
      atHeadSeconds: 0,
      atHeadCount: 0,
      inQueueSeconds: 0,
      inQueueCount: 0
    }});
  },

  async down(db) {
    await db.collection('people').updateMany({}, { $unset: {
      atHeadSeconds: 0,
      atHeadCount: 0,
      inQueueSeconds: 0,
      inQueueCount: 0
    }});
  }
};
