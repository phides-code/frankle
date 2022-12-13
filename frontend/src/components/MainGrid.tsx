import { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { NUM_OF_GUESSES } from '../constants';
import { fetchWord, selectWord } from '../features/word/wordSlice';
import GuessRow from './GuessRow';
import Keyboard from './Keyboard';

const MainGrid = () => {
    const dispatch = useAppDispatch();
    const wordObject = useAppSelector(selectWord);

    const wordFetchStatus = wordObject.status;
    const word = wordObject.wordObject.data;
    const httpStatus = wordObject.wordObject.httpStatus;
    const errorState = httpStatus !== 200 || wordFetchStatus === 'failed';
    const isLoading = wordFetchStatus === 'loading';

    const rows: number[] = Array(NUM_OF_GUESSES).fill(0);

    useEffect(() => {
        if (wordFetchStatus === 'idle' && word.length === 0) {
            console.log('running useEffect dispatch...');
            dispatch(fetchWord());
        }
    }, [wordFetchStatus, word, dispatch]);

    console.log('*** got word: ');
    console.log(word);

    return (
        <Wrapper>
            {errorState ? (
                <>Something went wrong... please reload</>
            ) : isLoading ? (
                <>...</>
            ) : (
                <>
                    <GuessRows>
                        {rows.map(() => (
                            <GuessRow
                                key={Math.floor(Math.random() * 999999)}
                            />
                        ))}
                    </GuessRows>
                    <Keyboard />
                </>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    border: 2px solid darkgray;
    display: flex;
    flex-direction: column;
`;

const GuessRows = styled.div``;

export default MainGrid;
