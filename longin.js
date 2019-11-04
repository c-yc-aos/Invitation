var http = require('http');//必须的http协议包
var url = require('url');//初始化url包
var ly = require("./luyou");
var valus = [];
http.createServer(function main(request,response) {
	if(request.url!=="/favicon.ico"){//清除一次访问造成两次响应的bug
		
		var pares = url.parse(request.url, true);
		var path = pares.pathname; 
		var spath = path.replace(/\//,"") || 'index';//去掉前面的/线
			var s = spath.substring(0,spath.indexOf("/"));
				if(spath == 'getvalue'){
					ly["getJson"]("json/blessing.json",response);
				}else if(spath =='setvalue'){
					var query = pares.query;
					if(!query["name"] || !query["value"]){
						response.writeHead(200,{'Content-Type':'text/json;charset=utf-8'});//设置向客户端发送数据的编码格式
						response.end("{'msg':'信息不完整','status':'500'}");
					}else{
						ly["addJson"]("json/blessing.json",response,query);
					}
					
				}else{
					try{
						ly[spath](request,response,pares.query);
					}catch (err){
						try{
							var str = spath.substring(0,spath.indexOf("/"));
							switch(str){
								case '':
									response.writeHead(200,{'Content-Type':'text/text;charset=utf-8'});
									response.end('无内容的请求');
									break;
								case "img":
									var ispng = spath.substring(spath.indexOf(".")+1,spath.length);
									switch(ispng){
										case 'png':
											ly['showpng'](request,response,path);
											break;
										case 'jpg':
											ly['showjpg'](request,response,path);
											break;
									}
									break;
								case "js":
								case "css":
								case 'font':
									ly['showstyles'](str,path,response);
									break;
							}
						}catch (err){
							response.writeHead(200,{'Content-Type':'text/text;charset=utf-8'});
							response.write(path+"页面</br>");
							response.write('发生了404错误');
							response.end();
						}
					}
				}					
		//response.end('<p>end</p>');//必须的  结束输出；
	}
}).listen(80);
console.log('监听了80端口');

