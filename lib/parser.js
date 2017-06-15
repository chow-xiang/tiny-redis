'use strict';


module.exports = format;

/* 
* use for format buffer to redis result array.
*/
function format(chunk){
	while (this.offset < this.buffer.length) {
	    var offset = this.offset
	    var type = this.buffer[this.offset++]
	    var response = parseType(this, type)
	    if (response === undefined) {
	      if (!this.arrayCache.length) {
	        this.offset = offset
	      }
	      return
	    }

	    if (type === 45) {
	      this.returnError(response)
	    } else {
	      this.returnReply(response)
	    }
  	}
}

/**
 * Called the appropriate parser for the specified type.
 * @param parser
 * @param type
 * @returns {*}
 */
function parseType (parser, type) {
  switch (type) {
    case 36: // $
      // return parseBulkString(parser)
    case 58: // :
      // return parseInteger(parser)
    case 43: // +
      // return parseSimpleString(parser)
    case 42: // *
      // return parseArray(parser)
    case 45: // -
      // return parseError(parser)
    default:
      // return handleError(parser, new ParserError(
      //   'Protocol error, got ' + JSON.stringify(String.fromCharCode(type)) + ' as reply type byte',
      //   JSON.stringify(parser.buffer),
      //   parser.offset
      // ))
  }
}

