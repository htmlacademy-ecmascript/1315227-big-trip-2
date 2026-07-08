const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const updateItem = (items, update)=> items.map((item) => item.id === update.id ? update : item);

export { getRandomArrayElement, getRandomInt, updateItem };
