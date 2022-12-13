import styled from 'styled-components';
import { WORD_LENGTH } from '../constants';
import LetterBox from './LetterBox';

const GuessRow = () => {
    const letters: number[] = Array(WORD_LENGTH).fill(0);

    return (
        <Wrapper>
            {letters.map(() => (
                <LetterBox key={Math.floor(Math.random() * 999999)} />
            ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
`;

export default GuessRow;
