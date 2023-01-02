import styled from 'styled-components';

const About = () => {
    return (
        <Wrapper>
            <div>{'Frankle (c) Philippe DeSousa 2022'}</div>
            <InnerWrapper>No repeating letters.</InnerWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin: 0.5rem;
`;

const InnerWrapper = styled.div`
    margin-top: 1rem;
`;

export default About;
