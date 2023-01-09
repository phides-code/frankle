import { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { NUM_OF_GUESSES, WORD_LENGTH } from '../constants';
import { fetchWord, selectWord } from '../features/word/wordSlice';
import Keyboard from './Keyboard';
import Message from './Message';
import { selectGuessStatus } from '../features/guess/guessSlice';
import { selectGameStatus } from '../features/game/gameSlice';
import GameOverDialog from './GameOverDialog';

interface StyledLetterBoxProps {
    bgColor: string;
    fgColor: string;
}

const MainGrid = () => {
    const dispatch = useAppDispatch();
    const wordObject = useAppSelector(selectWord);
    const guessStatus = useAppSelector(selectGuessStatus);
    const gameStatus = useAppSelector(selectGameStatus);

    const gameOver = gameStatus.gameOver;
    const board = guessStatus.board;
    const wordFetchStatus = wordObject.status;
    const word = wordObject.wordObject.data;
    const httpStatus = wordObject.wordObject.httpStatus;
    const errorState = httpStatus !== 200 || wordFetchStatus === 'failed';
    const isLoading = wordFetchStatus === 'loading';

    const rows: number[] = Array(NUM_OF_GUESSES).fill(0);
    const letters: number[] = Array(WORD_LENGTH).fill(0);

    useEffect(() => {
        if (wordFetchStatus === 'idle' && word.length === 0) {
            console.log('fetching word');
            dispatch(fetchWord());
        }
    }, [wordFetchStatus, word, dispatch]);

    console.log('*** got word: ');
    console.log(word);

    if (errorState) {
        return <>Something went wrong... please reload</>;
    }

    if (isLoading) {
        return <>...</>;
    }

    return (
        <>
            <Wrapper>
                <GuessRows>
                    {rows.map((_, row: number) => (
                        <GuessRowWrapper
                            key={Math.floor(Math.random() * 99999999)}
                        >
                            {letters.map((_, letterPosition: number) => {
                                const thisLetterBox =
                                    board[row][letterPosition];
                                return (
                                    <StyledLetterBox
                                        key={Math.floor(
                                            Math.random() * 99999999
                                        )}
                                        bgColor={thisLetterBox.bgColor}
                                        fgColor={thisLetterBox.fgColor}
                                        style={{
                                            transition:
                                                'background-color 1s, color 1s',
                                        }}
                                    >
                                        {thisLetterBox.letter}
                                    </StyledLetterBox>
                                );
                            })}
                        </GuessRowWrapper>
                    ))}
                </GuessRows>
                {gameOver ? <GameOverDialog /> : <Keyboard />}
            </Wrapper>
            <Message />
        </>
    );
};

const Wrapper = styled.div`
    border: 2px solid darkgray;
    display: flex;
    flex-direction: column;
`;

const GuessRows = styled.div``;

const GuessRowWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
`;

const StyledLetterBox = styled.div<StyledLetterBoxProps>`
    background-color: ${(props) => props.bgColor};
    color: ${(props) => props.fgColor};
    border: 2px solid darkgray;
    margin: 0.4rem;
    min-height: 4rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    align-content: stretch;
    font-size: xx-large;
`;

export default MainGrid;
