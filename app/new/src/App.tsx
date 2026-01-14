import React from 'react';
import './App.css';
import ChessBoard from './ChessBoard';
import UberMoto from './UberMoto';
import ConnectSupport from './ConnectSupport';
import KunuMasaRestaurant from './KunuMasaRestaurant';

function App() {
  return (
    <div className="App">
      <h1>Chess App</h1>
      <ChessBoard />
      <UberMoto />
      <ConnectSupport />
      <KunuMasaRestaurant />
    </div>
  );
}

export default App;