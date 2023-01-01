import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../app/hooks';
import { selectGuessStatus } from '../features/guess/guessSlice';
import { WORD_LENGTH } from '../constants';
import { selectWord } from '../features/word/wordSlice';
import { selectGameStatus } from '../features/game/gameSlice';

const Message = () => {
    const guessStatus = useAppSelector(selectGuessStatus);
    const wordObject = useAppSelector(selectWord);
    const gameStatus = useAppSelector(selectGameStatus);
    const [message, setMessage] = useState<string>('');

    const word = wordObject.wordObject.data;

    const validGuess = guessStatus.guessValidityObject.data;

    useEffect(() => {
        if (
            validGuess === false &&
            guessStatus.currentLetterPosition === WORD_LENGTH
        ) {
            setMessage('Invalid guess');

            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    }, [validGuess, guessStatus]);

    useEffect(() => {
        switch (gameStatus.gameResult) {
            case 'loss':
                // use red here
                setMessage(word);
                break;
            case 'win':
                // use green here
                setMessage('Well done.');
                break;
            default:
                setMessage('');
        }
    }, [gameStatus.gameResult, word]);

    return <Wrapper>{message}</Wrapper>;
};

const Wrapper = styled.div`
    color: red;
`;

export default Message;
