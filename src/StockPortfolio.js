import React, { Component } from 'react';
import PositionMgr from './PositionMgr' ;
import './StockPortfolio.css' ;

class DataCell extends Component {
    constructor( props ) {
        super( props ) ;
        this._ref = null ;
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

    componentWillUnmount() {
        var o = PositionMgr.find( this.props.data.order_no ) ;
        if (o !== null) {
            o.unregister( this._hChange ) ;
            this._hChange = -1 ;
        }
        this._ref = null ;
    }
    
    on_change( p ) {
        var v = this.get_value() ;
        if ((this._last !== v) && (this._ref != null)) {
            this._ref.current.innerHTML = v ;
            this._last = p ;
        }
    }

    render() {
        if (this._ref == null) {
            this._ref = React.createRef() ;
        }
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

    on_sell() {
        PositionMgr.sell( this.props.label ) ;
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
                    <button onClick={ this.on_sell.bind(this) }>sell </button> 
                </div>
            </div>            
        );
    }
}

class StockPortfolio extends Component {
    constructor( props ) {
        super( props ) ;
        this._ref = React.createRef() ;
        this._cashRef = React.createRef() ;
        this._hChange = PositionMgr.register( this.post_insert.bind(this), this.pre_erase.bind(this), this.on_change.bind(this) ) ;
    }

    pre_erase( position ) {
        this.setState({ date: new Date() });
    }

    post_insert( position ) {
        this.setState({ date: new Date() });
    }

    on_change( p ) {
        var v = p.total.toFixed(4) ;
        this._ref.current.innerHTML = v ;
        var c = p.cash.toFixed(4) ;
        this._cashRef.current.innerHTML = c ;
    }

    render() {
      return (
        <div className="stockportfolio">
            <div className="portfolio_header"> 
                <div className="portfolio_tag">portfolio </div>
                <div className="portfolio_value" ref={this._ref}> 0.00 </div>
            </div>
            <div className="portfolio_list"> 
            {
                PositionMgr.positions().map( function(order_no) { 
                    return <PositionDisplay label={order_no} /> ;
                })
            }
            </div>
            <div className="portfolio_footer"> 
                <div className="portfolio_cash" ref={this._cashRef}> 0.00 </div>
            </div>
        </div>
      ) ;
    }
  }
  
  export default StockPortfolio ;
  
  