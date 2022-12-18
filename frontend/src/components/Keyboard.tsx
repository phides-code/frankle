import { MouseEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    addGuess,
    decrementLetterPosition,
    fetchValidity,
    incrementLetterPosition,
    incrementRow,
    resetGuessValidity,
    resetLetterPosition,
    selectGuessStatus,
} from '../features/guess/guessSlice';
import { WORD_LENGTH, NUM_OF_GUESSES } from '../constants';
import { selectWord } from '../features/word/wordSlice';

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
    const wordObject = useAppSelector(selectWord);
    const word = wordObject.wordObject.data;

    const [gameOver, setGameOver] = useState<boolean>(false);

    const { currentRow, currentLetterPosition } = guessStatus;
    const validGuess = guessStatus.guessValidityObject.data;
    const guesses = guessStatus.guesses;

    let okKeyColor: string = '';

    if (
        validGuess &&
        guessStatus.status === 'idle' &&
        currentLetterPosition === WORD_LENGTH &&
        !gameOver
    ) {
        okKeyColor = 'green';
    } else if (validGuess === false) {
        okKeyColor = 'red';
    } else {
        okKeyColor = 'darkgray';
    }

    const colorize = useCallback(
        (guess: string, row: number) => {
            const guessArr = guess.split('');
            const wordArr = word.split('');

            guessArr.forEach((guessLetter, i) => {
                const thisLetterBox = letterBoxRefs[row][i];

                if (wordArr[i] === guessLetter) {
                    thisLetterBox.style.background = 'green';
                    thisLetterBox.style.color = 'white';
                } else if (wordArr.includes(guessLetter)) {
                    thisLetterBox.style.background = 'darkgoldenrod';
                    thisLetterBox.style.color = 'white';
                } else {
                    thisLetterBox.style.background = '#282828';
                    thisLetterBox.style.color = 'white';
                }
            });
        },
        [letterBoxRefs, word]
    );

    const assembleGuess = () => {
        let guess = '';
        letterBoxRefs[currentRow].forEach((letterBox) => {
            guess += letterBox.innerText;
        });

        return guess;
    };

    const endGame = (endType: 'win' | 'loss') => {
        console.log('game over: ' + endType);
        setGameOver(true);
        // show reset button
    };

    const goToNextRow = () => {
        dispatch(incrementRow());
        dispatch(resetLetterPosition());
    };

    const checkGuess = () => {
        const guess = assembleGuess();

        dispatch(addGuess(guess));
        colorize(guess, currentRow);

        if (guess === word) {
            endGame('win');
        } else if (currentRow === NUM_OF_GUESSES - 1) {
            endGame('loss');
        } else {
            goToNextRow();
        }
    };

    const validateGuess = async () => {
        const guess = assembleGuess();

        console.log('validating guess: ' + guess);
        await dispatch(fetchValidity(guess));
    };

    const printLetter = (letter: string) => {
        const currentLetterBox =
            letterBoxRefs[currentRow][currentLetterPosition];

        if (currentLetterPosition < WORD_LENGTH) {
            currentLetterBox.innerText = letter;

            dispatch(incrementLetterPosition());

            if (currentLetterPosition === WORD_LENGTH - 1) {
                validateGuess();
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
        if (!gameOver) {
            const keyPressed: HTMLButtonElement = event.currentTarget;
            switch (keyPressed.value) {
                case 'OK':
                    checkGuess();
                    break;
                case '<':
                    doBackspace();
                    break;
                default:
                    printLetter(keyPressed.value);
            }
        }
    };

    useEffect(() => {
        const loadGuess = (guess: string, row: number) => {
            console.log('Loading guess on row ' + row + ': ' + guess);
            const guessArr = guess.split('');

            guessArr.forEach((guessLetter, i) => {
                const thisLetterBox = letterBoxRefs[row][i];

                thisLetterBox.innerText = guessLetter;
            });
        };

        if (guesses.length > 0 && word.length > 0) {
            console.log('Loading existing guesses: ');
            console.log(guesses);

            guesses.forEach((guess, row) => {
                loadGuess(guess, row);
                colorize(guess, row);
            });

            dispatch(resetLetterPosition());
        }
    }, [guesses, word.length, colorize, dispatch, letterBoxRefs]);

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
