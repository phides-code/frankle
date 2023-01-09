import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import { useAppDispatch, useAppSelector } from '../app/hooks';
// import { selectWord } from '../features/word/wordSlice';
// import {
//     addHighScore,
//     fetchHighScores,
// } from '../features/highScores/highScoresSlice';

const Navbar = () => {
    // const dispatch = useAppDispatch();
    // const wordObject = useAppSelector(selectWord);
    // const word = wordObject.wordObject.data;

    return (
        <Wrapper>
            <StyledLink to='/'>Frankle</StyledLink>
            <StyledLink to='/highscores'>High Scores</StyledLink>
            <StyledLink to='/rules'>Rules</StyledLink>
            {/* <button
                onClick={async () => {
                    await dispatch(
                        addHighScore({
                            name: 'Don',
                            time: 12345,
                            word: word,
                        })
                    );
                    dispatch(fetchHighScores());
                }}
            >
                post high score
            </button> */}
        </Wrapper>
    );
};

const StyledLink = styled(Link)`
    color: darkgray;
    text-decoration: none;

    &:active {
        color: red;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
    margin-bottom: 1rem;
    margin-top: 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
`;

export default Navbar;
