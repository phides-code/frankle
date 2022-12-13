import { useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { NUM_OF_GUESSES } from '../constants';
import { fetchWord, selectWord } from '../features/word/wordSlice';
import GuessRow from './GuessRow';

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
            <div>
                {errorState ? (
                    <>Something went wrong... click button</>
                ) : isLoading ? (
                    <>...</>
                ) : (
                    <>
                        {rows.map(() => (
                            <GuessRow
                                key={Math.floor(Math.random() * 999999)}
                            />
                        ))}
                    </>
                )}
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    border: 2px solid lime;
    display: flex;
    flex-direction: column;
`;

export default MainGrid;
