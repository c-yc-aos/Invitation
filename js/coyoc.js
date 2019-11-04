
document.onclick = function(e){
	var obj = e['target'];
	try{
		window[obj.getAttribute("base-fun")](obj);
	}catch(e){
		
	}
}
document.onload = function(){
	htmlobj = document.getElementById("center");
	console.log(htmlobj);
}
function open(obj){
	document.getElementById("door").className += " open";
	setTimeout(function () {
		document.getElementById('door').style.display = 'none';
		obj.style.display = "none";	
		runtime();
	}, 2000);
}
function getLinke(map,type){
	switch(map){
		case "gmap"://高德
			return "https://uri.amap.com/marker?position="
			+address[map][type]["E"]+","+address[map][type]["N"]+"&name="+address[map][type]["title"];
		case "bmap"://百度
			return "http://api.map.baidu.com/marker?location="+address[map][type]["N"]
			+","+address[map][type]["E"]+"&title="+address[map][type]["title"]+"&output=html";
	}
}
var htmlobj = null;
var objname = {"h":"h4","s":"span"};
var runindex = 0;
function runtime(){
	if(!htmlobj){
		htmlobj = document.getElementById("center");
	}
	if(str[runindex]){
		show(str[runindex]);
		runindex ++;
		setTimeout(runtime,300);
	}else{
		document.getElementById("guide").style.display = "block";
	}
}
function show(s){
	switch(s){
		case "h":
		case "p":
		case "s":
		case "b":
			addobj(s);
			break;
		case "e":
			endobj();
			break;
		default:
			addText(s);
			break;
	}
}
function addText(s){
	var v = document.createElement("v");
	v.innerHTML = s ;
	htmlobj.appendChild(v);
}
function endobj(){
	htmlobj = htmlobj.parentElement;
}
function addobj(s){
	s = objname[s]||s;
	var o = document.createElement(s);
	htmlobj.appendChild(o);
	htmlobj = o;
}
var selectbox = null;
function hidden(obj){
	obj.parentElement.parentElement.style.display = "none";
}
function selectAdderss(Ks){
	if(!selectbox)selectbox = document.getElementById("select");
	selectbox.innerHTML = "<h3> <a base-fun='hidden'>×</a>往何处</h3>";
	var one = true;
	var p1 = document.createElement("p");
	for(var i = 0 ; i <Ks.length;i++){
		var b = document.createElement("button");
		b.setAttribute("base-fun","selAddress");
		b.setAttribute("base-type", Ks[i]);
		b.setAttribute("name","type");
		b.innerHTML = address["gmap"][Ks[i]]["title"];
		if(one){
			b.setAttribute("class","sel");
			one = false;
		}
		p1.appendChild(b);
	}
	p1.className = "select";
	selectbox.appendChild(p1);
	one = true;
	var p2 = document.createElement("p");
	var maplist = {"gmap":"高德地图","bmap":"百度地图"};
	for(var i in maplist){
		var b = document.createElement("button");
		b.setAttribute("base-fun","selAddress");
		b.setAttribute("base-type",i);
		b.setAttribute("name","map");
		b.innerHTML = maplist[i];
		if(one){
			b.setAttribute("class","sel");
			one = false;
		}
		p2.appendChild(b);
	}
	p2.className = "select";
	selectbox.appendChild(p2);
	
	var p3 = document.createElement("p");
		var b = document.createElement("button");
		b.setAttribute("base-fun","seeAddress");
		b.innerHTML = "获取地址";
		p3.appendChild(b);
	selectbox.appendChild(p3);
	selectbox.style.display = "block";
}
function selAddress(obj){
	var html = obj.parentElement.getElementsByTagName("button");
	for(var i = 0;i<html.length;i++){
		html[i].className = html[i]==obj?"sel":"";
	}
}
function showboard(){
	getvalue();
	document.getElementsByClassName("Board")[0].style.display = "block";
}
function back(obj){
	document.getElementsByClassName("Board")[0].style.display = "none";
}
function seeAddress(){
	var base = {"map":null,"type":null};
	var box = selectbox.getElementsByClassName("select");
	for(var i = 0 ;i<box.length;i++){
		var buts = box[i].getElementsByTagName("button");
		for(var j = 0 ; j<buts.length;j++){
			if(!base[buts[j].getAttribute("name")] || buts[j].className == 'sel'){
				base[buts[j].getAttribute("name")] = buts[j].getAttribute("base-type");
			}
		}
	}
	var a = document.createElement("a");
	a.href = getLinke(base["map"],base["type"]);
	a.click();
}
function showAddress(){
	selectAdderss(agent);
}
function getvalue(){
	ajax({
		"url":"getvalue",
		"data" : {},
		"fun":function(r){
			r = r.split("#");
			var seebox = document.getElementById('see');
			seebox.innerHTML = "";
			console.log(r);
			for(var i =0 ;i<r.length;i++){
				var j = JSON.parse(r[i]);
				seebox.innerHTML += "<p>"+j["value"]+"<span>"+j["name"]+"</span></p>";
			}
		}
	});
}
function send(obj){
	var value = document.getElementById("speak").value;
	if(!value && value == '' && value.length<1)return alert("留言字数太少\n不妨多些祝福.");
	ajax({
		"url":"setvalue",
		"data" : {
			"name":name,
			"value":value
		},
		"fun":function(r){
				 document.getElementById("speak").value = "";
				alert("留言成功！将在审核后发布在留言板哦~");
		}
	});
}
function ajax(base){
	var xmlhttp = null;
	var url=null;
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
	  	xmlhttp=new XMLHttpRequest();
	}
	else{// code for IE6, IE5
	  	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	var kv = [];
	for(var i in base['data']){
		kv.push(i+"="+base["data"][i]);
	}
	console.log(base,kv);
	xmlhttp.open("POST",base["url"]+"?"+(kv.join("&")),true);
	xmlhttp.send();
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState==4 && xmlhttp.status==200){
			base["fun"](xmlhttp.response);
		}
	}
}
