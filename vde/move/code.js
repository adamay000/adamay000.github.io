function convert() {
	code = document.getElementById("code").value;
	x = 0;
	y = 0;
	x = document.getElementById("x").value;
	y = document.getElementById("y").value;
	x = parseInt(x);
	y = parseInt(y);
	x = isNaN(x) ? 0 : x;
	y = isNaN(y) ? 0 : y;
	numsX = code.match(/X="([-]?\d+)"/g);
	numsY = code.match(/Y="([-]?\d+)"/g);
	numsP1 = code.match(/P1="([-]?\d+,[-]?\d+)"/g);
	numsP2 = code.match(/P2="([-]?\d+,[-]?\d+)"/g);
	numsP3 = code.match(/P3="([-]?\d+,[-]?\d+)"/g);
	numsP4 = code.match(/P4="([-]?\d+,[-]?\d+)"/g);
	numsC1 = code.match(/C1="([-]?\d+,[-]?\d+)"/g);
	numsC2 = code.match(/C2="([-]?\d+,[-]?\d+)"/g);
	numsX = numsX == null ? 0 : numsX;
	numsY = numsY == null ? 0 : numsY;
	numsP1 = numsP1 == null ? 0 : numsP1;
	numsP2 = numsP2 == null ? 0 : numsP2;
	numsP3 = numsP3 == null ? 0 : numsP3;
	numsP4 = numsP4 == null ? 0 : numsP4;
	numsC1 = numsC1 == null ? 0 : numsC1;
	numsC2 = numsC2 == null ? 0 : numsC2;
	result = code;
	if (x) {
		for(i=0;i<numsX.length;i++) {
			numX = numsX[i].replace(/X="([-]?\d+)"/,"$1");
			numX = parseInt(numX);
			numX = numX + x;
			eval("result = result.replace(/X=\"([-]?\\d+)\"/,\"X=\\\"\"+numX+\"convert\\\"\");");
		}
		result = result.replace(/convert/g,"");
	}
	if (y) {
		for(i=0;i<numsY.length;i++) {
			numY = numsY[i].replace(/Y="([-]?\d+)"/,"$1");
			numY = parseInt(numY);
			numY = numY + y;
			eval("result = result.replace(/Y=\"([-]?\\d+)\"/,\"Y=\\\"\"+numY+\"convert\\\"\");");
		}
		result = result.replace(/convert/g,"");
	}
	for(i=0;i<numsP1.length;i++) {
		numP1x = numsP1[i].replace(/P1="([-]?\d+),([-]?\d+)"/,"$1");
		numP1x = parseInt(numP1x);
		numP1x = numP1x + x;
		numP1y = numsP1[i].replace(/P1="([-]?\d+),([-]?\d+)"/,"$2");
		numP1y = parseInt(numP1y);
		numP1y = numP1y + y;
		eval("result = result.replace(/P1=\"([-]?\\d+,[-]?\\d+)\"/,\"P1=\\\"\"+numP1x+\",\"+numP1y+\"convert\\\"\");");
	}
	result = result.replace(/convert/g,"");
	for(i=0;i<numsP2.length;i++) {
		numP2x = numsP2[i].replace(/P2="([-]?\d+),([-]?\d+)"/,"$1");
		numP2x = parseInt(numP2x);
		numP2x = numP2x + x;
		numP2y = numsP2[i].replace(/P2="([-]?\d+),([-]?\d+)"/,"$2");
		numP2y = parseInt(numP2y);
		numP2y = numP2y + y;
		eval("result = result.replace(/P2=\"([-]?\\d+,[-]?\\d+)\"/,\"P2=\\\"\"+numP2x+\",\"+numP2y+\"convert\\\"\");");
	}
	result = result.replace(/convert/g,"");
	for(i=0;i<numsP3.length;i++) {
		numP3x = numsP3[i].replace(/P3="([-]?\d+),([-]?\d+)"/,"$1");
		numP3x = parseInt(numP3x);
		numP3x = numP3x + x;
		numP3y = numsP3[i].replace(/P3="([-]?\d+),([-]?\d+)"/,"$2");
		numP3y = parseInt(numP3y);
		numP3y = numP3y + y;
		eval("result = result.replace(/P3=\"([-]?\\d+,[-]?\\d+)\"/,\"P3=\\\"\"+numP3x+\",\"+numP3y+\"convert\\\"\");");
	}
	result = result.replace(/convert/g,"");
	for(i=0;i<numsP4.length;i++) {
		numP4x = numsP4[i].replace(/P4="([-]?\d+),([-]?\d+)"/,"$1");
		numP4x = parseInt(numP4x);
		numP4x = numP4x + x;
		numP4y = numsP4[i].replace(/P4="([-]?\d+),([-]?\d+)"/,"$2");
		numP4y = parseInt(numP4y);
		numP4y = numP4y + y;
		eval("result = result.replace(/P4=\"([-]?\\d+,[-]?\\d+)\"/,\"P4=\\\"\"+numP4x+\",\"+numP4y+\"convert\\\"\");");
	}
	result = result.replace(/convert/g,"");
	for(i=0;i<numsC1.length;i++) {
		numC1x = numsC1[i].replace(/C1="([-]?\d+),([-]?\d+)"/,"$1");
		numC1x = parseInt(numC1x);
		numC1x = numC1x + x;
		numC1y = numsC1[i].replace(/C1="([-]?\d+),([-]?\d+)"/,"$2");
		numC1y = parseInt(numC1y);
		numC1y = numC1y + y;
		eval("result = result.replace(/C1=\"([-]?\\d+,[-]?\\d+)\"/,\"C1=\\\"\"+numC1x+\",\"+numC1y+\"convert\\\"\");");
	}
	result = result.replace(/convert/g,"");
	for(i=0;i<numsC2.length;i++) {
		numC2x = numsC2[i].replace(/C2="([-]?\d+),([-]?\d+)"/,"$1");
		numC2x = parseInt(numC2x);
		numC2x = numC2x + x;
		numC2y = numsC2[i].replace(/C2="([-]?\d+),([-]?\d+)"/,"$2");
		numC2y = parseInt(numC2y);
		numC2y = numC2y + y;
		eval("result = result.replace(/C2=\"([-]?\\d+,[-]?\\d+)\"/,\"C2=\\\"\"+numC2x+\",\"+numC2y+\"convert\\\"\");");
	}
	result = result.replace(/convert/g,"");
	document.getElementById("result").value = code;
	if(x || y) document.getElementById("result").value = result;
}
function br() {
	convert();
	code = document.getElementById("result").value;
	code = code.replace(/>/g,">\n");
	code = code.replace(/\n$/g,"");
	document.getElementById("result").value = code;
}
function unbr() {
	convert();
	code = document.getElementById("result").value;
	code = code.replace(/(\n)/g,"");
	code = code.replace(/(\r)/g,"");
	document.getElementById("result").value = code;
}
function allselect(target) {
	text = document.getElementById(target);
	text.focus();
	text.select();
}

function codeview(target) {
	if(document.getElementById(target).style.display=="block")
		document.getElementById(target).style.display = "none";
	else
		document.getElementById(target).style.display = "block";
}