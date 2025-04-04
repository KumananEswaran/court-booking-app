import moment from 'moment-timezone';

export const formatBookingDateTime = (booking) => {
	const convertedDate = moment
		.utc(booking.booking_date)
		.tz('Asia/Kuala_Lumpur');

	const localDate = convertedDate.format('YYYY-MM-DD');

	const fullDateTime = `${localDate} ${booking.booking_time}`;

	const bookingDateTime = moment.tz(
		fullDateTime,
		'YYYY-MM-DD hh:mm A',
		'Asia/Kuala_Lumpur'
	);

	return bookingDateTime.format('D MMMM YYYY [at] hh:mm A');
};

export const generateDates = () => {
	let dates = [];
	for (let i = 0; i < 6; i++) {
		const date = moment().add(i, 'days');
		dates.push({
			fullDate: date.format('YYYY-MM-DD'),
			display: date.format('ddd DD MMM'),
		});
	}
	return dates;
};

export const isTimeSlotBooked = (bookings, courtName, date, time) => {
	return bookings.some(
		(booking) =>
			booking.court_name === courtName &&
			moment(booking.booking_date).format('YYYY-MM-DD') === date &&
			booking.booking_time === time
	);
};

export const availableTimes = [
	'09:00 AM',
	'10:00 AM',
	'11:00 AM',
	'12:00 PM',
	'01:00 PM',
	'02:00 PM',
	'03:00 PM',
	'04:00 PM',
	'05:00 PM',
	'06:00 PM',
	'07:00 PM',
	'08:00 PM',
	'09:00 PM',
	'10:00 PM',
	'11:00 PM',
	'12:00 AM',
	'01:00 AM',
	'02:00 AM',
];
