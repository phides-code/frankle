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
        return <div>Failed to load best times</div>;
    }

    if (highScores.length === 0) {
        return <div>No best times</div>;
    }

    return (
        <div>
            <HighScoreHeader>
                <Rank></Rank>
                <Name>Name</Name>
                <Time>Time</Time>
                <Word>Word</Word>
            </HighScoreHeader>

            {highScores?.map((highScore, i) => (
                <HighScoreWrapper key={Math.floor(Math.random() * 99999999)}>
                    <Rank>{i + 1}</Rank>
                    <Name>{highScore.name}</Name>
                    <Time>{formatTime(highScore.time)}</Time>
                    <Word>{highScore.word}</Word>
                </HighScoreWrapper>
            ))}
        </div>
    );
};

const HighScoreText = styled.div`
    flex: 1;
    text-align: left;
`;

const Rank = styled(HighScoreText)`
    max-width: 2rem;
`;
const Name = styled(HighScoreText)``;
const Time = styled(HighScoreText)``;
const Word = styled(HighScoreText)``;

const HighScoreWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
`;

const HighScoreHeader = styled(HighScoreWrapper)`
    border-bottom: 1px solid darkgrey;
    font-weight: bold;
`;

export default HighScores;
