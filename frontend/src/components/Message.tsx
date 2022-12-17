import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../app/hooks';
import { selectGuessStatus } from '../features/guess/guessSlice';

const Message = () => {
    const guessStatus = useAppSelector(selectGuessStatus);
    const validGuess = guessStatus.invalidGuessObject.data;

    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (validGuess === false) {
            setMessage('Invalid guess');

            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    }, [validGuess]);

    return <Wrapper>{message}</Wrapper>;
};

const Wrapper = styled.div`
    color: red;
`;

export default Message;
