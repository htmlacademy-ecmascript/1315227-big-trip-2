import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DateRange, DurationRange } from '../const.js';
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

const getRandomDateInRange = (minDate, maxDate) => {
  const min = new Date(minDate).getTime();
  const max = new Date(maxDate).getTime();
  return new Date(min + Math.random() * (max - min));
};

const getRandomPointDates = () => {
  const dateFrom = getRandomDateInRange(DateRange.MIN, DateRange.MAX);
  const durationMs = (DurationRange.MIN_HOURS + Math.random() * (DurationRange.MAX_HOURS - DurationRange.MIN_HOURS)) * 60 * 60 * 1000;
  const dateTo = new Date(dateFrom.getTime() + durationMs);

  return {
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString()
  };
};

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

export { generateId, getRandomPointDates, formatPointDate, getDurationInPoint, isPointFuture, isPointPast, isPointPresent, sortPointPrice, sortPointTime, sortPointDay };
