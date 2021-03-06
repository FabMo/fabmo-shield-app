
function make(){

	var material = {feed:150,plunge:100}  //mm/min
	var pass_depth = 0.425

	var filetype = ""

	if((document.getElementById("file").value)=="gcode"){
		filetype = "gcode"
	}
	else if((document.getElementById("file").value)=="sbp"){
		filetype = "sbp"
	}

	var plunge = (material.plunge/25.4).toFixed(0)
	var feed = (material.feed/25.4).toFixed(0)

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

	pass_depth = 0.0175
	var tabs = true

	if(filetype=="sbp"){
		g+="MS," + (material.feed/25.4/60).toFixed(1) + "," + (material.plunge/25.4/60).toFixed(1) + "\n"
		g+="JZ,0.2\n"
		g+="SO,1,1\n"
		g+="PAUSE 5\n"
	}
	else if(filetype=="gcode"){
		g+="g0z0.2\n"
		g+="m3\n"
		g+="g4p3\n"
	}   

	if((document.getElementById("board").value)=="arduino"){

   	for(i=0;i<vias.length;i++){

			pass_no = 4
			pass = 1
			
			if(filetype=="sbp"){
				g+="J2,"+((vias[i][0].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((vias[i][0].Y+ymax)/25.4).toFixed(4) + "\n"
			}
			else if(filetype=="gcode"){
				g+="g0x"+((vias[i][0].X+Math.abs(xmin))/25.4).toFixed(4)+"y"+ ((vias[i][0].Y+ymax)/25.4).toFixed(4) + "\n"			
			}

			while(pass<=pass_no){
				if(filetype=="sbp"){
					g+="MZ,-"+ (pass_depth*pass).toFixed(4) + "\n"
					for(j=0;j<vias[i].length;j++){
	   	   		g+="M2,"+((vias[i][j].X+Math.abs(xmin))/25.4).toFixed(4) +","+ ((vias[i][j].Y+(ymax))/25.4).toFixed(4) + "\n"
					}
				}
				else if(filetype=="gcode"){
					g+="g1z-"+ (pass_depth*pass).toFixed(4) + "f" + plunge + "\n"
					for(j=0;j<vias[i].length;j++){
	   	   		g+="g1x"+((vias[i][j].X+Math.abs(xmin))/25.4).toFixed(4) + "y" + ((vias[i][j].Y+(ymax))/25.4).toFixed(4) + "f" + feed + "\n"
					}
				}
			pass++
	   	}
			if(filetype=="sbp"){
				g+="JZ,0.1\n"
			}
			else if(filetype=="gcode"){
				g+="g0z0.1\n"
			}
		}
   	for(i=0;i<pins.length;i++){
			if(filetype=="sbp"){
				g+="J2,"+((pins[i][0].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((pins[i][0].Y+ymax)/25.4).toFixed(4) + "\n"
			   g+="MZ,-"+ (0.007) + "\n"
				g+="PAUSE 0.1\n"
					for(j=1;j<pins[i].length;j++){
						g+="M2,"+((pins[i][j].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((pins[i][j].Y+ymax)/25.4).toFixed(4) + "\n"		
					}
				g+="JZ,0.1\n"
			}
			else if(filetype=="gcode"){
				g+="g0x"+((pins[i][0].X+Math.abs(xmin))/25.4).toFixed(4)+"y"+ ((pins[i][0].Y+ymax)/25.4).toFixed(4) + "\n"
			   g+="g1z-"+ (0.007) + "f" + plunge + "\n"
				g+="g4p0.1\n"
					for(j=1;j<pins[i].length;j++){
						g+="g1x"+((pins[i][j].X+Math.abs(xmin))/25.4).toFixed(4)+"y"+ ((pins[i][j].Y+ymax)/25.4).toFixed(4) + "f" + feed + "\n"		
					}
				g+="g0z0.1\n"
			}
		}

	}

	for(i=0;i<hole.length;i++){

		pass_no = 4
		pass = 1
		if(filetype=="sbp"){
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
		else if(filetype=="gcode"){
			g+="g0x"+((hole[i][0].X+Math.abs(xmin))/25.4).toFixed(4)+"y"+ ((hole[i][0].Y+ymax)/25.4).toFixed(4) + "\n"
			while(pass<=pass_no){
	   	g+="g1z-"+ (pass_depth*pass).toFixed(4) + "f" + plunge + "\n"
				for(j=0;j<hole[i].length;j++){
   	   		g+="g1x"+((hole[i][j].X+Math.abs(xmin))/25.4).toFixed(4) +"y"+ ((hole[i][j].Y+ymax)/25.4).toFixed(4) + "f" + feed + "\n"
				}
			pass++
   		}
			g+="g0z0.1\n"
		}
	}

   for(i=0;i<net.length;i++){
   	for(j=0;j<net[i].length;j++){
			pass_no = 5
			pass = 1
			if(filetype=="sbp"){
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
			else if(filetype=="gcode"){
				if(net[i][j].D==true){
					g+="g0x"+((net[i][j].X+Math.abs(xmin))/25.4).toFixed(4) + "y" + ((net[i][j].Y+ymax)/25.4).toFixed(4) + "\n"
						while(pass<=pass_no){
	   					g+="g1z-"+ (pass_depth*pass).toFixed(4) + "f" + plunge + "\n"
							g+="g0z0.05\n"
							pass++
						}
					g+="g0z0.1\n"
				}
			}
		}
	}

	outlines.reverse()

   for(i=0;i<outlines.length;i++){
		if(filetype=="sbp"){
			g+="J2,"+((outlines[i][0].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4)+","+ (((outlines[i][0].Y/scale)+ymax)/25.4).toFixed(4) + "\n"
	   	g+="MZ,-"+ (0.007) + "\n"
			g+="PAUSE 0.1\n"
				for(j=1;j<outlines[i].length;j++){
					g+="M2,"+((outlines[i][j].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4)+","+ (((outlines[i][j].Y/scale)+ymax)/25.4).toFixed(4) + "\n"		
				}
			g+="JZ,0.1\n"
		}
		else if(filetype=="gcode"){
			g+="g0x"+((outlines[i][0].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4)+"y"+ (((outlines[i][0].Y/scale)+ymax)/25.4).toFixed(4) + "\n"
	   	g+="g1z-"+ (0.007) + "f" + plunge + "\n"
			g+="g4p0.1\n"
				for(j=1;j<outlines[i].length;j++){
					g+="g1x"+((outlines[i][j].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4) + "y" + (((outlines[i][j].Y/scale)+ymax)/25.4).toFixed(4) + "f" + feed + "\n"		
				}
			g+="g0z0.1\n"

		}
	}

	pass_no = 4
	pass = 1

	if(filetype=="sbp"){
		g+="J2,"+((path1[0].X+Math.abs(xmin))/25.4).toFixed(4)+","+ ((path1[0].Y+ymax)/25.4).toFixed(4) + "\n"
			while(pass<=pass_no){   
	   		g+="MZ,-"+ (pass_depth*pass).toFixed(4) + "\n"
	   	for(i=1;i<path1.length;i++){
				//tabs
				if(((i==path1.length-1)||(i==path1.length-51))&&(pass>pass_no-2)){
					if(i==path1.length-1){
						g+="M2,"+(((path1[i].X+Math.abs(xmin))/25.4)-0.2).toFixed(4) +","+ (((path1[i].Y+ymax)/25.4)).toFixed(4) + "\n"
						g+="JZ,-"+(pass_depth*(pass_no-1.5)).toFixed(4)+"\n"
						g+="M2,"+(((path1[i].X+Math.abs(xmin))/25.4)-0.1).toFixed(4) +","+ (((path1[i].Y+ymax)/25.4)).toFixed(4) + "\n"
					}
					else if(i==path1.length-51){
						g+="M2,"+(((path1[i].X+Math.abs(xmin))/25.4)+0.2).toFixed(4) +","+ (((path1[i].Y+ymax)/25.4)).toFixed(4) + "\n"
						g+="JZ,-"+(pass_depth*(pass_no-1.5)).toFixed(4)+"\n"
						g+="M2,"+(((path1[i].X+Math.abs(xmin))/25.4)+0.1).toFixed(4) +","+ (((path1[i].Y+ymax)/25.4)).toFixed(4) + "\n"
					}
					g+="MZ,-"+ (pass_depth*pass).toFixed(4) + "\n"
	   	   	g+="M2,"+((path1[i].X+Math.abs(xmin))/25.4).toFixed(4) +","+ ((path1[i].Y+ymax)/25.4).toFixed(4) + "\n"
					
				}
				else if(((i==path1.length-26)||(i==path1.length-76))&&(pass>pass_no-2)){
					if(i==path1.length-26){
						g+="M2,"+(((path1[i].X+Math.abs(xmin))/25.4)).toFixed(4) +","+ (((path1[i].Y+ymax)/25.4)+0.2).toFixed(4) + "\n"
						g+="JZ,-"+(pass_depth*(pass_no-1.5)).toFixed(4)+"\n"
						g+="M2,"+(((path1[i].X+Math.abs(xmin))/25.4)).toFixed(4) +","+ (((path1[i].Y+ymax)/25.4)+0.1).toFixed(4) + "\n"
					}
					else if(i==path1.length-76){
						g+="M2,"+(((path1[i].X+Math.abs(xmin))/25.4)).toFixed(4) +","+ (((path1[i].Y+ymax)/25.4)-0.2).toFixed(4) + "\n"
						g+="JZ,-"+(pass_depth*(pass_no-1.5)).toFixed(4) + "\n"
						g+="M2,"+(((path1[i].X+Math.abs(xmin))/25.4)).toFixed(4) +","+ (((path1[i].Y+ymax)/25.4)-0.1).toFixed(4) + "\n"
					}
					g+="MZ,-"+ (pass_depth*pass).toFixed(4) + "\n"
	   	   	g+="M2,"+((path1[i].X+Math.abs(xmin))/25.4).toFixed(4) +","+ ((path1[i].Y+ymax)/25.4).toFixed(4) + "\n"
					
				}
				//
				else{
	   	   	g+="M2,"+((path1[i].X+Math.abs(xmin))/25.4).toFixed(4) +","+ ((path1[i].Y+ymax)/25.4).toFixed(4) + "\n"
				}
	   	   
			}
   		pass++
		}
	}
	else if(filetype=="gcode"){
		g+="g0x"+((path1[0].X+Math.abs(xmin))/25.4).toFixed(4) + "y" + ((path1[0].Y+ymax)/25.4).toFixed(4) + "\n"
			while(pass<=pass_no){   
	   		g+="g1z-"+ (pass_depth*pass).toFixed(4) + "f" + plunge + "\n"
	   	for(i=1;i<path1.length;i++){
				//tabs
				if(((i==path1.length-1)||(i==path1.length-51))&&(pass>pass_no-2)){
					if(i==path1.length-1){
						g+="g1x"+(((path1[i].X+Math.abs(xmin))/25.4)-0.2).toFixed(4) +"y"+ (((path1[i].Y+ymax)/25.4)).toFixed(4) + "f" + feed + "\n"
						g+="g0z-"+(pass_depth*(pass_no-1.5)).toFixed(4)+"\n"
						g+="g1x"+(((path1[i].X+Math.abs(xmin))/25.4)-0.1).toFixed(4) +"y"+ (((path1[i].Y+ymax)/25.4)).toFixed(4) + "f" + feed + "\n"
					}
					else if(i==path1.length-51){
						g+="g1x"+(((path1[i].X+Math.abs(xmin))/25.4)+0.2).toFixed(4) +"y"+ (((path1[i].Y+ymax)/25.4)).toFixed(4) + "f" + feed + "\n"
						g+="g0z-"+(pass_depth*(pass_no-1.5)).toFixed(4)+"\n"
						g+="g1x"+(((path1[i].X+Math.abs(xmin))/25.4)+0.1).toFixed(4) +"y"+ (((path1[i].Y+ymax)/25.4)).toFixed(4) + "f" + feed + "\n"
					}
					g+="g1z-"+ (pass_depth*pass).toFixed(4) + "f" + plunge + "\n"
	   	   	g+="g1x"+((path1[i].X+Math.abs(xmin))/25.4).toFixed(4) +"y"+ ((path1[i].Y+ymax)/25.4).toFixed(4) + "f" + feed + "\n"
					
				}
				else if(((i==path1.length-26)||(i==path1.length-76))&&(pass>pass_no-2)){
					if(i==path1.length-26){
						g+="g1x"+(((path1[i].X+Math.abs(xmin))/25.4)).toFixed(4) +"y"+ (((path1[i].Y+ymax)/25.4)+0.2).toFixed(4) + "f" + feed + "\n"
						g+="g0z-"+(pass_depth*(pass_no-1.5)).toFixed(4)+"\n"
						g+="g1x"+(((path1[i].X+Math.abs(xmin))/25.4)).toFixed(4) +"y"+ (((path1[i].Y+ymax)/25.4)+0.1).toFixed(4) + "f" + feed + "\n"
					}
					else if(i==path1.length-76){
						g+="g1x"+(((path1[i].X+Math.abs(xmin))/25.4)).toFixed(4) +"y"+ (((path1[i].Y+ymax)/25.4)-0.2).toFixed(4) + "f" + feed + "\n"
						g+="g0z-"+(pass_depth*(pass_no-1.5)).toFixed(4)+"\n"
						g+="g1x"+(((path1[i].X+Math.abs(xmin))/25.4)).toFixed(4) +"y"+ (((path1[i].Y+ymax)/25.4)-0.1).toFixed(4) + "f" + feed + "\n"
					}
					g+="g1z-"+ (pass_depth*pass).toFixed(4) + "f" + plunge + "\n"
	   	   	g+="g1x"+((path1[i].X+Math.abs(xmin))/25.4).toFixed(4) +"y"+ ((path1[i].Y+ymax)/25.4).toFixed(4) + "f" + feed + "\n"
					
				}
				//
				else{
	   	   	g+="g1x"+((path1[i].X+Math.abs(xmin))/25.4).toFixed(4) +"y"+ ((path1[i].Y+ymax)/25.4).toFixed(4) + "f" + feed + "\n"
				}
				
			}
   		pass++
		}
	}

	if(filetype=="sbp"){
		g+="JZ,0.2\n"
		g+="SO,1,0\n"
		if((document.getElementById("board").value)=="arduino"){
			g+="J3,0," + ((ymax+Math.abs(ymin)+0.2)/25.4).toFixed(4) + ",0.4\n"
		}
		if((document.getElementById("board").value)=="blank"){
			g+="J3," + ((xmax+Math.abs(xmin)+0.2)/25.4).toFixed(4) + ",0,0.4\n"
		}
	}
	else if(filetype=="gcode"){
		g+="g0z0.2\n"
		g+="m5\n"
		if((document.getElementById("board").value)=="arduino"){
			g+="g0x0y" + ((ymax+Math.abs(ymin)+0.2)/25.4).toFixed(4) + "z0.4\n"
		}
		if((document.getElementById("board").value)=="blank"){
			g+="g0x" + ((xmax+Math.abs(xmin)+0.2)/25.4).toFixed(4) + "y0z0.4\n"
		}
	}
	//
	if((document.getElementById("board").value)=="arduino"){
		var jobFile = 'shield1_32.sbp'
		var jobName = 'Arduino Shield'
		if(filetype=="gcode"){
			jobFile = 'shield1_32.g'
		}
	}
	else if((document.getElementById("board").value)=="blank"){
		jobFile = 'pcb1_32.sbp'
		jobName = 'PCB'
		if(filetype=="gcode"){
			jobFile = 'pcb1_32.g'
		}
	}

	fabmo.submitJob({
   	file : g,
   	filename : jobFile,
   	name : jobName + " first pass",
		description : (((xmax+Math.abs(xmin))/25.4).toFixed(2)) + " x " + (((ymax+Math.abs(ymin))/25.4).toFixed(2)) + "\" " + "(1/32\" endmill)"  
	})


	g=""

	
	if(finishPass==true){
		var g2 = ""

		if(filetype=="gcode"){
			g2+="g0z0.2\n"
			g2+="m3\n"
			g2+="g4p3\n"
	
			for(i=0;i<passB.length;i++){
				g2+="g0x"+((passB[i][0].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4)+"y"+ (((passB[i][0].Y/scale)+ymax)/25.4).toFixed(4) + "\n"
	   		g2+="g1z-"+ (0.003) + "f" + (plunge/2).toFixed(2) + "\n"
				g2+="g4p0.1\n"
					for(j=1;j<passB[i].length;j++){
						g2+="g1x"+((passB[i][j].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4) + "y" + (((passB[i][j].Y/scale)+ymax)/25.4).toFixed(4) + "f" + (feed/2).toFixed(2) + "\n"		
					}
				g2+="g1x"+((passB[i][0].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4)+"y"+ (((passB[i][0].Y/scale)+ymax)/25.4).toFixed(4) + "f" + (feed/2).toFixed(2) + "\n"
				g2+="g0z0.1\n"
			}

			g2+="g0z0.2\n"
			g2+="m5\n"

			fabmo.submitJob({
	   		file : g2,
	   		filename : 'finishPass1_64.g',
	   		name : jobName + ' finish pass',
				description : (((xmax+Math.abs(xmin))/25.4).toFixed(2)) + " x " + (((ymax+Math.abs(ymin))/25.4).toFixed(2)) + "\" " + "(1/64\" endmill)"  
			})
		}
		else if(filetype=="sbp"){

			g2+="MS," + ((material.feed/25.4/60)/2).toFixed(2) + "," + ((material.plunge/25.4/60)/2).toFixed(2) + "\n"
			g2+="JZ,0.2\n"
			g2+="SO,1,1\n"
			g2+="PAUSE 5\n"
	
			for(i=0;i<passB.length;i++){
				g2+="J2,"+((passB[i][0].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4)+","+ (((passB[i][0].Y/scale)+ymax)/25.4).toFixed(4) + "\n"
	   		g2+="MZ,-"+ (0.003) + "\n"
				g2+="PAUSE 0.1\n"
					for(j=1;j<passB[i].length;j++){
						g2+="M2,"+((passB[i][j].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4) + "," + (((passB[i][j].Y/scale)+ymax)/25.4).toFixed(4) + "\n"		
					}
				g2+="M2,"+((passB[i][0].X/scale/25.4)+Math.abs(xmin)/25.4).toFixed(4) + "," + (((passB[i][0].Y/scale)+ymax)/25.4).toFixed(4) + "\n"
				g2+="JZ,0.1\n"
			}

			g2+="JZ,0.2\n"
			g2+="SO,1,0\n"

			fabmo.submitJob({
	   		file : g2,
	   		filename : 'finishPass1_64.sbp',
	   		name : jobName + ' finish pass',
				description : (((xmax+Math.abs(xmin))/25.4).toFixed(2)) + " x " + (((ymax+Math.abs(ymin))/25.4).toFixed(2)) + "\" " + "(1/64\" endmill)"  
			})
		}

	}

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

   for(i=0;i<passB.length;i++){
		for(j=0;j<passB[i].length;j++){
			if((passB[i][j].Y)<0){
				passB[i][j]={X:passB[i][j].X,Y:(Math.abs(passB[i][j].Y))}
			}
			else{
				passB[i][j]={X:passB[i][j].X,Y:(0-(passB[i][j].Y))}	
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

