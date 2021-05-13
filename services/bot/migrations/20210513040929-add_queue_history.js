module.exports = {
  async up(db) {
    await db.collection('project').updateMany({}, { $set: {queues: {'queues.$.history': []}}});
  },

  async down(db) {
    await db.collection('project').updateMany({}, { $unset: {queues: {'queues.$.history': []}}});
  }
};
