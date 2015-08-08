export function resolve( data ){
    switch( data.action ) {
        case 'startMovingGraphCamera' :
            this._pendingTransform = true
            break

        case 'endMovingGraphCamera' :
            this._pendingTransform = false
            this.emit('change', {pendingTransform: this._pendingTransform})
            break

        case 'translateGraphCamera' :
            const width = this.end - this.start
            this.start = data.newStart
            this.end = data.newStart + width
            this.emit('change', {pendingTransform: this._pendingTransform})
            break
    }
}
