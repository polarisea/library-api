const { faker } = require("@faker-js/faker");
const { chooseArray, removeItemFromArray } = require("../utils/index");

module.exports.categoryFactory = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      title: faker.person.jobType(),
    });
  }
  return data;
};

module.exports.authorFactory = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      name: faker.person.fullName(),
    });
  }
  return data;
};

module.exports.bookFactory = (count, authors, categories) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      name: faker.company.name(),
      authors: chooseArray(authors),
      description: faker.lorem.paragraph(),
      categories: chooseArray(categories),
      count: faker.number.int({ min: 1, max: 50 }),
      contracts: 0,
      votes: 0,
      createdAt: Date.now(),
    });
  }
  return data;
};

module.exports.contractFactory = (count, books, users) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      user: chooseArray(users)[0],
      book: chooseArray(books)[0],
      from: faker.date.past(),
      to: faker.date.future(),
      status: faker.number.int({ min: 0, max: 4 }),
      createdAt: Date.now(),
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
      fb: faker.string.numeric(16),
      name: faker.person.fullName(),
      role: 0,
      picture:
        "https://z-p3-scontent.fhan5-9.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c15.0.50.50a_cp0_dst-jpg_p50x50&_nc_cat=1&ccb=1-7&_nc_sid=12b3be&_nc_ohc=9H5hxV9gHkEAX8bOfuz&_nc_ht=z-p3-scontent.fhan5-9.fna&edm=AP4hL3IEAAAA&oh=00_AfAJtmw5jJzA79e_u-_RmwX_bQeklqVOJ5zgy9WCO_oeOQ&oe=654C6B59",
      createdAt: Date.now(),
    });
  }
  return data;
};
