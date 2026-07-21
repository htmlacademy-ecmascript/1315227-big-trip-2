import { getRandomArrayElement, getRandomInt } from '../utils/common.js';

const DESTINATION_IDS = ['dest-1', 'dest-2', 'dest-3'];

const CITIES = [
  'Chamonix',
  'Amsterdam',
  'Geneva'
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Aliquam id orci ut lectus varius viverra.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.'
];

const PictureRandomRange = {
  MIN: 0,
  MAX: 5
};

const PictureSrcRandomRange = {
  MIN: 1,
  MAX: 5
};

const createPicture = () => ({
  src: `img/photos/${getRandomInt(PictureSrcRandomRange.MIN, PictureSrcRandomRange.MAX)}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS)
});

const createMockDestinations = ()=> CITIES.map((city, index)=>({
  id: DESTINATION_IDS[index],
  description: getRandomArrayElement(DESCRIPTIONS),
  name: city,
  pictures: Array.from({ length: getRandomInt(PictureRandomRange.MIN, PictureRandomRange.MAX) }, createPicture)
}));

export { createMockDestinations, DESTINATION_IDS };
