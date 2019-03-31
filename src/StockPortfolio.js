import React, { Component } from 'react';
import PositionMgr from './PositionMgr' ;
import './StockPortfolio.css' ;

class PositionDisplay extends Component {
    constructor( props ) {
        super( props ) ;

        this._order_no = this.props.label ;
        this._ref = React.createRef() ;
        this._hChange = PositionMgr.position( this._order_no ).register( this.on_change.bind(this) ) ;
    }

    on_change( p ) {
        var txt = p.order_no +'  '+ p.sym +'  '+ p.qty +'  '+ p.value.toFixed(4) ;
        this._ref.current.innerHTML = txt ;
    }
    
    render() {
        var order_no = this.props.label ;
        var p = PositionMgr.position( order_no ) ;
        return (
            <div className="position_display" ref={this._ref}> 
            {p.order_no}  {p.sym}  {p.qty}  {p.value.toFixed(4)}
            </div>            
        );
    }
}

class StockPortfolio extends Component {
    render() {
      return (
        <div className="stockportfolio">
            <div className="portfolio_header">portfolio </div>
            {
                PositionMgr.positions().map( function(order_no) { 
console.log( 'order_no: ' + order_no ) ;
                    return <PositionDisplay label={order_no} /> ;
                })
            }
        </div>
      ) ;
    }
  }
  
  export default StockPortfolio ;
  
  