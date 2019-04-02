import React, { Component } from 'react';
import StockFeed from './StockFeed' ;
import PositionMgr from './PositionMgr' ;
import StockPortfolio from './StockPortfolio' ;
import LevelOneDisplay from './LevelOneStockDisplay' ;
import './App.css' ;

class App extends Component {
  constructor() {
    super() ;

    var syms = [ "MSFT", "AAPL", "INTC", "GOOG", "FACE", "LYFT", "SIRI", "AMZN", "TWTR" ];

    syms.forEach( function(s){ StockFeed.get( s ) ; } );

    PositionMgr.add( '0001', 'MSFT', '2000',  '110.00' );
    PositionMgr.add( '0002', 'TWTR', '1000',   '32.00' );
    PositionMgr.add( '0003', 'AMZN',  '100', '1780.00' );
    PositionMgr.add( '0004', 'MSFT', '1000',  '115.00' );
    PositionMgr.add( '0005', 'MSFT', '2000',  '110.00' );
    PositionMgr.add( '0006', 'TWTR', '1000',   '32.00' );
    PositionMgr.add( '0007', 'AMZN',  '100', '1780.00' );
    PositionMgr.add( '0008', 'MSFT', '1000',  '115.00' );
    PositionMgr.add( '0009', 'MSFT', '2000',  '110.00' );
    PositionMgr.add( '0010', 'TWTR', '1000',   '32.00' );
    PositionMgr.add( '0011', 'AMZN',  '100', '1780.00' );
    PositionMgr.add( '0012', 'MSFT', '1000',  '115.00' );

    this._portfolio = [ "MSFT", "AAPL", "INTC", "GOOG", "MSFT", "FACE", "LYFT", "SIRI", "AMZN", "TWTR", "MSFT" ];
    setTimeout(() => this.on_timer(), 10);
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
    setTimeout(() => this.on_timer(), 10);
  }
}

export default App;
