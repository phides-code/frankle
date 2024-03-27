import styled from 'styled-components';

const Rules = () => {
    return (
        <Wrapper>
            <div>No repeating letters in any one word.</div>
            <InnerWrapper>
                Plurals, verbs, some proper names and profanities are possible.
            </InnerWrapper>
            <InnerWrapper>
                The word list may include glaring omissions. Send word requests
                to frankle.wordgame@gmail.com
            </InnerWrapper>
            <InnerWrapper>Frankle (c) Philippe DeSousa 2022</InnerWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 0.5rem;
`;

const InnerWrapper = styled.div`
    margin-top: 1rem;
`;

export default Rules;
