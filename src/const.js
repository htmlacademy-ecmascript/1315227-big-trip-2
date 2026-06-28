const PRICES = [1100, 2300, 2100, 900, 450];
const OFFER_PRICES = [120, 100, 90, 80];
const DESTINATION_COUNT = 10;

const CITIES = [
  'Chamonix',
  'Amsterdam',
  'Geneva'
];

const OFFER_TITLES = [
  'Add luggage',
  'Upgrade to a business class',
  'Add breakfast',
  'Lunch in city',
  'Book tickets'
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Aliquam id orci ut lectus varius viverra.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.'
];

const TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];

const PictureRandomRange = {
  MIN: 0,
  MAX: 5
};

const PictureSrcRandomRange = {
  MIN: 1,
  MAX: 5
};

const OfferRandomRange = {
  MIN: 0,
  MAX: 4
};

const GroupOfferRandomRange = {
  MIN: 1,
  MAX: 5
};

const DateRange = {
  MIN: '2019-07-10T22:55:56.845Z',
  MAX: '2019-12-11T11:22:13.375Z'
};

const DurationRange = {
  MIN_HOURS: 1,
  MAX_HOURS: 72
};

const DateFormat = {
  SHORT_DATE: 'MMM D',
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME_MINUTES: 'YYYY-MM-DDTHH:mm',
  TIME_ONLY: 'HH:mm',
  INPUT_DATE: 'DD/MM/YY'
};

export { DESCRIPTIONS, TYPES, CITIES, PRICES, OFFER_TITLES, OFFER_PRICES, DESTINATION_COUNT, PictureRandomRange, PictureSrcRandomRange, OfferRandomRange, GroupOfferRandomRange, DateRange, DurationRange, DateFormat };
