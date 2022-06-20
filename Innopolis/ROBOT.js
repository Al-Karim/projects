
Trik = true


robot = { 
	wheelD: Trik ? 8.2 : 5.6,
	track: Trik ? 15: 17.5,
	cpr: Trik ? 370 : 360,
	v: 80,
	cellX:1,
	cellY:0,
	azimut:2
}

mL = brick.motor('M4').setPower
mR = brick.motor('M3').setPower
eL = brick.encoder('E4').read
eR = brick.encoder('E3').read
sF = brick.sensor('D1').read
sL = brick.sensor('A1').read
sR = brick.sensor('A2').read
pi = Math.PI
abs = Math.abs
wait = script.wait
cellLen = Trik ? 30: 52.5

gyrAngle= [ 
	[0, 90, 180, -90],
	[-90, 0, 90, 180],
	[180, -90, 0, 90],
	[90, 180, -90, 0]
]

brick.encoder('E3').reset()
brick.encoder('E4').reset()

gyro = gyrAngle[robot.azimut]
brick.gyroscope().setCalibrationValues([-43, -30, -69, 51, 86, 4145])


function cm2cpr(cm) {return (cm / (pi * robot.wheelD)) * robot.cpr}
function motors(vL, vR){
	vL = vL == undefined ? robot.v : vL
	vR = vR == undefined ? vL : vR
	mL(vL)
	mR(vR)
}
function move(cm,v){
	v = v || robot.v
	var path = cm2cpr(cm)
	path += eL()
	motors()
	while(eL() < path) { wait(10) }
	motors(-1)
}

function sign(num) {return num > 0? 1 : -1}



function povorot(alpha){
	var sgn = sign(alpha)
	var len = ((robot.track * alpha) / (robot.wheelD * 360)) * robot.cpr
	len += eL()
	motors(sgn * robot.v/1.5, sgn * -robot.v/1.5)
	if (sgn == 1){
		while (eL() < len){wait(10)}
	}else {
		while(eL() > len) { wait(10)}
	}
	
    motors(-1)
}

function razgon(cm, v){
	v = v == undefined ? robot.v : v
	var encLst = eL(), encRst = eR()
	var Kp_enc =  1.5, Kp_gyro = 1.5
	var pathO = eL()
	var path = cm2cpr(cm) + pathO
	var vO = 40, vM = vO
	var startStop = path / 4
	var dV = (v - vO) / 10
	while (eL() < path){
		if(eL() < pathO + startStop){ vM += dV}
		else if(eL() > pathO + startStop * 3){vM -= dV}
		uEnc = ((eL() - encLst) - (eR() - encRst)) *Kp_enc
		uGyro = (gyro[robot.azimut] - getYaw()/1000) * Kp_gyro
		u = uEnc + uGyro
		if (vM < vO) vM = vO
		else if (vM > v) vM = v
		motors(vM - u,  vM + u)
		//print(startStop,'   ',vM, '   ',eL(),'   ', path)
		wait(20)
	}
	motors(0)
}

//brick.gyroscope().calibrate(5000)
//wait(1000)
function getYaw(){return brick.gyroscope().read()[6]}


function goroskop(a){
	if(abs(a) < 200){a *= 1000}
	if(a > 180000) a = (a - (a - 180000) * 2) * -1
	var cy = getYaw()
	var lb = cy - 180000
	var sgn = Trik ? 1 : -1
	if ( a > lb && a < cy) sgn = Trik ? -1 : 1
		
	else if(lb < -180000) { 
			lb = abs(lb) - (abs(lb) - 180000) * 2
		if(a > lb) sgn = -1
		}
	
	motors(57 * sgn, -50 * sgn)
	
	
	while(abs(a - getYaw()) > 1000){ wait(10)}
	motors(0)	
}
//avgSpeed = 150;
//kP = 10; 

//correction = kP * error;
//motors(avgSpeed * (1 + correction), avgSpeed * (1 - correction));


matrix = [
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0] 
]

function printArr(arr, delim){
	delim = delim == undefined ? ', ': delim
	for(var i = 0; i < arr.length; i++)
		print(arr[i].join(delim))
}
function bfs(start, end){
	var queue = [start]
	var visited = []
	var path = []
	for( var i = 0; i < matrix.length; i++) visited.push(false)
	while(queue.length){
		P = queue.shift()
		if(!visited[P]){
			visited[P] = true
			path.push(P)
			if(P == end)
				break
			for(var i = 0; i < matrix.length; i++){
				if(matrix[P][i] == 1 && !visited[i]){
					queue.push(i)
				}
			}
		}
	}
	//print (path)
	path = path.reverse()
	var pathBack= [path.shift()]
	for(var i = 0; i < path.length; i++){
		var lastP = pathBack.slice(-1)
		if(matrix[lastP][path[i]] == 1)
			pathBack.push(path[i])
	}
	return pathBack.reverse()
	
	
}


function dfs(start, end){
	var stack = [start]
	var visited = []
	var P, Q
	var path = [start]
	for( var i = 0; i < matrix.length; i++) visited.push(false)
	visited[start] = true
	
	while(stack.length){
		P = Number(stack.slice(-1))
		if(P == end)
				break
		var notVisited = []
		for(var i = 0; i < matrix.length; i++){
				if(matrix[P][i] == 1 && !visited[i]){
					
					notVisited.push(i)
				}
			}
			if(notVisited.length > 0){
				Q = notVisited[0]
				visited[Q] = true
				stack.push(Q)
		
		
			
				}
			else{
			stack.pop()
			path.pop()
		}
		}
		
		
	return path
}



function makeMoves(way) {
	print(way)
	var step 
	az = robot.azimut, moves = []
	for(var i = 0; i < way.length; i++){
			
			step = way[i] - way[i - 1]
			
	if(step == 4){
		if(az == 1) moves.push('R')
		else if(az == 3) moves.push('L')
		else if(az == 0) moves.push('RR')
		moves.push('F')
		az = 2
		
		}
		
	else if(step == 1){
		if(az == 3) moves.push('LL')
		else if(az == 2) moves.push('L')
		else if(az == 0) moves.push('R')
		moves.push('F')
		az = 1
		}
	else if(step == -1){
		if(az == 1) moves.push('LL')
		else if(az == 2) moves.push('R')
		else if(az == 0) moves.push('L')
		moves.push('F')
		az = 3}
		
		
		
	else if(step == -4){
		if(az == 1) moves.push('L')
		else if(az == 2) moves.push('LL')
		else if(az == 3) moves.push('R')
		moves.push('F')
		az = 0}
		
	
	
	
	}
	return moves.join(' ')
	}
	

function Moves(moves){
	moves = moves.split('')
	for (var i = 0; i< moves.length ; i++){
		if(moves[i] == 'F'){
			razgon(58, 80)
			if(robot.azimut == 2) robot.cellY += 1
			if(robot.azimut == 3) robot.cellX -= 1
			if(robot.azimut == 0) robot.cellY -= 1
			if(robot.azimut == 1) robot.cellX += 1
			} 
		else if(moves[i] == 'R'){
			goroskop(90)
			robot.azimut+= 1
			if(robot.azimut == 4) robot.azimut = 0
			}
		else if(moves[i] == 'L'){
			goroskop(-87)
			robot.azimut -= 1
			if(robot.azimut == -1) robot.azimut = 3
			
			} 
		
		}
}

//Moves(makeMoves(bfs(1,0)))
//povorot(-85)
//razgon(100, 80)		
//move(25.76,50)
//move(100)		
//goroskop(85)		


function rgb24_RGB (rgb24){
	var R, G, B
	R =(rgb24 & 0xFF0000) >> 16
	G =(rgb24 & 0x00FF00) >> 8
	B =(rgb24 & 0x0000FF)
	
	return [R,G,B]
	}
	
	function RGB_rgb24(R ,G, B){
		return  R * Math.pow(256,2) + G * 256 + B
		}

function rgb24_grey(arr){
	var arrOut = [], grey,
	buffer=[]
	for (var i = 0; i < arr.length; i++){
		arrOut.push([])
		for (var j = 0; j < arr[0].length; j++){
			buffer=rgb24_RGB(arr[i][j])
			grey = Math.round((buffer[0]+buffer[1]+buffer[2])/3)
			arrOut[i].push(grey)
			}
		}
		return arrOut
	}

function pic2bw(arr) {
	var arrOut = [], bit
	for (var i = 0; i < arr.length; i++){
		arrOut.push([])
		for (var j = 0; j < arr[0].length; j++){
			bit = arr[i][j] < 255 / 5? 1: 0
			arrOut[i].push(bit)
			}
		}
		return arrOut
	}

function skan(arr, delta){
	delta = delta || 4
	var A, B, C, D, y, x
	var count = 1 + delta
	cornerA:
	for(var i=delta; i < arr[0].length- delta; i++){
		for(var j = delta; j < count - delta; j++){
			y = j
			if(y > arr.length - delta - 1) y = arr.length - delta - 1
			if(arr[y][count - 1 - j] == 1){
				A = [y, count - 1 - j]
				break cornerA
				}
			}
			count++
		}
		
		
	var count = 1 + delta	
	cornerB:
	for(var i = delta; i < arr[0].length - delta; i++){
     	for(var j = delta; j < count - delta; j++){
			y = j
			if(y > arr.length - delta - 1) y = arr.length - delta - 1
          if(arr[y][arr[0].length - count  + j]  == 1){
			  B = [y,arr[0].length - count + j]
			  break cornerB
			  }
			  
			}
			count++
		}	
		
		
	var count = 1 + delta	
	cornerC:
	for(var i=arr[0].length - delta - 1; i > delta; i--){
     	for(var j = delta; j < count - delta; j++){
			y = i + j 
			if(y > arr.length - delta - 1) y = arr.length - delta - 1
          if(arr[y][arr[0].length - delta -  j - 1]  == 1){
			  
			  C = [y,arr[0].length - delta - j - 1]
			  break cornerC
			  }
			  
			}
			count++
		}
	var count = 1 + delta		
		cornerD:
	for(var i = arr[0].length - delta - 1; i >delta; i--){
     	for(var j = delta; j < count - delta; j++){
			y = i + j
			if(y > arr.length - delta - 1) y = arr.length - delta - 1
          if(arr[y][delta + j]  == 1){
			  D = [y,delta + j]
			  break cornerD
			  }
			  
			}
			count++
		}
		print(A, B, C, D)
		return[A,B,C,D]
}

function crossFind(abcd){
	
	//print(abcd)
	var x1 = abcd[0][0],
		y1 = abcd[0][1],
		x2 = abcd[2][0],
		y2 = abcd[2][1],
		x3 = abcd[1][0],
		y3 = abcd[1][1],
		x4 = abcd[3][0],
		y4 = abcd[3][1],
		x, y
	
	
	x = -(((x1*y2 - x2*y1)*(x4 - x3)-(x3*y4-x4*y3)*(x2 - x1))/((y1-y2)*(x4-x3)-(y3-y4)*(x2-x1)));
	y = ((y3-y4)*(-x)-(x3*y4-x4*y3))/(x4 - x3)
	x = Math.floor(x)
	y = Math.floor(y)
	//print(x,'  ',y)
	return[x, y]
	
	}




function splitLine(x1y1, x2y2, sections){
	var dX, dY, out = [x1y1]
	dX = Math.floor((x2y2[0] - x1y1[0]) / sections)
	dY = Math.floor((x2y2[1] - x1y1[1])/ sections)
	for(var i = 1; i < sections ; i++){
		out.push([out[i-1][0]+dX, out[i-1][1]+dY])
		}
		out.push(x2y2)
		return out
	}
	
function getPixByXY(arrPic, xy){
	var arrOut = []
	for(var i = 0; i < xy.length; i++)
		arrOut.push(arrPic[xy[i][0]][xy[i][1]])
	return arrOut
	}
	

function ARTAG (arr) {                                 ////////////ARTAG/////////////
	pic = []
	for(var i = 0; i < 120; i++){
		pic.push([])
		for(var j = 0; j < 160; j++){
			pic[i].push(arr[i * 160 + j])
			
			}
		
		}
		
	picGrey = rgb24_grey(pic)
	picBW = pic2bw(picGrey)
		
		

	//printArr(picBW , '')
	//print(skan(picBW))
	//print(delenie(skan(picBW)))
	ABCD = skan(picBW, 6)
	cross = crossFind(ABCD)
	OA = splitLine(cross, ABCD[0], 6)
	OB = splitLine(cross, ABCD[1], 6)
	OC = splitLine(cross, ABCD[2], 6)
	OD = splitLine(cross, ABCD[3], 6)
	AB = splitLine(OA[3], OB[3], 3)
	BC = splitLine(OB[3], OC[3], 3)	
	CD = splitLine(OC[3], OD[3], 3)	
	DA = splitLine(OD[3], OA[3], 3)
		
		


	xy = [OA[3], OB[3], OC[3], OD[3]]

	orient = getPixByXY(picBW, xy).join('')

	switch(orient){
		case '1101': //pn
			xy = [AB[1], AB[2], DA[2], OA[1] ,OB[1], BC[1], DA[1], OD[1], OC[1], BC[2], CD[2], CD[1]]
			break
		case '1110': //ln
			xy = [BC[1], BC[2], AB[2], OB[1] ,OC[1], CD[1], AB[1], OA[1], OD[1], CD[2], DA[2], DA[1]]
			break
		case '0111': //lv
			xy = [CD[1], CD[2], BC[2], OC[1] ,OD[1], DA[1], BC[1], OB[1], OA[1], DA[2], AB[2], AB[1]]
			break
		case '1011' : //pv
			xy = [DA[1], DA[2], CD[2], OD[1] ,OA[1], AB[1], CD[1], OC[1], OB[1], AB[2], BC[2], BC[1]]
				break
		}

	xy = getPixByXY(picBW, xy)

	var n = [], x = [], y = []
	n.push(xy[2], xy[4])
	x.push(xy[5], xy[6], xy[8])
	y.push(xy[9], xy[10], xy[11])
		
	n = parseInt(n.join(''), 2)
	x = parseInt(x.join(''), 2)
	y = parseInt(y.join(''), 2)
		return [n, x, y] 
	}		

//photo = script.readAll("c:\\users\\olymp\\desktop\\6_3_1.txt")	
//photo = photo[0].trim().split(',')
photo = getPhoto()

print(ARTAG(photo))
