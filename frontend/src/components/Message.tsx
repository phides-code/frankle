import { useEffect, useMemo, useState } from 'react';
// import styled from 'styled-components';
import { useAppSelector } from '../app/hooks';
import { selectGuessStatus } from '../features/guess/guessSlice';
import { WORD_LENGTH } from '../constants';
import { selectWord } from '../features/word/wordSlice';
import { selectGameStatus } from '../features/game/gameSlice';

const Message = () => {
    const guessStatus = useAppSelector(selectGuessStatus);
    const wordObject = useAppSelector(selectWord);
    const gameStatus = useAppSelector(selectGameStatus);

    const word = wordObject.wordObject.data;
    const validGuess = guessStatus.guessValidityObject.data;

    const noMessage = useMemo(() => ({ text: '', color: '' }), []);
    const invalidGuessMessage = useMemo(
        () => ({ text: 'Invalid guess', color: 'red' }),
        []
    );
    const lossMessage = useMemo(() => ({ text: word, color: 'red' }), [word]);
    const winMessage = useMemo(
        () => ({ text: 'Well done!', color: 'green' }),
        []
    );

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

    // return <Wrapper>{message.text}</Wrapper>;
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

// const Wrapper = styled.div`
//     color: red;
// `;

export default Message;
