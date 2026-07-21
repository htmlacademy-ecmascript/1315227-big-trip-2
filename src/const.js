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

const DateFormat = {
  SHORT_DATE: 'MMM D',
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME_MINUTES: 'YYYY-MM-DDTHH:mm',
  TIME_ONLY: 'HH:mm',
  INPUT_DATE: 'DD/MM/YY',
  DAY_MONTH: 'D MMM'
};

const FilterType = {
  'EVERYTHING': 'everything',
  'FUTURE': 'future',
  'PRESENT': 'present',
  'PAST': 'past'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

export { TYPES, DateFormat, FilterType, SortType, UpdateType, UserAction };
