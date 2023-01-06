import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    fetchHighScores,
    selectHighScores,
} from '../features/highScores/highScoresSlice';

const HighScores = () => {
    const dispatch = useAppDispatch();
    const highScoresObject = useAppSelector(selectHighScores);

    const highScoresFetchStatus = highScoresObject.status;
    const highScores = highScoresObject.highScores.data;
    const httpStatus = highScoresObject.highScores.httpStatus;
    const errorState =
        (httpStatus !== 200 && httpStatus !== 201) ||
        highScoresFetchStatus === 'failed';
    const isLoading = highScoresFetchStatus === 'loading';

    useEffect(() => {
        console.log('fetching high scores');
        dispatch(fetchHighScores());
    }, [dispatch]);

    if (isLoading) {
        return <>...</>;
    }

    if (errorState) {
        return <div>Failed to load high scores</div>;
    }

    if (highScores.length === 0) {
        return <div>No high scores</div>;
    }

    return (
        <div>
            {highScores?.map((highScore) => (
                <div key={Math.floor(Math.random() * 99999999)}>
                    <div>{highScore.name}</div>
                    <div>{highScore.time}</div>
                    <div>{highScore.word}</div>
                    ***
                </div>
            ))}
        </div>
    );
};

export default HighScores;
