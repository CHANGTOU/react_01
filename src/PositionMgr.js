import StockFeed from './StockFeed' ;

const _positions = [];
const _order_ids = [];

_positions.remove_key = function(order_no){
    var i = 0, keyval = null;
    for( ; i < this.length; i++){
        if(this[i].order_no === order_no){
            keyval = this.splice(i, 1);
            break;
        }
    }
    return keyval;
}

function pad(n, len) {
    var s = n.toString();
    if (s.length < len) {
        s = ('0000000000' + s).slice(-len);
    }
    return s;
}

class Position {
    constructor( order_no_, sym_, qty_, price_ ) {
        this.order_no = order_no_ ;
        this.sym = sym_ ;
        this.price = price_ ; // buy price
        this._last = price_ ; // latest price update
        this.qty = qty_ ;
        this.value = price_ * qty_ ; // current price
        this.old_value = this.value ;
        this.diff = 0 ;
        this.status = 'inactive';
        this.cb = [] ;
        this._ndx = 0 ;
        this._hFeed = StockFeed.register( sym_, this.on_update.bind(this) ) ;
    }
    on_update( s ) {
        if (s.price !== this._last) {
            this.old_value = this.value ;
            this.value = this.qty * s.price ;
            this.diff = this.qty * (this._last - this.price) ;
            this._last = s.price ;
            this.trigger() ;
        }
    }

    unmount() {
        StockFeed.unregister( this._hFeed ) ;
        this._hFeed = -1 ;
    }

    register( func ) {
        var h = 'S' + pad( this._ndx++, 6 ) ;
        this.cb.push({ id: h, f: func }) ;
        return h ;
    }

    unregister( h ) {
        if (h == null) return ;
        var ndx = this.cb.find( function(e) { return (e.id === h) ; }) ;
        if (ndx !== -1) this.cb.splice( ndx, 1 ) ;
        this.unmount() ;
    }

    trigger() {
        this.cb.forEach( function(el, ndx, arr){ el.f( this ) ; }.bind(this) ) ;
    }
}

const PositionMgr = {
    total: 0.00, // total value of portfolio
    cash: 10000.00,  // total cash on hand
    _orderTicker: 100, // got to start somewhere
    _ndx: 10,
    cb: [],
    _hooks: [],
} ;

PositionMgr.add = function( order_no, sym, qty, buy_price ) {
        var p = this.find( order_no ) ;
        if (p !== null) {
            return p ;
        }
        p = new Position( order_no, sym, qty, buy_price ) ;
        _positions.push( p ) ;
        _order_ids.push( order_no ) ;
        this._hooks[ order_no ] = p.register( this.on_portfolio_update.bind( this ) ) ;
        this.post_insert( p ) ;
        this.trigger() ;
        return p ;
}.bind( PositionMgr ) ;

PositionMgr.calc_value = function() {
        var total = 0.00 ;
        _positions.forEach( function( el, ndx, arr ){ 
            if (el.status === "active") { 
                total += el.value ; 
            }
        }) ;
        if (total !== this.total) {
            this.total = total ;
            this.trigger() ;
        }
        return total ;
    }.bind( PositionMgr ) ; 

PositionMgr.find = function( order_no ) {
        var o = null ;
        _positions.forEach( function( p, ndx, arr ){
            if (p.order_no === order_no) {
                o = p ;
            }
        }) ;
        return o ;
    } ;

PositionMgr.on_portfolio_update = function( p ) {
        this.calc_value() ;
    }.bind( PositionMgr ) ;

PositionMgr.get_next_orderno = function() {
        return 'S' + pad( (this._orderTicker++), 6 ) ;
    }.bind( PositionMgr ) ;

PositionMgr.sell = function( order_no ) {
        // 'sell' position at the current market price
        var o = this.find( order_no ) ;
        if (o === null)  return -1 ;
        o.status = 'sold' ;
        this.remove( order_no ) ;
        this.cash += o.value ;
        this.calc_value() ;
    }.bind( PositionMgr ) ;

PositionMgr.buy = function( sym, qty ) {
        // 'buy' X shares of a stock
        var s = StockFeed.get( sym ) ;
        if (s === null)  return -1 ;
        var cost = s.price * qty ;
        if (cost > this.cash) return -2 ;
        this.cash -= cost ;
        var order_no = this.get_next_orderno() ;
        this.add( order_no, sym, qty, s.price ) ;
        var o = this.find( order_no ) ;
        o.status = 'active' ;
        this.calc_value() ;
        return 0 ;
    }.bind( PositionMgr ) ;

PositionMgr.remove = function( order_no ) {
        var p = this.find( order_no ) ;
        if  (p == null) {
            return ;
        }
        this.pre_erase( p ) ;
        _positions.remove_key( order_no ) ;
        var ndx = _order_ids.indexOf( order_no );
        if (ndx !== -1) _order_ids.splice( ndx, 1);
    }.bind( PositionMgr ) ;

PositionMgr.register = function( insert_func, erase_func, change_func ) {
        var h = 'S' + pad( this._ndx++, 6 ) ;
        var o = { id: h, insertCB: insert_func, eraseCB: erase_func, changeCB: change_func } ;
        this.cb.push( o ) ;
        return h ;
    }.bind( PositionMgr ) ;

PositionMgr.unregister = function( h ) {
        var ndx = this.cb.find( function(e) { return (e.id === h) ; }) ;
        if (ndx !== -1) this.cb.splice( ndx, 1 ) ;
    }.bind( PositionMgr ) ;

    PositionMgr.position = function( order_no ) {
        return this.find( order_no ) ;
    } ;

    PositionMgr.nPositions = function() {
        return _order_ids.length ;
    } ;

PositionMgr.positions = function() {
        return _order_ids ;
    } ;

PositionMgr.post_insert = function( position ) {
        this.cb.forEach( function( cb ){ if (cb.insertCB != null) cb.insertCB( position ) ; }) ;
    }.bind( PositionMgr ) ;

PositionMgr.pre_erase = function( position ) {
        this.cb.forEach( function( cb ){ if (cb.eraseCB != null) cb.eraseCB( position ) ; }) ;
    }.bind( PositionMgr ) ;

PositionMgr.trigger = function() {
        this.cb.forEach( function( cb ){
            if (cb.changeCB != null) cb.changeCB( this ) ; 
        }.bind( this ) ) ;
    }.bind( PositionMgr ) ;

export default PositionMgr ;




