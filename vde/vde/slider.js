
YUI().use("slider", function(Y) {
	var setSelectedSlider = 0;
	window.updateSelectedSliderDo = function()
	{
		setSelectedSlider = 1;
		
		var tar = selectedWeightSlider;
		var data   = tar.getData(),
			slider = data.slider,
			value  = parseInt(tar.get("value"), 10);
		if(data.wait) data.wait.cancel();
		data.wait = Y.later(200, slider, function() {
			data.wait = null;
			this.set("value", value);
		});
		
		var tar2 = selectedAlphaSlider;
		var data2   = tar2.getData(),
			slider2 = data2.slider,
			value2  = parseInt(tar2.get("value"), 10);
		if(data2.wait) data2.wait.cancel();
		data2.wait = Y.later(200, slider2, function() {
			data2.wait = null;
			this.set("value", value2);
		});
		
		var tar3 = selectedFinenessSlider;
		var data3   = tar3.getData(),
			slider3 = data3.slider,
			value3  = parseInt(tar3.get("value"), 10);
		if(data3.wait) data3.wait.cancel();
		data3.wait = Y.later(200, slider3, function() {
			data3.wait = null;
			this.set("value", value3);
		});
	};

	function updateSlider(e) {
		var tar = this;
		var data   = tar.getData(),
			slider = data.slider,
			value  = parseInt(tar.get("value"), 10);
		if(data.wait) data.wait.cancel();
		data.wait = Y.later(200, slider, function() {
			data.wait = null;
			if(!isNaN(value)) this.set("value", value);
		});
	}
	function zoomUpdateSlider(e) {
		var tar = this;
		var data   = tar.getData(),
			slider = data.slider,
			value  = parseInt(tar.get("value")*10, 10);
		if(data.wait) data.wait.cancel();
		data.wait = Y.later(200, slider, function() {
			data.wait = null;
			if(!isNaN(value)) this.set("value", value);
		});
	}

	function updateInput(e) {
		setSelectedSlider = 0;
		this.set("value", e.newVal);
		if(this.get("id") == "weight")			weight(e.newVal);
		if(this.get("id") == "alpha")			alpha(e.newVal);
		if(this.get("id") == "fineness")		fineness(e.newVal);
		if(this.get("id") == "zoom")			setZoom(e.newVal);
		if(this.get("id") == "imgAlpha")		setImgAlpha(e.newVal);
		if(this.get("id") == "imgZoom")			setImgZoom(e.newVal);
		if(this.get("id") == "selectedWeight")	{ changeSelected("weight", e.newVal).weight(e.newVal); }
		if(this.get("id") == "selectedAlpha")	{ changeSelected("alpha", e.newVal).alpha(e.newVal); }
		if(this.get("id") == "selectedFineness"){ changeSelected("fineness", e.newVal).fineness(e.newVal); }
	}

	function zoomUpdateInput(e) {
		var value = (e.newVal*0.1).toFixed(1);
		this.set("value", value);
		if(this.get("id") == "zoom") setZoom(value);
		if(this.get("id") == "imgZoom") setImgZoom(value);
	}
	
	var zoomSlider = Y.one("#zoom");
	zoomSlider.setData("slider", new Y.Slider({
		axis: 'x',
		min: 10,
		max: 100,
		value : 1.0,
		length: '80px',
		after: {
			valueChange: Y.bind(zoomUpdateInput, zoomSlider)
		}
		}).render(".zoom")
	).on("keyup", zoomUpdateSlider);
	
	var weightSlider = Y.one("#weight");
	weightSlider.setData("slider", new Y.Slider({
		axis: 'x',
		min: 1,
		max: 250,
		value : 1,
		length: '160px',
		after: {
			valueChange: Y.bind(updateInput, weightSlider)
		}
		}).render(".weight")
	).on("keyup", updateSlider);
	
	var alphaSlider = Y.one("#alpha");
	alphaSlider.setData("slider", new Y.Slider({
		axis: 'x',
		min: 0,
		max: 100,
		value : 100,
		length: '160px',
		after: {
			valueChange: Y.bind(updateInput, alphaSlider)
		}
		}).render(".alpha")
	).on("keyup", updateSlider);
	
	var finenessSelider = Y.one("#fineness");
	finenessSelider.setData("slider", new Y.Slider({
		axis: 'x',
		min: 2,
		max: 30,
		value : 20,
		length: '160px',
		after: {
			valueChange: Y.bind(updateInput, finenessSelider)
		}
		}).render(".fineness")
	).on("keyup", updateSlider);
	
	var selectedWeightSlider = Y.one("#selectedWeight");
	selectedWeightSlider.setData("slider", new Y.Slider({
		axis: 'x',
		min: 1,
		max: 250,
		value : 1,
		length: '160px',
		after: {
			valueChange: Y.bind(updateInput, selectedWeightSlider)
		}
		}).render(".selectedWeight")
	).on("keyup", updateSlider);
	
	var selectedAlphaSlider = Y.one("#selectedAlpha");
	selectedAlphaSlider.setData("slider", new Y.Slider({
		axis: 'x',
		min: 0,
		max: 100,
		value : 100,
		length: '160px',
		after: {
			valueChange: Y.bind(updateInput, selectedAlphaSlider)
		}
		}).render(".selectedAlpha")
	).on("keyup", updateSlider);
	
	var selectedFinenessSlider = Y.one("#selectedFineness");
	selectedFinenessSlider.setData("slider", new Y.Slider({
		axis: 'x',
		min: 2,
		max: 30,
		value : 30,
		length: '160px',
		after: {
			valueChange: Y.bind(updateInput, selectedFinenessSlider)
		}
		}).render(".selectedFineness")
	).on("keyup", updateSlider);
	
	var imgAlphaSlider = Y.one("#imgAlpha");
	imgAlphaSlider.setData("slider", new Y.Slider({
		axis: 'x',
		min: 0,
		max: 100,
		value : 100,
		length: '160px',
		after: {
			valueChange: Y.bind(updateInput, imgAlphaSlider)
		}
		}).render(".imgAlpha")
	).on("keyup", updateSlider);
	
	var imgZoomSlider = Y.one("#imgZoom");
	imgZoomSlider.setData("slider", new Y.Slider({
		axis: 'x',
		min: 1,
		max: 100,
		value : 10,
		length: '160px',
		after: {
			valueChange: Y.bind(zoomUpdateInput, imgZoomSlider)
		}
		}).render(".imgZoom")
	).on("keyup", zoomUpdateSlider);
});