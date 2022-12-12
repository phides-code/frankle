import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
    fetchWord,
    selectWord,
    selectWordStatus,
} from './features/word/wordSlice';

const App = () => {
    const word = useAppSelector(selectWord);
    const wordStatus = useAppSelector(selectWordStatus);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (wordStatus === 'idle' && word.length === 0) {
            console.log('running useEffect dispatch...');
            dispatch(fetchWord());
        }
    });

    return (
        <div>
            <div>{word}</div>
            <button
                onClick={() => {
                    dispatch(fetchWord());
                }}
            >
                new word
            </button>
        </div>
    );
};

export default App;
