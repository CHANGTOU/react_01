import StockFeed from './StockFeed' ;

const _positions = [];
const _order_ids = [];
var _ndx = 0 ;

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
        this.cb = [] ;
        this._ndx = 0 ;

        StockFeed.register( sym_, this.on_update.bind(this) ) ;
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

    register( func ) {
        var h = this._ndx++ ;
        this.cb[ h ] = func ;
        return h ;
    }

    unregister( h ) {
        var ndx = this.cb.indexOf( h ) ;
        if (ndx != -1) this.cb.splice( ndx, 1 ) ;
    }

    trigger() {
        this.cb.forEach( function(cb){ cb( this ) ; }.bind(this) ) ;
    }
}

const PositionMgr = {
    total: 0.00,
    cb: [],
    _hooks: [],

    add( order_no, sym, qty, buy_price ) {
console.log( 'add.0:  order_no('+ order_no +')  sym('+ sym +')') ;
        if  (_positions[ order_no ] != null) {
            return _positions[ order_no ] ;
        }
        _positions[ order_no ] = new Position( order_no, sym, qty, buy_price ) ;
        _order_ids.push( order_no ) ;
        this._hooks[ order_no ] = _positions[ order_no ].register( this.on_portfolio_update.bind( this ) ) ;
        this.total += _positions[ order_no ].value ;
        this.post_insert( _positions[ order_no ] ) ;
        this.trigger() ;
        return _positions[ order_no ] ;
    },

    on_portfolio_update( p ) {
        this.total = this.total - p.old_value + p.value ;
        this.trigger() ;
    },

    remove( order_no ) {
        if  (_positions[ order_no ] == null) {
            return ;
        }
        this.pre_erase( _positions[ order_no ] ) ;
        _positions.remove_key( order_no ) ;
        var ndx = _order_ids.indexOf( order_no );
        if (ndx !== -1) _order_ids.splice( ndx, 1);
    },

    register( insert_func = null, erase_func = null, change_func = null ) {
        var h = _ndx++ ;
        this.cb[ h ] = { insertCB: insert_func, eraseCB: erase_func, changeCB: change_func } ;
        return h ;
    },

    unregister( h ) {
        var ndx = this.cb.indexOf( h ) ;
        if (ndx != -1) this.cb.splice( ndx, 1 ) ;
    },

    position( order_no ) {
        return _positions[ order_no ] ;
    },

    positions() {
        return _order_ids ;
    },

    post_insert( position ) {
        this.cb.forEach( function( cb ){ if (cb.insertCB != null) cb.insertCB( position ) ; }) ;
    }, 

    pre_erase( position ) {
        this.cb.forEach( function( cb ){ if (cb.eraseCB != null) cb.eraseCB( position ) ; }) ;
    }, 

    trigger() {
        this.cb.forEach( function( cb ){ if (cb.changeCB != null) cb.changeCB( this ) ; }.bind( this ) ) ;
    }, 
}

export default PositionMgr ;




