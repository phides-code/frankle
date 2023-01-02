import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Rules from './components/Rules';
import MainGrid from './components/MainGrid';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Wrapper>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path='/' element={<MainGrid />} />
                    <Route path='/rules' element={<Rules />} />
                </Routes>
            </BrowserRouter>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    max-width: 24rem;
    min-width: 24rem;
    margin: 0 auto;
`;

export default App;
