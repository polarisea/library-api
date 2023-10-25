const fs = require("fs");

module.exports.chooseArray = (src, count = 1) => {
  let randomValues = [];

  while (randomValues.length < count) {
    let randomIndex = Math.floor(Math.random() * src.length);
    let randomValue = src[randomIndex];

    if (!randomValues.includes(randomValue)) {
      randomValues.push(randomValue);
    }
  }
  return randomValues;
};

module.exports.removeItemFromArray = (src, item) => {
  const index = src.indexOf(item);
  if (index > -1) {
    src.splice(index, 1);
  }
};

module.exports.convertBase64ToImage = (base64String, fileName) => {
  // Remove the data:image/<fileType>;base64 prefix
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

  // Create a buffer from the base64 data
  const buffer = Buffer.from(base64Data, "base64");

  // Write the buffer to a file
  fs.writeFileSync(fileName, buffer);
};

module.exports.formatString = (str) => {
  const words = str.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join(" ");
};

module.exports.getUniqueArray = (arr) => {
  const uniqueArr = arr.filter((string, index) => {
    return arr.indexOf(string) === index;
  });

  return uniqueArr;
};
