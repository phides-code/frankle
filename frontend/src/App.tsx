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
    display: flex;
    flex-direction: column;
    width: 100vw;
    max-width: 25rem;
    margin: 0 auto;
`;

export default App;
