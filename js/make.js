



function make(){

var material = {feed:250,plunge:200}
var pass_depth = 0.425
var filetype = "sbp"

g=""

pins.reverse()

for(i=0;i<net.length;i++){
	for(j=0;j<net[i].length;j++){
		if(net[i][j].D==true){
			for(k=0;k<net.length;k++){
				for(l=0;l<net[k].length;l++){
					if( (net[i][j].X.toFixed(2)==net[k][l].X.toFixed(2)) && (net[i][j].Y.toFixed(2)==net[k][l].Y.toFixed(2)) && (net[k][l].D==true) ){
						if((i!=k)||(l!=j)){
							net[k][l].D=false
						}
					}
				}
			}
		}
	}
}

	if(document.getElementById('side').value=="top"){
		flip()
	}

if(filetype=="gcode"){


}

else if(filetype=="sbp"){

pass_depth = 0.0175

g+="MS," + (material.feed/25.4/60).toFixed(1) + "," + (material.plunge/25.4/60).toFixed(1) + "\n"
g+="JZ,0.2\n"
g+="SO,1,1\n"
g+="PAUSE 5\n"   


if((document.getElementById("board").value)=="arduino"){

   for(i=0;i<vias.length;i++){

		pass_no = 4
		pass = 1
		g+="J2,"+((vias[i][0].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((vias[i][0].Y+ymax)/25.4).toFixed(4) + "\n"

		while(pass<=pass_no){
	   g+="MZ,-"+ (pass_depth*pass).toFixed(4) + "\n"
			for(j=0;j<vias[i].length;j++){
   	   	g+="M2,"+((vias[i][j].X+Math.abs(xmin))/25.4).toFixed(4) +","+ ((vias[i][j].Y+ymax)/25.4).toFixed(4) + "\n"
			}
		pass++
   	}
		g+="JZ,0.1\n"
	}

   for(i=0;i<pins.length;i++){
		g+="J2,"+((pins[i][0].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((pins[i][0].Y+ymax)/25.4).toFixed(4) + "\n"
	   g+="MZ,-"+ (0.007) + "\n"
		g+="PAUSE 0.1\n"
			for(j=1;j<pins[i].length;j++){
				g+="M2,"+((pins[i][j].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((pins[i][j].Y+ymax)/25.4).toFixed(4) + "\n"		
			}
		g+="JZ,0.1\n"
	}

}

	for(i=0;i<hole.length;i++){

		pass_no = 4
		pass = 1
		g+="J2,"+((hole[i][0].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((hole[i][0].Y+ymax)/25.4).toFixed(4) + "\n"

		while(pass<=pass_no){
	   g+="MZ,-"+ (pass_depth*pass).toFixed(4) + "\n"
			for(j=0;j<hole[i].length;j++){
   	   	g+="M2,"+((hole[i][j].X+Math.abs(xmin))/25.4).toFixed(4) +","+ ((hole[i][j].Y+ymax)/25.4).toFixed(4) + "\n"
			}
		pass++
   	}
		g+="JZ,0.1\n"
	}

   for(i=0;i<net.length;i++){
		
   	for(j=0;j<net[i].length;j++){
		pass_no = 5
		pass = 1
		if(net[i][j].D==true){
			g+="J2,"+((net[i][j].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((net[i][j].Y+ymax)/25.4).toFixed(4) + "\n"
				while(pass<=pass_no){
	   			g+="MZ,-"+ (pass_depth*pass).toFixed(4) + "\n"
					g+="JZ,0.05\n"
					pass++
				}
			g+="JZ,0.1\n"
		}
		}
	}

	outlines.reverse()

   for(i=0;i<outlines.length;i++){
		g+="J2,"+((outlines[i][0].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4)+","+ (((outlines[i][0].Y/scale)+ymax)/25.4).toFixed(4) + "\n"
	   g+="MZ,-"+ (0.007) + "\n"
		g+="PAUSE 0.1\n"
			for(j=1;j<outlines[i].length;j++){
				g+="M2,"+((outlines[i][j].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4)+","+ (((outlines[i][j].Y/scale)+ymax)/25.4).toFixed(4) + "\n"		
			}
		g+="JZ,0.1\n"
	}

pass_no = 4
pass = 1


g+="J2,"+((path1[0].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((path1[0].Y+ymax)/25.4).toFixed(4) + "\n"

while(pass<=pass_no){
   
   g+="MZ,-"+ (pass_depth*pass).toFixed(4) + "\n"
   for(i=1;i<path1.length;i++){
      g+="M2,"+((path1[i].X+Math.abs(xmin))/25.4).toFixed(4) +","+ ((path1[i].Y+ymax)/25.4).toFixed(4) + "\n"
   }
   pass++
}


g+="JZ,0.2\n"
g+="SO,1,0\n"
if((document.getElementById("board").value)=="arduino"){
	g+="J3," + "0" + "," + ((ymax+Math.abs(ymin)+0.2)/25.4).toFixed(4) + ",0.4\n"
}
if((document.getElementById("board").value)=="blank"){
	g+="J3," + ((xmax+Math.abs(xmin)+0.2)/25.4).toFixed(4) + "," + "0" + ",0.4\n"
}

if((document.getElementById("board").value)=="arduino"){
	var jobFile = 'shield.sbp'
	var jobName = 'Arduino Shield'
}
else if((document.getElementById("board").value)=="blank"){
	jobFile = 'pcb.sbp'
	jobName = 'PCB'
}

fabmo.submitJob({
   file : g,
   filename : jobFile,
   name : jobName,
	description : (((xmax+Math.abs(xmin))/25.4).toFixed(2)) + " x " + (((ymax+Math.abs(ymin))/25.4).toFixed(2)) + "\" " + "(1/32\" endmill)"  
});


}

	g=""

	if(document.getElementById('side').value=="top"){
		flip()
	}

}

function flip(){

   for(i=0;i<outlines.length;i++){
		for(j=0;j<outlines[i].length;j++){
			if((outlines[i][j].Y)<0){
				outlines[i][j]={X:outlines[i][j].X,Y:(Math.abs(outlines[i][j].Y))}
			}
			else{
				outlines[i][j]={X:outlines[i][j].X,Y:(0-(outlines[i][j].Y))}	
			}
		}
	}

   for(i=0;i<pins.length;i++){
		for(j=0;j<pins[i].length;j++){
			if(pins[i][j].Y<0){
				pins[i][j].Y=Math.abs(pins[i][j].Y)
			}
			else{
				pins[i][j].Y=(0-pins[i][j].Y)	
			}
		}
	}

   for(i=0;i<vias.length;i++){
		for(j=0;j<vias[i].length;j++){
			if(vias[i][j].Y<0){
				vias[i][j].Y=Math.abs(vias[i][j].Y)
			}
			else{
				vias[i][j].Y=(0-vias[i][j].Y)	
			}
		}
	}

   for(i=0;i<hole.length;i++){
		for(j=0;j<hole[i].length;j++){
			if(hole[i][j].Y<0){
				hole[i][j].Y=Math.abs(hole[i][j].Y)
			}
			else{
				hole[i][j].Y=(0-hole[i][j].Y)	
			}
		}
	}


   for(i=0;i<net.length;i++){
		for(j=0;j<net[i].length;j++){
			if(net[i][j].Y<0){
				net[i][j].Y=Math.abs(net[i][j].Y)
			}
			else{
				net[i][j].Y=(0-net[i][j].Y)	
			}
		}
	}

   for(i=0;i<path1.length;i++){	
		if(path1[i].Y<0){
			path1[i]={X:path1[i].X,Y:(Math.abs(path1[i].Y))}
		}
		else{
			path1[i]={X:path1[i].X,Y:(0-(path1[i].Y))}	
		}
	}

}

