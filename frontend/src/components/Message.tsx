import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectGuessStatus } from '../features/guess/guessSlice';
import { WORD_LENGTH } from '../constants';
import { selectWord } from '../features/word/wordSlice';
import { selectGameStatus } from '../features/game/gameSlice';
import { selectTimeStatus } from '../features/time/timeSlice';
import moment from 'moment';

const Message = () => {
    const guessStatus = useAppSelector(selectGuessStatus);
    const wordObject = useAppSelector(selectWord);
    const gameStatus = useAppSelector(selectGameStatus);
    const times = useAppSelector(selectTimeStatus);

    const word = wordObject.wordObject.data;
    const validGuess = guessStatus.guessValidityObject.data;

    const formatTime = (timeInMs: number) => {
        const thisTime = moment.duration(timeInMs);
        let timeString: string = '';

        if (timeInMs > 3600000) {
            timeString += thisTime.hours().toString() + ':';
        }

        timeString +=
            thisTime.minutes().toString() +
            ':' +
            thisTime.seconds().toString() +
            ':' +
            thisTime.milliseconds().toString();

        return timeString;
    };

    const noMessage = useMemo(() => ({ text: '', color: '' }), []);

    const invalidGuessMessage = useMemo(
        () => ({ text: 'Invalid guess', color: 'red' }),
        []
    );

    const lossMessage = useMemo(() => ({ text: word, color: 'red' }), [word]);

    const winMessage = useMemo(() => {
        const { startTime, endTime } = times;

        let thisGameTime: string = '';

        if (!!startTime && !!endTime) {
            console.log('endTime: ' + endTime);
            console.log('startTime: ' + startTime);
            console.log('diff: ');
            console.log((endTime - startTime).toString());
            thisGameTime = formatTime(endTime - startTime);
        }
        return {
            text: 'Well done! Your time: ' + thisGameTime,
            color: 'green',
        };
    }, [times]);

    const [message, setMessage] = useState<{
        text: string;
        color: string;
    }>(noMessage);

    useEffect(() => {
        if (
            validGuess === false &&
            guessStatus.currentLetterPosition === WORD_LENGTH
        ) {
            setMessage(invalidGuessMessage);

            setTimeout(() => {
                setMessage(noMessage);
            }, 3000);
        }
    }, [validGuess, guessStatus, invalidGuessMessage, noMessage]);

    useEffect(() => {
        switch (gameStatus.gameResult) {
            case 'loss':
                setMessage(lossMessage);
                break;
            case 'win':
                setMessage(winMessage);
                break;
            default:
                setMessage(noMessage);
        }
    }, [gameStatus.gameResult, word, lossMessage, noMessage, winMessage]);

    return (
        <div
            style={{
                color: message.color,
            }}
        >
            {message.text}
        </div>
    );
};

export default Message;
