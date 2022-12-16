import { MouseEvent } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    decrementLetterPosition,
    incrementLetterPosition,
    selectGuessStatus,
} from '../features/guess/guessSlice';
import { WORD_LENGTH } from '../constants';

const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '<'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '✔️'],
];
interface KeyboardProps {
    letterBoxRefs: HTMLDivElement[][];
}

const Keyboard = ({ letterBoxRefs }: KeyboardProps) => {
    const guessStatus = useAppSelector(selectGuessStatus);
    const dispatch = useAppDispatch();

    const { currentRow, currentLetterPosition } = guessStatus;

    const printLetter = (letter: string) => {
        const currentLetterBox =
            letterBoxRefs[currentRow][currentLetterPosition];

        if (currentLetterPosition < WORD_LENGTH) {
            currentLetterBox.innerText = letter;

            dispatch(incrementLetterPosition());
        }
    };

    const doBackspace = () => {
        const previousLetterBox =
            letterBoxRefs[currentRow][currentLetterPosition - 1];

        if (currentLetterPosition > 0) {
            previousLetterBox.innerText = '';
            dispatch(decrementLetterPosition());
        }
    };

    const processGuess = () => {
        if (currentLetterPosition === WORD_LENGTH) {
            console.log('processing guess');
            // check validity
        }
    };

    const handleKeyPress = (event: MouseEvent<HTMLButtonElement>) => {
        const keyPressed: HTMLButtonElement = event.currentTarget;

        switch (keyPressed.value) {
            case '✔️':
                processGuess();
                break;
            case '<':
                doBackspace();
                break;
            default:
                printLetter(keyPressed.value);
        }
    };

    return (
        <Wrapper>
            {keyboardLayout.map((keyBoardRow) => (
                <Row key={keyBoardRow[0]}>
                    {keyBoardRow.map((keyboardKey) => (
                        <Key
                            key={keyboardKey}
                            onClick={handleKeyPress}
                            value={keyboardKey}
                        >
                            {keyboardKey}
                        </Key>
                    ))}
                </Row>
            ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
    margin-top: 0.4rem;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    align-content: stretch;
    margin-bottom: 0.4rem;
`;

const Key = styled.button`
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    font-size: 1.2rem;
    height: 3rem;
    background: black;
    color: darkgray;
    min-width: 1.8rem;
    border: 1px solid darkgray;
`;

export default Keyboard;
