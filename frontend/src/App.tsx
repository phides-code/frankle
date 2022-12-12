import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import About from './About';
import MainGrid from './MainGrid';
import Navbar from './Navbar';

const App = () => {
    return (
        <Wrapper>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path='/' element={<MainGrid />} />
                    <Route path='/about' element={<About />} />
                </Routes>
            </BrowserRouter>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    padding: 1rem;
`;

export default App;
