import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectGuessStatus } from '../features/guess/guessSlice';
import { WORD_LENGTH } from '../constants';
import { selectWord } from '../features/word/wordSlice';
import { selectGameStatus } from '../features/game/gameSlice';
import { selectTimeStatus } from '../features/time/timeSlice';
import formatTime from '../formatTime';
import styled from 'styled-components';

interface WrapperProps {
    messageColor: string;
}

const Message = () => {
    const guessStatus = useAppSelector(selectGuessStatus);
    const wordObject = useAppSelector(selectWord);
    const gameStatus = useAppSelector(selectGameStatus);
    const times = useAppSelector(selectTimeStatus);

    const word = wordObject.wordObject.data;
    const validGuess = guessStatus.guessValidityObject.data;

    const noMessage = useMemo(() => ({ text: '', color: '' }), []);

    const invalidGuessMessage = useMemo(
        () => ({ text: 'Invalid guess', color: 'red' }),
        []
    );

    const lossMessage = useMemo(
        () => ({ text: 'The word was ' + word, color: 'red' }),
        [word]
    );

    const winMessage = useMemo(() => {
        const { startTime, endTime } = times;
        const timeInMs = endTime - startTime;

        return {
            text: 'Well done! Your time was ' + formatTime(timeInMs),
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

    return <Wrapper messageColor={message.color}>{message.text}</Wrapper>;
};

const Wrapper = styled.div<WrapperProps>`
    margin-left: 0.3rem;
    margin-top: 0.5rem;
    min-height: 1.2rem;
    color: ${(props) => props.messageColor};
`;

export default Message;
