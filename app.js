var json = {
  header: {
    icon: "https://cirno.eu.org/favicon.ico",
    name: "",
    description: ""
  },
  main: {
    "new_gift": [],
    "add_character": [],
    "new_character": []
  }
}
function readFile( file, method = "DataURL" ){
  return new Promise( function( res, rej ){
    var reader = new FileReader()
    reader.onload = ( e ) => {
      res( e.target.result )
      Qmsg.success( "文件读取成功" )
    }
    reader.onerror = rej
    reader[ "readAs" + method ]( file )
  })
}
async function main(){
  var fileInput = file.cloneNode()
  function update(){
    jsonc.innerHTML = JSON.stringify( json, 0, 2 )
    hljs.highlightAll()
  }
  update()
  pname.oninput = () => {
    json.header.name = pname.value
    update()
  }
  pinfo.oninput = () => {
    json.header.description = pinfo.value
    update()
  }
  picon.onclick = async () => {
    if( file.files[0] ){
      json.header.icon = await readFile( file.files[0])
      pimg.src = json.header.icon
      update()
    } else {
      json.header.icon = purl.value
      pimg.src = purl.value
      update()
    }
  }
  // 讲个笑话，本来写了个Proxy对象，然后发现没用 :(
  // 最后发现是下文的index写bug了是-1
  newGift.onclick = function(){
    var contain = document.createElement( "div" )
    contain.className = "contain"
    var gname = document.createElement( "input" )
    var index = json.main.new_gift.length
    json.main.new_gift[index] = {}
    update()
    gname.type = "text"
    gname.placeholder = "礼物名称"
    gname.oninput = () => {
      json.main.new_gift[index].name = gname.value
      update()
    }
    var ginfo = document.createElement( "input" )
    ginfo.type = "text"
    ginfo.placeholder = "礼物介绍"
    ginfo.oninput = () => {
      json.main.new_gift[index].description = ginfo.value
      update()
    }
    var gift = new Image()
    gift.className = "gift"
    gift.style.marginLeft = "1ch"
    var icon = fileInput.cloneNode()
    icon.onchange = async function(){
      if( this.files[0] ){
        gift.src = await readFile( this.files[0] )
        json.main.new_gift[index].icon = gift.src
        update()
      }
    }
    var h = document.createElement( "h2" )
    h.innerHTML = "新礼物"
    var p = document.createElement( "p" )
    p.innerHTML = "创建一个新的礼物"
    contain.appendChild( h )
    contain.appendChild( p )
    contain.appendChild( gift )
    contain.appendChild( icon )
    contain.appendChild( gname )
    contain.appendChild( ginfo )
    modc.appendChild( contain )
  }
  newCCover.onclick = function(){
    var contain = document.createElement( "div" )
    contain.className = "contain"
    var index = json.main.new_character.length
    json.main.new_character[index] = {}
    var cname = document.createElement( "input" )
    cname.type = "text"
    cname.placeholder = "角色名称"
    cname.oninput = () => {
      json.main.new_character[index].name = cname.value
      update()
    }
    var character = document.createElement( "textarea" )
    character.placeholder = "角色设定"
    character.oninput = () => {
      json.main.new_character[index].character = character.value
      update()
    }
    var h = document.createElement( "h2" )
    h.innerHTML = "新设定"
    var p = document.createElement( "p" )
    p.innerHTML = "创建新的角色设定，如果有(旧设定)则覆盖"
    contain.appendChild( h )
    contain.appendChild( p )
    contain.appendChild( cname )
    contain.appendChild( character )
    modc.appendChild( contain )
  }
  newCAppend.onclick = function(){
    var contain = document.createElement( "div" )
    contain.className = "contain"
    var index = json.main.add_character.length
    json.main.add_character[index] = {}
    var cname = document.createElement( "input" )
    cname.type = "text"
    cname.placeholder = "角色名称"
    cname.oninput = () => {
      json.main.add_character[index].name = cname.value
      update()
    }
    var character = document.createElement( "textarea" )
    character.placeholder = "角色设定"
    character.oninput = () => {
      json.main.add_character[index].character = character.value
      update()
    }
    var h = document.createElement( "h2" )
    h.innerHTML = "新设定"
    var p = document.createElement( "p" )
    p.innerHTML = "创建新的角色设定，如果有(旧设定)则追加，如果没有，则创建"
    contain.appendChild( h )
    contain.appendChild( p )
    contain.appendChild( cname )
    contain.appendChild( character )
    modc.appendChild( contain )
  }
  dw.onclick = ( e ) => {
    var download = document.createElement( "a" )
    download.download = (json.header.name || "gensokyo") + ".gskm"
    download.href = URL.createObjectURL( new Blob( (e.compress ? [JSON.stringify(json)] : [JSON.stringify( json, 0, 2 )]), {type: "application/gskm"} ) )
    download.click()
    Qmsg.success( "下载已开使" )
  }
  dwc.onclick = () => {
    dw.onclick( {compress: true} )
  }
  dwec.onclick = () => {
    var download = document.createElement( "a" )
    download.download = (json.header.name || "gensokyo") + ".gskm"
    download.href = URL.createObjectURL( new Blob( [jsonEncode( json )], {type: "application/gskm"} ) )
    download.click()
    Qmsg.success( "下载已开使" )
  }
  Qmsg.success( "页面渲染完毕" )
}
