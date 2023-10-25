const {
  categoryFactory,
  authorFactory,
  bookFactory,
  contractFactory,
  voteFactory,
  userFactory,
  publisherFactory,
} = require("../faker/seed");
const { ObjectId } = require("mongodb");

const { addAuthors, addCatgories, addPublishers } = require("../cache");
const { unlinkSync } = require("fs");

module.exports = {
  async up(db, client) {
    await db.createCollection("book");
    db.collection("book").createIndex({ indexedContent: "text" });

    await db.createCollection("user");
    db.collection("user").createIndex({ name: "text" });

    const authors = authorFactory(10);
    addAuthors(authors);

    const categories = categoryFactory(15);
    addCatgories(categories);

    const publishers = publisherFactory(15);
    addPublishers(publishers);

    const books = bookFactory(100, authors, categories, publishers);
    const b = await db.collection("book").insertMany(books);

    const users = userFactory(100);
    const u = await db.collection("user").insertMany(users);

    const contracts = contractFactory(500, users, books);
    await db.collection("contract").insertMany(contracts);
    // const contracts = contractFactory(
    //   100,
    //   Object.values(b.insertedIds),
    //   Object.values(u.insertedIds),
    // );

    // const votes = voteFactory(
    //   100,
    //   Object.values(b.insertedIds),
    //   Object.values(u.insertedIds),
    // );
    // await db.collection("vote").insertMany(votes);

    // const updatedData = {};
    // for (const contract of contracts) {
    //   const bookId = contract.book.toString();
    //   if (!(bookId in updatedData))
    //     updatedData[bookId] = { contracts: 0, votes: 0 };
    //   updatedData[bookId].contracts += 1;
    // }

    // for (const vote of votes) {
    //   const bookId = vote.book.toString();
    //   if (!(bookId in updatedData))
    //     updatedData[bookId] = { contracts: 0, votes: 0 };
    //   updatedData[bookId].votes += vote.value;
    // }

    // for (const bookId in updatedData) {
    //   const { contracts: countContracts, votes: countVotes } =
    //     updatedData[bookId];
    //   await db
    //     .collection("book")
    //     .updateOne(
    //       { _id: new ObjectId(bookId) },
    //       { $set: { contracts: countContracts, votes: countVotes } },
    //     );
    // }

    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    await db.collection("book").drop();
    await db.collection("user").drop();
    await db.collection("contract").drop();
    await db.collection("vote").drop();
    try {
      unlinkSync("cache/db/author.js");
      unlinkSync("cache/db/category.js");
      unlinkSync("cache/db/publisher.js");
    } catch (error) {}

    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
