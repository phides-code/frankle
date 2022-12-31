import { MouseEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    colorizeAndAdvance,
    decrementLetterPosition,
    fetchValidity,
    incrementLetterPosition,
    incrementRow,
    resetGuessValidity,
    resetLetterPosition,
    selectGuessStatus,
    updateBoard,
} from '../features/guess/guessSlice';
import { WORD_LENGTH, NUM_OF_GUESSES } from '../constants';
import { selectWord } from '../features/word/wordSlice';

const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '<'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'OK'],
];

const Keyboard = () => {
    const dispatch = useAppDispatch();
    const guessStatus = useAppSelector(selectGuessStatus);
    const wordObject = useAppSelector(selectWord);
    const word = wordObject.wordObject.data;

    const [gameOver, setGameOver] = useState<boolean>(false);

    const { currentRow, currentLetterPosition } = guessStatus;
    const validGuess = guessStatus.guessValidityObject.data;

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

    // const colorize = useCallback(
    //     (guess: string, row: number) => {
    //         const guessArr = guess.split('');
    //         const wordArr = word.split('');

    //         guessArr.forEach((guessLetter, i) => {
    //             const thisLetterBox = letterBoxRefs[row][i];

    //             if (wordArr[i] === guessLetter) {
    //                 thisLetterBox.style.background = 'green';
    //                 thisLetterBox.style.color = 'white';
    //             } else if (wordArr.includes(guessLetter)) {
    //                 thisLetterBox.style.background = 'darkgoldenrod';
    //                 thisLetterBox.style.color = 'white';
    //             } else {
    //                 thisLetterBox.style.background = '#282828';
    //                 thisLetterBox.style.color = 'white';
    //             }
    //         });
    //     },
    //     [letterBoxRefs, word]
    // );

    const assembleGuess = useCallback(() => {
        let guess = '';

        guessStatus.board[currentRow].forEach((letterBox) => {
            guess += letterBox.letter;
        });

        return guess;
    }, [currentRow, guessStatus.board]);

    const endGame = (endType: 'win' | 'loss') => {
        console.log('game over: ' + endType);
        setGameOver(true);
    };

    const goToNextRow = () => {
        dispatch(incrementRow());
        dispatch(resetLetterPosition());
    };

    const checkGuess = () => {
        const guess = assembleGuess();
        console.log('checking guess: ' + guess);

        dispatch(
            colorizeAndAdvance({
                guess,
                word,
            })
        );

        // dispatch(addGuess(guess));
        // colorize(guess, currentRow);

        if (guess === word) {
            endGame('win');
        } else if (currentRow === NUM_OF_GUESSES - 1) {
            endGame('loss');
        } else {
            goToNextRow();
        }
    };

    const printLetter = (letter: string) => {
        if (currentLetterPosition < WORD_LENGTH) {
            dispatch(
                updateBoard({
                    row: currentRow,
                    letterPosition: currentLetterPosition,
                    value: letter,
                })
            );

            dispatch(incrementLetterPosition());
        }
    };

    const doBackspace = () => {
        if (currentLetterPosition > 0) {
            dispatch(resetGuessValidity());
            dispatch(
                updateBoard({
                    row: currentRow,
                    letterPosition: currentLetterPosition - 1,
                    value: '',
                })
            );
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
        const validateGuess = async () => {
            const guess = assembleGuess();

            await dispatch(fetchValidity(guess));
        };

        if (currentLetterPosition === WORD_LENGTH) {
            validateGuess();
        }
    }, [currentLetterPosition, assembleGuess, dispatch]);

    // useEffect(() => {
    //     const loadGuess = (guess: string, row: number) => {
    //         console.log('Loading guess on row ' + row + ': ' + guess);
    //         const guessArr = guess.split('');

    //         guessArr.forEach((guessLetter, i) => {
    //             const thisLetterBox = letterBoxRefs[row][i];

    //             thisLetterBox.innerText = guessLetter;
    //         });
    //     };

    //     if (guesses.length > 0 && word.length > 0) {
    //         console.log('Loading existing guesses: ');
    //         console.log(guesses);

    //         guesses.forEach((guess, row) => {
    //             loadGuess(guess, row);
    //             colorize(guess, row);
    //         });

    //         dispatch(resetLetterPosition());
    //     } else if (guesses.length === 0) {
    //         // remove colour from all squares
    //         letterBoxRefs.forEach((letterBoxRow) => {
    //             letterBoxRow.forEach((letterBox) => {
    //                 letterBox.innerText = '';
    //                 letterBox.style.color = 'darkgrey';
    //                 letterBox.style.background = 'black';
    //             });
    //         });
    //     }
    // }, [guesses, word.length, colorize, dispatch, letterBoxRefs]);

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
                                        !validGuess ||
                                        currentLetterPosition !== WORD_LENGTH
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
