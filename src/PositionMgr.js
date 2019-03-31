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
        this.qty = qty_ ;
        this.value = price_ * qty_ ; // current price
        this.cb = [] ;
        this._ndx = 0 ;

        StockFeed.register( sym_, this.on_update.bind(this) ) ;
    }
    on_update( s ) {
        if (s.price !== this._last) {
            this.value = this.qty * s.price ;
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
        this.cb.splice( h, 1 ) ;
    }

    trigger() {
        this.cb.forEach( function(cb){ cb( this ) ; }.bind(this) ) ;
    }
}

const PositionMgr = {
    cb: [],

    add( order_no, sym, qty, buy_price ) {
console.log( 'add.0:  order_no('+ order_no +')  sym('+ sym +')') ;
        if  (_positions[ order_no ] != null) {
            return _positions[ order_no ] ;
        }
        _positions[ order_no ] = new Position( order_no, sym, qty, buy_price ) ;
        _order_ids.push( order_no ) ;
        this.post_insert( _positions[ order_no ] ) ;
console.log( 'add.1:  count('+ _positions.length +')  # order_ids: '+ _order_ids.length ) ;
        return _positions[ order_no ] ;
    },

    remove( order_no ) {
        if  (_positions[ order_no ] == null) {
            return ;
        }
        this.pre_erase( _positions[ order_no ] ) ;
        _positions.remove_key( order_no ) ;
        var index = _order_ids.indexOf( order_no );
        if (index !== -1) _order_ids.splice(index, 1);
    },

    register( insert_func, erase_func ) {
        var h = _ndx++ ;
        this.cb[ h ] = { insertCB: insert_func, eraseCB: erase_func } ;
        return h ;
    },

    unregister( h ) {
        this.cb.splice( h, 1 ) ;
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
}

export default PositionMgr ;




