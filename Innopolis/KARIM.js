robot = {
	wheelD: 5.6,
	track: 17.5,
	cpr: 360,
	v: 80
}

mL = brick.motor('M4').setPower
mR = brick.motor('M3').setPower
eL = brick.encoder('E4').read
eR = brick.encoder('E3').read
//sF = brick.sensor('D1').read
//sL = brick.sensor('A2').read
pi = Math.PI
abs = Math.abs
wait = script.wait



function cm2cpr(cm) {return (cm / (pi * robot.wheelD)) * robot.cpr}
function motors(vL, vR){
	vL = vL == undefined ? robot.v : vL
	vR = vR == undefined ? vL : vR
	mL(vL)
	mR(vR)
}
function move(cm){
	var path = cm2cpr(cm)
	path += eL()
	motors()
	while(eL() < path) { wait(10) }
	motors(0)
}

function sign(num) {return num > 0? 1 : -1}



function povorot(alpha){
	var sgn = sign(alpha)
	var len = ((robot.track * alpha) / (robot.wheelD * 360)) * robot.cpr
	len += eL()
	motors(sgn * robot.v/2,sgn * -robot.v/2)
	if (sgn == 1){
		while (eL() < len){wait(10)}
		}else {
			while(eL() > len) { wait(10)}
			
		}
	
    motors(0)
}
function razgon(cm, v){
	v = v == undefined ? robot.v : v
	var pathO = eL()
	var path = cm2cpr(cm) + pathO
	var vO = 30, vM = vO
	var startStop = path / 4
	var dV = (v - vO) / 10
	while (eL() < path){
		if(eL() < pathO + startStop){ vM += dV}
		else if(eL() > pathO + startStop * 3){ vM -= dV}
		motors(vM)
		
		wait(30)
	}

	}

brick.gyroscope().calibrate(5000)
wait(4000)
function getYaw(){return brick.gyroscope().read()[6]}


function goroskop(a){
	if(a < 200){ a*= 1000}
	
	
	motors(40, -40)
	
	
	while(abs(a - getYaw()) > 3000){ wait(10)}
		
}

