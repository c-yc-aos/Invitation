var fs = require('fs');
module.exports = {
	readfile:function(url,funs) {
		fs.readFile(url,function(err,date){
			if(err){
				console.log('出错！读取文件时');
			}else{
				// console.log(date.toString());
				funs(date);
			}
		});
	},
	readImg:function(url,funs){
		 fs.readFile("."+url,'binary',function(err,date)  {
            if  (err)  {
                console.log("读取图片时;出现错误:"+err);
            }else{
            	funs(date);
            }
        });
	},
	readJson:function(url,funs){
		// var fs=reauire('fs');
		// var file="./ajax.json";
		// var result=JSON.parse(fs.readFileSync( file));
		fs.readFile(url,function(err,date)  {
            if  (err)  {
                console.log("读取JSON时;出现错误:"+err);
            }else{
            	funs(date);
            }
        });
	},
	Up:function(url,kv,funs,errfun){//部分属性更改  
		fs.readFile(url,function(err,date){
			if(err){
				errfun('文件不存在');
			}else{
				var b = "";
				date = date.toString();
				console.log(date,date.length);
				if(date && date != '' && date.length > 1){
					b = date + "#" + JSON.stringify(kv);
				}else{
					b = JSON.stringify(kv);
				}
				var arrays = b.split("#");
				//array
				fs.writeFile(url,b,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
				     if(err){
				        errfun('修改失败');
				     }else{
				        funs(true);
				     }
				});
			}
		});
	},
}