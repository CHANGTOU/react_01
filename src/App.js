import React, { Component } from 'react';
import StockFeed from './StockFeed' ;
//import PositionMgr from './PositionMgr' ;
import StockPortfolio from './StockPortfolio' ;
import LevelOneDisplay from './LevelOneStockDisplay' ;
import './App.css' ;

class App extends Component {
  constructor() {
    super() ;

    var syms = [ "MSFT", "AAPL", "INTC", "GOOG", "FACE", "LYFT", "SIRI", "AMZN", "TWTR" ];

    syms.forEach( function(s){ StockFeed.get( s ) ; } );

//    this._portfolio = [ "MSFT", "AAPL", "INTC", "GOOG", "MSFT", "FACE", "LYFT", "SIRI", "AMZN", "TWTR", "MSFT" ];
    setTimeout(() => this.on_timer(), 100);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-display">
              <LevelOneDisplay /> <StockPortfolio />
          </div>
        </header>
      </div>
    );
  }

  on_timer() {
    var syms = StockFeed.symbols() ;
    var sym = syms[ Math.floor( Math.random() * syms.length )] ;
    var m = StockFeed.get( sym ) ;
    StockFeed.update( m.sym, m.volume + 1, m.price + (Math.random() * 2 - 1) * (Math.random() * 0.99) ) ;
    setTimeout(() => this.on_timer(), 100);
  }
}

export default App;
