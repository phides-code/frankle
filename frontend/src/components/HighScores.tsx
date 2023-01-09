import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    fetchHighScores,
    selectHighScores,
} from '../features/highScores/highScoresSlice';
import styled from 'styled-components';
import formatTime from '../formatTime';

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
                <HighScoreWrapper key={Math.floor(Math.random() * 99999999)}>
                    <Name>{highScore.name}</Name>
                    <Time>{formatTime(highScore.time)}</Time>
                    <Word>{highScore.word}</Word>
                </HighScoreWrapper>
            ))}
        </div>
    );
};

const Name = styled.div``;
const Time = styled.div``;
const Word = styled.div``;

const HighScoreWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: stretch;
    align-content: stretch;
`;

export default HighScores;
