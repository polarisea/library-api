const { faker } = require("@faker-js/faker");
const { chooseArray, getUniqueArray, formatString } = require("../utils");

module.exports.categoryFactory = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(faker.animal.type());
  }
  return getUniqueArray(data.map((v) => formatString(v)));
};

module.exports.authorFactory = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(faker.person.fullName());
  }
  return getUniqueArray(data.map((v) => formatString(v)));
};

module.exports.publisherFactory = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(faker.company.name());
  }
  return getUniqueArray(data.map((v) => formatString(v)));
};

module.exports.bookFactory = (count, authors, categories, publishers) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const count = faker.number.int({ min: 5, max: 25 });
    data.push({
      name: faker.company.name(),
      authors: chooseArray(authors, faker.number.int({ min: 1, max: 3 })),
      description: faker.lorem.paragraph(),
      categories: chooseArray(categories, faker.number.int({ min: 1, max: 3 })),
      publishers: chooseArray(publishers, faker.number.int({ min: 1, max: 3 })),
      lateReturnFine: faker.number.int({ min: 1, max: 10 }) * 5000,
      damagedBookFine: faker.number.int({ min: 15, max: 30 }) * 5000,
      count,
      borrowedCount: faker.number.int({ min: 0, max: count }),
      brokenCount: faker.number.int({ min: 0, max: count }),
      contracts: faker.number.int({ min: 0, max: 100 }),
      votes: 0,
      createdAt: new Date(faker.date.past()),
    });
    data[i].indexedContent =
      data[i].name +
      " " +
      [...data[i].categories, ...data[i].authors, ...data[i].publishers].join(
        " "
      );
  }
  return data;
};

module.exports.contractFactory = (count, users, books) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const createdAt = getRandomDateWithinLast12Months();
    data.push({
      user: chooseArray(users)[0]._id,
      book: chooseArray(books)[0]._id,
      from: createdAt,
      to: new Date(faker.date.anytime()),
      status: faker.number.int({ min: 0, max: 3 }),
      createdAt,
    });
  }
  return data;
};

module.exports.voteFactory = (count, books, users) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      user: chooseArray(users)[0],
      book: chooseArray(books)[0],
      value: chooseArray([-1, 1])[0],
    });
  }
  return data;
};

module.exports.userFactory = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      name: faker.person.fullName(),
      role: 100,
      createdAt: new Date(faker.date.past()),
      contracts: faker.number.int({ min: 0, max: 50 }),
    });
  }
  return data;
};

function getRandomDateWithinLast12Months() {
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(
    startDate.getMonth() - faker.number.int({ min: 0, max: 12 })
  );

  return startDate;
}
