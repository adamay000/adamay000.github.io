/*
 * Viprin's Drawing Editor!
 * by Viprin
 * 12/12/13
 * Version 0.82
 *
 */
var distance = function(xy1, xy2) { return Math.sqrt(Math.pow(xy1[0]-xy2[0], 2) + Math.pow(xy1[1]-xy2[1], 2)); };

//レイヤークラス
var Layers = function()
{
	this.target = 0;	//現在操作しているレイヤー
	this.layers = [];	//レイヤー情報
	this.addLayer();	//初期レイヤー
};
Layers.prototype = {
	//新規レイヤー
	addLayer: function()
	{
		this.layers.push(new this.Layer("Layer"+(this.layers.length+1)));
		this.target = this.layers.length-1;
	},
	//レイヤーの削除
	delLayer: function(target)
	{
		if(this.layers.length > 1) {
			this.layers.splice(target, 1);
			if(this.target >= this.layers.length)
				this.target--;
			return this.target;
		} else {
			return -1;
		}
	},
	//操作レイヤーの変更
	setTarget: function(target)
	{
		if(this.layers.length < target) this.target = target;
	},
	//レイヤーの順序変更
	orderUp: function(target)
	{
	},
	//レイヤーの順序変更
	orderDown: function(target)
	{
	},
	//レイヤーの全消去
	reset: function()
	{
		this.layers.length = 0;
		this.addLayer();
	},
	//内部クラス。レイヤー一枚一枚を示す
	Layer: function(layerName)
	{
		this.name = layerName;
		this.display = 1;
		this.elements = [];
	}
};
//レイヤー一枚一枚のクラス
Layers.prototype.Layer.prototype = {
	//レイヤー名の変更
	nameChange: function(layerName) { this.name = layerName; },
	//Lineエレメントの新規
	addLine: function(xy1, xy2, color, weight, alpha, foreground) { this.elements.push(new this.Line([xy1[0], xy1[1]], [xy2[0], xy2[1]], color, weight, alpha, foreground)); },
	//Curveエレメントの新規
	addCurve: function()
	{
	},
	//エレメントの移動
	moveElement: function(target, xy1, xy2)
	{
		this.elements[target].x1 += xy1[0];
		this.elements[target].y1 += xy1[1];
		this.elements[target].x2 += xy2[0];
		this.elements[target].y2 += xy2[1];
	},
	//Lineエレメントの属性の変更
	updateLine: function(target)
	{
		var this_ = this;
		return {
			xy1: function(xy) {
				this_.elements[target].x1 = xy[0];
				this_.elements[target].y1 = xy[1];
			},
			xy2: function(xy) {
				this_.elements[target].x2 = xy[0];
				this_.elements[target].y2 = xy[1];
			},
			color: function(color_) {
				this_.elements[target].color = color_;
			},
			weight: function(weight_) {
				this_.elements[target].weight = weight_;
			},
			alpha: function(alpha_) {
				this_.elements[target].alpha = alpha_;
			},
			foreground: function(foreground_) {
				this_.elements[target].color = foreground_;
			},
			display: function(display_) {
				if(display_ == Undefined) this_.elements[target].display ^= 1;
				else this_.elements[target].display = display_;
			}
		};
	},
	//Curveエレメントの属性の変更
	updateCurve: function()
	{
	},
	//エレメントの削除
	delElement: function(target) { this.elements.splice(target, 1); },
	//エレメントの順序変更
	orderUp: function(target)
	{
	},
	//エレメントの順序変更
	orderDown: function(target)
	{
	},
	//Lineクラス
	Line: function(xy1, xy2, color, weight, alpha, foreground)
	{
		this.x1			= xy1[0];
		this.y1			= xy1[1];
		this.x2			= xy2[0];
		this.y2			= xy2[1];
		this.color		= color;
		this.weight		= weight;
		this.alpha		= alpha;
		this.foreground	= foreground;
		this.display	= 1;
	},
	//Curveクラス
	Curve: function()
	{
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
	var wait = 0;								//-1なら再描画する
	
	var ctx = canvas.getContext('2d');		//画像表示用
	var img = new Image();					//画像表示用
	p.imgAlpha = 0.5;						//画像透過率
	p.imgX = 0;								//画像表示位置
	p.imgY = 0;								//画像表示位置
	
	var backgroundColor = "#6a7495";					//背景色
	
	var weight = 2;
	var color = "#ffffff";
	var alpha = 100;
	var foreground = 0;
	
	//順に始点、中点、終点、ターゲット
	var helper = {
		start: 1,
		end: 1,
		middle: 1,
		target: 1
	};
	
	var layer = new Layers();
	var layers = layer.layers;
	var els = layers[0].elements;

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
		if(wait == 1)	return;
		if(wait == 0)	wait++;
		else		wait = 1;
		p.format();
		//p.IMAGE("file:///C:/Documents and Settings/adamay/My Documents/Directory/web/vipformice2/draw/test.jpg");
		p.elements(0);
		p.elements(1);
		if(mode == "new")
		{
			if(newline[0] != newline[3] && newline[2] != newline[4])
				p.LINE([newline[0], newline[1]], [newline[2], newline[3]], color, weight, alpha);
		}
		/*
		if(mode == "moving1" || mode == "moving2" || mode == "moving3")
		{
				p.LINE([newline[0], newline[1]], [newline[2], newline[3]], L[pretarget].color, L[pretarget].weight, L[target].alpha);
		}
		*/
		$("#information").html("debug info:<br />");
		$("#information").append("mouseX = " + (p.mouseX-cardinal[0]-center[0]) + ", mouseY = " + (p.mouseY-cardinal[1]-center[1]));
		$("#information").append(", centerX = " + center[0] + ", centerY = " + center[1]);
		$("#information").append("<br />Mode = " + mode);
		$("#information").append("<br />Target = " + target + " in \"" + layers[layer.target].name + "\"");
	};
	/*########################################*/
	p.mousePressed = function()
	{
		if(p.mouseButton != p.LEFT) return;
		wait = -1;
		mouse = [p.mouseX-cardinal[0]-center[0], p.mouseY-cardinal[1]-center[1]];
		if(mode == "new") newline = [mouse[0], mouse[1], mouse[0], mouse[1]];
		if(mode == "move1" || mode == "move2" || mode == "move3") target = pretarget;
	};
	/*########################################*/
	p.mouseReleased = function()
	{
		if(p.mouseButton != p.LEFT) return;
		if(p.mouseButton != p.LEFT) return;
		wait = -1;
		if(mode == "new")
		{
			if(newline[0] != newline[3] && newline[2] != newline[4])
			{
				layers[layer.target].addLine([newline[0], newline[1]], [newline[2], newline[3]], color, weight, alpha, foreground);
				target = els.length - 1;
			}
			newline = [0, 0, 0, 0];
		}
		if(mode == "moving1" || mode == "moving2" || mode == "moving3")
		{
			p.cursor(p.ARROW);
			mode = "new";
//			l.update(pretarget, [newline[2], newline[3]], [newline[0], newline[1]], L[target].weight, L[target].color, L[target].alpha, L[target].foreground);
			newline = [0, 0, 0, 0];
		}
	};
	/*########################################*/
	p.mouseDragged = function()
	{
		if(p.mouseButton != p.LEFT) return;
		wait = -1;
		if(mode == "drag") center = [center[0]+(p.mouseX-cardinal[0]-center[0])-mouse[0], center[1]+(p.mouseY-cardinal[1]-center[1])-mouse[1]];
		if(mode == "new") newline = [mouse[0], mouse[1], p.mouseX-cardinal[0]-center[0], p.mouseY-cardinal[1]-center[1]];
		if(mode == "move1")
		{
			mode = "moving1";
			mouse = [els[pretarget].x2, els[pretarget].y2];
			newline = [mouse[0], mouse[1], mouse[0], mouse[1]];
			target = pretarget;
		}
		if(mode == "move3")
		{
			mode = "moving3";
			mouse = [els[pretarget].x1, els[pretarget].y1];
			newline = [mouse[0], mouse[1], mouse[0], mouse[1]];
			target = pretarget;
		}
		if(mode == "move2")
		{
			mode = "moving2";
			mouse = [(els[pretarget].x1+els[pretarget].x2)/2, (els[pretarget].y1+els[pretarget].y2)/2];
			oldline = [els[pretarget].x2, els[pretarget].y2, els[pretarget].x1, els[pretarget].y1];
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
		var el;
		//ドラッグ中でなければセレクタを有効にする
		if(mode != "drag")
		{
			els.reverse();
			for(var i in els)
			{
				el = els[i];
				var mouse2 = [p.mouseX-cardinal[0]-center[0], p.mouseY-cardinal[1]-center[1]];
				if(helper.middle && distance(mouse2, [(el.x1+el.x2)/2, (el.y1+el.y2)/2]) < 7)
				{
					p.cursor(p.MOVE);
					if(mode != "move2") p.wait();
					mode = "move2";
					pretarget = els.length-i-1;
					break;
				}
				else if(helper.start && distance(mouse2, [el.x1, el.y1]) < 7)
				{
					p.cursor(p.HAND);
					if(mode != "move1") p.wait();
					mode = "move1";
					pretarget = els.length-i-1;
					break;
				}
				else if(helper.end && distance(mouse2, [el.x2, el.y2]) < 7)
				{
					p.cursor(p.HAND);
					if(mode != "move3") p.wait();
					mode = "move3";
					pretarget = els.length-i-1;
					break;
				}
				else
				{
					p.cursor(p.ARROW);
					if(mode != "new") p.wait();
					mode = "new";
				}
			}
			els.reverse();
		}
	};
	/*########################################*/
	p.keyPressed = function()
	{
		p.wait();
		if(p.keyCode == 27 || p.keyCode == 82) center = [0, 0];
		if(p.keyCode == 32) mode = "drag";
		var el = els[target];
		if(p.keyCode == 37 && target != -1) layers[layer.target].moveElement(target, [-1, 0], [-1, 0]);
		if(p.keyCode == 38 && target != -1) layers[layer.target].moveElement(target, [0, -1], [0, -1]);
		if(p.keyCode == 39 && target != -1) layers[layer.target].moveElement(target, [1, 0], [1, 0]);
		if(p.keyCode == 40 && target != -1) layers[layer.target].moveElement(target, [0, 1], [0, 1]);
		if(p.keyCode == 83) setHelper("start");
		if(p.keyCode == 77) setHelper("middle");
		if(p.keyCode == 69) setHelper("end");
		if(p.keyCode == 84) setHelper("target");
	};
	/*########################################*/
	p.keyReleased = function()
	{
		wait = -1;
		if(p.keyCode == 32) mode = "new";
		if(p.keyCode == 127 || p.keyCode == 68)
		{
			//エレメント削除処理
		}
	};
	/*########################################*/
	p.resize = function()
	{
		wait = -1;
		winX = window.innerWidth;
		winY = window.innerHeight;
		cardinal = [winX/2-400, winY/2-300];
		p.size(winX, winY);
		p.redraw();
	};
	/*########################################*/
	p.wait = function()
	{
		wait = -1;
	};
	/*########################################*/
	p.setHelper = function(which)
	{
		p.wait();
		helper[which] ^= 1;
		return helper[which];
	};
	/*########################################*/
	p.setTarget = function(value)
	{
		target = value;
	};
	p.setPretarget = function(value)
	{
		pretarget = value;
	};
	/*########################################*/
	p.setColor = function(value)		{ color = value; };
	p.setWeight = function(value)		{ weight = value; };
	p.setAlpha = function(value)		{ alpha = value; };
	p.setForeground = function(value)	{ foreground ^= 1; return foreground; };
	p.getColor = function()				{ return color.slice(1); };
	p.getWeight = function()			{ return weight; };
	p.getAlpha = function()				{ return alpha; };
	p.getForeground = function()		{ return foreground; };



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
	p.LINE = function(xy1, xy2, c, w, a)
	{
		p.stroke(p.color(getRGB(c).r, getRGB(c).g, getRGB(c).b, a));
		p.strokeWeight(w);
		p.line(cardinal[0]+xy1[0]+center[0], cardinal[1]+xy1[1]+center[1], cardinal[0]+xy2[0]+center[0], cardinal[1]+xy2[1]+center[1])
	};
	p.DOT = function(xy, c, w, a)
	{
		p.stroke(p.color(getRGB(c).r, getRGB(c).g, getRGB(c).b, a));
		p.strokeWeight(w);
		p.line(cardinal[0]+xy[0]+center[0], cardinal[1]+xy[1]+center[1], cardinal[0]+xy[0]+center[0], cardinal[1]+xy[1]+center[1])
	};
	p.CIRCLE = function(xy, c, w, f, a)
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
		p.BACKGROUND(backgroundColor);
		var formatColor = (parseInt(getRGB(backgroundColor).r)+parseInt(getRGB(backgroundColor).g)+parseInt(getRGB(backgroundColor).b))/3 > 127 ? "#000000" : "#ffffff";
		p.LINE([0, 0],	[800, 0],	formatColor, 1, 64);
		p.LINE([0, 22],	[800, 22],	formatColor, 1, 64);
		p.LINE([0, 400],[800, 400],	formatColor, 1, 64);
		p.LINE([0, 600],[800, 600],	formatColor, 1, 64);
		p.LINE([0, 0],	[0, 600],	formatColor, 1, 64);
		p.LINE([800, 0],[800, 600],	formatColor, 1, 64);
	};
	/*########################################*/
	p.elements = function(_foreground)
	{
		var el;
		for(var i in layers[layer.target].elements)
		{
			el = layers[layer.target].elements[i];
			if(_foreground != el.foreground) continue;
			p.LINE([el.x1, el.y1], [el.x2, el.y2], el.color, el.weight, el.alpha*2.55);
			//補助アロー
			if(helper.start)
			{
				p.LINE([el.x1-5, el.y1], [el.x1+5, el.y1], "#6a7495", 2, 255);
				p.LINE([el.x1, el.y1-5], [el.x1, el.y1+5], "#6a7495", 2, 255);
				p.LINE([el.x1-5, el.y1], [el.x1+5, el.y1], "#ffff00", 1, 255);
				p.LINE([el.x1, el.y1-5], [el.x1, el.y1+5], "#ffff00", 1, 255);
			}
			if(helper.middle)
			{
				p.LINE([(el.x1+el.x2)/2-5, (el.y1+el.y2)/2], [(el.x1+el.x2)/2+5, (el.y1+el.y2)/2], "#6a7495", 2, 255);
				p.LINE([(el.x1+el.x2)/2, (el.y1+el.y2)/2-5], [(el.x1+el.x2)/2, (el.y1+el.y2)/2+5], "#6a7495", 2, 255);
				p.LINE([(el.x1+el.x2)/2-5, (el.y1+el.y2)/2], [(el.x1+el.x2)/2+5, (el.y1+el.y2)/2], "#00ffff", 1, 255);
				p.LINE([(el.x1+el.x2)/2, (el.y1+el.y2)/2-5], [(el.x1+el.x2)/2, (el.y1+el.y2)/2+5], "#00ffff", 1, 255);
			}
			if(helper.end)
			{
				p.LINE([el.x2-5, el.y2], [el.x2+5, el.y2], "#6a7495", 2, 255);
				p.LINE([el.x2, el.y2-5], [el.x2, el.y2+5], "#6a7495", 2, 255);
				p.LINE([el.x2-5, el.y2], [el.x2+5, el.y2], "#ffff00", 1, 255);
				p.LINE([el.x2, el.y2-5], [el.x2, el.y2+5], "#ffff00", 1, 255);
			}
			//セレクト中
			if(helper.target && i == target)
			{
				p.DOT([(el.x1+el.x2)/2, (el.y1+el.y2)/2], "#ffffff", 12, 255);
				p.DOT([(el.x1+el.x2)/2, (el.y1+el.y2)/2], "#6a7495", 10, 255);
				p.DOT([(el.x1+el.x2)/2, (el.y1+el.y2)/2], "#ffffff", 6, 255);
			}
		}
	};
	/*########################################*/
	p.add = function(xy1, xy2, color, weight, alpha, foreground)
	{
		alert("ok");
		layers[layer.target].addLine(xy1, xy2, color, weight, alpha, foreground);
		target = layers[layer.target].elements.length - 1;
		alert("ok");
	};
	p.reseter = function(target)
	{
	};
	/*########################################*/
	p.move = function(target)
	{
	
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

window.onresize = function()
{
	processing.resize();
};

function setHelper(which)
{
	var res = processing.setHelper(which);
	$("#"+which).removeClass("off").removeClass("on");
	if(res)	$("#"+which).addClass("on");
	else	$("#"+which).addClass("off");
}
function color(value)
{
	processing.setColor(value);
	processing2.call(null, value, null);
}
function weight(value)
{
	processing.setWeight(value);
	processing2.call(value, null, null);
}
function alpha(value)
{
	processing.setAlpha(value);
	processing2.call(null, null, value);
}
function foreground(but)
{
	processing.wait();
	but.className = processing.setForeground() ? "on" : "off";
}

function generateXML()
{
	res = "<C><P /><Z><S /><D /><O /><L>";
	var l = processing.layer;
	var L = l.lines;
	for(var i in L)
	{
		q = L[i]
		var color = q.color.substring(1,7);
		var alpha = q.alpha * 0.01;
		if(q.x1 == q.x2 && q.y1 == q.y2) q.y2++;
		res += '<JD P1="'+q.x1+','+q.y1+'" P2="'+q.x2+','+q.y2+'" c="'+color+','+q.weight+','+alpha+','+q.foreground+'" />';
	}
	res += "</L></Z></C>";
	$("#xmlText").val(res);
}

function load()
{
	var l = processing.layer;
	processing.reseter();
	
	var p1;
	var p2;
	var c;
	var xml = $("#xmlLoad").val();
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
	
	processing.waiter();
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

function winPop(value)
{
	//log, help, load, xml
	$("#log").css("display", "none");
	$("#help").css("display", "none");
	$("#load").css("display", "none");
	$("#xml").css("display", "none");
	$("#"+value).css("display", "block");
}

$(function() {
	//キャンバス設定
	canvas = $("#canvas")[0];
	processing = new Processing(canvas, Draw);
	
	var preview = $("#preview")[0];
	processing2 = new Processing(preview, Preview);
	
	//初期化
	$("#color").val(processing.getColor());
	$("#weight").val(processing.getWeight());
	$("#alpha").val(processing.getAlpha());
	
	//メニュー表示
	$(".draggable").draggable({
		handle: "h1",
		snap: true,
		scroll: false,
		start: function(e, ui)
		{
			
			$(this).css("height", $(this).innerHeight());
		}
	});
});