import { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { NUM_OF_GUESSES, WORD_LENGTH } from '../constants';
import { fetchWord, selectWord } from '../features/word/wordSlice';
import Keyboard from './Keyboard';
import Message from './Message';
import { selectGuessStatus } from '../features/guess/guessSlice';

const MainGrid = () => {
    const dispatch = useAppDispatch();
    const wordObject = useAppSelector(selectWord);
    const guessStatus = useAppSelector(selectGuessStatus);

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
            console.log('running useEffect dispatch...');
            dispatch(fetchWord());
        }
    }, [wordFetchStatus, word, dispatch]);

    console.log('*** got word: ');
    console.log(word);

    return (
        <>
            <Wrapper>
                {errorState ? (
                    <>Something went wrong... please reload</>
                ) : isLoading ? (
                    <>...</>
                ) : (
                    <>
                        <GuessRows>
                            {rows.map((_, row: number) => (
                                <GuessRowWrapper
                                    key={Math.floor(Math.random() * 99999999)}
                                >
                                    {letters.map(
                                        (_, letterPosition: number) => (
                                            <StyledLetterBox
                                                key={Math.floor(
                                                    Math.random() * 99999999
                                                )}
                                            >
                                                {
                                                    board[row][letterPosition]
                                                        .letter
                                                }
                                            </StyledLetterBox>
                                        )
                                    )}
                                </GuessRowWrapper>
                            ))}
                        </GuessRows>
                        <Keyboard />
                    </>
                )}
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

const StyledLetterBox = styled.div`
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
