/*
 * Viprin's Drawing Editor!
 * Version 1.4.6
 * 18/06/14
 */

var body;
var main;
var canvas;

var processing;

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
		target = parseInt(target);
		if(this.layers.length > 1 && target < this.layers.length) {
			this.layers.splice(target, 1);
			if(this.target == this.layers.length) this.target--;
			return this.target;
		} else {
			alert("Failed to delete: You need to have 1 layer at least!");
			return -1;
		}
	},
	//レイヤーの削除できるかの確認
	delCheckLayer: function(target)
	{
		target = parseInt(target);
		if(this.layers.length > 1 && target < this.layers.length) {
			return 1;
		} else {
			return -1;
		}
	},
	//レイヤー情報の取得
	saveLayer: function(target)
	{
		return {
			name: this.layers[target].name,
			link: this.layers[target].link,
			display: this.layers[target].display,
			tree: this.layers[target].tree,
			elements: this.layers[target].elements
		};
	},
	//レイヤーのコピー
	copyLayer: function(target)
	{
		var s = this.saveLayer(target);
		var res = this.addLayer();

		this.layers[res].nameChange("Copy of " + s.name);
		this.layers[res].setLink(s.link);
		this.layers[res].setDisplay(s.display);
		this.layers[res].setTree(s.tree);

		for(var i=0;i<s.elements.length;i++) {
			var el = s.elements[i];
			if(el.c1x == undefined) {
				this.layers[res].addLine([el.x1, el.y1], [el.x2, el.y2], el.color, el.weight, el.alpha, el.foreground);
			} else {
				this.layers[res].addCurveWithC([el.x1, el.y1], [el.x2, el.y2], [el.c1x, el.c1y], [el.c2x, el.c2y], el.color, el.weight, el.alpha, el.foreground, el.fineness);
			}
		}

		return res;
	},
	//レイヤーの反転
	flipX: function(target)
	{
		var els = this.layers[target].elements;
		var sumX = 0;
		for(var i=0;i<els.length;i++) {
			sumX += els[i].x1 + els[i].x2;
		}
		var x = Math.round(sumX / 2 / els.length);
		for(i=0;i<els.length;i++) {
			this.layers[target].elements[i].x1 = x + (x - els[i].x1);
			this.layers[target].elements[i].x2 = x + (x - els[i].x2);
			if(this.layers[target].elements[i].c1x != undefined) {
				this.layers[target].elements[i].c1x = x + (x - els[i].c1x);
				this.layers[target].elements[i].c2x = x + (x - els[i].c2x);
			}
		}
	},
	//レイヤーの反転
	flipY: function(target)
	{
		var els = this.layers[target].elements;
		var sumY = 0;
		for(var i=0;i<els.length;i++) {
			sumY += els[i].y1 + els[i].y2;
		}
		var y = Math.round(sumY / 2 / els.length);
		for(i=0;i<els.length;i++) {
			this.layers[target].elements[i].y1 = y + (y - els[i].y1);
			this.layers[target].elements[i].y2 = y + (y - els[i].y2);
			if(this.layers[target].elements[i].c1y != undefined) {
				this.layers[target].elements[i].c1y = y + (y - els[i].c1y);
				this.layers[target].elements[i].c2y = y + (y - els[i].c2y);
			}
		}
	},
	//レイヤーの回転
	rotateLayer: function(target, rot_)
	{
		var rot = rot_ * Math.PI / 180;
		var els = this.layers[target].elements;
		var sumY = 0;
		for(var i=0;i<els.length;i++) {
			sumY += els[i].y1 + els[i].y2;
		}
		var y = Math.round(sumY / 2 / els.length);
		var sumX = 0;
		for(var i=0;i<els.length;i++) {
			sumX += els[i].x1 + els[i].x2;
		}
		var x = Math.round(sumX / 2 / els.length);

		for(i=0;i<els.length;i++) {
			var el = this.layers[target].elements[i];
			var x1 = Math.floor(x + Math.cos(rot)*(el.x1 - x) - Math.sin(rot)*(el.y1 - y));
			var x2 = Math.floor(x + Math.cos(rot)*(el.x2 - x) - Math.sin(rot)*(el.y2 - y));
			var y1 = Math.floor(y + Math.sin(rot)*(el.x1 - x) * Math.cos(rot)*(el.y1 - y));
			var y2 = Math.floor(y + Math.sin(rot)*(el.x2 - x) * Math.cos(rot)*(el.y2 - y));
			if(el.c1y != undefined) {
				var c1x = Math.floor(x + Math.cos(rot)*(el.c1x - x) - Math.sin(rot)*(el.c1y - y));
				var c2x = Math.floor(x + Math.cos(rot)*(el.c2x - x) - Math.sin(rot)*(el.c2y - y));
				var c1y = Math.floor(y + Math.sin(rot)*(el.c1x - x) * Math.cos(rot)*(el.c1y - y));
				var c2y = Math.floor(y + Math.sin(rot)*(el.c2x - x) * Math.cos(rot)*(el.c2y - y));
			}
			el.x1 = x1;
			el.x2 = x2;
			el.y1 = y1;
			el.y2 = y2;
			el.c1x = c1x;
			el.c2x = c2x;
			el.c1y = c1y;
			el.c2y = c2y;
		}
	},
	//レイヤーの移動
	moveLayer: function(target, x, y)
	{
		var els = this.layers[target].elements;
		if(isNaN(x)) x = 0;
		if(isNaN(y)) y = 0;
		for(var i=0;i<els.length;i++) {
			this.layers[target].elements[i].x1 += x;
			this.layers[target].elements[i].x2 += x;
			this.layers[target].elements[i].y1 += y;
			this.layers[target].elements[i].y2 += y;
			if(this.layers[target].elements[i].c1x != undefined) {
				this.layers[target].elements[i].c1x += x;
				this.layers[target].elements[i].c2x += x;
				this.layers[target].elements[i].c1y += y;
				this.layers[target].elements[i].c2y += y;
			}
		}
	},
	//レイヤーの結合
	mergeLayer: function(target)
	{
		this.layers[target].elements = this.layers[target-1].elements.concat(this.layers[target].elements);
		this.delLayer(target-1);
		return target - 1;
	},
	//レイヤーの結合できるかの確認
	mergeCheckLayer: function(target)
	{
		target = parseInt(target);
		if(this.layers.length > 1 && target < this.layers.length && target > 0) {
			return 1;
		} else {
			return -1;
		}
	},
	//操作レイヤーの変更
	setTarget: function(target)
	{
		target = parseInt(target);
		if(this.layers.length > target) this.target = target;
	},
	//レイヤーの順序変更
	orderUp: function(target)
	{
		target = parseInt(target);
		if(target < this.layers.length - 1)
		{
			var temp = this.layers[target+1];
			this.layers[target+1] = this.layers[target];
			this.layers[target] = temp;
			if(this.target == target) this.setTarget(this.target+1);
			else if(this.target == target+1) this.setTarget(this.target-1);
			return target+1;
		}
		return target;
	},
	//レイヤーの順序変更
	orderDown: function(target)
	{
		target = parseInt(target);
		if(target > 0)
		{
			var temp = this.layers[target-1];
			this.layers[target-1] = this.layers[target];
			this.layers[target] = temp;
			if(this.target == target) this.setTarget(this.target-1);
			else if(this.target == target-1) this.setTarget(this.target+1);
			return target-1;
		}
		return target;
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
		this.elements.push(new this.Line(xy1, xy2, color, weight, alpha, foreground));
	},
	//Curveエレメントの新規
	addCurve: function(xy1, xy2, color, weight, alpha, foreground, fineness)
	{
		xy1[0] = Math.round(xy1[0]);
		xy1[1] = Math.round(xy1[1]);
		xy2[0] = Math.round(xy2[0]);
		xy2[1] = Math.round(xy2[1]);
		this.elements.push(new this.Curve(xy1, xy2, xy1, xy2, color, weight, alpha, foreground, fineness));
	},
	//Curveエレメントの新規
	addCurveWithC: function(xy1, xy2, c1, c2, color, weight, alpha, foreground, fineness)
	{
		xy1[0] = Math.round(xy1[0]);
		xy1[1] = Math.round(xy1[1]);
		xy2[0] = Math.round(xy2[0]);
		xy2[1] = Math.round(xy2[1]);
		c1[0] = Math.round(c1[0]);
		c1[1] = Math.round(c1[1]);
		c2[0] = Math.round(c2[0]);
		c2[1] = Math.round(c2[1]);
		this.elements.push(new this.Curve(xy1, xy2, c1, c2, color, weight, alpha, foreground, fineness));
	},
	//エレメントの移動
	moveElement: function(target, xy1, xy2)
	{
		this.elements[target].x1 += xy1[0];
		this.elements[target].y1 += xy1[1];
		this.elements[target].x2 += xy2[0];
		this.elements[target].y2 += xy2[1];
		if(this.elements[target].c1x != undefined) {
			this.elements[target].c1x += xy1[0];
			this.elements[target].c1y += xy1[1];
			this.elements[target].c2x += xy2[0];
			this.elements[target].c2y += xy2[1];
		}
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
				if(this_.elements[target] != undefined)
					this_.elements[target].color = color_;
			},
			weight: function(weight_) {
				if(this_.elements[target] != undefined)
					this_.elements[target].weight = weight_;
			},
			alpha: function(alpha_) {
				if(this_.elements[target] != undefined)
					this_.elements[target].alpha = alpha_;
			},
			foreground: function(foreground_) {
				this_.elements[target].foreground = foreground_;
				return foreground_;
			},
			fineness: function(fineness_) {
				if(this_.elements[target] != undefined) {
					this_.elements[target].fineness = fineness_;
					return fineness_;
				}
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
	delElement: function(target)
	{
		this.elements.splice(target, 1);
	},
	//エレメント情報の取得
	saveElement: function(target)
	{
		var res = {};
		var el = this.elements[target];
		if(el != undefined) {
			res.x1 = el.x1;
			res.x2 = el.x2;
			res.y1 = el.y1;
			res.y2 = el.y2;
			res.color = el.color;
			res.weight = el.weight;
			res.alpha = el.alpha;
			res.foreground = el.foreground;
			if(el.c1x != undefined) {
				res.c1x = el.c1x;
				res.c1y = el.c1y;
				res.c2x = el.c2x;
				res.c2y = el.c2y;
				res.fineness = el.fineness;
			}
		}
		return res;
	},
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
	orderChange: function(target, value) {
		if(isNaN(value)) return target;
		if(target == value) return target;
		var els = this.elements;
		var temp = [];
		if(0 <= value && value < els.length) {
			if(target > value) {
				while(target > value) {
					this.orderDown(target);
					target--;
				}
			}
			if(target < value) {
				while(target < value) {
					this.orderUp(target);
					target++;
				}
			}
			return value;
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
	setDisplay: function(value) { this.display = value; },
	setTree: function(value) { this.tree = value; },
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
	Curve: function(xy1, xy2, c1, c2, color, weight, alpha, foreground, fineness)
	{
		this.x1			= xy1[0];
		this.y1			= xy1[1];
		this.x2			= xy2[0];
		this.y2			= xy2[1];
		this.c1x		= c1[0];
		this.c1y		= c1[1];
		this.c2x		= c2[0];
		this.c2y		= c2[1];
		this.color		= color;
		this.weight		= weight;
		this.alpha		= alpha;
		this.foreground	= foreground;
		this.fineness	= fineness;
		this.display	= 1;
	}
};

var Hist = function(layer) {
	this.history = [];
	this.historyRe = [];
	this.layer = layer;
};
Hist.prototype = {
	reset: function(layer) {
		this.history.length = 0;
		this.historyRe.length = 0;
		this.layer = layer;
	},
	get: function(){
		return this.history.length;
	},
	new: function(type, d) {
		this.historyRe.length = 0;
		this.history.unshift({
			type: type,
			d: d,
			number: this.history.length+1
		});
		if(this.history.length > 512) {
			this.history.length = 512;
		}
		return this.history.length;
	},
	add: function(type, d) {
		console.log('add');
		if(this.history.length > 0) {
			switch(this.history[0].type) {
				case "moveElementByArrow":
					if(
						this.history[0].type == type &&
						this.history[0].d.layer == d.layer &&
						this.history[0].d.target == d.target
					) {
						this.history[0].d.xy1[0] += d.xy1[0];
						this.history[0].d.xy1[1] += d.xy1[1];
						this.history[0].d.xy2[0] += d.xy2[0];
						this.history[0].d.xy2[1] += d.xy2[1];
						return;
					}
				break;
				case "updateElement":
					if(
						this.history[0].type == type &&
						this.history[0].d.layer == d.layer &&
						this.history[0].d.target == d.target
					) {
						if(this.history[0].d.item == d.item) {
							//古いものを残しておく
							//this.history[0].d.value = d.value;
							return;
						}
					}
				break;
			}
		}
		var number = this.new(type, d);
		return number;
	},
	undo: function(num) {
		if(this.history.length > 0) {
			var number = -1;
			var res = "";
			switch(this.history[0].type) {
				case "newline":
					number = this.do("undo").delElement();
					res =  "newline";
				break;
				case "paste":
					number = this.do("undo").delElement();
					res =  "paste";
				break;
				case "delElement":
					number = this.do("undo").addElement();
					res =  "delElement";
				break;
				case "elementOrderUp":
					number = this.do("undo").elementOrderDown();
					res =  "elementOrderUp";
				break;
				case "elementOrderDown":
					number = this.do("undo").elementOrderUp();
					res =  "elementOrderDown";
				break;
				case "elementOrderChange":
					number = this.do("undo").elementOrderChange();
					res =  "elementOrderChange";
				break;
				case "addLayer":
					number = this.do("undo").delLayer();
					res =  "addLayer";
				break;
				case "delLayer":
					number = this.do("undo").addLayer();
					res =  "delLayer";
				break;
				case "copyLayer":
					number = this.do("undo").delLayer();
					res =  "copyLayer";
				break;
				case "mergeLayer":
					number = this.do("undo").unmergeLayer();
					res =  "mergeLayer";
				break;
				case "moveLayer":
					number = this.do("undo").moveLayer();
					res =  "moveLayer";
				break;
				case "flipXLayer":
					number = this.do("undo").flipXLayer();
					res =  "flipXLayer";
				break;
				case "flipYLayer":
					number = this.do("undo").flipYLayer();
					res =  "flipYLayer";
				break;
				case "layerOrderUp":
					number = this.do("undo").layerOrderDown();
					res =  "layerOrderUp";
				break;
				case "layerOrderDown":
					number = this.do("undo").layerOrderUp();
					res =  "layerOrderDown";
				break;
				case "layerNameChange":
					number = this.do("undo").layerNameChange();
					res =  "layerNameChange";
				break;
				case "layerSetLink":
					number = this.do("undo").layerSetLink();
					res =  "layerSetLink";
				break;
				case "moveLine":
					number = this.do("undo").moveLine();
					res =  "moveLine";
				break;
				case "moveCurve":
					number = this.do("undo").moveCurve();
					res =  "moveCurve";
				break;
				case "deform":
					number = this.do("undo").deform();
					res =  "deform";
				break;
				case "deformC":
					number = this.do("undo").deformC();
					res =  "deformC";
				break;
				case "moveElementByArrow":
					number = this.do("undo").moveElemenetByArrow();
					res =  "moveElementByArrow";
				break;
				case "updateElement":
					number = this.do("undo").updateElement();
					res =  "updateElement";
				break;
			}
			return {number: number, type: res};
		}
	},
	redo: function(num) {
		if(this.historyRe.length > 0) {
			var number = -1;
			var res = "";
			switch(this.historyRe[0].type) {
				case "newline":
					number = this.do("redo").addElement();
					res = "newline";
				break;
				case "paste":
					number = this.do("redo").addElement();
					res = "paste";
				break;
				case "delElement":
					number = this.do("redo").delElement();
					res = "delElement";
				break;
				case "elementOrderUp":
					number = this.do("redo").elementOrderUp();
					res = "elementOrderUp";
				break;
				case "elementOrderDown":
					number = this.do("redo").elementOrderDown();
					res = "elementOrderDown";
				break;
				case "elementOrderChange":
					number = this.do("redo").elementOrderChange();
					res =  "elementOrderChange";
				break;
				case "addLayer":
					number = this.do("redo").addLayer();
					res = "addLayer";
				break;
				case "delLayer":
					number = this.do("redo").delLayer();
					res = "delLayer";
				break;
				case "copyLayer":
					number = this.do("redo").addLayer();
					res =  "copyLayer";
				break;
				case "mergeLayer":
					number = this.do("redo").mergeLayer();
					res =  "mergeLayer";
				break;
				case "moveLayer":
					number = this.do("redo").moveLayer();
					res =  "moveLayer";
				break;
				case "flipXLayer":
					number = this.do("redo").flipXLayer();
					res =  "flipXLayer";
				break;
				case "flipYLayer":
					number = this.do("redo").flipYLayer();
					res =  "flipYLayer";
				break;
				case "layerOrderUp":
					number = this.do("redo").layerOrderUp();
					res = "layerOrderUp";
				break;
				case "layerOrderDown":
					number = this.do("redo").layerOrderDown();
					res = "layerOrderDown";
				break;
				case "layerSetLink":
					number = this.do("redo").layerSetLink();
					res = "layerSetLink";
				break;
				case "layerNameChange":
					number = this.do("redo").layerNameChange();
					res = "layerNameChange";
				break;
				case "moveLine":
					number = this.do("redo").moveLine();
					res = "moveLine";
				break;
				case "moveCurve":
					number = this.do("redo").moveCurve();
					res = "moveCurve";
				break;
				case "deform":
					number = this.do("redo").deform();
					res = "deform";
				break;
				case "deformC":
					number = this.do("redo").deformC();
					res = "deformC";
				break;
				case "moveElementByArrow":
					number = this.do("redo").moveElemenetByArrow();
					res = "moveElementByArrow";
				break;
				case "updateElement":
					number = this.do("redo").updateElement();
					res = "updateElement";
				break;
			}
			return {number: number, type: res};
		}
	},
	//########################################
	//実行部分
	do: function(type) {
		if(type == "undo") {
			var history = this.history;
			var historyRe = this.historyRe;
		} else {
			var history = this.historyRe;
			var historyRe = this.history;
		}
		var h = history.shift();
		var d = h.d;
		var layer = this.layer;
		var layers = this.layer.layers;

		return {
			delElement: function()
			{
				var saveElement = layers[d.layer].saveElement(d.target);
				layers[d.layer].delElement(d.target);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: d.target,
						save: saveElement
					},
					number: h.number
				});
				return h.number;
			},
			addElement: function()
			{
				var s = d.save;
				if(s.c1x == undefined) {
					layers[d.layer].addLine([s.x1, s.y1], [s.x2, s.y2], s.color, s.weight, s.alpha, s.foreground);
				} else {
					layers[d.layer].addCurveWithC([s.x1, s.y1], [s.x2, s.y2], [s.c1x, s.c1y], [s.c2x, s.c2y], s.color, s.weight, s.alpha, s.foreground, s.fineness);
				}
				var tar = layers[d.layer].elements.length - 1;
				while(tar > d.target) {
					tar = layers[d.layer].orderDown(tar);
				}
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: d.target
					},
					number: h.number
				});
				return h.number;
			},
			moveLine: function()
			{
				var s = layers[d.layer].saveElement(d.target);
				layers[d.layer].updateElement(d.target).xy1(d.xy1);
				layers[d.layer].updateElement(d.target).xy2(d.xy2);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: d.target,
						xy1: [s.x1, s.y1],
						xy2: [s.x2, s.y2]
					},
					number: h.number
				});
				return h.number;
			},
			moveCurve: function()
			{
				var s = layers[d.layer].saveElement(d.target);
				layers[d.layer].updateElement(d.target).xy1(d.xy1);
				layers[d.layer].updateElement(d.target).xy2(d.xy2);
				layers[d.layer].updateElement(d.target).c1(d.c1);
				layers[d.layer].updateElement(d.target).c2(d.c2);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: d.target,
						xy1: [s.x1, s.y1],
						xy2: [s.x2, s.y2],
						c1: [s.c1x, s.c1y],
						c2: [s.c2x, s.c2y]
					},
					number: h.number
				});
				return h.number;
			},
			deform: function()
			{
				var s = layers[d.layer].saveElement(d.target);
				layers[d.layer].updateElement(d.target).xy1(d.xy1);
				layers[d.layer].updateElement(d.target).xy2(d.xy2);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: d.target,
						xy1: [s.x1, s.y1],
						xy2: [s.x2, s.y2]
					},
					number: h.number
				});
				return h.number;
			},
			deformC: function()
			{
				var s = layers[d.layer].saveElement(d.target);
				layers[d.layer].updateElement(d.target).c1(d.c1);
				layers[d.layer].updateElement(d.target).c2(d.c2);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: d.target,
						c1: [s.c1x, s.c1y],
						c2: [s.c2x, s.c2y]
					},
					number: h.number
				});
				return h.number;
			},
			moveElemenetByArrow: function()
			{
				var xy1 = [d.xy1[0] * (-1), d.xy1[1] * (-1)];
				var xy2 = [d.xy2[0] * (-1), d.xy2[1] * (-1)];
				layers[d.layer].moveElement(d.target, xy1, xy2);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: d.target,
						xy1: xy1,
						xy2: xy2
					},
					number: h.number
				});
				return h.number;
			},
			updateElement: function()
			{
				eval("var s = layers[d.layer].elements[d.target]." + d.item);
				eval("layers[d.layer].updateElement(d.target)." + d.item + "(d.value)");
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: d.target,
						item: d.item,
						value: s
					},
					number: h.number
				});
				return h.number;
			},
			elementOrderUp: function()
			{
				var res = layers[d.layer].orderUp(d.target);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: res
					},
					number: h.number
				});
				return h.number;
			},
			elementOrderDown: function()
			{
				var res = layers[d.layer].orderDown(d.target);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: res
					},
					number: h.number
				});
				return h.number;
			},
			elementOrderChange: function()
			{
				var res = layers[d.layer].orderChange(d.target, d.value);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						target: d.value,
						value: d.target
					},
					number: h.number
				});
				return h.number;
			},
			addLayer: function()
			{
				var s = d.save;
				layer.addLayer();
				var tar = layers.length - 1;
				layers[tar].nameChange(s.name);
				layers[tar].setLink(s.link);
				layers[tar].setDisplay(s.display);
				layers[tar].setTree(s.tree);
				for(var i=0;i<s.elements.length;i++) {
					var el = s.elements[i];
					if(el.c1x == undefined) {
						layers[tar].addLine([el.x1, el.y1], [el.x2, el.y2], el.color, el.weight, el.alpha, el.foreground);
					} else {
						layers[tar].addCurveWithC([el.x1, el.y1], [el.x2, el.y2], [el.c1x, el.c1y], [el.c2x, el.c2y], el.color, el.weight, el.alpha, el.foreground, el.fineness);
					}
				}

				while(tar > d.layer) {
					tar = layer.orderDown(tar);
				}
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer
					},
					number: h.number
				});
				return h.number;
			},
			delLayer: function()
			{
				var saveLayer = layer.saveLayer(d.layer);
				var res = layer.delLayer(d.layer);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						save: saveLayer
					},
					number: h.number
				});
				return h.number;
			},
			unmergeLayer: function()
			{
				var s = d.save;
				layers[d.layer].elements = layers[d.layer].elements.slice(s.elements.length);
				layer.addLayer();
				var tar = layers.length - 1;
				layers[tar].nameChange(s.name);
				layers[tar].setLink(s.link);
				layers[tar].setDisplay(s.display);
				layers[tar].setTree(s.tree);
				for(var i=0;i<s.elements.length;i++) {
					var el = s.elements[i];
					if(el.c1x == undefined) {
						layers[tar].addLine([el.x1, el.y1], [el.x2, el.y2], el.color, el.weight, el.alpha, el.foreground);
					} else {
						layers[tar].addCurveWithC([el.x1, el.y1], [el.x2, el.y2], [el.c1x, el.c1y], [el.c2x, el.c2y], el.color, el.weight, el.alpha, el.foreground, el.fineness);
					}
				}
				while(tar > d.layer) {
					tar = layer.orderDown(tar);
				}
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer+1
					},
					number: h.number
				});
				return h.number;
			},
			mergeLayer: function()
			{
				var saveLayer = layer.saveLayer(d.layer-1);
				layer.mergeLayer(d.layer);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer-1,
						save: saveLayer
					},
					number: h.number
				});
				return h.number;
			},
			moveLayer: function()
			{
				layer.moveLayer(d.layer, d.x*(-1), d.y*(-1));
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						x: d.x*(-1),
						x: d.y*(-1)
					},
					number: h.number
				});
				return h.number;
			},
			flipXLayer: function()
			{
				layer.flipX(d.layer);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer
					},
					number: h.number
				});
				return h.number;
			},
			flipYLayer: function()
			{
				layer.flipY(d.layer);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer
					},
					number: h.number
				});
				return h.number;
			},
			layerOrderUp: function()
			{
				var res = layer.orderUp(d.layer);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: res
					},
					number: h.number
				});
				return h.number;
			},
			layerOrderDown: function()
			{
				var res = layer.orderDown(d.layer);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: res
					},
					number: h.number
				});
				return h.number;
			},
			layerSetLink: function()
			{
				var temp = layers[d.layer].link;
				layers[d.layer].setLink(d.link);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						link: temp
					},
					number: h.number
				});
				return h.number;
			},
			layerNameChange: function()
			{
				var temp = layers[d.layer].name;
				layers[d.layer].nameChange(d.name);
				historyRe.unshift({
					type: h.type,
					d: {
						layer: d.layer,
						name: temp
					},
					number: h.number
				});
				return h.number;
			}
		}
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
	var scroll = 0;							//スクロール
	var scrollH = 0;							//たてスクロール
	var capacity = 0;						//容量

	var information = $("#information");

	var ctx = canvas.getContext('2d');		//画像表示用
	var img = new Image();					//画像表示用
	var imgWidth = 0;						//画像の長さ
	var imgHeight = 0;						//画像の高さ
	var imgX = 0;							//画像表示位置
	var imgY = 0;							//画像表示位置
	var imgSavedX = 0;						//画像移動用
	var imgSavedY = 0;						//画像移動用
	var imgAlpha = 1;						//画像透過率
	var imgZoom = 1;						//画像拡大縮小用
	var imgForeground = 0;					//画像を前面に表示させるか

	var copyElement;						//エレメントコピー用

	var backgroundColor = "6a7495";			//背景色

	var weight = 2;
	var color = "ffffff";
	var alpha = 1;
	var foreground = 0;
	var bezier = false;
	var fineness = 20;

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
	var hist = new Hist(layer);
	p.hist = hist;
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
	var setSavedImg = function(xy) {
		imgSavedX = xy[0];
		imgSavedY = xy[1];
	};
	var setImg = function(xy) {
		imgX = xy[0];
		imgY = xy[1];
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
	var getImgX = function(iz)		{ return iz == undefined ? Math.round(imgX*zoom) : imgX; };
	var getImgY = function(iz)		{ return iz == undefined ? Math.round(imgY*zoom) : imgY; };
	var getSavedImgX = function()	{ return imgSavedX; };
	var getSavedImgY = function()	{ return imgSavedY; };
	var getTfmX = function()		{ return getCardinalX() + getCenterX(); };
	var getTfmY = function()		{ return getCardinalY() + getCenterY(); };

	/*########################################*/
	p.setup = function()
	{
		p.frameRate(60);
		p.size(winX, winY);
		p.layerDisplay();
		//p.setBackgroundImage("http://spicyemu.formice.com/forum/data/avatars/l/5/5336.jpg?1353505063");
	};
	/*########################################*/
	p.draw = function()
	{
		if(wait == 1)	return;
		if(wait == 0)	wait++;
		else		wait = 1;
		p.format();
		if(imgForeground==0) p.IMAGE();
		p.elements(0);
		p.elements(1);
		if(imgForeground==1) p.IMAGE();
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
		addInfo = "mouseX = " + getZoomedOutX(getMouseX()-getTfmX()) + ", mouseY = " + getZoomedOutY(getMouseY()-getTfmY());
		addInfo += ", centerX = " + getCenterX() + ", centerY = " + getCenterY();
		addInfo += "<br />";
		addInfo += "Tool = " + (bezier ? "Bezier curve" : "Straight line");
		addInfo += ", Zoom = " + zoom;
		addInfo += ", Target = " + (target) + " in \"" + layers[layer.target].name + "\"";
		addInfo += ", Mode = " + mode;
		addInfo += "<br />Capacity = " + capacity + "/20000";
		information.html(addInfo);
		var elNumber = 0;
		for(var i=0;i<layers.length;i++)
			for(var j=0;j<layers[i].elements.length;j++)
				elNumber++;
		$("#layerInfo").html("Layer: " + layers.length + ", Elms: " + elNumber + " - " + capacity + "KB");
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
			p.elementChanged("newline", {
				layer: layer.target,
				target: target
			});
			p.setNewline(0, 0, 0, 0);
		}
		if(mode == "moving1" || mode == "moving3") {
			p.cursor(p.ARROW);
			var xy1 = [els[pretarget].x1, els[pretarget].y1];
			var xy2 = [els[pretarget].x2, els[pretarget].y2];
			p.updateElement(layer.target, pretarget).xy1([newline[2], newline[3]]);
			p.updateElement(layer.target, pretarget).xy2([newline[0], newline[1]]);
			p.updateElement(layer.target, pretarget).display(1);
			p.elementChanged("deform", {
				layer: layer.target,
				target: pretarget,
				xy1: xy1,
				xy2: xy2
			});
			p.setNewline(0, 0, 0, 0);
			mode = "new";
		}
		if(mode == "moving2") {
			var xy1 = [els[pretarget].x1, els[pretarget].y1];
			var xy2 = [els[pretarget].x2, els[pretarget].y2];
			p.updateElement(layer.target, pretarget).xy1([newline[2], newline[3]]);
			p.updateElement(layer.target, pretarget).xy2([newline[0], newline[1]]);
			p.updateElement(layer.target, pretarget).display(1);
			if(els[pretarget].c1x != undefined) {
				var c1 = [els[pretarget].c1x, els[pretarget].c1y];
				var c2 = [els[pretarget].c2x, els[pretarget].c2y];
				p.updateElement(layer.target, pretarget).c1([newC[0], newC[1]]);
				p.updateElement(layer.target, pretarget).c2([newC[2], newC[3]]);
				p.elementChanged("moveCurve", {
					layer: layer.target,
					target: pretarget,
					xy1: xy1,
					xy2: xy2,
					c1: c1,
					c2: c2
				});
			} else {
				p.elementChanged("moveLine", {
					layer: layer.target,
					target: pretarget,
					xy1: xy1,
					xy2: xy2
				});
			}
			p.setNewline(0, 0, 0, 0);
			mode = "new";
		}
		if(mode == "moving4") {
			var c1 = [els[pretarget].c1x, els[pretarget].c1y];
			var c2 = [els[pretarget].c2x, els[pretarget].c2y];
			p.updateElement(layer.target, pretarget).c1([getMovingCX(), getMovingCY()]);
			p.updateElement(layer.target, pretarget).display(1);
			p.elementChanged("deformC", {
				layer: layer.target,
				target: pretarget,
				c1: c1,
				c2: c2
			});
			p.setNewline(0, 0, 0, 0);
			mode = "new";
		}
		if(mode == "moving5") {
			var c1 = [els[pretarget].c1x, els[pretarget].c1y];
			var c2 = [els[pretarget].c2x, els[pretarget].c2y];
			p.updateElement(layer.target, pretarget).c2([getMovingCX(), getMovingCY()]);
			p.updateElement(layer.target, pretarget).display(1);
			p.elementChanged("deformC", {
				layer: layer.target,
				target: pretarget,
				c1: c1,
				c2: c2
			});
			p.setNewline(0, 0, 0, 0);
			mode = "new";
		}
	};
	/*########################################*/
	p.mouseDragged = function()
	{
		if(p.mouseButton != p.LEFT) return;
		wait = -1;
		if(mode == "drag") setCenter([getCenterX("iz")+getZoomedOutX(getMouseX()-getTfmX())-getSavedMouseX(), getCenterY("iz")+getZoomedOutY(getMouseY()-getTfmY())-getSavedMouseY()]);
		if(mode == "image") {
			var moved = [getZoomedOutX(getMouseX()-getTfmX())-getSavedMouseX(), getZoomedOutY(getMouseY()-getTfmY())-getSavedMouseY()];
			setImg([getSavedImgX()+moved[0], getSavedImgY()+moved[1]]);
		}
		if(mode == "new") p.setNewline(getSavedMouseX(), getSavedMouseY(), getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY()));

		var el = els[pretarget];

		if(mode == "move1") {
			mode = "moving1";
			setSavedMouse([el.x2, el.y2]);
			p.setNewline(getSavedMouseX(), getSavedMouseY(), getSavedMouseX(), getSavedMouseY());
			p.setTarget(pretarget);
			p.updateElement(layer.target, pretarget).display(0);
		}
		if(mode == "move3") {
			mode = "moving3";
			setSavedMouse([el.x1, el.y1]);
			p.setNewline(getSavedMouseX(), getSavedMouseY(), getSavedMouseX(), getSavedMouseY());
			p.setTarget(pretarget);
			p.updateElement(layer.target, pretarget).display(0);
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
			p.updateElement(layer.target, pretarget).display(0);
		}
		if(mode == "move4") {
			mode = "moving4";
			setSavedMouse([el.c1x, el.c1y]);
			setMovingC([el.c1x, el.c1y]);
			p.setNewline(el.x1, el.y1, el.x2, el.y2);
			p.setTarget(pretarget);
			p.updateElement(layer.target, pretarget).display(0);
		}
		if(mode == "move5") {
			mode = "moving5";
			setSavedMouse([el.c2x, el.c2y]);
			setMovingC([el.c2x, el.c2y]);
			p.setNewline(el.x1, el.y1, el.x2, el.y2);
			p.setTarget(pretarget);
			p.updateElement(layer.target, pretarget).display(0);
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
		if(mode != "drag" && mode != "layer" && mode != "image" && mode != "layermove")
		{
			els.reverse();
			var mouse2 = [getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY())];
			var selecting = -1;
			for(var i=-1;i<els.length;i++) {
				if(i==-1) {
					el = els[els.length-target-1];
					selecting = target;
					if(el == undefined) continue;
				} else {
					el = els[i];
					selecting = els.length-i-1;
				}

				if(el.c1x != undefined) {
					if(helper.bezier1 && distance(mouse2, [el.c1x, el.c1y]) < 7/getZoom()) {
						p.cursor(p.HAND);
						if(mode != "move4") p.wait();
						mode = "move4";
						pretarget = selecting;
						break;
					} else if(helper.bezier2 && distance(mouse2, [el.c2x, el.c2y]) < 7/getZoom()) {
						p.cursor(p.HAND);
						if(mode != "move5") p.wait();
						mode = "move5";
						pretarget = selecting;
						break;
					}
				}

				if(helper.middle && distance(mouse2, [(el.x1+el.x2)/2, (el.y1+el.y2)/2]) < 7/getZoom()) {
					p.cursor(p.MOVE);
					if(mode != "move2") p.wait();
					mode = "move2";
					pretarget = selecting;
					break;
				} else if(helper.start && distance(mouse2, [el.x1, el.y1]) < 7/getZoom()) {
					p.cursor(p.HAND);
					if(mode != "move1") p.wait();
					mode = "move1";
					pretarget = selecting;
					break;
				}
				else if(helper.end && distance(mouse2, [el.x2, el.y2]) < 7/getZoom()) {
					p.cursor(p.HAND);
					if(mode != "move3") p.wait();
					mode = "move3";
					pretarget = selecting;
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
	p.KEYPRESSED = function(key)
	{
		if(key != undefined)	key = key;
		else					key = p.keyCode;
		if(key == 27 || key == 82) setCenter([0, 0]);
		if(key == 32) {
			if(mode != "new") p.mouseReleased();
			mode = "drag";
			setSavedMouse([getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY())]);
			p.setNewline(0, 0, 0, 0);
		}
		if(key == 76) {
			if(mode != "new") p.mouseReleased();
			mode = "layer";
			setSavedMouse([getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY())]);
			p.setNewline(0, 0, 0, 0);
		}
		if(key == 73) {
			if(mode != "new") p.mouseReleased();
			mode = "image";
			setSavedMouse([getZoomedOutX(getMouseX()-getTfmX()), getZoomedOutY(getMouseY()-getTfmY())]);
			setSavedImg([imgX, imgY]);
			p.setNewline(0, 0, 0, 0);
		}
		var el = els[target];
		if(key == 37 && target != -1) p.moveElement(target, [-1, 0], [-1, 0]);
		if(key == 38 && target != -1) p.moveElement(target, [0, -1], [0, -1]);
		if(key == 39 && target != -1) p.moveElement(target, [1, 0], [1, 0]);
		if(key == 40 && target != -1) p.moveElement(target, [0, 1], [0, 1]);
		if(key == 83) setHelper("start");
		if(key == 77) setHelper("middle");
		if(key == 69) setHelper("end");
		if(key == 84) setHelper("target");
		p.wait();
	};
	/*########################################*/
	p.KEYRELEASED = function(key)
	{
		if(key != undefined)	key = key;
		else					key = p.keyCode;
		wait = -1;
		if(key == 32) mode = "wait";//SPACE
		if(key == 76) mode = "wait";//L
		if(key == 73) mode = "wait";//I
		if(key == 90) {
			if(mode != "moving1" && mode != "moving2" && mode != "moving3" && mode != "moving4" && mode != "moving5") {
				var res = hist.undo(1);
				if(res != undefined) {
					history(1).add("["+res.number+"] Undo("+res.type+").");
					p.setSelected();
					p.layerDisplay();
				}
			}
		}
		if(key == 89) {
			if(mode != "moving1" && mode != "moving2" && mode != "moving3" && mode != "moving4" && mode != "moving5") {
				var res = hist.redo(1);
				if(res != undefined) {
					history(1).add("["+res.number+"] Redo("+res.type+").");
					p.setSelected();
					p.layerDisplay();
				}
			}
		}
		if(key == 67) {
			if(els[target] != undefined) {
				var el = els[target];
				if(el.c1x != undefined) {
					copyElement = new Layers.prototype.Layer.prototype.Curve([el.x1, el.y1], [el.x2, el.y2], [el.c1x, el.c1y], [el.c2x, el.c2y], el.color, el.weight, el.alpha, el.foreground, el.fineness);
				} else {
					copyElement = new Layers.prototype.Layer.prototype.Line([el.x1, el.y1], [el.x2, el.y2], el.color, el.weight, el.alpha, el.foreground);
				}
				history(1).add("Copied an element.");
			}
		}
		if(key == 86) {
			if(copyElement != undefined) {
				var el = copyElement;
				if(copyElement.c1x != undefined) {
					layers[layer.target].addCurveWithC([el.x1, el.y1], [el.x2, el.y2], [el.c1x, el.c1y], [el.c2x, el.c2y], el.color, el.weight, el.alpha, el.foreground, el.fineness);
					p.elementChanged("paste", {
						layer: layer.target,
						target: target
					});
				} else {
					layers[layer.target].addLine([el.x1, el.y1], [el.x2, el.y2], el.color, el.weight, el.alpha, el.foreground);
					p.elementChanged("paste", {
						layer: layer.target,
						target: target
					});
				}
				p.updateEls();
				p.setTarget(els.length - 1);
			}
		}
		//DELETEはprocessingなら127
		if(key == 46 || key == 68)
		{
			if(mode != "moving1" && mode != "moving2" && mode != "moving3" && mode != "moving4" && mode != "moving5") {
				var saveElement = layers[layer.target].saveElement(target);
				if( saveElement['x1'] !== undefined ){
					layers[layer.target].delElement(target);
					p.elementChanged("delElement", {
						layer: layer.target,
						target: target,
						save: saveElement
					});
					setTarget(target-1);
				}
			}
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
		p.layerDisplay();
		p.wait();
		canvas.focus();
	};
	p.setTarget = function(value)
	{
		target = value;
		if(target < 0) target = 0;

		if(layers[layer.target].elements[target] == undefined) {
			mode = "new";
			p.cursor(p.ARROW);
		}

		p.setSelected(target);
		p.updateSelectedSlider();
		p.layerDisplay();
		p.wait();
		canvas.focus();
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
			$("#selectedZ").val("-");
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
			$("#selectedDelete").removeClass("off").removeClass("on");
			$("#selectedDelete").addClass("disable");
		} else {
			var el = els[target];
			$("#selectedZ").val(target);
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
			$("#selectedDelete").text("DELETE");
			$("#selectedDelete").removeClass("off").removeClass("on").removeClass("disable");
			$("#selectedDelete").addClass("on");
		}
	};
	p.updateSelectedSlider = function()
	{
		updateSelectedSliderDo();
	};
	p.changeSelected = function(ifselected, newValue)
	{
		return {
			del: function() {
				var saveElement = layers[layer.target].saveElement(target);
				layers[layer.target].delElement(target);
				p.elementChanged("delElement", {
					layer: layer.target,
					target: target,
					save: saveElement
				});
				setTarget(target-1);
			},
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
				if(!isNaN(value)) p.updateElement(layer.target, target, ifselected).x1(value);
				p.wait();
			},
			y1: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(layer.target, target, ifselected).y1(value);
				p.wait();
			},
			x2: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(layer.target, target, ifselected).x2(value);
				p.wait();
			},
			y2: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(layer.target, target, ifselected).y2(value);
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
				if(!isNaN(value)) p.updateElement(layer.target, target, ifselected).c1x(value);
				p.wait();
			},
			c1y: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(layer.target, target, ifselected).c1y(value);
				p.wait();
			},
			c2x: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(layer.target, target, ifselected).c2x(value);
				p.wait();
			},
			c2y: function(value) {
				value = parseInt(value);
				if(!isNaN(value)) p.updateElement(layer.target, target, ifselected).c2y(value);
				p.wait();
			},
			color: function(value) {
				var clr = getRGB(value);
				if(clr == null) return;
				p.updateElement(layer.target, target, ifselected).color(value);
				$("#selectedColor").val(value);
				p.wait();
			},
			weight: function(value) {
				p.updateElement(layer.target, target, ifselected, newValue).weight(value);
				$("#selectedWeight").val(value);
				p.wait();
			},
			alpha: function(value) {
				p.updateElement(layer.target, target, ifselected, newValue).alpha(value/100);
				$("#selectedAlpha").val(value);
				p.wait();
			},
			fineness: function(value) {
				p.updateElement(layer.target, target, ifselected, newValue).fineness(value);
				$("#selectedFineness").val(value);
				p.wait();
			},
			foreground: function() {
				return p.updateElement(layer.target, target, ifselected).foreground((els[target].foreground) ? 0 : 1);
			}
		};
	};
	/*########################################*/
	p.setColor = function(value)			{
		var clr = getRGB(value);
		if(clr == null) return;
		color = value;
	};
	p.setWeight = function(value)			{ weight = value; };
	p.setAlpha = function(value)			{ alpha = value/100; };
	p.setForeground = function(value	)	{ foreground ^= 1; return foreground; };
	p.setBackgroundImage = function(from, f){
		img = new Image();
		if(from=="web") {
			img.onload = function() {
				if(img.height > 0) {
					imgX = 0;
					imgY = 0;
					imgWidth = img.width;
					imgHeight = img.height;
					imgZoom = 1;
					p.wait();
				} else {
					imgWidth = 0;
					imgHeight = 0;
					alert("Image does not exist.");
				}
			};
			img.src = $("#bgImageWeb").val();
		} else if(from=="local") {
			if(!f.files.length) return;
			if(!f.files[0].type.match('image.*')) return;
			var fr = new FileReader();
			fr.onload = function(e) {
				img.onload = function() {
					if(img.width > 0 && img.height > 0) {
						imgX = 0;
						imgY = 0;
						imgWidth = img.width;
						imgHeight = img.height;
						imgZoom = 1;
						p.wait();
					} else {
						imgWidth = 0;
						imgHeight = 0;
						alert("Image does not exist.");
					}
				};
				img.src = e.target.result;
			};
			fr.readAsDataURL(f.files[0]);
		}
	};
	p.setBackgroundColor = function(value)	{
		var clr = getRGB(value);
		if(clr == null) return;
		backgroundColor = value;
	};
	p.setImgAlpha = function(value) {
		imgAlpha = value/100;
	};
	p.setImgZoom = function(value) {
		imgZoom = value;
	};
	p.setImgForeground = function(value) {
		imgForeground ^= 1;
		return imgForeground;
	};
	p.setBezier = function(value)			{ bezier = value; };
	p.setFineness = function(value)			{ fineness = value; };
	p.setCapacity = function(value)			{ capacity = value; p.wait(); };
	p.setScroll = function(value)			{ scroll ^= 1; p.wait(); return scroll; };
	p.setScrollH = function(value)			{ scrollH ^= 1; p.wait(); return scrollH; };
	p.setZoom = function(mag)				{ zoom = mag; p.wait(); };
	p.getZoom = function()					{ return zoom; };
	p.getScroll = function()				{ return scroll; };
	p.getScrollH = function()				{ return scrollH; };
	p.getColor = function()					{ return color; };
	p.getWeight = function()				{ return weight; };
	p.getAlpha = function()					{ return alpha*100; };
	p.getBezier = function()				{ return bezier; };
	p.getFineness = function()				{ return fineness; };
	p.getForeground = function()			{ return foreground; };
	p.getBackgroundColor = function()		{ return backgroundColor; };
	/*########################################*/
	p.toggleTree = function(tar)		{
		layers[tar].toggleTree();
		p.layerDisplay();
		p.wait();
	};
	p.toggleDisplay = function(tar)		{
		layers[tar].toggleDisplay();
		p.layerDisplay();
		p.wait();
	};
	/*########################################*/
	p.getLayer = function()				{ return layer; };
	p.getLayers = function()			{ return layers; };
	/*########################################*/
	p.updateEls = function() {
		els = layers[layer.target].elements;
	};
	p.addLayer = function() {
		els = layers[layer.addLayer()].elements;
		p.elementChanged("addLayer", {
			layer: layer.target
		});
		p.setTarget(-1);
		p.wait();
	};
	p.delLayer = function(tar) {
		var res = layer.delCheckLayer(tar);
		if(res != -1) {
			var saveLayer = layer.saveLayer(tar);
			res = layer.delLayer(tar);
			els = layers[res].elements;
			p.elementChanged("delLayer", {
				layer: tar,
				save: saveLayer
			});
			p.setTarget(-1);
			p.wait();
		} else {
			alert("Failed to delete: You need to have 1 layer at least!");
		}
	};
	p.copyLayer = function(tar) {
		els = layers[layer.copyLayer(tar)].elements;
		p.elementChanged("copyLayer", {
			layer: layer.target
		});
		p.setTarget(-1);
		p.wait();
	};
	p.mergeLayer = function(tar) {
		var res = layer.mergeCheckLayer(tar);
		if(res != -1) {
			var saveLayer = layer.saveLayer(tar-1);
			els = layers[layer.mergeLayer(tar)].elements;
			p.elementChanged("mergeLayer", {
				layer: tar-1,
				save: saveLayer
			});
			p.setTarget(-1);
			p.wait();
		} else {
			alert("Failed to merge: There is not a layer which can be merged!");
		}
	};
	p.flipXLayer = function(tar) {
		layer.flipX(tar);
		p.elementChanged("flipXLayer", {
			layer: tar
		});
		p.setTarget(-1);
		p.wait();
	};
	p.flipYLayer = function(tar) {
		layer.flipY(tar);
		p.elementChanged("flipYLayer", {
			layer: tar
		});
		p.setTarget(-1);
		p.wait();
	};
	p.moveLayer = function(tar, x_, y_) {

		var x = parseInt(x_);
		var y = parseInt(y_);
		layer.moveLayer(tar, x, y);
		p.elementChanged("moveLayer", {
			layer: tar,
			x: x,
			y: y
		});
		p.wait();
	};
	p.rotateLayer = function(tar, rot_) {

		var rot = parseInt(rot_);
		layer.rotateLayer(tar, rot);
		p.wait();
	};
	p.layerOrderUp = function(tar) {
		var res = layer.orderUp(tar);
		if(res != tar) {
			p.setTarget(-1);
			p.elementChanged("layerOrderUp", {
				layer: res
			});
			p.wait();
		}
	};
	p.layerOrderDown = function(tar) {
		var res = layer.orderDown(tar);
		if(res != tar) {
			p.setTarget(-1);
			p.elementChanged("layerOrderDown", {
				layer: res
			});
			p.wait();
		}
	};
	p.layerNameChange = function(tar, value) {
		var temp = layers[tar].name;
		layers[tar].nameChange(value);
		p.elementChanged("layerNameChange", {
			layer: tar,
			name: temp
		});
		p.wait();
	};
	p.layerSetLink = function(tar, linkGround) {
		var temp = layers[tar].link;
		layers[tar].setLink(linkGround);
		p.elementChanged("layerSetLink", {
			layer: tar,
			link: temp
		});
		p.wait();
	};
	p.updateElement = function(layerTar, tar, ifselected, newValue) {
		var el = layers[layerTar].elements[tar];
		var value = undefined;
		if(el != undefined) {
			if(ifselected == "x1")			value = el.x1;
			if(ifselected == "y1")			value = el.y1;
			if(ifselected == "x2")			value = el.x2;
			if(ifselected == "y2")			value = el.y2;
			if(ifselected == "c1x")			value = el.c1x;
			if(ifselected == "c1y")			value = el.c1y;
			if(ifselected == "c2x")			value = el.c2x;
			if(ifselected == "c2y")			value = el.c2y;
			if(ifselected == "color")		value = el.color;
			if(ifselected == "foreground")	value = el.foreground;

			if(ifselected == "weight") {
				if(el.weight != newValue) value = el.weight;
			}
			if(ifselected == "alpha") {
				if(el.alpha*100 != newValue) value = el.alpha;
			}
			if(ifselected == "fineness") {
				if(el.c1x != undefined) {
					if(el.fineness != newValue) value = el.fineness;
				}
			}
		}

		var res = layers[layerTar].updateElement(tar);

		if(ifselected == undefined) {
			//p.setSelected();
		} else {
			if(value != undefined) {
				p.elementChanged("updateElement", {
					layer: layerTar,
					target: tar,
					item: ifselected,
					value: value
				});
			}
		}
		return res;
	};
	p.moveElement = function(tar, xy1, xy2) {
		var el = els[tar];
		layers[layer.target].moveElement(tar, xy1, xy2);
		p.elementChanged("moveElementByArrow", {
			layer: layer.target,
			target: tar,
			xy1: xy1,
			xy2: xy2
		});
		p.setSelected();
		p.wait();
	};
	p.elementOrderUp = function() {
		var res = layers[layer.target].orderUp(target);
		if(res != target) {
			setTarget(res);
			p.elementChanged("elementOrderUp", {
				layer: layer.target,
				target: res
			});
			p.wait();
		}
	};
	p.elementOrderDown = function() {
		var res = layers[layer.target].orderDown(target);
		if(res != target) {
			setTarget(res);
			p.elementChanged("elementOrderDown", {
				layer: layer.target,
				target: res
			});
			p.wait();
		}
	};
	p.elementOrderChange = function(value) {
		value = parseInt(value);
		if(isNaN(value)) return;

		var saveTarget = target;
		var res = layers[layer.target].orderChange(target, value);
		if(res != target) {
			setTarget(res);
			p.elementChanged("elementOrderChange", {
				layer: layer.target,
				target: value,
				value: saveTarget
			});
			p.wait();
		}
	};
	p.loadFirst = function() {
		p.delLayer(0);
	};
	p.loadLayer = function(name, link) {
		p.addLayer();
		layers[layer.target].nameChange(name);
		layers[layer.target].setLink(link);
	};
	p.loadLine = function(xy1, xy2, color, weight, alpha, foreground) {
		layers[layer.target].addLine(xy1, xy2, color, weight, alpha, foreground);
		p.updateEls();
		p.setTarget(els.length - 1);
	};
	p.loadCurve = function(xy1, xy2, c1, c2, color, weight, alpha, foreground, fineness) {
		layers[layer.target].addCurveWithC(xy1, xy2, c1, c2, color, weight, alpha, foreground, fineness);
		p.updateEls();
		p.setTarget(els.length - 1);
	};
	/*########################################*/
	p.elementChanged = function(type, d) {
		var number;
		switch(type) {
			case "newline":
				number = hist.new(type, d);
				history().add("["+number+"] Drew new line.");
			break;
			case "paste":
				number = hist.new(type, d);
				history().add("["+number+"] Pasted an element.");
			break;
			case "delElement":
				number = hist.new(type, d);
				history().add("["+number+"] Deleted an element.");
			break;
			case "moveLine":
				number = hist.new(type, d);
				history().add("["+number+"] Moved an element.");
			break;
			case "moveCurve":
				number = hist.new(type, d);
				history().add("["+number+"] Moved an element.");
			break;
			case "deform":
				number = hist.new(type, d);
				history().add("["+number+"] Deformed an element.");
			break;
			case "deformC":
				number = hist.new(type, d);
				history().add("["+number+"] Deformed an element.");
			break;
			case "moveElementByArrow":
				number = hist.add(type, d);
				if(number != undefined) {
					history().add("["+number+"] Moved an element.");
				}
			break;
			case "updateElement":
				if( hist.get() !== 0 ){
					number = hist.add(type, d);
					if(number != undefined) {
						history().add("["+number+"] Updated an element("+d.item+").");
					}
					setTimeout(function(){
						p.layerDisplay();
					}, 100);
				}
			break;
			case "elementOrderUp":
				number = hist.new(type, d);
				history().add("["+number+"] Changed orders of elements.");
			break;
			case "elementOrderDown":
				number = hist.new(type, d);
				history().add("["+number+"] Changed orders of elements.");
			break;
			case "elementOrderChange":
				number = hist.new(type, d);
				history().add("["+number+"] Changed orders of elements.");
			break;
			case "addLayer":
				number = hist.new(type, d);
				history().add("["+number+"] Made new layer.");
			break;
			case "delLayer":
				number = hist.new(type, d);
				history().add("["+number+"] Deleted \""+d.save.name+"\".");
			break;
			case "copyLayer":
				number = hist.new(type, d);
				history().add("["+number+"] Copied a layer.");
			break;
			case "mergeLayer":
				number = hist.new(type, d);
				history().add("["+number+"] Merged layers.");
			break;
			case "moveLayer":
				number = hist.new(type, d);
				history().add("["+number+"] Moved a layer.");
			break;
			case "flipXLayer":
				number = hist.new(type, d);
				history().add("["+number+"] Flipped a layer(X).");
			break;
			case "flipYLayer":
				number = hist.new(type, d);
				history().add("["+number+"] Flipped a layer(Y).");
			break;
			case "layerOrderUp":
				number = hist.new(type, d);
				history().add("["+number+"] Changed orders of layers.");
			break;
			case "layerOrderDown":
				number = hist.new(type, d);
				history().add("["+number+"] Changed orders of layers.");
			break;
			case "layerNameChange":
				number = hist.new(type, d);
				history().add("["+number+"] Changed layer name.");
			break;
			case "layerSetLink":
				number = hist.new(type, d);
				history().add("["+number+"] Set link.");
			break;
		}
		p.layerDisplay();
	};



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

		var points = getCurve(xy1, xy2, c1, c2, fineness);
		for(var i in points) {
			var q = points[i];
			p.line(q.x1+getTfmX(), q.y1+getTfmY(), q.x2+getTfmX(), q.y2+getTfmY());
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
	p.IMAGE = function()
	{
		if(imgWidth > 0 && imgHeight > 0) {
			ctx.save();
			ctx.globalAlpha = imgAlpha;
			var x = getTfmX()+getZoomedX(imgX);
			var y = getTfmY()+getZoomedY(imgY);
			var w = imgWidth*getZoom() * imgZoom;
			var h = imgHeight*getZoom() * imgZoom;
			ctx.drawImage(img, x, y, w, h);
			ctx.restore();
		}
	};



	/*########################################*/
	p.format = function()
	{
		p.BACKGROUND("#" + backgroundColor);
		var clr = getRGB("#" + backgroundColor);
		if(clr == null) return;
		var formatColor = (parseInt(clr.r)+parseInt(clr.g)+parseInt(clr.b))/3 > 127 ? "#000000" : "#ffffff";
		var formatColorH = (parseInt(clr.r)+parseInt(clr.g)+parseInt(clr.b))/3 > 127 ? "#339933" : "#66ff66";
		p.strokeCap(p.SQUARE);
		p.LINE([0, 0],	[800, 0],	formatColor, 1, 64);
		p.LINE([0, 22],	[800, 22],	formatColor, 1, 64);
		p.LINE([0, 400],[800, 400],	formatColor, 1, 64);
		p.LINE([0, 600],[800, 600],	formatColor, 1, 64);
		p.LINE([0, 0],	[0, 600],	formatColor, 1, 64);
		p.LINE([800, 0],[800, 600],	formatColor, 1, 64);
		if(scroll) {
			p.LINE([800, 0],	[1600, 0],		formatColor, 1, 64);
			p.LINE([800, 22],	[1600, 22],		formatColor, 1, 64);
			p.LINE([800, 400],	[1600, 400],	formatColor, 1, 64);
			p.LINE([800, 600],	[1600, 600],	formatColor, 1, 64);
			p.LINE([1600, 0],	[1600, 600],	formatColor, 1, 64);
		}
		if(scrollH) {
			p.LINE([0, 400],	[800, 400],	formatColorH, 1, 64);
			p.LINE([0, 422],	[800, 422],	formatColorH, 1, 64);
			p.LINE([0, 800],[800, 800],	formatColorH, 1, 64);
			p.LINE([0, 1000],[800, 1000],	formatColorH, 1, 64);
			p.LINE([0, 400],	[0, 1000],	formatColorH, 1, 64);
			p.LINE([800, 400],[800, 1000],	formatColorH, 1, 64);
		}
		if(scroll && scrollH) {
			p.LINE([800, 400],	[1600, 400],	formatColorH, 1, 64);
			p.LINE([800, 422],	[1600, 422],	formatColorH, 1, 64);
			p.LINE([800, 800],[1600, 800],	formatColorH, 1, 64);
			p.LINE([800, 1000],[1600, 1000],	formatColorH, 1, 64);
			p.LINE([800, 400],	[800, 1000],	formatColorH, 1, 64);
			p.LINE([1600, 400],[1600, 1000],	formatColorH, 1, 64);
		}
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
					/*
					if(helper.target && j == target)
					{
						p.LINE([(el.x1+el.x2)/2, (el.y1+el.y2)/2], [(el.x1+el.x2)/2, (el.y1+el.y2)/2], "#ffffff", 12, 255, "ignoreZoom");
						p.LINE([(el.x1+el.x2)/2, (el.y1+el.y2)/2], [(el.x1+el.x2)/2, (el.y1+el.y2)/2], "#6a7495", 10, 255, "ignoreZoom");
						p.LINE([(el.x1+el.x2)/2, (el.y1+el.y2)/2], [(el.x1+el.x2)/2, (el.y1+el.y2)/2], "#ffffff", 6, 255, "ignoreZoom");
					}
					*/
				}
			}
		}
		if(layers[layer.target].display) {
			var el = layers[layer.target].elements[target];
			if(el != undefined) {
				if(el.display) {
					if(helper.start) p.CROSS([el.x1, el.y1], 5, "#ffff00", 2, 255);
					if(helper.middle) p.CROSS([(el.x1+el.x2)/2, (el.y1+el.y2)/2], 5, "#00ffff", 2, 255);
					if(helper.end) p.CROSS([el.x2, el.y2], 5, "#ffff00", 2, 255);
					if(el.c1x != undefined) {
						if(helper.bezier1) p.CROSS([el.c1x, el.c1y], 5, "#00ff00", 2, 255);
						if(helper.bezier2) p.CROSS([el.c2x, el.c2y], 5, "#00ff00", 2, 255);
					}
				}
			}
		}
	};
	/*########################################*/
	p.layerDisplay = function()
	{
		generateXML();
		var $e;
		$e = $("#layers");
		$e.empty();
		for(var i=layers.length-1;i>=0;i--)
		{
			var $els = layers[i].elements;
//			var res = "<li><p onclick=\"toggleTree(this, " + i + ")\"> ";
			var res = "<li class=\"test\"><p id=\"layer" + i + "\"";
			if(layer.target == i) res += " class=\"selected\"";
			res += ">";
			res += "<img src=\"./images/tree_";
			res += layers[i].tree ? "on" : "off";
			res += ".gif\" onclick=\"toggleTree(this, " + i + ")\" />";
			res += " <input type=\"test\" id=\"layerName" + i + "\" value=\"" + layers[i].name + "\" />";
			res += " [" + $els.length + "]";
			if(layers[i].link != -1)	res += " &lt;" + layers[i].link + "&gt;";
			res += "<span>";
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
					res += "><span class=\"no\">" + (j) + "</span>P1=\""+$els[j].x1+","+$els[j].y1+"\" P2=\""+$els[j].x2+","+$els[j].y2+"\"<br />";
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
		$("#layers").find("p").click(function(e){
			if(e.target.tagName == "P")
			{
				setLayerTarget(e.target.id.slice(5));
			}
			if(e.target.tagName == "INPUT")
			{
				layers[e.target.id.slice(9)].nameChange(e.target.value);
				setLayerTarget($(e.target).parent("p").attr("id").slice(5));
			}
		}).bind('contextmenu', function(e) {
			$(document).bind('mousedown', function(){
				$(document).unbind('mousedown');
			});
			var linker = "<select id=\"linkTarget\"><option value=\"-1\">None</option>";
			for(var j=1;j<50;j++) linker += "<option value=\""+j+"\">"+j+"</option>";
			linker += "</select>";
			var e2;
			/*
				<ul>
					<li><p>layer name</p>
						<ul>
							<li>element</li>
						</ul>
					</li>
				</ul>
			*/
			if(e.target.tagName != "P") e2 = $(e.target).parent("p");
			else						e2 = $(e.target);
			if(e2.parent().children("div").get(0) != undefined) {
				e2.parent().children("div").remove();
				return false;
			}
			var layerId = e2[0].id.slice(5);
			e2.after("<div>"+
				"<button onclick=\""+
					"$(this).parent().prevAll('p').children('input')[0].focus();"+
					"$(this).parent().prevAll('p').children('input')[0].select();"+
					"$(this).parent().remove();"+
				"\">Rename</button>"+
				"<button onclick=\""+
					"if(confirm('Do you want to delete this layer?')){"+
						"delLayer("+layerId+");"+
					"};"+
					"$(this).parent().remove();"+
				"\">Delete</button>"+
				linker+
				"<button onclick=\""+
					"layerSetLink("+layerId+", $(this).prevAll('select').val());"+
					"$(this).parent().remove();"+
				"\">Link</button>"+
			"<br />"+
				"<button onclick=\""+
					"copyLayer("+layerId+")"+
				"\">Copy</button>"+
				"<button onclick=\""+
					"mergeLayer("+layerId+")"+
				"\">MergeDown</button>"+
				"<button onclick=\""+
					"flipXLayer("+layerId+")"+
				"\">FlipX</button>"+
				"<button onclick=\""+
					"flipYLayer("+layerId+")"+
				"\">FlipY</button>"+
			"<br />"+
				"<span>X: <input type=\"text\" /></span>"+
				"<span>Y: <input type=\"text\" /></span>"+
				"<button onclick=\""+
					"moveLayer("+layerId+", $(this).prev().prev().children().val(), $(this).prev().children().val())"+
				"\">Move</button>"+
				/*
			"<br />"+
				"<span>Rotate: <input type=\"text\" /></span>"+
				"<button onclick=\""+
					"rotateLayer("+layerId+", $(this).prev().children().val())"+
				"\">Rotate</button>"+
				*/
			"</div>");
			/*
			e.append("<div>"+
				"<button onclick=\"$(this).parent('div').parent('p').children('input')[0].focus();$(this).parent('div').parent('p').children('input')[0].select();$(this).parent('div').remove('div');\">Rename</button>"+
				"<button onclick=\"if(confirm('Do you want to delete this layer?')){delLayer($(this).parent('div').parent('p')[0].id.slice(5));};$(this).parent('div').remove('div');\">Delete</button>"+
				linker+
				"<button onclick=\"layerSetLink($(this).parent('div').parent('p')[0].id.slice(5), $(this).parent('div').children('select').val());$(this).parent('div').remove('div');\">Link</button>"+
				"</div>");
			*/

			return false;
		});
		$("#layers").find("input").change(function(e){
			p.layerNameChange(e.target.id.slice(9), e.target.value);
		});
	};
	/*########################################*/
	p.reset = function()
	{
		layer.reset();
		hist.reset(layer);
	};
};

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
};

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
function setScroll() {
	var res = processing.setScroll();
	$("#scroll").removeClass("off").removeClass("on");
	if(res)	$("#scroll").addClass("on");
	else	$("#scroll").addClass("off");
}
function setScrollH() {
	var res = processing.setScrollH();
	$("#scrollH").removeClass("off").removeClass("on");
	if(res)	$("#scrollH").addClass("on");
	else	$("#scrollH").addClass("off");
}
function setZoom(value)			{ processing.setZoom(value); }
function setTarget(value)		{ processing.setTarget(value); }
function setLayerTarget(value)	{ processing.setLayerTarget(value); }
function changeSelected(ifs, nv){ return processing.changeSelected(ifs, nv); }
function selectedForeground(but){
	var res = processing.changeSelected("foreground").foreground();
	but.className = res ? "on" : "off";
	$(but).text(res ? "FOREGROUND" : "BACKGROUND");
	processing.wait();
}
function selectedDelete(){
	var res = processing.changeSelected("delete").del();
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
function setBackgroundImage(from, f) {
	processing.setBackgroundImage(from, f);
}
function setImgAlpha(value) {
	processing.setImgAlpha(value);
	processing.wait();
}
function setImgZoom(value) {
	processing.setImgZoom(value);
	processing.wait();
}
function setImgForeground(but) {
	var res = processing.setImgForeground();
	but.className = res ? "on" : "off";
	$(but).text(res ? "FOREGROUND" : "BACKGROUND");
	processing.wait();
}
function backgroundColor(value) {
	processing.setBackgroundColor(value);
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
function copyLayer(target)					{ processing.copyLayer(target); }
function mergeLayer(target)					{ processing.mergeLayer(target); }
function flipXLayer(target)					{ processing.flipXLayer(target); }
function flipYLayer(target)					{ processing.flipYLayer(target); }
function moveLayer(target, x, y)			{ processing.moveLayer(target, x, y); }
function rotateLayer(target, rot)			{ processing.rotateLayer(target, rot); }
function layerOrderDown(target)				{ processing.layerOrderDown(target);}
function layerOrderUp(target)				{ processing.layerOrderUp(target); }
function layerSetLink(target, linkGround)	{ processing.layerSetLink(target, linkGround); }
function elementOrderDown()					{ processing.elementOrderDown(); }
function elementOrderUp()					{ processing.elementOrderUp(); }
function elementOrderChange(value)			{ processing.elementOrderChange(value); }
function toggleTree(onoff, target) {
	processing.toggleTree(target);
	$(onoff).toggleClass("off");
}
function toggleDisplay(onoff, target) {
	processing.toggleDisplay(target);
	$(onoff).toggleClass("off");
}
function reset()							{ processing.reset(); }

function elementChanged(type, d) {
	processing.elementChanged(type, d);
}


function getCurve(xy1, xy2, c1, c2, fineness)
{
	/*
	var res = [];
	var t = 0;
	var t0 = 0;
	var p0 = [xy1[0], xy1[1]];
	var p1 = [c1[0], c1[1]];
	var p2 = [c2[0], c2[1]];
	var p3 = [xy2[0], xy2[1]];
	var bp = { x: 0, y: 0, tx: 0, ty: 0 };
	for(var i=1;i<=fineness;i++) {
		t = i / fineness;
		bp.x = processing.bezierPoint(p[0], p1[0], p2[0], p3[0], t);
		bp.y = processing.bezierPoint(p[1], p1[1], p2[1], p3[1], t);
		bp.tx = processing.bezierTangent(p[0], p1[0], p2[0], p3[0], t);
		bp.ty = processing.bezierTangent(p[1], p1[1], p2[1], p3[1], t);

		t0 = t;
	*/
	var res = [];
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
			p7[0]+(p8[0]-p7[0])*t,
			p7[1]+(p8[1]-p7[1])*t
		];
		res.push({
			x1: Math.round(p10[0]),
			y1: Math.round(p10[1]),
			x2: Math.round(p9[0]),
			y2: Math.round(p9[1])
		});
		p10 = [p9[0], p9[1]];
	/*
		t2 = (i+1) / fineness;
		var x = p.bezierPoint(p0[0], p1[0], p2[0], p3[0], t);
		var y = p.bezierPoint(p0[1], p1[1], p2[1], p3[1], t);
		var x2 = p.bezierPoint(p0[0], p1[0], p2[0], p3[0], t2);
		var y2 = p.bezierPoint(p0[1], p1[1], p2[1], p3[1], t2);
		p.line(Math.round(x+getTfmX()), Math.round(y+getTfmY()), Math.round(x2+getTfmX()), Math.round(y2+getTfmY()));


		var x = (1-t)*(1-t)*(1-t)*p0[0] + 3*(1-t)*(1-t)*t*p1[0] + 3*(1-t)*t*t*p2[0] + t*t*t*p3[0];
		var y = (1-t)*(1-t)*(1-t)*p0[1] + 3*(1-t)*(1-t)*t*p1[1] + 3*(1-t)*t*t*p2[1] + t*t*t*p3[1];
		p.line(Math.round(x+getTfmX()), Math.round(y+getTfmY()), Math.round(x2+getTfmX()), Math.round(y2+getTfmY()));
	*/
	}
	return res;
}



function generateXML(ifmin)
{
	if( processing === undefined ) return;
	if(ifmin == 'min') {
		var min = 1;
	} else if(ifmin == 'cjobjects') {
		var min = 2;
	} else {
		var min = 0;
	}
	var temp = "";
	if(processing.getScroll()) {
		temp += " L=\"1600\"";
	}
	if(processing.getScrollH()) {
		temp += " H=\"800\"";
	}
	var res = "<C><P"+ temp +"/><Z><S /><D /><O /><L>";
	var layer = processing.getLayer();
	var layers = processing.getLayers();
	var el;
	var dot;
	var cdata;
	var q, q1, q2, q3, q4, c;
	var ifLayerConnected = 0;
	var cnt = 0;
	for(var i=0;i<layers.length;i++)
	{
		if(!layers[i].display) continue;
		if(layers[i].link != -1) ifLayerConnected = 1;
		if(!min) res += '<VL n="' + layers[i].name + '"l="' + layers[i].link + '"/>';
		for(var j=0;j<layers[i].elements.length;j++)
		{

			el = layers[i].elements[j];
			if(!el.display) continue;
			cnt++;
			if(el.c1x != undefined) {
				cdata = getCurve([el.x1, el.y1], [el.x2, el.y2], [el.c1x, el.c1y], [el.c2x, el.c2y], el.fineness);
				c = 'c="'+el.color;
				if(min==1) {
					if(el.foreground != 0) {
						c += ','+el.weight+','+el.alpha+','+el.foreground;
					} else {
						if(el.alpha != 1) {
							c += ','+el.weight+','+el.alpha;
						} else {
							if(el.weight != 1) {
								c += ','+el.weight;
							}
						}
					}
				} else {
					c += ','+el.weight+','+el.alpha+','+el.foreground;
				}
				c += '"';

				if(layers[i].link != -1 || min==2) {
					if(layers[i].link != -1) c += 'M1="'+layers[i].link+'"M2="'+layers[i].link+'"';
					for(var k=0;k<cdata.length;k++) {
						q = cdata[k];
						dot = 0;
						if(q.x1 == q.x2 && q.y1 == q.y2) dot++;
						res += '<JD P1="'+q.x1+','+q.y1+'"';
						if(!min) res += 'v=""';
						res += 'P2="'+q.x2+','+(q.y2+dot)+'"'+c+'/>';
					}
				} else {
					for(var k=0;k<cdata.length;k+=3) {
						q1 = cdata[k];
						q2 = cdata[k+1];
						q3 = cdata[k+2];
						q4 = cdata[k+3];

						res += '<JPL P1="'+q1.x1+','+q1.y1+'"';

						dot = 0;
						if(q1.x1 == q1.x2 && q1.y1 == q1.y2) dot++;
						if(q2 == undefined) {
							res += 'P3="'+q1.x2+','+(q1.y2+dot)+'"';
							res += 'P4="'+q1.x1+','+q1.y1+'"';
							res += 'P2="'+q1.x1+','+q1.y1+'"';
							res += c + "/>";
							break;
						} else {
							res += 'P3="'+q1.x2+','+(q1.y2+dot)+'"';
						}

						dot = 0;
						if(q2.x1 == q2.x2 && q2.y1 == q2.y2) dot++;
						if(q3 == undefined) {
							res += 'P4="'+q2.x2+','+(q2.y2+dot)+'"';
							res += 'P2="'+q2.x1+','+q2.y1+'"';
							res += c + "/>";
							break;
						} else {
							res += 'P4="'+q2.x2+','+(q2.y2+dot)+'"';
						}

						dot = 0;
						if(q3.x1 == q3.x2 && q3.y1 == q3.y2) dot++;
						if(q4 == undefined) {
							res += 'P2="'+q3.x2+','+(q3.y2+dot)+'"';
							res += c + "/>";
							break;
						} else {
							res += 'P2="'+q3.x2+','+(q3.y2+dot)+'"';
							res += c + "/>";
						}
					}
				}
				if(!min) res += '<VC P1="'+el.x1+','+el.y1+'"P2="'+el.x2+','+el.y2+'"C1="'+el.c1x+','+el.c1y+'"C2="'+el.c2x+','+el.c2y+'"C="'+el.color+','+el.weight+','+el.alpha+','+el.foreground+'"f="'+el.fineness+'"/>';
			} else {
				dot = 0;
				if(el.x1 == el.x2 && el.y1 == el.y2) dot++;

				c = 'c="'+el.color;
				if(min==1) {
					if(el.foreground != 0) {
						c += ','+el.weight+','+el.alpha+','+el.foreground;
					} else {
						if(el.alpha != 1) {
							c += ','+el.weight+','+el.alpha;
						} else {
							if(el.weight != 1) {
								c += ','+el.weight;
							}
						}
					}
				} else {
					c += ','+el.weight+','+el.alpha+','+el.foreground;
				}
				c += '"';

				res += '<JD P1="'+el.x1+','+el.y1+'"P2="'+el.x2+','+(el.y2+dot)+'"'+c;
				if(layers[i].link != -1) res += 'M1="'+layers[i].link+'"M2="'+layers[i].link+'"';
				res += '/>';
			}
		}
	}
	if(min!=2) res += "<L />";
	res += "</L></Z></C>";
	var cap = res.length > 20000 ? '<span style="color: #ff0000">'+ (res.length/1000).toFixed(1) +'</span>' : (res.length/1000).toFixed(1);
	processing.setCapacity(cap);
	var xmlCaution = "";
	if(res.length>20000) {
		xmlCaution += "<span class=\"notify1\">You can't load this XML in tfm editor, because it exceeds the capacity. (" + res.length + "/20000)</span><br />";
	}
	if(ifmin == 'min') {
		$("#xmlTitle").text("Generate XML with compressing");
		xmlCaution += "<span class=\"notify2\">Note that you CAN'T load XML below in this editor, because layer/curve data is reduced to save capacity.</span><br />";
	} else if(ifmin == 'cjobjects') {
		$("#xmlTitle").text("Generate XML for cjobjects");
		xmlCaution += "<span class=\"notify2\">This xml is to make new object for cjobjects. If you don't intend that, please use another button such as \"Generate XML\". Also, do not forget to connect your art to dynamic ground.</span><br />";
		if(!ifLayerConnected) xmlCaution += "<span class=\"notify1\">You seem to forget to connect your art to dynamic ground. <a href=\"./images/howtoconnect.gif\" target=\"_blank\">Here is an explanation how to connect.</a></span><br />";
	}
	if(xmlCaution === '') {
		$("#xmlTitle").text("Generate XML");
		xmlCaution += "<span class=\"notify2\">Have fun with your map making!</span>";
	}
	$("#xmlCaution").html(xmlCaution);
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
	var c1;
	var c2;
	var c;
	var f;
	var link;
	var first = 0; //最初にVDELをロードした場合、初期レイヤーを廃棄する

	$(xml).find("JD, VDEL, VL, VC").each(function(index, e)
	{
		var this_ = $(this);
		if(e.tagName == "VDEL" || e.tagName == "VL") {
			if(this_.attr("n") != null && this_.attr("l") != null)
			{
				link = parseInt(this_.attr("l"));
				if(isNaN(link)) return;
				if(first == 0) first = 1;
				processing.loadLayer(this_.attr("n"), link);
			}
		}
		if(e.tagName == "VC") {
			if(this_.attr("P1") != null && this_.attr("P2") != null && this_.attr("C2") != null && this_.attr("C2") != null && this_.attr("C") != null && this_.attr("f") != null)
			{
				if(first == 0) first = -1;
				p1 = this_.attr("P1").split(",");
				p2 = this_.attr("P2").split(",");
				c1 = this_.attr("C1").split(",");
				c2 = this_.attr("C2").split(",");
				c = this_.attr("C").split(",");
				f = this_.attr("f");
				if(p1.length != 2 || p2.length != 2 || c1.length != 2 || c2.length != 2 || c.length != 4) return;
				p1[0] = parseInt(p1[0]);
				p1[1] = parseInt(p1[1]);
				p2[0] = parseInt(p2[0]);
				p2[1] = parseInt(p2[1]);
				c1[0] = parseInt(c1[0]);
				c1[1] = parseInt(c1[1]);
				c2[0] = parseInt(c2[0]);
				c2[1] = parseInt(c2[1]);
				c[1] = parseInt(c[1]);
				c[2] = parseInt(c[2]*100)/100;
				c[3] = parseInt(c[3]);
				f = parseInt(f);
				if(isNaN(p1[0])) return;
				if(isNaN(p1[1])) return;
				if(isNaN(p2[0])) return;
				if(isNaN(p2[1])) return;
				if(isNaN(c1[0])) return;
				if(isNaN(c1[1])) return;
				if(isNaN(c2[0])) return;
				if(isNaN(c2[1])) return;
				if(isNaN(c[1])) return;
				if(isNaN(c[2])) return;
				if(isNaN(c[3])) return;
				if(isNaN(f)) return;
				if(getRGB("#"+c[0]) == null) return;
				processing.loadCurve(p1, p2, c1, c2, c[0], c[1], c[2], c[3], f);
			}
		}
		if(e.tagName == "JD")
		{
			if(this_.attr("v") == null && this_.attr("P1") != null && this_.attr("P2") != null && this_.attr("c") != null)
			{
				if(first == 0) first = -1;
				p1 = this_.attr("P1").split(",");
				p2 = this_.attr("P2").split(",");
				c = this_.attr("c").split(",");
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
				processing.loadLine(p1, p2, c[0], c[1], c[2], c[3]);
			}
		}
	});
	if(first == 1) processing.loadFirst();
	processing.hist.reset(layer);
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

var popup = (function(){
	self.init = function(){
		var closer = $('<span class="x" >&nbsp;</span>').click( self.close );
		body.prepend( layer );
		$('#popup').center().find('article').center().prepend( closer );
	};
	self.add = function( name, trigger, fn ){
		var target = $(name);

		$(trigger).click(function(){
			if( fn !== undefined ) fn();
			for( d in data ) data[d].hide();
			layer.show();
			target.show();
		});
		data.push(target);
	};
	self.close = function(){
		for( d in data ) data[d].hide();
		layer.hide();
	};
	var layer = $('<article id="popuplayer"></article>').click( self.close );
	var data = [];
	return self;
})();

var historyList = [];

function history(non) {
	if(non != undefined)	var cls = ' class="non"';
	else					var cls = "";
	return {
		add: function(text) {
			var ul = $("#hist");
			ul.append('<li><span'+cls+'>'+text+'</span></li>');
			historyList.unshift({
				type: cls,
				text: text
			});
			if(historyList.length > 512) historyList.length = 512;
			ul.find("li:last").animate({opacity: 0.5}, 500);
			setTimeout(function(){
				ul.find("li:first").animate({opacity: 0}, 500);
				setTimeout(function(){
					ul.find("li:first").remove();
				}, 500);
			}, 3500);
		}
	};
}

function historyDisplay() {
	var res = "<ul>";
	for(var i=0;i<historyList.length;i++) {
		res += '<li><span'+historyList[i].type+'>'+historyList[i].text+'</span></li>';
	}
	res += "</ul>";
	$("#history").find("ul").replaceWith(res);
}

$(function() {
	body = $('body');
	main = $('main').html('');
	canvas = $('<canvas id="canvas"></canvas>').appendTo(main)[0];
	processing = new Processing(canvas, Draw);

	var preview = $("#preview")[0];
	processing2 = new Processing(preview, Preview);

	//ポップアップ用レイヤー
	popup.init();
	popup.add('#background', '#menuBackground');
	popup.add('#load', '#menuLoad');
	popup.add('#xml', '#menuXML', generateXML );
	popup.add('#xml', '#menuXMLcompress', function(){ generateXML('min') });
	popup.add('#xml', '#menuXMLcjobjects', function(){ generateXML('cjobjects') });
	popup.add('#help', '#menuHelp');
	popup.add('#log', '#menuLog');
	popup.add('#history', '#menuHistory', historyDisplay );

	//メニュー
	$('#start').click(function(){ setHelper('start'); });
	$('#middle').click(function(){ setHelper('middle'); });
	$('#end').click(function(){ setHelper('end'); });
	$('#bezier1').click(function(){ setHelper('bezier1'); });
	$('#bezier2').click(function(){ setHelper('bezier2'); });
	$('#scroll').click(function(){ setScroll() });
	$('#scrollH').click(function(){ setScrollH() });
	$('#menuForum').click(function(){
		window.open('http://www.transformice.com/forum/?s=162564');
		return false;
	});

	//ツール
	$('#addLayer').click( addLayer );
	$('#elementOrderDown').click( elementOrderDown );
	$('#elementOrderUp').click( elementOrderUp );
	$('#selectedDelete').click( selectedDelete );
	$('#selectedForeground').click(function(){ selectedForeground(this) });
	$('#foreground').click(function(){ foreground(this); });

	//ポップアップ
	$('#backgroundWeb').click(function(){ setBackgroundImage('web'); });
	$('#bgImageLocal').change(function(){ setBackgroundImage('local', this); });
	$('#imgForeground').click(function(){ setImgForeground(this); });
	$('#xmlSelect').click(function(){ $('#xmlText').focus().select() });
	$('#xmlLoadButton').click(function(){ load(); popup.close() });

	//ページ遷移時の確認
	$(window).on('beforeunload', function() {
		return 'Are you sure you want to close this window?';
	});

	//メニューにJSを割り当てる
	$('menu > li').bind('mouseover', function(){
		$(this).children('ul').css('display', 'block');
	}).bind('mouseout', function(){
		$(this).children('ul').css('display', 'none');
	});

	//初期化
	var temp = function( target, func ){
		$('#'+target).val('12').bind('keyup', function(){
			func( this.value );
		});
	};
	temp( 'selectedZ', elementOrderChange );
	temp( 'selectedX1', changeSelected("x1").x1 );
	temp( 'selectedY1', changeSelected('y1').y1 );
	temp( 'selectedX2', changeSelected('x2').x2 );
	temp( 'selectedY2', changeSelected('y2').y2 );
	temp( 'selectedC1X', changeSelected('c1x').c1x );
	temp( 'selectedC1Y', changeSelected('c1y').c1y );
	temp( 'selectedC2X', changeSelected('c2x').c2x );
	temp( 'selectedC2Y', changeSelected('c2y').c2y );
	$('#selectedColor').val('');
	$('#selectedWeight').val('');
	$('#selectedAlpha').val('');
	$('#selectedFineness').val('');

	$("#bezier").bind('change', function(){
		bezier($(this).is(':checked'));
	});



	$('#zoom').val( processing.getZoom() );
	$('#color').val( processing.getColor() )
		.change(function(){ color($(this).val()); });
	$('#weight').val( processing.getWeight() )
		.change(function(){ weight($(this).val()); });
	$('#alpha').val( processing.getAlpha() )
		.change(function(){ alpha($(this).val()); });
	$('#fineness').val( processing.getFineness() )
		.change(function(){ fineness($(this).val()); });
	$('#backgroundColor').val( processing.getBackgroundColor() )
		.change(function(){ background($(this).val()); });

	var z = 10;
	//メニュー全般
	$('.draggable').draggable({
		handle: 'h1',
		scroll: false,
		start: function(e, ui) {
			if( z > 9000 ) z = 10;
			var t = $(this);
			t.css({
				opacity: 0.8,
				height: t.innerHeight(),
				zIndex: z++
			});
		},
		stop: function(e, ui) {
			$(this).css('opacity', 1);
		}
	}).bind('click', function(e){
		if( e.target.tagName === 'H1' ) {
			if( z > 9000 ) z = 10;
			$(this).css('z-index', z++);
		}
	});

	//キー入力
	var keycheck = {
		cnt: 0,
		key: 0
	};
	$(window).keydown(function(e){
		if( e.target.tagName === 'INPUT' ) return;
		if( $(":focus").attr('id') !== 'canvas' ) return;
		if(e.which == 32 || e.which == 76 || e.which == 73) {
		} else {
			if( 0 < keycheck.cnt || keycheck.cnt < 10 ) return;
		}
		if( e.which === keycheck.key ){
			keycheck.cnt++;
		} else{
			keycheck.cnt = 1;
			keycheck.key = e.which;
		}
		processing.KEYPRESSED( e.which );
	});
	$(window).keyup(function(e){
		if( e.target.tagName === 'INPUT' ) return;
		if( $(":focus").attr('id') !== 'canvas' ) return;
		keycheck = 0;
		processing.KEYRELEASED( e.which );
	});

	//ポップアップメッセージ
	$('<ul id="hist"></ul>').appendTo( body );
	history(1).add('Loaded ...');
});


function distance( xy1, xy2 ){
	return Math.sqrt( Math.pow(xy1[0]-xy2[0], 2) + Math.pow(xy1[1]-xy2[1], 2) );
}
