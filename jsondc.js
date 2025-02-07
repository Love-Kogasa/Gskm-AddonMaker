function jsonEncode( jso, mode = 0 ){
  var jsonCustomParser = { mode }
  jsonCustomParser.string = function( str ){
    if( this.mode == 0 ){
      // 按unicode编码
      var chars = ""
      for( let char of str.split( "" ) ){
        chars += "\\u" + char.charCodeAt().toString( 16 ).padStart( 4, "0" )
      }
      return "\"" + chars + "\""
    } else {
      // 未知加密模式，将按照标准JSON编码器编码
      console.error( "Warn: Unknown decode mode" )
      return JSON.stringify( str )
    }
  }
  // ↓number目前没有加密方案，也没办法用0xFF表示，直接用标准解释器编码即可
  jsonCustomParser.number = JSON.stringify
  jsonCustomParser[ "function" ] = function( func ){
    // JSON不支持function类型
    console.error( "Warn: Unknown JSON type 'Function'" )
    return "null"
  }
  jsonCustomParser.undefined = () => "null"
  jsonCustomParser.object = function( obj ){
    if( Array.isArray( obj ) ){
      var arr = []
      for( let child of obj ){
        arr.push( this[ typeof child ]( child ) )
      }
      return "[" + arr.join( "," ) + "]"
    } else if( obj == null ){
      return "null"
    } else {
      var objarr = []
      for( let key of Object.keys( obj ) ){
        let value = obj[ key ]
        objarr.push( this.string( key ) + ":" + this[ typeof value ](value) )
      }
      return "{" + objarr.join( "," ) + "}"
    }
  }
  return jsonCustomParser[typeof jso]( jso )
}

typeof module === "object" && (module.exports = jsonEncode)
