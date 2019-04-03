import React, { Component } from 'react';
import StockFeed from './StockFeed' ;
import './LevelOneStockDisplay.css' ;
import PositionMgr from './PositionMgr';

class StockName extends Component {
    constructor( props ) {
      super( props ) ;
      this._ref = React.createRef() ;
      this._hChange = StockFeed.register( this.props.label, this.on_change.bind(this) ) ;
    }

    on_change( o ) {
      this.set( o.sym );
    }

    render() {
      return (
        <div className="stockname" ref={this._ref}>
            {this.props.label}
        </div>
      ) ;
    }

    set( val ) {
      if (val !== this._last) {
        this._last = val ;
        this._ref.current.innerHTML = val ;
//        this.render() ;
      }
    }
}
  
class StockVolume extends Component {
  constructor( props ) {
    super( props ) ;
    this._ref = React.createRef() ;
    this._hChange = StockFeed.register( this.props.label, this.on_change.bind(this) ) ;
  }

  on_change( o ) {
    this.set( o.volume );
  }

  render() {
    return (
      <div className="stockvolume" ref={this._ref} >
          { StockFeed.get( this.props.label ).volume }
      </div>
    ) ;
  }

  set( val ) {
    if ((this._ref != null) && (val !== this._last)) {
      this._last = val ;
      this._ref.current.innerHTML = val ;
//      this.render() ;
    }
  }
}

class StockPrice extends Component {
  constructor( props ) {
    super( props ) ;
    this._ref = React.createRef() ;
    this._hChange = StockFeed.register( this.props.label, this.on_change.bind(this) ) ;
  }

  on_change( o ) {
    this.set( o.price );
  }

  render() {
    return (
      <div className="stockprice" ref={this._ref}>
          { StockFeed.get( this.props.label ).price.toFixed(4) }
      </div>
    ) ;
  }

  set( val ) {
    if (val !== this._last) {
      this._last = val ;
      this._ref.current.innerHTML = val.toFixed(4) ;
//      this.render() ;
    }
  }
}
 
class LevelOneStockDisplay extends Component {
  on_buy() {
    PositionMgr.buy( this.props.label, 100 ) ;
  }
  render() {
    return (
      <div className="levelone">
        <StockName label={this.props.label} /> 
        <StockVolume label={this.props.label} /> 
        <StockPrice label={this.props.label} />
        <button onClick={ this.on_buy.bind(this) } >buy </button> 
      </div>
    ) ;
  }
}

class LevelOneDisplay extends Component {
  render() {
    return (
      <div className="levelonedisplay">
          <div className="leveloneheader">level one </div>
          <div className="levelone_list"> 
          {
              StockFeed.symbols().map( function(sym, ndx) { 
                  return <LevelOneStockDisplay label={sym} /> ;
              })
          }
          </div>
      </div>
    ) ;
  }
}

export default LevelOneDisplay ;

