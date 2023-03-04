import { add } from "date-fns";

const plusRandom = (current: number, base: number) =>
	current + Math.round(Math.random() * base);

const generate = (startDate: Date, endDate: Date, baseValue = 0, velocity = 100) => {
	let cursor = startDate;
	const data = [];
	let currentValue = baseValue;
	while (endDate > cursor) {
		currentValue = plusRandom(currentValue, velocity);
		data.push({
			date: cursor,
			val: currentValue
		});
		cursor = add(cursor, { days: 1 });
	}
	return data;
};

const days = (startDate: Date, num = 1) =>
	generate(startDate, add(startDate, { days: num }));
const months = (startDate: Date, num = 1) =>
	generate(startDate, add(startDate, { months: num }));
const years = (startDate: Date, num = 1) =>
	generate(startDate, add(startDate, { years: num }));

export default {
	generate,
	days,
	months,
	years
};
