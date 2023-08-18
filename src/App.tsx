import React from 'react';
import './App.css'
import DragAndDropContainer from './DragAndDropContainer';
import { BrowserRouter as Router , Route, Routes } from 'react-router-dom'


function App() {
    return (
          <Router>
            <Routes>
                <Route path='/' element = { <DragAndDropContainer /> } />
            </Routes>
          </Router>
      );
}
export default App
