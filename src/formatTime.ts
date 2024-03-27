import moment from 'moment';

const formatTime = (timeInMs: number) => {
    const duration = moment.duration(timeInMs);
    let timeString: string = '';

    if (timeInMs > 3600000) {
        timeString += duration.hours().toString().padStart(2, '0') + ':';
    }

    timeString +=
        duration.minutes().toString().padStart(2, '0') +
        ':' +
        duration.seconds().toString().padStart(2, '0') +
        ':' +
        duration.milliseconds().toString().padStart(3, '0');

    return timeString;
};

export default formatTime;
