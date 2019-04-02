
const _feed = [];
const _symbols = [] ;
var _ndx = 0 ;

const StockFeed = {
    get( ndx ) {
        if  (_feed[ ndx ] == null) {
            _feed[ ndx ] = { sym: ndx, volume: 0, price: 0.00, cb: [] } ;
            _symbols.push( ndx ) ;
        }
        return _feed[ ndx ] ;
    },

    update( ndx, vol, p ) {
        var o = this.get( ndx ) ;
        var flag = false ;
        if (o.volume !== vol) {
            flag = true ;
            o.volume = vol ;
        }
        if (o.price !== p) {
            flag = true ;
            o.price = p ;
        }
        if (flag) {
            o.cb.forEach( function(cb){ cb( o ) ; }) ;
        }
    },

    register( ndx, func ) {
        var o = this.get( ndx ) ;
        var h = _ndx++ ;
        o.cb[ h ] = func ;
        return h ;
    },

    unregister( ndx, h ) {
        var o = this.get( ndx ) ;

        var index = o.cb.indexOf( h ) ;
        if (index != -1) o.cb.splice( index, 1 ) ;
    },

    symbols() {
        return _symbols ;
    },

    trigger( ndx ) {
        var o = this.get( ndx ) ;
        o.cb.forEach( function(cb){ cb( o ) ; }) ;
    }, 
}

export default StockFeed ;

