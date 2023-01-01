import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../app/hooks';
import { selectGuessStatus } from '../features/guess/guessSlice';
import { WORD_LENGTH } from '../constants';
import { selectWord } from '../features/word/wordSlice';

const Message = () => {
    const guessStatus = useAppSelector(selectGuessStatus);
    const wordObject = useAppSelector(selectWord);
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

    return <Wrapper>{message}</Wrapper>;
};

const Wrapper = styled.div`
    color: red;
`;

export default Message;
