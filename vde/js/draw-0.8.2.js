/*
 * Viprin's Drawing Editor!
 * by Viprin
 * 12/12/13
 * Version 0.82
 *
 */

var getID = (function()
{
	var elm = {};
	return function(id)
	{
		if(elm[id] == null) elm[id] = document.getElementById(id);
		return elm[id];
	};
})();


var distance = function(xy1, xy2) {
	return Math.sqrt(Math.pow(xy1[0]-xy2[0], 2) + Math.pow(xy1[1]-xy2[1], 2));
};

var Layer = function()
{
	/* コンストラクタ */
	this.lines = [];
};
Layer.prototype = {
	add : function(type, xy1, xy2, weight, linecolor, opacity, foreground)
	{
		this.lines.push({
			type: type,
			x1: xy1[0],
			y1: xy1[1],
			x2: xy2[0],
			y2: xy2[1],
			weight: weight,
			linecolor: linecolor,
			opacity: opacity,
			foreground: foreground
		});
	},
	update : function(target, xy1, xy2, weight, linecolor, opacity, foreground)
	{
		this.lines[target].type = "LINE";
		this.lines[target].x1 = xy1[0];
		this.lines[target].y1 = xy1[1];
		this.lines[target].x2 = xy2[0];
		this.lines[target].y2 = xy2[1];
		this.lines[target].weight = weight;
		this.lines[target].linecolor = linecolor;
		this.lines[target].opacity = opacity;
		this.lines[target].foreground = foreground;
	},
	del : function(target)
	{
		this.lines.splice(target, 1);
	},
	reseter : function()
	{
		this.lines = [];
	}
};

var Draw = function(p) {
	var winX = window.innerWidth;			//ウィンドウの横幅
	var winY = window.innerHeight;			//ウィンドウの縦幅
	var cardinal = [winX/2-400, winY/2-300];//0,0
	var center = [0, 0];					//描画枠の中心
	var mode = "new";						//現在何を行うべきか
	var mouse = [0, 0];						//マウス位置の記録
	var newline = [0, 0, 0, 0];				//新しい線の位置
	var newlines = [];						//新しい線の位置
	var oldline = [0, 0, 0, 0];				//古い線の位置
	var target = -1;						//セレクタで移動させるターゲットのインデックス
	var pretarget = -1;						//セレクタで移動させるターゲットのインデックス
	p.wait = 0;								//-1なら再描画する
	
	var ctx = canvas.getContext('2d');		//画像表示用
	var img = new Image();					//画像表示用
	p.imgAlpha = 0.5;						//画像透過率
	p.imgX = 0;								//画像表示位置
	p.imgY = 0;								//画像表示位置
	
	p.bgcolor = "#6a7495";					//背景色
	
	p.weight = 2;
	p.linecolor = "#ffffff";
	p.opacity = 100;
	p.foreground = 0;
	
	p.helper1 = 1;							//始点の補助アローを表示するか
	p.helper2 = 1;							//中点の補助アローを表示するか
	p.helper3 = 1;							//終点の補助アローを表示するか
	p.helper4 = 1;							//選択しているラインを強調するか
	
	p.layer = new Layer();
	var l = p.layer;
	var L = l.lines;

	/*########################################*/
	p.setup = function()
	{
		p.frameRate(10);
		p.rectMode(p.CENTER);
		p.size(winX, winY);
	};
	/*########################################*/
	p.draw = function()
	{
		if(p.wait == 1)	return;
		if(p.wait == 0)	p.wait++;
		else			p.wait = 1;
		p.format();
		//p.IMAGE("file:///C:/Documents and Settings/adamay/My Documents/Directory/web/vipformice2/draw/test.jpg");
		p.elements(0);
		p.elements(1);
		if(mode == "new")
		{
			if(newline[0] != newline[3] && newline[2] != newline[4])
				p.LINE([newline[0], newline[1]], [newline[2], newline[3]], p.weight, p.linecolor, p.opacity);
		}
		if(mode == "moving1" || mode == "moving2" || mode == "moving3")
		{
				p.LINE([newline[0], newline[1]], [newline[2], newline[3]], L[pretarget].weight, L[pretarget].linecolor, L[target].opacity);
		}
		getID("information").innerHTML = "debug info:<br />";
		getID("information").innerHTML += "mouseX = " + (p.mouseX-cardinal[0]-center[0]) + ", mouseY = " + (p.mouseY-cardinal[1]-center[1]);
		getID("information").innerHTML += ", centerX = " + center[0] + ", centerY = " + center[1];
		getID("information").innerHTML += "<br />Mode = " + mode + ", Target = " + target;
		getID("information").innerHTML += "<br />Elements = " + L.length;
	};
	/*########################################*/
	p.mousePressed = function()
	{
		if(p.mouseButton != p.LEFT) return;
		p.wait = -1;
		mouse = [p.mouseX-cardinal[0]-center[0], p.mouseY-cardinal[1]-center[1]];
		if(mode == "new") newline = [mouse[0], mouse[1], mouse[0], mouse[1]];
		if(mode == "move1" || mode == "move2" || mode == "move3") target = pretarget;
	};
	/*########################################*/
	p.mouseReleased = function()
	{
		if(p.mouseButton != p.LEFT) return;
		if(p.mouseButton != p.LEFT) return;
		p.wait = -1;
		if(mode == "new")
		{
			if(newline[0] != newline[3] && newline[2] != newline[4])
			{
				l.add("LINE", [newline[0], newline[1]], [newline[2], newline[3]], p.weight, p.linecolor, p.opacity, p.foreground);
				target = L.length - 1;
			}
			newline = [0, 0, 0, 0];
		}
		if(mode == "moving1" || mode == "moving2" || mode == "moving3")
		{
			p.cursor(p.ARROW);
			mode = "new";
			l.update(pretarget, [newline[2], newline[3]], [newline[0], newline[1]], L[target].weight, L[target].linecolor, L[target].opacity, L[target].foreground);
			newline = [0, 0, 0, 0];
		}
	};
	/*########################################*/
	p.mouseDragged = function()
	{
		if(p.mouseButton != p.LEFT) return;
		p.wait = -1;
		if(mode == "drag") center = [center[0]+(p.mouseX-cardinal[0]-center[0])-mouse[0], center[1]+(p.mouseY-cardinal[1]-center[1])-mouse[1]];
		if(mode == "new") newline = [mouse[0], mouse[1], p.mouseX-cardinal[0]-center[0], p.mouseY-cardinal[1]-center[1]];
		if(mode == "move1")
		{
			mode = "moving1";
			mouse = [L[pretarget].x2, L[pretarget].y2];
			L[pretarget].type = "MOVING";
			newline = [mouse[0], mouse[1], mouse[0], mouse[1]];
			target = pretarget;
		}
		if(mode == "move3")
		{
			mode = "moving3";
			mouse = [L[pretarget].x1, L[pretarget].y1];
			L[pretarget].type = "MOVING";
			newline = [mouse[0], mouse[1], mouse[0], mouse[1]];
			target = pretarget;
		}
		if(mode == "move2")
		{
			mode = "moving2";
			mouse = [(L[pretarget].x1+L[pretarget].x2)/2, (L[pretarget].y1+L[pretarget].y2)/2];
			L[pretarget].type = "MOVING";
			oldline = [L[pretarget].x2, L[pretarget].y2, L[pretarget].x1, L[pretarget].y1];
			target = pretarget;
		}
		if(mode == "moving1")
		{
			newline = [mouse[0], mouse[1], p.mouseX-cardinal[0]-center[0], p.mouseY-cardinal[1]-center[1]];
		}
		if(mode == "moving2")
		{
			var moved = [(p.mouseX-cardinal[0]-center[0])-mouse[0], (p.mouseY-cardinal[1]-center[1])-mouse[1]];
			newline = [oldline[0]+moved[0], oldline[1]+moved[1], oldline[2]+moved[0], oldline[3]+moved[1]]
		}
		if(mode == "moving3")
		{
			newline = [p.mouseX-cardinal[0]-center[0], p.mouseY-cardinal[1]-center[1], mouse[0], mouse[1]];
		}
	};
	/*########################################*/
	p.mouseMoved = function()
	{
		//ドラッグ中でなければセレクタを有効にする
		if(mode != "drag")
		{
			L.reverse();
			for(var i in L)
			{
				var mouse2 = [p.mouseX-cardinal[0]-center[0], p.mouseY-cardinal[1]-center[1]];
				if(p.helper2 == 1 && distance(mouse2, [(L[i].x1+L[i].x2)/2, (L[i].y1+L[i].y2)/2]) < 7)
				{
					p.cursor(p.MOVE);
					if(mode != "move2") p.wait = -1;
					mode = "move2";
					pretarget = L.length-i-1;
					break;
				}
				else if(p.helper1 == 1 && distance(mouse2, [L[i].x1, L[i].y1]) < 7)
				{
					p.cursor(p.HAND);
					if(mode != "move1") p.wait = -1;
					mode = "move1";
					pretarget = L.length-i-1;
					break;
				}
				else if(p.helper3 == 1 && distance(mouse2, [L[i].x2, L[i].y2]) < 7)
				{
					p.cursor(p.HAND);
					if(mode != "move3") p.wait = -1;
					mode = "move3";
					pretarget = L.length-i-1;
					break;
				}
				else
				{
					p.cursor(p.ARROW);
					if(mode != "new") p.wait = -1;
					mode = "new";
				}
			}
			L.reverse();
		}
	};
	/*########################################*/
	p.keyPressed = function()
	{
		p.wait = -1;
		if(p.keyCode == 27 || p.keyCode == 82) center = [0, 0];
		if(p.keyCode == 32) mode = "drag";
		var q = L[target];
		if(p.keyCode == 37 && target != -1) l.update(target, [q.x1-1,q. y1], [q.x2-1, q.y2], q.weight, q.linecolor, q.opacity, q.foreground);
		if(p.keyCode == 38 && target != -1) l.update(target, [q.x1,q. y1-1], [q.x2, q.y2-1], q.weight, q.linecolor, q.opacity, q.foreground);
		if(p.keyCode == 39 && target != -1) l.update(target, [q.x1+1,q. y1], [q.x2+1, q.y2], q.weight, q.linecolor, q.opacity, q.foreground);
		if(p.keyCode == 40 && target != -1) l.update(target, [q.x1,q. y1+1], [q.x2, q.y2+1], q.weight, q.linecolor, q.opacity, q.foreground);
		if(p.keyCode == 83) helper1(getID("start"));
		if(p.keyCode == 77) helper2(getID("middle"));
		if(p.keyCode == 69) helper3(getID("end"));
		if(p.keyCode == 84) helper4(getID("target"));
	};
	/*########################################*/
	p.keyReleased = function()
	{
		p.wait = -1;
		if(p.keyCode == 32) mode = "new";
		if(p.keyCode == 127 || p.keyCode == 68)
		{
			l.del(target);
			if(target >= L.length) target --;
		}
	};
	/*########################################*/
	p.resize = function()
	{
		p.wait = -1;
		winX = window.innerWidth;
		winY = window.innerHeight;
		cardinal = [winX/2-400, winY/2-300];
		p.size(winX, winY);
		p.redraw();
	};



	/*########################################*/
	p.BACKGROUND = function(c)
	{
		p.background(getRGB(c).r, getRGB(c).g, getRGB(c).b);
	};
	p.RECT = function(xy, w, h, s, c, a)
	{
		p.stroke(getRGB(c).r, getRGB(c).g, getRGB(c).b);
		p.fill(getRGB(c).r, getRGB(c).g, getRGB(c).b);
		p.rect(cardinal[0]+xy[0]+center[0], cardinal[1]+xy[1]+center[1], w, h);
	};
	p.LINE = function(xy1, xy2, w, c, a)
	{
		p.stroke(p.color(getRGB(c).r, getRGB(c).g, getRGB(c).b, a));
		p.strokeWeight(w);
		p.line(cardinal[0]+xy1[0]+center[0], cardinal[1]+xy1[1]+center[1], cardinal[0]+xy2[0]+center[0], cardinal[1]+xy2[1]+center[1])
	};
	p.DOT = function(xy, w, c, a)
	{
		p.stroke(p.color(getRGB(c).r, getRGB(c).g, getRGB(c).b, a));
		p.strokeWeight(w);
		p.line(cardinal[0]+xy[0]+center[0], cardinal[1]+xy[1]+center[1], cardinal[0]+xy[0]+center[0], cardinal[1]+xy[1]+center[1])
	};
	p.CIRCLE = function(xy, w, c, f, a)
	{
		p.stroke(p.color(getRGB(c).r, getRGB(c).g, getRGB(c).b, a));
		p.fill(p.color(getRGB(f).r, getRGB(f).g, getRGB(f).b, a));
		p.ellipse(cardinal[0]+xy[0]+center[0], cardinal[1]+xy[1]+center[1], w, w)
	};
	p.IMAGE = function(url)
	{
		img.src = url;
		ctx.save();
		ctx.globalAlpha = p.imgAlpha;
		ctx.drawImage(img, p.imgX+cardinal[0], p.imgY+cardinal[1]);
		ctx.restore();
	}
	
	
	
	/*########################################*/
	p.format = function()
	{
		p.BACKGROUND(p.bgcolor);
		var formatColor = (parseInt(getRGB(p.bgcolor).r)+parseInt(getRGB(p.bgcolor).g)+parseInt(getRGB(p.bgcolor).b))/3 > 127 ? "#000000" : "#ffffff";
		p.LINE([0, 0],	[800, 0],	1, formatColor, 64);
		p.LINE([0, 22],	[800, 22],	1, formatColor, 64);
		p.LINE([0, 400],[800, 400],	1, formatColor, 64);
		p.LINE([0, 600],[800, 600],	1, formatColor, 64);
		p.LINE([0, 0],	[0, 600],	1, formatColor, 64);
		p.LINE([800, 0],[800, 600],	1, formatColor, 64);
	};
	/*########################################*/
	p.elements = function(_foreground)
	{
		var l = this.layer;
		var L = l.lines;
		for(var i in L)
		{
			if(_foreground != L[i].foreground) continue;
			if(L[i].type == "NULL") continue;
			if(L[i].type == "MOVING") continue;
			p.LINE([L[i].x1, L[i].y1], [L[i].x2, L[i].y2], L[i].weight, L[i].linecolor, L[i].opacity*2.55);
			//補助アロー
			if(p.helper1 == 1)
			{
				p.LINE([L[i].x1-5, L[i].y1], [L[i].x1+5, L[i].y1], 2, "#6a7495", 255);
				p.LINE([L[i].x1, L[i].y1-5], [L[i].x1, L[i].y1+5], 2, "#6a7495", 255);
				p.LINE([L[i].x1-5, L[i].y1], [L[i].x1+5, L[i].y1], 1, "#ffff00", 255);
				p.LINE([L[i].x1, L[i].y1-5], [L[i].x1, L[i].y1+5], 1, "#ffff00", 255);
			}
			if(p.helper2 == 1)
			{
				p.LINE([(L[i].x1+L[i].x2)/2-5, (L[i].y1+L[i].y2)/2], [(L[i].x1+L[i].x2)/2+5, (L[i].y1+L[i].y2)/2], 2, "#6a7495", 255);
				p.LINE([(L[i].x1+L[i].x2)/2, (L[i].y1+L[i].y2)/2-5], [(L[i].x1+L[i].x2)/2, (L[i].y1+L[i].y2)/2+5], 2, "#6a7495", 255);
				p.LINE([(L[i].x1+L[i].x2)/2-5, (L[i].y1+L[i].y2)/2], [(L[i].x1+L[i].x2)/2+5, (L[i].y1+L[i].y2)/2], 1, "#00ffff", 255);
				p.LINE([(L[i].x1+L[i].x2)/2, (L[i].y1+L[i].y2)/2-5], [(L[i].x1+L[i].x2)/2, (L[i].y1+L[i].y2)/2+5], 1, "#00ffff", 255);
			}
			if(p.helper3 == 1)
			{
				p.LINE([L[i].x2-5, L[i].y2], [L[i].x2+5, L[i].y2], 2, "#6a7495", 255);
				p.LINE([L[i].x2, L[i].y2-5], [L[i].x2, L[i].y2+5], 2, "#6a7495", 255);
				p.LINE([L[i].x2-5, L[i].y2], [L[i].x2+5, L[i].y2], 1, "#ffff00", 255);
				p.LINE([L[i].x2, L[i].y2-5], [L[i].x2, L[i].y2+5], 1, "#ffff00", 255);
			}
			//セレクト中
			if(p.helper4 == 1 && i == target)
			{
				p.DOT([(L[i].x1+L[i].x2)/2, (L[i].y1+L[i].y2)/2], 12, "#ffffff", 255);
				p.DOT([(L[i].x1+L[i].x2)/2, (L[i].y1+L[i].y2)/2], 10, "#6a7495", 255);
				p.DOT([(L[i].x1+L[i].x2)/2, (L[i].y1+L[i].y2)/2], 6, "#ffffff", 255);
			}
		}
	};
	/*########################################*/
	p.add = function(type, xy1, xy2, weight, linecolor, opacity, foreground)
	{
		l.add(type, xy1, xy2, weight, linecolor, opacity, foreground);
		target = L.length - 1;
	}
	p.reseter = function(target)
	{
		l.reseter();
		l = p.layer;
		L = l.lines;
		target = -1;
		pretarget = -1;
		p.wait = -1;
	}
	/*########################################*/
	p.move = function(target)
	{
		for(var tar in target)
		{
		}
	};
}

var Preview = function(p) {
	p.w = 2;
	p.c = "#ffffff";
	p.a = 255;
	p.wait = 0;
	p.setup = function()
	{
		p.frameRate(10);
		p.size(180, 180);
	};
	p.draw = function()
	{
		if(p.wait == 1)	return;
		if(p.wait == 0)	p.wait++;
		else			p.wait = 1;
		p.BACKGROUND("#6a7495");
		p.DOT(p.w, p.c, p.a);
	};
	p.call = function(w, c, a)
	{
		p.wait = -1;
		if(w != null) p.w = w;
		if(c != null) p.c = c;
		if(a != null) p.a = a*2.55;
	};
	p.BACKGROUND = function(c)
	{
		p.background(getRGB(c).r, getRGB(c).g, getRGB(c).b);
	};
	p.DOT = function(w, c, a)
	{
		p.stroke(p.color(getRGB(c).r, getRGB(c).g, getRGB(c).b, a));
		p.strokeWeight(w);
		p.line(90, 90, 90, 90)
	};
}

window.onload = function()
{
	canvas = getID("canvas");
	processing = new Processing(canvas, Draw);
	
	var preview = getID("preview");
	processing2 = new Processing(preview, Preview);
	
	getID("linecolor").value = processing.linecolor.slice(1);
	getID("weight").value = processing.weight;
	getID("alpha").value = processing.opacity;
};

window.onresize = function()
{
	processing.resize();
};

function helper1(but)
{
	processing.wait = -1;
	processing.helper1 ^= 1;
	but.className = processing.helper1 == 0 ? "off" : "on";
}
function helper2(but)
{
	processing.wait = -1;
	processing.helper2 ^= 1;
	but.className = processing.helper2 == 0 ? "off" : "on";
}
function helper3(but)
{
	processing.wait = -1;
	processing.helper3 ^= 1;
	but.className = processing.helper3 == 0 ? "off" : "on";
}
function helper4(but)
{
	processing.wait = -1;
	processing.helper4 ^= 1;
	but.className = processing.helper4 == 0 ? "off" : "on";
}
function weight(value)
{
	processing.weight = value;
	processing2.call(value, null, null);
}
function color(value)
{
	processing.linecolor = value;
	processing2.call(null, value, null);
}
function alpha(value)
{
	processing.opacity = value;
	processing2.call(null, null, value);
}
function foreground(but)
{
	processing.wait = -1;
	processing.foreground ^= 1;
	but.className = processing.foreground == 0 ? "off" : "on";
}

function generateXML()
{
	res = "<C><P /><Z><S /><D /><O /><L>";
	var l = processing.layer;
	var L = l.lines;
	for(var i in L)
	{
		q = L[i]
		var color = q.linecolor.substring(1,7);
		var alpha = q.opacity * 0.01;
		if(q.x1 == q.x2 && q.y1 == q.y2) q.y2++;
		res += '<JD P1="'+q.x1+','+q.y1+'" P2="'+q.x2+','+q.y2+'" c="'+color+','+q.weight+','+alpha+','+q.foreground+'" />';
	}
	res += "</L></Z></C>";
	getID("xmlText").value = res;
}

function load()
{
	var l = processing.layer;
	processing.reseter();
	
	var p1;
	var p2;
	var c;
	var xml = getID("xmlLoad").value;
	$(xml).find("JD").each(function()
	{
		if($(this).attr("M1") == null && $(this).attr("M2") == null && $(this).attr("P1") != null && $(this).attr("P2") != null && $(this).attr("c") != null)
		{
			p1 = $(this).attr("P1").split(",");
			p2 = $(this).attr("P2").split(",");
			c = $(this).attr("c").split(",");
			if(p1.length != 2 || p2.length != 2 || c.length != 4) return;
			p1[0] = parseInt(p1[0]);
			p1[1] = parseInt(p1[1]);
			p2[0] = parseInt(p2[0]);
			p2[1] = parseInt(p2[1]);
			c[1] = parseInt(c[1]);
			c[2] = parseInt(c[2]*100);
			c[3] = parseInt(c[3]);
			if(isNaN(p1[0])) return;
			if(isNaN(p1[1])) return;
			if(isNaN(p2[0])) return;
			if(isNaN(p2[1])) return;
			if(isNaN(c[1])) return;
			if(isNaN(c[2])) return;
			if(isNaN(c[3])) return;
			if(getRGB("#"+c[0]) == null) return;
			processing.add("LINE", [p1[0], p1[1]], [p2[0], p2[1]], c[1], "#"+c[0], c[2], c[3]);
		}
	});
	
	processing.wait = -1;
}

function getRGB(hex) {
	var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return res ? {
		r: parseInt(res[1], 16),
		g: parseInt(res[2], 16),
		b: parseInt(res[3], 16)
	} : null;
}


function reset() {
	processing.reseter();
}