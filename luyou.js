var fs = require('./flis');
var cache = {};
module.exports = {
	index:function(req,res,base){
		base = base || {"name":"神秘人","agent":"Groom"}
		var keys = "./index.html";
		function recall(date){
			if(!cache[keys])cache[keys] = date;
			res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置向客户端发送数据的编码格式
			var html = date.toString();
			if(base)
			for(var i in base){
				var rep = new RegExp( "{{ "+i+" }}", "g");
				html = html.replace(rep,base[i]);
			}
			res.write(html);
			res.end();
		}
		if(!cache[keys]){
			fs["readfile"](keys,recall);
		}else{
			recall(cache[keys]);
		}
	},
	showpng:function(req,res,url){
		function recall(date){
			if(!cache[url])cache[url] = date;
			res.writeHead(200,{'Content-Type':'image/png'});//设置向客户端发送数据的编码格式
			res.write(date,'binary');
			res.end();
		}
		if(!cache[url]){
			fs["readImg"](url,recall);
		}else{
			recall(cache[url]);
		}
	},
	showjpg:function(req,res,url){
		function recall(date){
			if(!cache[url])cache[url] = date;
			res.writeHead(200,{'Content-Type':'image/jpeg'});//设置向客户端发送数据的编码格式
			res.write(date,'binary');
			res.end();
		}
		if(!cache[url]){
			fs["readImg"](url,recall);
		}else{
			recall(cache[url]);
		}
	},
	showstyles:function(sty,url,res){
		url = '.'+url;
		sty = sty == 'font'?'html':sty;
		function recall(date){
			if(!cache[url])cache[url] = date;
			res.writeHead(200,{'Content-Type':'text/'+sty});//设置向客户端发送数据的编码格式
			res.end(date);
		}
		if(!cache[url]){
			fs["readfile"](url,recall);
		}else{
			recall(cache[url]);
		}
	},
	getJson:function(url,res){
		function recall(date){
			res.writeHead(200,{'Content-Type':'text/text;charset=utf-8'});//设置向客户端发送数据的编码格式
//			date = date.toString();
			res.end(date);
		}
		fs["readJson"](url,recall);
	},
	addJson:function(url,res,base){
		fs["Up"](url,base,function(){
			res.writeHead(200,{'Content-Type':'text/json;charset=utf-8'});//设置向客户端发送数据的编码格式
			res.end("{'msg':'成功','status':'200'}");
		},function(err){
			res.writeHead(200,{'Content-Type':'text/json;charset=utf-8'});//设置向客户端发送数据的编码格式
			res.end("{'msg':'"+err+"','status':'500'}");
		});
	}
}