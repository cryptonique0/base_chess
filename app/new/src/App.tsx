import React from 'react';
import './App.css';
import ChessBoard from './ChessBoard';
import UberMoto from './UberMoto';
import ConnectSupport from './ConnectSupport';
import KunuMasaRestaurant from './KunuMasaRestaurant';
import AdmittedStudents from './AdmittedStudents';

function App() {
  return (
    <div className="App">
      <h1>Chess App</h1>
      <ChessBoard />
      <UberMoto />
      <ConnectSupport />
      <KunuMasaRestaurant />
      <AdmittedStudents />
    </div>
  );
}

export default App;