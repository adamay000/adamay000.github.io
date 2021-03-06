/*
 * Viprin's Drawing Editor!
 * by Viprin
 * 18/12/12
 * Version 1.1.0
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
		return this.target;
	},
	//レイヤーの削除
	delLayer: function(target)
	{
		if(this.layers.length > 1 && target < this.layers.length) {
			this.layers.splice(target, 1);
			if(this.target == this.layers.length) this.target--;
			return this.target;
		} else {
			alert("Failed to delete: You need to have 1 layer at least!");
			return this.target;
		}
	},
	//操作レイヤーの変更
	setTarget: function(target)
	{
		if(this.layers.length > target) this.target = target;
	},
	//レイヤーの順序変更
	orderUp: function(target)
	{
		if(target < this.layers.length - 1)
		{
			var temp = this.layers[target+1];
			this.layers[target+1] = this.layers[target];
			this.layers[target] = temp;
			if(this.target == target) this.setTarget(this.target+1);
			else if(this.target == target+1) this.setTarget(this.target-1);
		}
	},
	//レイヤーの順序変更
	orderDown: function(target)
	{
		if(target > 0)
		{
			var temp = this.layers[target-1];
			this.layers[target-1] = this.layers[target];
			this.layers[target] = temp;
			if(this.target == target) this.setTarget(this.target-1);
			else if(this.target == target-1) this.setTarget(this.target+1);
		}
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
		this.link = -1;
		this.display = 1;
		this.tree = 1;
		this.elements = [];
	}
};
//レイヤー一枚一枚のクラス
Layers.prototype.Layer.prototype = {
	//レイヤー名の変更
	nameChange: function(layerName) { this.name = layerName; },
	//Lineエレメントの新規
	addLine: function(xy1, xy2, color, weight, alpha, foreground)
	{
		xy1[0] = Math.round(xy1[0]);
		xy1[1] = Math.round(xy1[1]);
		xy2[0] = Math.round(xy2[0]);
		xy2[1] = Math.round(xy2[1]);
		this.elements.push(new this.Line([xy1[0], xy1[1]], [xy2[0], xy2[1]], color, weight, alpha, foreground));
	},
	//Curveエレメントの新規
	addCurve: function(xy1, xy2, color, weight, alpha, foreground, fineness)
	{
		xy1[0] = Math.round(xy1[0]);
		xy1[1] = Math.round(xy1[1]);
		xy2[0] = Math.round(xy2[0]);
		xy2[1] = Math.round(xy2[1]);
		this.elements.push(new this.Curve([xy1[0], xy1[1]], [xy2[0], xy2[1]], color, weight, alpha, foreground, fineness));
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
	updateElement: function(target)
	{
		var this_ = this;
		return {
			x1: function(value) {
				value = Math.round(value);
				this_.elements[target].x1 = value;
			},
			y1: function(value) {
				value = Math.round(value);
				this_.elements[target].y1 = value;
			},
			x2: function(value) {
				value = Math.round(value);
				this_.elements[target].x2 = value;
			},
			y2: function(value) {
				value = Math.round(value);
				this_.elements[target].y2 = value;
			},
			xy1: function(xy) {
				xy[0] = Math.round(xy[0]);
				xy[1] = Math.round(xy[1]);
				this_.elements[target].x1 = xy[0];
				this_.elements[target].y1 = xy[1];
			},
			xy2: function(xy) {
				xy[0] = Math.round(xy[0]);
				xy[1] = Math.round(xy[1]);
				this_.elements[target].x2 = xy[0];
				this_.elements[target].y2 = xy[1];
			},
			c1x: function(value) {
				if(this_.elements[target].c1x == undefined) return;
				value = Math.round(value);
				this_.elements[target].c1x = value;
			},
			c1y: function(value) {
				if(this_.elements[target].c1y == undefined) return;
				value = Math.round(value);
				this_.elements[target].c1y = value;
			},
			c2x: function(value) {
				if(this_.elements[target].c2x == undefined) return;
				value = Math.round(value);
				this_.elements[target].c2x = value;
			},
			c2y: function(value) {
				if(this_.elements[target].c2y == undefined) return;
				value = Math.round(value);
				this_.elements[target].c2y = value;
			},
			c1: function(xy) {
				xy[0] = Math.round(xy[0]);
				xy[1] = Math.round(xy[1]);
				this_.elements[target].c1x = xy[0];
				this_.elements[target].c1y = xy[1];
			},
			c2: function(xy) {
				xy[0] = Math.round(xy[0]);
				xy[1] = Math.round(xy[1]);
				this_.elements[target].c2x = xy[0];
				this_.elements[target].c2y = xy[1];
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
				this_.elements[target].foreground = foreground_;
				return foreground_;
			},
			fineness: function(fineness_) {
				this_.elements[target].fineness = fineness_;
				return fineness_;
			},
			display: function(display_) {
				if(display_ == undefined) this_.elements[target].display ^= 1;
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
		if(target < this.elements.length-1) {
			var temp = this.elements[target+1];
			this.elements[target+1] = this.elements[target];
			this.elements[target] = temp;
			return target+1;
		}
		return target;
	},
	//エレメントの順序変更
	orderDown: function(target)
	{
		if(target > 0) {
			var temp = this.elements[target-1];
			this.elements[target-1] = this.elements[target];
			this.elements[target] = temp;
			return target-1;
		}
		return target;
	},
	//レイヤーのグラウンドへの接続
	setLink: function(target)
	{
		var tar = parseInt(target);
		this.link = target;
	},
	//レイヤーの表示
	toggleDisplay: function() { this.display ^= 1; },
	toggleTree: function() { this.tree ^= 1; },
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
	Curve: function(xy1, xy2, color, weight, alpha, foreground, fineness)
	{
		this.x1			= xy1[0];
		this.y1			= xy1[1];
		this.x2			= xy2[0];
		this.y2			= xy2[1];
		this.c1x		= xy1[0];
		this.c1y		= xy1[1];
		this.c2x		= xy2[0];
		this.c2y		= xy2[1];
		this.color		= color;
		this.weight		= weight;
		this.alpha		= alpha;
		this.foreground	= foreground;
		this.fineness	= fineness;
		this.display	= 1;
	}
};

var Draw = function(p) {
	var winX = window.innerWidth;			//ウィンドウの横幅
	var winY = window.innerHeight;			//ウィンドウの縦幅
	var cardinal = [Math.round(winX/2-400), Math.round(winY/2-300)];//0,0
	var center = [0, 0];					//描画枠の中心
	var mode = "new";						//現在何を行うべきか
	var mouse = [0, 0];						//マウス位置の記録
	var newline = [0, 0, 0, 0];				//新しい線の位置
	var newlines = [];						//新しい線の位置
	var oldline = [0, 0, 0, 0];				//古い線の位置
	var savedC = [0, 0];					//動かさない方のベジェコントローラの位置
	var movingC = [0, 0];					//古いベジェコントローラの位置
	var movingC2 = [0, 0];					//古いベジェコントローラの位置
	var newC = [0, 0, 0, 0];				//moving2で動かす新しいベジェコントローラの位置
	var target = -1;						//セレクタで移動させるターゲットのインデックス
	var pretarget = -1;						//セレクタで移動させるターゲットのインデックス
	var wait = 0;							//-1なら再描画する
	var sorted = 0;							//レイヤー用。ソートが行われたか
	var zoom = 1.0;							//拡大倍率
	
	var ctx = canvas.getContext('2d');		//画像表示用
	var img = new Image();					//画像表示用
	p.imgAlpha = 0.5;						//画像透過率
	p.imgX = 0;								//画像表示位置
	p.imgY = 0;								//画像表示位置
	
	var backgroundColor = "#6a7495";					//背景色
	
	var weight = 2;
	var color = "ffffff";
	var alpha = 1;
	var foreground = 0;
	var bezier = false;
	var fineness = 30;
	
	//順に始点、中点、終点、ターゲット
	var helper = {
		start: 1,
		end: 1,
		middle: 1,
		target: 1,
		bezier1: 1,
		bezier2: 1
	};
	
	var layer = new Layers();
	var layers = layer.layers;
	var els = layers[0].elements;
	
	var setCardinal = function(xy) {
		cardinal[0] = xy[0];
		cardinal[1] = xy[1];
	};
	var setCenter = function(xy) {
		center[0] = xy[0];
		center[1] = xy[1];
	};
	var setSavedMouse = function(xy) {
		mouse[0] = xy[0];
		mouse[1] = xy[1];
	};
	var setSavedC = function(xy) {
		savedC[0] = xy[0];
		savedC[1] = xy[1];
	};
	var setMovingC = function(xy) {
		movingC[0] = xy[0];
		movingC[1] = xy[1];
	};
	var setMovingC2 = function(xy) {
		movingC2[0] = xy[0];
		movingC2[1] = xy[1];
	};
	var setNewC = function(c1x, c1y, c2x, c2y) {
		newC[0] = c1x;
		newC[1] = c1y;
		newC[2] = c2x;
		newC[3] = c2y;
	};
	var getZoomedXY = function(xy) {
		return {
			x: xy[0]+(xy[0]-400)*(getZoom()-1),
			y: xy[1]+(xy[1]-200)*(getZoom()-1)
		};
	};
	var getZoomedX = function(x)	{ return x+(x-400)*(getZoom()-1); };
	var getZoomedY = function(y)	{ return y+(y-200)*(getZoom()-1); };
	var getZoomedOutX = function(x)	{ return Math.round((x+400*(getZoom()-1))/getZoom()); };
	var getZoomedOutY = function(y)	{ return Math.round((y+200*(getZoom()-1))/getZoom()); };
	var getSavedCX = function()		{ return savedC[0]; };
	var getSavedCY = function()		{ return savedC[1]; };
	var getMovingCX = function()	{ return movingC[0]; };
	var getMovingCY = function()	{ return movingC[1]; };
	var getMovingC2X = function()	{ return movingC2[0]; };
	var getMovingC2Y = function()	{ return movingC2[1]; };
	var getZoom = function()		{ return zoom; };
	var getMouseX = function()		{ return Math.round(p.mouseX); };
	var getMouseY = function()		{ return Math.round(p.mouseY); };
	var getSavedMouseX = function()	{ return mouse[0]; };
	var getSavedMouseY = function()	{ return mouse[1]; };
	var getCardinalX = function()	{ return cardinal[0]; };
	var getCardinalY = function()	{ return cardinal[1]; };
	var getCenterX = function(iz)	{ return iz == undefined ? Math.round(center[0]*zoom) : center[0]; };
	var getCenterY = function(iz)	{ return iz == undefined ? Math.round(center[1]*zoom) : center[1]; };
	var getTfmX = function()		{ return getCardinalX() + getCenterX(); };
	var getTfmY = function()		{ return getCardinalY() + getCenterY(); };

	/*########################################*/
	p.setup = function()
	{
		p.frameRate(60);
		p.size(winX, winY);
	};
	/*########################################*/
	p.draw = function()
	{
		if(wait == 1)	return;
		if(wait == 0)	wait++;
		else		wait = 1;
		p.format();
//		p.IMAGE("file:///C:/Documents and Settings/adamay/My Documents/Directory/web/vipformice2/draw/test.jpg");
		p.elements(0);
		p.elements(1);
		p.layerDisplay();
		if(mode == "new")
		{
			if(newline[0] != newline[3] && newline[2] != newline[4])
				p.LINE([newline[0], newline[1]], [newline[2], newline[3]], color, weight, alpha*100);
		}
		
		var el = els[pretarget];

		if(el != undefined) {
			if(el.c1x == undefined) {
				if(mode == "moving1" || mode == "moving2" || mode == "moving3") {
					p.LINE([newline[0], newline[1]], [newline[2], newline[3]], el.color, el.weight, els[target].alpha*100);
				}
			} else {
				if(mode == "moving1" || mode == "moving3") {
					p.CURVE([newline[0], newline[1]], [newline[2], newline[3]], [el.c2x, el.c2y], [el.c1x, el.c1y], el.color, el.weight, els[target].alpha*100, el.fineness);
					if(helper.bezier1) {
						p.LINE([el.c1x, el.c1y], [newline[2], newline[3]], "#00ff00", 1, 63, "ignoreZoom");
						p.CROSS([el.c1x, el.c1y], 5, "#00ff00", 1, 255);
					}
					if(helper.bezier2) {
						p.LINE([el.c2x, el.c2y], [newline[0], newline[1]], "#00ff00", 1, 63, "ignoreZoom");
						p.CROSS([el.c2x, el.c2y], 5, "#00ff00", 1, 255);
					}
				}
				if(mode == "moving2") {
					p.CURVE([newline[0], newline[1]], [newline[2], newline[3]], [newC[2], newC[3]], [newC[0], newC[1]], el.color, el.weight, els[target].alpha*100, el.fineness);
				}
			}
		}

		if(mode == "moving4") {
			p.CURVE([newline[0], newline[1]], [newline[2], newline[3]], [getMovingCX(), getMovingCY()], [el.c2x, el.c2y], el.color, el.weight, els[target].alpha*100, el.fineness);
			if(helper.bezier1) {
				p.LINE([newline[0], newline[1]], [getMovingCX(), getMovingCY()], "#00ff00", 1, 63, "ignoreZoom");
				p.CROSS([getMovingCX(), getMovingCY()], 5, "#00ff00", 1, 255);
			}
			if(helper.bezier2) {
				p.LINE([el.c2x, el.c2y], [el.x2, el.y2], "#00ff00", 1, 63, "ignoreZoom");
				p.CROSS([el.c2x, el.c2y], 5, "#00ff00", 1, 255);
			}
		}
		if(mode == "moving5") {
			p.CURVE([newline[0], newline[1]], [newline[2], newline[3]], [el.c1x, el.c1y], [getMovingCX(), getMovingCY()], el.color, el.weight, els[target].alpha*100, el.fineness);
			if(helper.bezier1) {
				p.LINE([el.c1x, el.c1y], [el.x1, el.y1], "#00ff00", 1, 63, "ignoreZoom");
				p.CROSS([el.c1x, el.c1y], 5, "#00ff00", 1, 255);
			}
			if(helper.bezier2) {
				p.LINE([newline[2], newline[3]], [getMovingCX(), getMovingCY()], "#00ff00", 1, 63, "ignoreZoom");
				p.CROSS([getMovingCX(), getMovingCY()], 5, "#00ff00", 1, 255);
			}
		}
		
		$("#information").html("Information:<br />");
		$("#information").append("mouseX = " + getZoomedOutX(getMouseX()-getTfmX()) + ", mouseY = " + getZoomedOutY(getMouseY()-getTfmY()));
		$("#information").append(", centerX = " + getCenterX() + ", centerY = " + getCenterY());
		$("#information").append("<br />Mode = " + mode);
		$("#information").append("<br />Target = " + (target+1) + " in \"" + layers[layer.target].name + "\"");
		$("#information").append("<br />Tool = " + (bezier ? "Bezier curve" : "Straight line"));
		$("#information").append("<br />Zoom = " + zoom);
		var elNumber = 0;
		for(var i=0;i<layers.length;i++)
			for(var j=0;j<layers[i].elements.length;j++)
				elNumber++;
		$("#layerInfo").html("Layer: " + layers.length + ", Element: " + elNumber);
	};
	/*########################################*/
	p.mousePressed = function()
	{
		if(p.mouseButton != p.LEFT) return;
		setSavedMouse([getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY())]);
		if(mode == "new") p.setNewline(getSavedMouseX(), getSavedMouseY(), getSavedMouseX(), getSavedMouseY());
		if(mode == "move1" || mode == "move2" || mode == "move3" || mode == "move4" || mode == "move5") p.setTarget(pretarget);
		p.wait();
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
				if(p.getBezier()) {
					layers[layer.target].addCurve([newline[0], newline[1]], [newline[2], newline[3]], color, weight, alpha, foreground, fineness);
				} else {
					layers[layer.target].addLine([newline[0], newline[1]], [newline[2], newline[3]], color, weight, alpha, foreground);
				}
				p.updateEls();
				p.setTarget(els.length - 1);
			}
			p.setNewline(0, 0, 0, 0);
		}
		if(mode == "moving1" || mode == "moving3") {
			p.cursor(p.ARROW);
			mode = "new";
			p.updateElement(pretarget).xy1([newline[2], newline[3]]);
			p.updateElement(pretarget).xy2([newline[0], newline[1]]);
			p.updateElement(pretarget).display(1);
			p.setNewline(0, 0, 0, 0);
		}
		if(mode == "moving2") {
			mode = "new";
			if(els[pretarget].c1x != undefined) {
				p.updateElement(pretarget).c1([newC[0], newC[1]]);
				p.updateElement(pretarget).c2([newC[2], newC[3]]);
			}
			p.updateElement(pretarget).xy1([newline[2], newline[3]]);
			p.updateElement(pretarget).xy2([newline[0], newline[1]]);
			p.updateElement(pretarget).display(1);
			p.setNewline(0, 0, 0, 0);
		}
		if(mode == "moving4") {
			mode = "new";
			p.updateElement(pretarget).c1([getMovingCX(), getMovingCY()]);
			p.updateElement(pretarget).display(1);
			p.setNewline(0, 0, 0, 0);
		}
		if(mode == "moving5") {
			mode = "new";
			p.updateElement(pretarget).c2([getMovingCX(), getMovingCY()]);
			p.updateElement(pretarget).display(1);
			p.setNewline(0, 0, 0, 0);
		}
	};
	/*########################################*/
	p.mouseDragged = function()
	{
		if(p.mouseButton != p.LEFT) return;
		wait = -1;
		if(mode == "drag") setCenter([getCenterX("iz")+getZoomedOutX(getMouseX()-getTfmX())-getSavedMouseX(), getCenterY("iz")+getZoomedOutY(getMouseY()-getTfmY())-getSavedMouseY()]);
		if(mode == "new") p.setNewline(getSavedMouseX(), getSavedMouseY(), getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY()));

		var el = els[pretarget];

		if(mode == "move1") {
			mode = "moving1";
			setSavedMouse([el.x2, el.y2]);
			p.setNewline(getSavedMouseX(), getSavedMouseY(), getSavedMouseX(), getSavedMouseY());
			p.setTarget(pretarget);
			p.updateElement(pretarget).display(0);
		}
		if(mode == "move3") {
			mode = "moving3";
			setSavedMouse([el.x1, el.y1]);
			p.setNewline(getSavedMouseX(), getSavedMouseY(), getSavedMouseX(), getSavedMouseY());
			p.setTarget(pretarget);
			p.updateElement(pretarget).display(0);
		}
		if(mode == "move2") {
			mode = "moving2";
			if(el.c1x != undefined) {
				setMovingC([el.c1x, el.c1y]);
				setMovingC2([el.c2x, el.c2y]);
			}
			setSavedMouse([(el.x1+el.x2)/2, (el.y1+el.y2)/2]);
			oldline = [el.x2, el.y2, el.x1, el.y1];
			p.setTarget(pretarget);
			p.updateElement(pretarget).display(0);
		}
		if(mode == "move4") {
			mode = "moving4";
			setSavedMouse([el.c1x, el.c1y]);
			setMovingC([el.c1x, el.c1y]);
			p.setNewline(el.x1, el.y1, el.x2, el.y2);
			p.setTarget(pretarget);
			p.updateElement(pretarget).display(0);
		}
		if(mode == "move5") {
			mode = "moving5";
			setSavedMouse([el.c2x, el.c2y]);
			setMovingC([el.c2x, el.c2y]);
			p.setNewline(el.x1, el.y1, el.x2, el.y2);
			p.setTarget(pretarget);
			p.updateElement(pretarget).display(0);
		}

		if(mode == "moving1") {
			p.setNewline(getSavedMouseX(), getSavedMouseY(), getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY()));
			p.changeSelected().moveP1([newline[2], newline[3]]);
		}
		if(mode == "moving2") {
			var moved = [getZoomedOutX(getMouseX()-getTfmX())-getSavedMouseX(), getZoomedOutY(getMouseY()-getTfmY())-getSavedMouseY()];
			setNewC(getMovingCX()+moved[0], getMovingCY()+moved[1], getMovingC2X()+moved[0], getMovingC2Y()+moved[1]);
			p.setNewline(oldline[0]+moved[0], oldline[1]+moved[1], oldline[2]+moved[0], oldline[3]+moved[1]);
			p.changeSelected().moveP1([newline[2], newline[3]]);
			p.changeSelected().moveP2([newline[0], newline[1]]);
		}
		if(mode == "moving3") {
			p.setNewline(getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY()), getSavedMouseX(), getSavedMouseY());
			p.changeSelected().moveP2([newline[0], newline[1]]);
		}
		if(mode == "moving4") {
			var moved = [getZoomedOutX(getMouseX()-getTfmX())-getSavedMouseX(), getZoomedOutY(getMouseY()-getTfmY())-getSavedMouseY()];
			setMovingC([getSavedMouseX()+moved[0], getSavedMouseY()+moved[1]]);
			p.changeSelected().moveC1([getMovingCX(), getMovingCY()]);
		}
		if(mode == "moving5") {
			var moved = [getZoomedOutX(getMouseX()-getTfmX())-getSavedMouseX(), getZoomedOutY(getMouseY()-getTfmY())-getSavedMouseY()];
			setMovingC([getSavedMouseX()+moved[0], getSavedMouseY()+moved[1]]);
			p.changeSelected().moveC2([getMovingCX(), getMovingCY()]);
		}
	};
	/*########################################*/
	p.mouseMoved = function()
	{
		if(mode == "wait") mode = "new";
		var el;
		//ドラッグ中でなければセレクタを有効にする
		if(mode != "drag" && mode != "layermove")
		{
			els.reverse();
			var mouse2 = [getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY())];
			for(var i in els)
			{
				el = els[i];
				
				if(el.c1x != undefined) {
					if(helper.bezier1 && distance(mouse2, [el.c1x, el.c1y]) < 7/getZoom()) {
						p.cursor(p.HAND);
						if(mode != "move4") p.wait();
						mode = "move4";
						pretarget = els.length-i-1;
						break;
					} else if(helper.bezier2 && distance(mouse2, [el.c2x, el.c2y]) < 7/getZoom()) {
						p.cursor(p.HAND);
						if(mode != "move5") p.wait();
						mode = "move5";
						pretarget = els.length-i-1;
						break;
					}
				}
				
				if(helper.middle && distance(mouse2, [(el.x1+el.x2)/2, (el.y1+el.y2)/2]) < 7/getZoom()) {
					p.cursor(p.MOVE);
					if(mode != "move2") p.wait();
					mode = "move2";
					pretarget = els.length-i-1;
					break;
				} else if(helper.start && distance(mouse2, [el.x1, el.y1]) < 7/getZoom()) {
					p.cursor(p.HAND);
					if(mode != "move1") p.wait();
					mode = "move1";
					pretarget = els.length-i-1;
					break;
				}
				else if(helper.end && distance(mouse2, [el.x2, el.y2]) < 7/getZoom()) {
					p.cursor(p.HAND);
					if(mode != "move3") p.wait();
					mode = "move3";
					pretarget = els.length-i-1;
					break;
				}
				
				p.cursor(p.ARROW);
				if(mode != "new") p.wait();
				mode = "new";
			}
			els.reverse();
		}
	};
	/*########################################*/
	p.keyPressed = function()
	{
		if(p.keyCode == 27 || p.keyCode == 82) setCenter([0, 0]);
		if(p.keyCode == 32) {
			mode = "drag";
			p.setNewline(0, 0, 0, 0);
		}
		if(p.keyCode == 76) {
			mode = "layermove";
			p.setNewline(0, 0, 0, 0);
		}
		var el = els[target];
		if(p.keyCode == 37 && target != -1) p.moveElement(target, [-1, 0], [-1, 0]);
		if(p.keyCode == 38 && target != -1) p.moveElement(target, [0, -1], [0, -1]);
		if(p.keyCode == 39 && target != -1) p.moveElement(target, [1, 0], [1, 0]);
		if(p.keyCode == 40 && target != -1) p.moveElement(target, [0, 1], [0, 1]);
		if(p.keyCode == 83) setHelper("start");
		if(p.keyCode == 77) setHelper("middle");
		if(p.keyCode == 69) setHelper("end");
		if(p.keyCode == 84) setHelper("target");
		p.wait();
	};
	/*########################################*/
	p.keyReleased = function()
	{
		wait = -1;
		if(p.keyCode == 32) mode = "wait";
		if(p.keyCode == 76) mode = "wait";
		if(p.keyCode == 127 || p.keyCode == 68)
		{
			layers[layer.target].delElement(target);
			setTarget(target-1);
		}
	};
	/*########################################*/
	p.resize = function()
	{
		wait = -1;
		winX = window.innerWidth;
		winY = window.innerHeight;
		setCardinal([Math.round(winX/2-400), Math.round(winY/2-300)]);
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
		helper[which] ^= 1;
		p.wait();
		return helper[which];
	};
	/*########################################*/
	p.setLayerTarget = function(value)
	{
		layer.setTarget(value);
		p.updateEls();
		p.wait();
	};
	p.setTarget = function(value)
	{
		target = value;
		if(target < 0) target = 0;
		p.setSelected(target);
		p.updateSelectedSlider();
		p.wait();
		$("#canvas")[0].focus();
	};
	p.setPretarget = function(value)
	{
		pretarget = value;
		p.wait();
	};
	p.setNewline = function(value1, value2, value3, value4)
	{
		value1 = Math.round(value1);
		value2 = Math.round(value2);
		value3 = Math.round(value3);
		value4 = Math.round(value4);
		newline = [value1, value2, value3, value4];
		p.wait();
	};
	p.setSelected = function(tar)
	{
		if(els[target] == undefined)
		{
			$("#selectedZ span").text("-");
			$("#selectedX1").val("");
			$("#selectedY1").val("");
			$("#selectedX2").val("");
			$("#selectedY2").val("");
			$("#selectedC1X").val("");
			$("#selectedC1Y").val("");
			$("#selectedC2X").val("");
			$("#selectedC2Y").val("");
			$("#selectedColor").val("");
			$("#selectedWeight").val("");
			$("#selectedAlpha").val("");
			$("#selectedFineness").val("");
			$("#selectedForeground").removeClass("off").removeClass("on");
			$("#selectedForeground").addClass("disable");
		} else {
			var el = els[target];
			$("#selectedZ span").text(target);
			$("#selectedX1").val(el.x1);
			$("#selectedY1").val(el.y1);
			$("#selectedX2").val(el.x2);
			$("#selectedY2").val(el.y2);
			$("#selectedC1X").val(el.c1x != undefined ? el.c1x : "");
			$("#selectedC1Y").val(el.c1y != undefined ? el.c1y : "");
			$("#selectedC2X").val(el.c2x != undefined ? el.c2x : "");
			$("#selectedC2Y").val(el.c2y != undefined ? el.c2y : "");
			$("#selectedColor").val(el.color);
			$("#selectedWeight").val(el.weight);
			$("#selectedAlpha").val(parseInt(el.alpha*100));
			$("#selectedFineness").val(el.fineness != undefined ? el.fineness : "");
			$("#selectedForeground").text(el.foreground ? "FOREGROUND" : "BACKGROUND");
			$("#selectedForeground").removeClass("off").removeClass("on").removeClass("disable");
			$("#selectedForeground").addClass(el.foreground ? "on" : "off");
		}
	}
	p.updateSelectedSlider = function()
	{
		updateSelectedSliderDo();
	}
	p.changeSelected = function(ifselected)
	{
		return {
			moveP1: function(value) {
				$(selectedX1).val(value[0]);
				$(selectedY1).val(value[1]);
			},
			moveP2: function(value) {
				$(selectedX2).val(value[0]);
				$(selectedY2).val(value[1]);
			},
			x1: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(target, ifselected).x1(value);
				p.wait();
			},
			y1: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(target, ifselected).y1(value);
				p.wait();
			},
			x2: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(target, ifselected).x2(value);
				p.wait();
			},
			y2: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(target, ifselected).y2(value);
				p.wait();
			},
			moveC1: function(value) {
				$(selectedC1X).val(value[0]);
				$(selectedC1Y).val(value[1]);
			},
			moveC2: function(value) {
				$(selectedC2X).val(value[0]);
				$(selectedC2Y).val(value[1]);
			},
			c1x: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(target, ifselected).c1x(value);
				p.wait();
			},
			c1y: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(target, ifselected).c1y(value);
				p.wait();
			},
			c2x: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(target, ifselected).c2x(value);
				p.wait();
			},
			c2y: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(target, ifselected).c2y(value);
				p.wait();
			},
			color: function(value) {
				var clr = getRGB(value);
				if(clr == null) return;
				p.updateElement(target).color(value);
				$("#selectedColor").val(value);
				p.wait();
			},
			weight: function(value) {
				p.updateElement(target).weight(value);
				$("#selectedWeight").val(value);
				p.wait();
			},
			alpha: function(value) {
				p.updateElement(target).alpha(value/100);
				$("#selectedAlpha").val(value);
				p.wait();
			},
			fineness: function(value) {
				p.updateElement(target).fineness(value);
				$("#selectedFineness").val(value);
				p.wait();
			},
			foreground: function() {
				return p.updateElement(target).foreground((els[target].foreground) ? 0 : 1);
			}
		};
	}
	/*########################################*/
	p.setColor = function(value)		{
		var clr = getRGB(value);
		if(clr == null) return;
		color = value;
	};
	p.setWeight = function(value)		{ weight = value; };
	p.setAlpha = function(value)		{ alpha = value/100; };
	p.setForeground = function(value)	{ foreground ^= 1; return foreground; };
	p.setBezier = function(value)		{ bezier = value; }
	p.setFineness = function(value)		{ fineness = value; }
	p.getZoom = function()				{ return zoom; };
	p.getColor = function()				{ return color; };
	p.getWeight = function()			{ return weight; };
	p.getAlpha = function()				{ return alpha*100; };
	p.getBezier = function()			{ return bezier; }
	p.getFineness = function()			{ return fineness; }
	p.getForeground = function()		{ return foreground; };
	/*########################################*/
	p.toggleTree = function(tar)		{ layers[tar].toggleTree(); p.wait(); };
	p.toggleDisplay = function(tar)		{ layers[tar].toggleDisplay(); p.wait(); };
	/*########################################*/
	p.getLayer = function()				{ return layer; };
	p.getLayers = function()			{ return layers; };



	/*########################################*/
	p.BACKGROUND = function(c)
	{
		var clr = getRGB(c);
		if(clr == null) return;
		p.background(clr.r, clr.g, clr.b);
	};
	p.LINE = function(xy1, xy2, c, w, a, ignoreZoom)
	{
		var clr = getRGB(c);
		if(clr == null) return;
		p.stroke(p.color(clr.r, clr.g, clr.b, a));
		if(ignoreZoom == undefined) w *= zoom;
		xy1[0] = getZoomedXY(xy1).x;
		xy1[1] = getZoomedXY(xy1).y;
		xy2[0] = getZoomedXY(xy2).x;
		xy2[1] = getZoomedXY(xy2).y;
		p.strokeWeight(w);
		p.line(xy1[0]+getTfmX(), xy1[1]+getTfmY(), xy2[0]+getTfmX(), xy2[1]+getTfmY());
	};
	p.CURVE = function(xy1, xy2, c1, c2, c, w, a, fineness, ignoreZoom)
	{
		var clr = getRGB(c);
		if(clr == null) return;
		p.stroke(p.color(clr.r, clr.g, clr.b, a));
		if(ignoreZoom == undefined) w *= zoom;
		xy1[0] = getZoomedXY(xy1).x;
		xy1[1] = getZoomedXY(xy1).y;
		xy2[0] = getZoomedXY(xy2).x;
		xy2[1] = getZoomedXY(xy2).y;
		c1[0] = getZoomedXY(c1).x;
		c1[1] = getZoomedXY(c1).y;
		c2[0] = getZoomedXY(c2).x;
		c2[1] = getZoomedXY(c2).y;
		p.strokeWeight(w);
		
		var t = 0;
		var p0 = [xy1[0], xy1[1]];
		var p1 = [c1[0], c1[1]];
		var p2 = [c2[0], c2[1]];
		var p3 = [xy2[0], xy2[1]];
		var p4 = [0, 0];
		var p5 = [0, 0];
		var p6 = [0, 0];
		var p7 = [0, 0];
		var p8 = [0, 0];
		var p9 = [0, 0];
		var p10 = [xy1[0], xy1[1]];
		for(var i=1;i<=fineness;i++) {
			t = i / fineness;
			
			p4 = [
				p0[0]+(p1[0]-p0[0])*t,
				p0[1]+(p1[1]-p0[1])*t
			];
			p5 = [
				p1[0]+(p2[0]-p1[0])*t,
				p1[1]+(p2[1]-p1[1])*t
			];
			p6 = [
				p2[0]+(p3[0]-p2[0])*t,
				p2[1]+(p3[1]-p2[1])*t
			];
			p7 = [
				p4[0]+(p5[0]-p4[0])*t,
				p4[1]+(p5[1]-p4[1])*t
			];
			p8 = [
				p5[0]+(p6[0]-p5[0])*t,
				p5[1]+(p6[1]-p5[1])*t
			];
			p9 = [
				Math.round(p7[0]+(p8[0]-p7[0])*t),
				Math.round(p7[1]+(p8[1]-p7[1])*t)
			];
			p.line(p10[0]+getTfmX(), p10[1]+getTfmY(), p9[0]+getTfmX(), p9[1]+getTfmY());
			p10 = [p9[0], p9[1]];
		}
	};
	p.CROSS = function(xy, l, c, w, a) {
		var clr = getRGB(c);
		if(clr == null) return;
		xy[0] = getZoomedXY(xy).x;
		xy[1] = getZoomedXY(xy).y;
		p.stroke(p.color(getRGB("#6a7495").r, getRGB("#6a7495").g, getRGB("#6a7495").b));
		p.strokeWeight(w*2);
		p.line(xy[0]+getTfmX()-l, xy[1]+getTfmY(), xy[0]+getTfmX()+l, xy[1]+getTfmY());
		p.line(xy[0]+getTfmX(), xy[1]+getTfmY()-l, xy[0]+getTfmX(), xy[1]+getTfmY()+l);
		clr = getRGB(c);
		if(clr == null) return;
		p.stroke(p.color(clr.r, clr.g, clr.b, a));
		p.strokeWeight(w);
		p.line(xy[0]+getTfmX()-l, xy[1]+getTfmY(), xy[0]+getTfmX()+l, xy[1]+getTfmY());
		p.line(xy[0]+getTfmX(), xy[1]+getTfmY()-l, xy[0]+getTfmX(), xy[1]+getTfmY()+l);
	};
	p.IMAGE = function(url)
	{
		img.src = url;
		ctx.save();
		ctx.globalAlpha = p.imgAlpha;
		ctx.drawImage(img, p.imgX+getTfmX(), p.imgY+getTfmY());
		ctx.restore();
	};
	
	
	
	/*########################################*/
	p.format = function()
	{
		p.BACKGROUND(backgroundColor);
		var clr = getRGB(backgroundColor);
		if(clr == null) return;
		var formatColor = (parseInt(clr.r)+parseInt(clr.g)+parseInt(clr.b))/3 > 127 ? "#000000" : "#ffffff";
		p.strokeCap(p.SQUARE);
		p.LINE([0, 0],	[800, 0],	formatColor, 1, 64);
		p.LINE([0, 22],	[800, 22],	formatColor, 1, 64);
		p.LINE([0, 400],[800, 400],	formatColor, 1, 64);
		p.LINE([0, 600],[800, 600],	formatColor, 1, 64);
		p.LINE([0, 0],	[0, 600],	formatColor, 1, 64);
		p.LINE([800, 0],[800, 600],	formatColor, 1, 64);
		p.strokeCap(p.ROUND);
	};
	/*########################################*/
	p.elements = function(_foreground)
	{
		for(var i=0;i<layers.length;i++)
		{
			if(!layers[i].display) continue;
			for(var j=0;j<layers[i].elements.length;j++)
			{
				var el = layers[i].elements[j];
				if(!el.display) continue;
				if(_foreground != el.foreground) continue;
				if(el.c1x != undefined) {
					p.CURVE([el.x1, el.y1], [el.x2, el.y2], [el.c1x, el.c1y], [el.c2x, el.c2y], el.color, el.weight, el.alpha*255, el.fineness);
				} else {
					p.LINE([el.x1, el.y1], [el.x2, el.y2], el.color, el.weight, el.alpha*255);
				}
				if(i == layer.target)
				{
					//補助アロー
					if(helper.start)
					{
						p.CROSS([el.x1, el.y1], 5, "#ffff00", 1, 255);
					}
					if(helper.middle)
					{
						if(el.c1x != undefined) p.LINE([el.x1, el.y1], [el.x2, el.y2], "#00ffff", 1, 63, "ignoreZoom");
						p.CROSS([(el.x1+el.x2)/2, (el.y1+el.y2)/2], 5, "#00ffff", 1, 255);
					}
					if(helper.end)
					{
						p.CROSS([el.x2, el.y2], 5, "#ffff00", 1, 255);
					}
					//ベジェコントローラー
					if(el.c1x != undefined) {
						if(helper.bezier1) {
							p.LINE([el.c1x, el.c1y], [el.x1, el.y1], "#00ff00", 1, 63, "ignoreZoom");
							p.CROSS([el.c1x, el.c1y], 5, "#00ff00", 1, 255);
						}
						if(helper.bezier2) {
							p.LINE([el.c2x, el.c2y], [el.x2, el.y2], "#00ff00", 1, 63, "ignoreZoom");
							p.CROSS([el.c2x, el.c2y], 5, "#00ff00", 1, 255);
						}
					}
					//セレクト中
					if(helper.target && j == target)
					{
						p.LINE([(el.x1+el.x2)/2, (el.y1+el.y2)/2], [(el.x1+el.x2)/2, (el.y1+el.y2)/2], "#ffffff", 12, 255, "ignoreZoom");
						p.LINE([(el.x1+el.x2)/2, (el.y1+el.y2)/2], [(el.x1+el.x2)/2, (el.y1+el.y2)/2], "#6a7495", 10, 255, "ignoreZoom");
						p.LINE([(el.x1+el.x2)/2, (el.y1+el.y2)/2], [(el.x1+el.x2)/2, (el.y1+el.y2)/2], "#ffffff", 6, 255, "ignoreZoom");
					}
				}
			}
		}
	};
	/*########################################*/
	p.updateEls = function() {
		els = layers[layer.target].elements;
	}
	p.addLayer = function() {
		els = layers[layer.addLayer()].elements;
		p.setTarget(-1);
		p.wait();
	}
	p.delLayer = function(tar) {
		els = layers[layer.delLayer(tar)].elements;
		p.setTarget(-1);
		p.wait();
	}
	p.updateElement = function(tar, ifselected) {
		var res = layers[layer.target].updateElement(tar);
		if(ifselected == undefined) p.setSelected();
		return res;
	}
	p.moveElement = function(tar, xy1, xy2) {
		layers[layer.target].moveElement(tar, xy1, xy2);
		p.setSelected();
	}
	p.elementOrderUp = function() {
		p.setTarget(layers[layer.target].orderUp(target));
		p.wait();
	}
	p.elementOrderDown = function() {
		p.setTarget(layers[layer.target].orderDown(target));
		p.wait();
	}
	p.layerOrderDown = function(tar) {
		layer.orderDown(tar);
		p.setTarget(-1);
		p.wait();
	}
	p.layerOrderUp = function(tar) {
		layer.orderUp(tar);
		p.setTarget(-1);
		p.wait();
	}
	p.layerSetLink = function(tar, linkGround) {
		layers[tar].setLink(linkGround);
		p.wait();
	}
	p.loadFirst = function() {
		p.delLayer(0);
	}
	p.loadLayer = function(name, link) {
		p.addLayer();
		layers[layer.target].nameChange(name);
		layers[layer.target].setLink(link);
	}
	p.loadLine = function(xy1, xy2, color, weight, alpha, foreground) {
		layers[layer.target].addLine([xy1[0], xy1[1]], [xy2[0], xy2[1]], color, weight, alpha, foreground);
		p.updateEls();
		p.setTarget(els.length - 1);
	}
	/*########################################*/
	p.layerDisplay = function()
	{
		var $e;
		$e = $("#layers");
		$e.empty();
		for(var i=layers.length-1;i>=0;i--)
		{
			var $els = layers[i].elements;
//			var res = "<li><p onclick=\"toggleTree(this, " + i + ")\"> ";
			var res = "<li><p id=\"layer" + i + "\"";
			if(layer.target == i) res += " class=\"selected\"";
			res += ">";
			res += "<img src=\"./images/tree_";
			res += layers[i].tree ? "on" : "off";
			res += ".gif\" onclick=\"toggleTree(this, " + i + ")\" />";
			res += " <input type=\"test\" id=\"layerName" + i + "\" value=\"" + layers[i].name + "\" />";
			res += " [" + $els.length + "]";
			if(layers[i].link != -1)	res += " &lt;" + layers[i].link + "&gt;";
			res += "<span>"
			if(i > 0)				res += "<img src=\"./images/order_down.gif\" onclick=\"layerOrderDown(" + i + ")\" /> ";
			if(i < layers.length-1)	res += "<img src=\"./images/order_up.gif\" onclick=\"layerOrderUp(" + i + ")\" /> ";
			res += "<img src=\"./images/display_";
			res += layers[i].display ? "on" : "off";
			res += ".gif\" onclick=\"toggleDisplay(this, " + i + ")\" />";
			res += "</span>";
			res += "</p>";
			if(layers[i].tree)
			{
				res += "<ul>";
				for(var j=$els.length-1;j>=0;j--)
				{
					res += "<li onclick=\"setLayerTarget(" + i + ");setTarget(" + j + ")\"";
					if(layer.target == i && target == j) res += "class=\"selected\"";
					res += "><span class=\"no\">" + (j+1) + "</span>P1=\""+$els[j].x1+","+$els[j].y1+"\" P2=\""+$els[j].x2+","+$els[j].y2+"\"<br />";
					if($els[j].c1x != undefined) res += "C1=\""+$els[j].c1x+","+$els[j].c1y+"\" C2=\""+$els[j].c2x+","+$els[j].c2y+"\"<br />";
					res += "<span style=\"color: #"+$els[j].color+"\">c=\""+$els[j].color+","+$els[j].weight+","+$els[j].alpha+","+$els[j].foreground+"\"";
					if($els[j].c1x != undefined) res += " Fineness=\"" + $els[j].fineness + "\"";
					if(layers[i].link != -1) res += " M1=\"" + layers[i].link + "\" M2=\"" + layers[i].link + "\"";
					res += "</span></li>";
				}
				res += "</ul>";
			}
			res += "</li>";
			$e.append(res);
		}
		$("#layers p").click(function(e){
			if(e.target.tagName == "P")
			{
				setLayerTarget(e.target.id.slice(5));
			}
			if(e.target.tagName == "INPUT")
			{
				layers[e.target.id.slice(9)].nameChange(e.target.value);
				setLayerTarget($(e.target).parent("p").attr("id").slice(5));
			}
		});
		$("#layers p").bind('contextmenu', function(e) {
			$(document).bind('mousedown', function(){
				$(document).unbind('mousedown');
			});
			var linker = "<select id=\"linkTarget\"><option value=\"-1\">None</option>";
			for(var j=1;j<50;j++) linker += "<option value=\""+j+"\">"+j+"</option>";
			linker += "</select>";
			var e;
			if(e.target.tagName != "P") e = $(e.target).parent("p");
			else						e = $(e.target);
			e.append("<div>"+
				"<button onclick=\"$(this).parent('div').parent('p').children('input')[0].focus();$(this).parent('div').parent('p').children('input')[0].select();$(this).parent('div').remove('div');\">Rename</button>"+
				"<button onclick=\"if(confirm('Do you want to delete this layer?')){delLayer($(this).parent('div').parent('p')[0].id.slice(5));};$(this).parent('div').remove('div');\">Delete</button>"+
				linker+
				"<button onclick=\"layerSetLink($(this).parent('div').parent('p')[0].id.slice(5), $(this).parent('div').children('select').val());$(this).parent('div').remove('div');\">Link</button>"+
				"</div>");

			return false;
		});
		$("#layers p input").change(function(e){
			layers[e.target.id.slice(9)].nameChange(e.target.value);
		});
	}
	/*########################################*/
	p.reset = function()
	{
		layer.reset()
	};
	/*########################################*/
	p.setZoom = function(mag)
	{
		zoom = mag;
		p.wait();
	}
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
		var clr = getRGB(c);
		if(clr == null) return;
		p.background(clr.r, clr.g, clr.b);
	};
	p.DOT = function(w, c, a)
	{
		var clr = getRGB(c);
		if(clr == null) return;
		p.stroke(p.color(clr.r, clr.g, clr.b, a));
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
function setZoom(value)			{ processing.setZoom(value); }
function setTarget(value)		{ processing.setTarget(value); }
function setLayerTarget(value)	{ processing.setLayerTarget(value); }
function changeSelected(ifs)	{ return processing.changeSelected(ifs); }
function selectedForeground(but){
	var res = processing.changeSelected().foreground();
	but.className = res ? "on" : "off";
	$(but).text(res ? "FOREGROUND" : "BACKGROUND");
	processing.wait();
}
function color(value) {
	processing.setColor(value);
	processing2.call(null, value, null);
}
function weight(value) {
	processing.setWeight(value);
	processing2.call(value, null, null);
}
function alpha(value) {
	processing.setAlpha(value);
	processing2.call(null, null, value);
}
function foreground(but) {
	var res = processing.setForeground();
	but.className = res ? "on" : "off";
	$(but).text(res ? "FOREGROUND" : "BACKGROUND");
	processing.wait();
}
function bezier(value) {
	processing.setBezier(value);
	processing.wait();
}
function fineness(value) {
	processing.setFineness(value);
}

function addLayer()							{ processing.addLayer(); }
function delLayer(target)					{ processing.delLayer(target); }
function layerOrderDown(target)				{ processing.layerOrderDown(target); }
function layerOrderUp(target)				{ processing.layerOrderUp(target); }
function layerSetLink(target, linkGround)	{ processing.layerSetLink(target, linkGround); }
function elementOrderDown()					{ processing.elementOrderDown(); }
function elementOrderUp()					{ processing.elementOrderUp(); }
function toggleTree(onoff, target) {
	processing.toggleTree(target);
	$(onoff).toggleClass("off");
}
function toggleDisplay(onoff, target) {
	processing.toggleDisplay(target);
	$(onoff).toggleClass("off");
}
function reset()							{ processing.reset(); }
function generateXML()
{
	res = "<C><P /><Z><S /><D /><O /><L>";
	var layer = processing.getLayer();
	var layers = processing.getLayers();
	for(var i=0;i<layers.length;i++)
	{
		if(!layers[i].display) continue;
		res += "<VDEL n=\"" + layers[i].name + "\"l=\"" + layers[i].link + "\"/>";
		for(var j=0;j<layers[i].elements.length;j++)
		{
			var el = layers[i].elements[j];
			if(!el.display) continue;

			var dot = 0;
			if(el.x1 == el.x2 && el.y1 == el.y2) dot++;
			res += '<JD P1="'+el.x1+','+el.y1+'"P2="'+el.x2+','+(el.y2+dot)+'"c="'+el.color+','+el.weight+','+el.alpha+','+el.foreground+'"';
			if(layers[i].link != -1) res += 'M1="'+layers[i].link+'"M2="'+layers[i].link+'"';
			res += '/>';
		}
	}
	res += "</L></Z></C>";
	$("#xmlText").val(res);
}

function load()
{
	var layer = processing.getLayer();
	var layers = processing.getLayers();
	reset();
	
	var xml = $("#xmlLoad").val();
	var p1;
	var p2;
	var c;
	var link;
	var first = 0; //最初にVDEをロードした場合、初期レイヤーを廃棄する
	$(xml).find("JD, VDEL").each(function(index, e)
	{
		if(e.tagName == "VDEL")
		{
			if($(this).attr("n") != null && $(this).attr("l") != null)
			{
				link = parseInt($(this).attr("l"));
				if(isNaN(link)) return;
				if(first == 0) first = 1;
				processing.loadLayer($(this).attr("n"), link);
			}
		}
		if(e.tagName == "JD")
		{
			if($(this).attr("P1") != null && $(this).attr("P2") != null && $(this).attr("c") != null)
			{
				if(first == 0) first = -1;
				p1 = $(this).attr("P1").split(",");
				p2 = $(this).attr("P2").split(",");
				c = $(this).attr("c").split(",");
				if(p1.length != 2 || p2.length != 2 || c.length != 4) return;
				p1[0] = parseInt(p1[0]);
				p1[1] = parseInt(p1[1]);
				p2[0] = parseInt(p2[0]);
				p2[1] = parseInt(p2[1]);
				c[1] = parseInt(c[1]);
				c[2] = parseInt(c[2]*100)/100;
				c[3] = parseInt(c[3]);
				if(isNaN(p1[0])) return;
				if(isNaN(p1[1])) return;
				if(isNaN(p2[0])) return;
				if(isNaN(p2[1])) return;
				if(isNaN(c[1])) return;
				if(isNaN(c[2])) return;
				if(isNaN(c[3])) return;
				if(getRGB("#"+c[0]) == null) return;
				processing.loadLine([p1[0], p1[1]], [p2[0], p2[1]], c[0], c[1], c[2], c[3]);
			}
		}
	});
	if(first == 1) processing.loadFirst();
	processing.wait();
}

function getRGB(hex) {
	var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return res ? {
		r: parseInt(res[1], 16),
		g: parseInt(res[2], 16),
		b: parseInt(res[3], 16)
	} : null;
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
	$("#selectedX1").val("");
	$("#selectedY1").val("");
	$("#selectedX2").val("");
	$("#selectedY2").val("");
	$("#selectedC1X").val("");
	$("#selectedC1Y").val("");
	$("#selectedC2X").val("");
	$("#selectedC2Y").val("");
	$("#selectedColor").val("");
	$("#selectedWeight").val("");
	$("#selectedAlpha").val("");
	$("#selectedFineness").val("");
	
	$("#selectedX1").bind("keyup", function(){ changeSelected(-1).x1(this.value); });
	$("#selectedY1").bind("keyup", function(){ changeSelected(-1).y1(this.value); });
	$("#selectedX2").bind("keyup", function(){ changeSelected(-1).x2(this.value); });
	$("#selectedY2").bind("keyup", function(){ changeSelected(-1).y2(this.value); });
	$("#selectedC1X").bind("keyup", function(){ changeSelected(-1).c1x(this.value); });
	$("#selectedC1Y").bind("keyup", function(){ changeSelected(-1).c1y(this.value); });
	$("#selectedC2X").bind("keyup", function(){ changeSelected(-1).c2x(this.value); });
	$("#selectedC2Y").bind("keyup", function(){ changeSelected(-1).c2y(this.value); });
	
	$("#bezier").bind("change", function(){
		bezier($(this).is(":checked"));
	});


	
	$("#zoom").val(processing.getZoom());
	$("#color").val(processing.getColor());
	$("#weight").val(processing.getWeight());
	$("#alpha").val(processing.getAlpha());
	$("#fineness").val(processing.getFineness());
	
	$("#color").change(function(e)		{ color($(this).val()); });
	$("#weight").change(function(e)		{ weight($(this).val()); });
	$("#alpha").change(function(e)		{ alpha($(this).val()); });
	$("#fineness").change(function(e)	{ fineness($(this).val()); });
	
	var z = 10;
	//メニュー全般
	$(".draggable").draggable({
		handle: "h1",
//		snap: true,
		scroll: false,
		start: function(e, ui) {
			$(this).css("opacity", 0.8);
			$(this).css("height", $(this).innerHeight());
			if(z>9000) z = 10;
			$(this).css("z-index", z++);
		},
		stop: function(e, ui) {
			$(this).css("opacity", 1);
		}
	});
});