const { readFileSync, writeFileSync } = require("fs");

const { getUniqueArray } = require("../utils");

try {
  module.exports.authors = JSON.parse(readFileSync("cache/db/author.json"));
} catch (error) {
  module.exports.authors = [];
}

try {
  module.exports.categories = JSON.parse(
    readFileSync("cache/db/category.json")
  );
} catch (error) {
  module.exports.categories = [];
}

try {
  module.exports.publishers = JSON.parse(
    readFileSync("cache/db/publisher.json")
  );
} catch (error) {
  module.exports.publishers = [];
}

module.exports.addAuthors = (newValues) => {
  this.authors = getUniqueArray([...this.authors, ...newValues]);
  try {
    writeFileSync("cache/db/author.json", JSON.stringify(this.authors), "utf8");
  } catch (error) {}
};

module.exports.addCatgories = (newValues) => {
  this.categories = getUniqueArray([...this.categories, ...newValues]);
  try {
    writeFileSync(
      "cache/db/category.json",
      JSON.stringify(this.categories),
      "utf8"
    );
  } catch (error) {}
};

module.exports.addPublishers = (newValues) => {
  this.publishers = getUniqueArray([...this.publishers, ...newValues]);
  try {
    writeFileSync(
      "cache/db/publisher.json",
      JSON.stringify(this.publishers),
      "utf8"
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports.createAuthors = (values) => {
  this.authors = values;
  try {
    writeFileSync("cache/db/author.json", JSON.stringify(values), "utf8");
  } catch (error) {}
};

module.exports.createCatgories = (values) => {
  this.categories = values;
  // console.log(categories);
  try {
    writeFileSync(
      "cache/db/category.json",
      JSON.stringify(this.categories),
      "utf8"
    );
  } catch (error) {}
};

module.exports.createPublishers = (values) => {
  this.publishers = values;
  try {
    writeFileSync(
      "cache/db/publisher.json",
      JSON.stringify(this.publishers),
      "utf8"
    );
  } catch (error) {
    console.log(error);
  }
};
