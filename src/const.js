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
  INPUT_DATE: 'DD/MM/YY',
  DAY_MONTH: 'D MMM'
};

const BLANK_POINT = {
  id: '',
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

const DATEPICKER_CONFIG = {
  dateFormat: 'd/m/y H:i',
  enableTime: true,
  'time_24hr': true,
  locale: {firstDayOfWeek: 1}
};

const FilterType = {
  'EVERYTHING': 'Everything',
  'FUTURE': 'Future',
  'PRESENT': 'Present',
  'PAST': 'Past'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const SORT_TYPES = [
  {
    type: SortType.DAY,
    label: 'Day',
    disabled: false,
    dataAttribute: true
  },
  {
    type: SortType.EVENT,
    label: 'Event',
    disabled: true,
    dataAttribute: false
  },
  {
    type: SortType.TIME,
    label: 'Time',
    disabled: false,
    dataAttribute: true
  },
  {
    type: SortType.PRICE,
    label: 'Price',
    disabled: false,
    dataAttribute: true
  },
  {
    type: SortType.OFFER,
    label: 'Offers',
    disabled: true,
    dataAttribute: false
  }
];

const NoPointMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'Past — \'There are no past events now\''
};

export { DESCRIPTIONS, TYPES, CITIES, PRICES, OFFER_TITLES, OFFER_PRICES, DESTINATION_COUNT, SORT_TYPES, PictureRandomRange, PictureSrcRandomRange, OfferRandomRange, GroupOfferRandomRange, DateRange, DurationRange, DateFormat, FilterType, SortType, NoPointMessage, BLANK_POINT, DATEPICKER_CONFIG };
