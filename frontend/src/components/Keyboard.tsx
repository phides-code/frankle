import { MouseEvent } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    decrementLetterPosition,
    fetchValidity,
    incrementLetterPosition,
    resetGuessValidity,
    selectGuessStatus,
} from '../features/guess/guessSlice';
import { WORD_LENGTH } from '../constants';

const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '<'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'OK'],
];
interface KeyboardProps {
    letterBoxRefs: HTMLDivElement[][];
}

const Keyboard = ({ letterBoxRefs }: KeyboardProps) => {
    const dispatch = useAppDispatch();
    const guessStatus = useAppSelector(selectGuessStatus);

    const { currentRow, currentLetterPosition } = guessStatus;
    const validGuess = guessStatus.invalidGuessObject.data;

    let okKeyColor: string = '';

    if (validGuess) {
        okKeyColor = 'green';
    } else if (validGuess === false) {
        okKeyColor = 'red';
    } else {
        okKeyColor = 'darkgray';
    }

    const assembleGuess = () => {
        let guess = '';
        letterBoxRefs[currentRow].forEach((letterBox) => {
            guess += letterBox.innerText;
        });

        return guess;
    };

    const sendGuess = async () => {
        const guess = assembleGuess();

        console.log('Sending guess: ' + guess);
    };

    const processGuess = async () => {
        const guess = assembleGuess();

        console.log('processing guess: ' + guess);
        await dispatch(fetchValidity(guess));
    };

    const printLetter = (letter: string) => {
        const currentLetterBox =
            letterBoxRefs[currentRow][currentLetterPosition];

        if (currentLetterPosition < WORD_LENGTH) {
            currentLetterBox.innerText = letter;

            dispatch(incrementLetterPosition());

            if (currentLetterPosition === WORD_LENGTH - 1) {
                processGuess();
            }
        }
    };

    const doBackspace = () => {
        const previousLetterBox =
            letterBoxRefs[currentRow][currentLetterPosition - 1];

        if (currentLetterPosition > 0) {
            dispatch(resetGuessValidity());
            previousLetterBox.innerText = '';
            dispatch(decrementLetterPosition());
        }
    };

    const handleKeyPress = (event: MouseEvent<HTMLButtonElement>) => {
        const keyPressed: HTMLButtonElement = event.currentTarget;
        switch (keyPressed.value) {
            case 'OK':
                sendGuess();
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
                    {keyBoardRow.map((keyboardKey) => {
                        if (keyboardKey === 'OK') {
                            return (
                                <Key
                                    key={keyboardKey}
                                    onClick={handleKeyPress}
                                    value={keyboardKey}
                                    style={{
                                        color: okKeyColor,
                                    }}
                                    disabled={
                                        !(guessStatus.status === 'idle') ||
                                        !validGuess
                                    }
                                >
                                    {guessStatus.status === 'loading'
                                        ? '...'
                                        : 'OK'}
                                </Key>
                            );
                        }

                        return (
                            <Key
                                key={keyboardKey}
                                onClick={handleKeyPress}
                                value={keyboardKey}
                            >
                                {keyboardKey}
                            </Key>
                        );
                    })}
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
