var gyro = brick.gyroscope()
var calibrationDelay = 60000

gyro.calibrationFinished.connect(function() {
	calibValues = gyro.getCalibrationValues()
	print("Calibration values: " + calibValues)
	
	
	gyro.setCalibrationValues(calibValues)
	
	script.quit()
	
})

gyro.calibrate(calibrationDelay)
script.run()