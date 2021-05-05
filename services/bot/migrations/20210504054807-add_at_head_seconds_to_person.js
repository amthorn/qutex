module.exports = {
  async up(db) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    await db.collection('people').updateMany({}, { $set: {atHeadSeconds: 0 }});
  },

  async down(db) {
    await db.collection('people').updateMany({}, { $unset: {atHeadSeconds: 0 }});
  }
};
