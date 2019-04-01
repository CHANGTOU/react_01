import React, { Component } from 'react';
import PositionMgr from './PositionMgr' ;
import './StockPortfolio.css' ;

class DataCell extends Component {
    constructor( props ) {
        super( props ) ;
        this._ref = React.createRef() ;
        this._last = '' ;
        this._hChange = PositionMgr.position( this.props.data.order_no ).register( this.on_change.bind(this) ) ;
    }

    get_value() {
        switch( this.props.field ) {
            case 'order_no': return this.props.data.order_no ;
            case 'symbol': return this.props.data.sym ;
            case 'qty': return this.props.data.qty ;
            case 'value': return this.props.data.value.toFixed(4) ;
            case 'diff': return this.props.data.diff.toFixed(4) ;
            default: return 'n/a' ;
        }
    }

    on_change( p ) {
        var v = this.get_value() ;
        if (this._last !== v) {
            this._ref.current.innerHTML = v ;
            this._last = p ;
        }
    }

    render() {
        return (
            <div className={this.props.className} ref={this._ref}> 
            {this.get_value()}
            </div>            
        );
    }
}

class PositionDisplay extends Component {
    constructor( props ) {
        super( props ) ;

        this.order_no = this.props.label ;
    }

    render() {
        var order_no = this.props.label ;
        var p = PositionMgr.position( order_no ) ;
        return (
            <div className="position_display"> 
                <div className="position_line">
                    <DataCell className="position_orderno" data={p} field='order_no' />
                    <DataCell className="position_symbol" data={p} field='symbol' />
                    <DataCell className="position_qty" data={p} field='qty' />
                    <DataCell className="position_value" data={p} field='value' />
                    <DataCell className="position_diff" data={p} field='diff' />
                </div>
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
  
  