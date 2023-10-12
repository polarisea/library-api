const {
  categoryFactory,
  authorFactory,
  bookFactory,
  contractFactory,
  voteFactory,
  userFactory,
} = require("../faker/seed");
const { ObjectId } = require("mongodb");

module.exports = {
  async up(db, client) {
    await db.createCollection("book");
    db.collection("book").createIndex({ name: "text" });

    await db.createCollection("user");
    db.collection("user").createIndex({ name: "text" });

    const authors = authorFactory(10);
    const a = await db.collection("author").insertMany(authors);

    const categories = categoryFactory(15);
    const c = await db.collection("category").insertMany(categories);

    const books = bookFactory(
      100,
      Object.values(a.insertedIds),
      Object.values(c.insertedIds),
    );
    const b = await db.collection("book").insertMany(books);

    const users = userFactory(100);
    const u = await db.collection("user").insertMany(users);

    const contracts = contractFactory(
      100,
      Object.values(b.insertedIds),
      Object.values(u.insertedIds),
    );
    await db.collection("contract").insertMany(contracts);

    const votes = voteFactory(
      100,
      Object.values(b.insertedIds),
      Object.values(u.insertedIds),
    );
    await db.collection("vote").insertMany(votes);

    const updatedData = {};
    for (const contract of contracts) {
      const bookId = contract.book.toString();
      if (!(bookId in updatedData))
        updatedData[bookId] = { contracts: 0, votes: 0 };
      updatedData[bookId].contracts += 1;
    }

    for (const vote of votes) {
      const bookId = vote.book.toString();
      if (!(bookId in updatedData))
        updatedData[bookId] = { contracts: 0, votes: 0 };
      updatedData[bookId].votes += vote.value;
    }

    for (const bookId in updatedData) {
      const { contracts: countContracts, votes: countVotes } =
        updatedData[bookId];
      await db
        .collection("book")
        .updateOne(
          { _id: new ObjectId(bookId) },
          { $set: { contracts: countContracts, votes: countVotes } },
        );
    }

    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    await db.collection("author").drop();
    await db.collection("category").drop();
    await db.collection("book").drop();
    await db.collection("user").drop();
    await db.collection("contract").drop();
    await db.collection("vote").drop();

    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
