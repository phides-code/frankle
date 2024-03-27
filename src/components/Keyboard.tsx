import { MouseEvent, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    decrementLetterPosition,
    fetchValidity,
    incrementLetterPosition,
    incrementRow,
    resetGuessState,
    resetGuessValidity,
    resetLetterPosition,
    selectGuessStatus,
    updateLetterBoxColor,
    updateLetterBoxLetter,
} from '../features/guess/guessSlice';
import { WORD_LENGTH, NUM_OF_GUESSES } from '../constants';
import { fetchWord, selectWord } from '../features/word/wordSlice';
import {
    endGame,
    resetGameState,
    selectGameStatus,
} from '../features/game/gameSlice';
import {
    LetterKeysState,
    colorizeLetterkey,
    resetLetterKeysState,
    selectLetterKeyStatus,
} from '../features/letterKeys/letterKeysSlice';
import { setEndTime, setStartTime } from '../features/time/timeSlice';
import resetIcon from '../reset.svg';
import greenResetIcon from '../reset-green.svg';

const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '<'],
    ['reset', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'OK'],
];

const Keyboard = () => {
    const dispatch = useAppDispatch();
    const guessStatus = useAppSelector(selectGuessStatus);
    const gameStatus = useAppSelector(selectGameStatus);
    const letterKeyStatus = useAppSelector(selectLetterKeyStatus);
    const wordState = useAppSelector(selectWord);
    const word = wordState.wordObject.data as string;

    const { currentRow, currentLetterPosition } = guessStatus;
    const validGuess = guessStatus.guessValidityObject.data;

    let okKeyColor: string = '';

    if (
        validGuess &&
        guessStatus.status === 'idle' &&
        currentLetterPosition === WORD_LENGTH &&
        !gameStatus.gameOver
    ) {
        okKeyColor = 'green';
    } else if (validGuess === false) {
        okKeyColor = 'red';
    } else {
        okKeyColor = 'darkgray';
    }

    const assembleGuess = useCallback(() => {
        let guess = '';

        guessStatus.board[currentRow].forEach((letterBox) => {
            guess += letterBox.letter;
        });

        return guess;
    }, [currentRow, guessStatus.board]);

    const goToNextRow = () => {
        dispatch(incrementRow());
        dispatch(resetLetterPosition());
    };

    const checkGuess = () => {
        if (currentRow === 0) {
            // start the clock
            dispatch(setStartTime(Date.now()));
        }

        const guess = assembleGuess();

        for (let i = 0; i < WORD_LENGTH; i++) {
            const thisLetter = guess[i];
            let bgColor = '';

            if (word[i] === thisLetter) {
                bgColor = 'green';
            } else if (word.includes(thisLetter)) {
                bgColor = 'goldenrod';
            } else {
                bgColor = '#282828';
            }

            dispatch(
                updateLetterBoxColor({
                    row: currentRow,
                    letterPosition: i,
                    bgColor: bgColor,
                })
            );
            dispatch(
                colorizeLetterkey({
                    letterKey: thisLetter as keyof LetterKeysState['colors'],
                    bgColor: bgColor,
                })
            );
        }

        if (guess === word) {
            dispatch(endGame('win'));
            // stop the clock
            dispatch(setEndTime(Date.now()));
        } else if (currentRow === NUM_OF_GUESSES - 1) {
            dispatch(endGame('loss'));
        } else {
            goToNextRow();
        }
    };

    const printLetter = (letter: string) => {
        if (currentLetterPosition < WORD_LENGTH) {
            dispatch(
                updateLetterBoxLetter({
                    row: currentRow,
                    letterPosition: currentLetterPosition,
                    letter: letter,
                })
            );

            dispatch(incrementLetterPosition());
        }
    };

    const doBackspace = () => {
        if (currentLetterPosition > 0) {
            dispatch(resetGuessValidity());
            dispatch(
                updateLetterBoxLetter({
                    row: currentRow,
                    letterPosition: currentLetterPosition - 1,
                    letter: '',
                })
            );
            dispatch(decrementLetterPosition());
        }
    };

    const resetGame = () => {
        console.log('resetting game');
        dispatch(resetGameState());
        dispatch(resetGuessState());
        dispatch(fetchWord());
        dispatch(resetLetterKeysState());
    };

    const handleKeyPress = (event: MouseEvent<HTMLButtonElement>) => {
        const keyPressed: HTMLButtonElement = event.currentTarget;

        if (keyPressed.value === 'reset') {
            resetGame();
        } else if (!gameStatus.gameOver) {
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
                                        currentLetterPosition !== WORD_LENGTH ||
                                        gameStatus.gameOver
                                    }
                                >
                                    {guessStatus.status === 'loading'
                                        ? '...'
                                        : 'OK'}
                                </Key>
                            );
                        }
                        if (keyboardKey === 'reset') {
                            return (
                                <Key
                                    key={keyboardKey}
                                    onClick={handleKeyPress}
                                    value='reset'
                                    title='Reset game'
                                >
                                    <img
                                        src={
                                            gameStatus.gameOver
                                                ? greenResetIcon
                                                : resetIcon
                                        }
                                        alt='reset'
                                    />
                                </Key>
                            );
                        }

                        const bgColor =
                            letterKeyStatus.colors[
                                keyboardKey as keyof LetterKeysState['colors']
                            ]?.bgColor;

                        const fgColor =
                            letterKeyStatus.colors[
                                keyboardKey as keyof LetterKeysState['colors']
                            ]?.fgColor;

                        return (
                            <Key
                                key={keyboardKey}
                                onClick={handleKeyPress}
                                value={keyboardKey}
                                style={{
                                    backgroundColor: bgColor,
                                    color: fgColor,
                                    transition: 'background-color 1s, color 1s',
                                }}
                                disabled={gameStatus.gameOver}
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
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin-top: 0.4rem;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-shrink: 0;
    justify-content: center;
    margin-bottom: 0.4rem;
`;

const Key = styled.button`
    border-radius: 5px;
    padding: 0;
    flex: 1;
    margin-right: 0.1rem;
    margin-left: 0.1rem;
    font-size: large;
    height: 3rem;
    background: black;
    color: darkgray;
`;

export default Keyboard;
