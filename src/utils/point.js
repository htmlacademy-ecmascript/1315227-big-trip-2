import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const formatPointDate = (date, format) => date ? dayjs(date).format(format) : '';
const generateId = () => crypto.randomUUID();
const isPointFuture = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());
const isPointPast = (dateTo) => dayjs(dateTo).isBefore(dayjs());
const isPointPresent = (dateFrom, dateTo) => dayjs(dateFrom).isSameOrBefore(dayjs()) && dayjs(dateTo).isSameOrAfter(dayjs());

const getDurationInPoint = (dateFrom, dateTo) => {
  const timeDuration = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const days = timeDuration.days();
  const hours = timeDuration.hours();
  const minutes = timeDuration.minutes();
  const totalMinutes = timeDuration.asMinutes();

  const pad = (num) => String(num).padStart(2, '0');

  if (totalMinutes < 60) {
    return `${pad(minutes)}M`;
  }

  if (days === 0) {
    return `${pad(hours)}H ${pad(minutes)}M`;
  }

  return `${pad(days)}D ${pad(hours)}H ${pad(minutes)}M`;
};

const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortPointTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return durationB - durationA;
};

const getOffersByType = (type, offers) => {
  const offerGroup = offers.find((group) => group.type === type.toLowerCase());
  const offersByType = offerGroup?.offers ?? [];

  return offersByType;
};

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const isOffersEqual = (arrA, arrB) => {
  if (!arrA || !arrB) {
    return false;
  }

  if (arrA.length !== arrB.length) {
    return false;
  }

  return arrA.every((item, index) => item === arrB[index]);
};

export { generateId, formatPointDate, getDurationInPoint, isPointFuture, isPointPast, isPointPresent, sortPointPrice, sortPointTime, sortPointDay, getOffersByType, isDatesEqual, isOffersEqual };
