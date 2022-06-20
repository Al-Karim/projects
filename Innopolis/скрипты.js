


function messages(){
	if(mailbox.hasMessages()) {
		var msg = mailbox.receive();
		brick.display().addLabel(msg,10,10)
		brick.display().redraw()
		script.wait(1000)
		}}
		mailbox.connect("10.240.23.9")
		var pager = script.timer(20)
		pager.timeout.connect(this, function() {messages()})
		pager.start()
		while(true) {script.wait(10)}
		
		
		
		mailbox.send(13,"privet")
		
