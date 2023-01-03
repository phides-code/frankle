import { MouseEvent, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    decrementLetterPosition,
    fetchValidity,
    incrementLetterPosition,
    incrementRow,
    resetGuessValidity,
    resetLetterPosition,
    selectGuessStatus,
    updateLetterBoxColor,
    updateLetterBoxLetter,
} from '../features/guess/guessSlice';
import { WORD_LENGTH, NUM_OF_GUESSES } from '../constants';
import { selectWord } from '../features/word/wordSlice';
import { endGame, selectGameStatus } from '../features/game/gameSlice';
import {
    LetterKeysState,
    colorizeLetterkey,
    selectLetterKeyStatus,
} from '../features/letterKeys/letterKeysSlice';
import { setEndTime, setStartTime } from '../features/time/timeSlice';

const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '<'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'OK'],
];

const Keyboard = () => {
    const dispatch = useAppDispatch();
    const guessStatus = useAppSelector(selectGuessStatus);
    const wordObject = useAppSelector(selectWord);
    const gameStatus = useAppSelector(selectGameStatus);
    const letterKeyStatus = useAppSelector(selectLetterKeyStatus);

    const word = wordObject.wordObject.data;
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
        console.log('checking guess: ' + guess);

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

    const handleKeyPress = (event: MouseEvent<HTMLButtonElement>) => {
        if (!gameStatus.gameOver) {
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
    /* flex-shrink: 0; */
    /* justify-content: space-between; */
    /* align-items: stretch; */
    /* align-content: stretch; */
    margin-top: 0.4rem;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-shrink: 0;
    /* justify-content: space-between; */
    justify-content: center;
    /* align-items: center; */
    /* align-content: stretch; */
    /* align-content: center; */
    margin-bottom: 0.4rem;
    /* margin-left: 0.2rem;
    margin-right: 0.2rem; */
    /* max-width: 2rem; */
    /* border: 1px solid lime; */
`;

const Key = styled.button`
    /* flex-shrink: 0; */
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    margin-right: 0.1rem;
    margin-left: 0.1rem;
    font-size: large;
    height: 3rem;
    background: black;
    color: darkgray;
    /* width: 100%; */
    /* max-width: 2rem; */
    width: auto;
    border: 1px solid darkgray;
`;

export default Keyboard;
