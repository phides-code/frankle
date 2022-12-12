import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchWord, selectWord } from './features/word/wordSlice';

const App = () => {
    const dispatch = useAppDispatch();
    const wordObject = useAppSelector(selectWord);

    const wordFetchStatus = wordObject.status;
    const word = wordObject.wordObject.data;
    const httpStatus = wordObject.wordObject.httpStatus;
    const errorState = httpStatus !== 200 || wordFetchStatus === 'failed';

    useEffect(() => {
        if (wordFetchStatus === 'idle' && word.length === 0) {
            console.log('running useEffect dispatch...');
            dispatch(fetchWord());
        }
    }, [wordFetchStatus, word, dispatch]);

    return (
        <div>
            <div>
                {errorState ? (
                    <>Something went wrong... click button</>
                ) : (
                    <>{word}</>
                )}
            </div>
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
