import { getRandomArrayElement, generateId, getRandomInt } from '../utils.js';
import { TYPES, DESCRIPTIONS, CITIES, PictureRandomRange, PictureSrcRandomRange } from '../const.js';

const createPicture = () => ({
  src: `img/photos/${getRandomInt(PictureSrcRandomRange.MIN, PictureSrcRandomRange.MAX)}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS)
});

const createMockDestinations = ()=> TYPES.map(()=>({
  id: generateId(),
  description: getRandomArrayElement(DESCRIPTIONS),
  name: getRandomArrayElement(CITIES),
  pictures: Array.from({ length: getRandomInt(PictureRandomRange.MIN, PictureRandomRange.MAX) }, createPicture)
}));

export { createMockDestinations };
