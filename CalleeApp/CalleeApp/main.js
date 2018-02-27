function handleKeydown(event) {
	console.log('[TestApp] handleKeydown : ' + event.keyCode);

	switch(event.keyCode) {
		case 48:
			logClear();

		break;
		case 49:
			test1();

		break;
		case 50:
			test2();

		break;
		case 51:
			test3();

		break;
		case 10009:
			console.log('[TestApp] return');
			tizen.application.getCurrentApplication().exit();
			
		break;
		default:

		break;
	}
}

var result = '';
var text = '';

function test1() {
	tizen.application.getCurrentApplication().hide();
}

function test2() {
	tizen.application.getCurrentApplication().exit();
}

function test3() {
	deepLink();
}

function main() {
	console.log('[TestApp] onload');

	window.addEventListener('appcontrol', deepLink);
	deepLink();
	
	document.addEventListener(
		'visibilitychange',
		function() {
			if(document.hidden){
				text = 'hidden';
				log(text);
				
			} else {
				text = 'visible';
				log(text);
			}
		}
	);

	tizen.tvinputdevice.registerKey('0');
	tizen.tvinputdevice.registerKey('1');
	tizen.tvinputdevice.registerKey('2');
	tizen.tvinputdevice.registerKey('3');
}

function deepLink() {
	var reqAppCtrl = tizen.application.getCurrentApplication().getRequestedAppControl();
	log("tizen.application.getCurrentApplication().getRequestedAppControl().callerAppId : " + reqAppCtrl.callerAppId);

	var reqAppCtrlDataAry = reqAppCtrl.appControl.data;
	log("tizen.application.getCurrentApplication().getRequestedAppControl().appControl.data : " + JSON.stringify(reqAppCtrlDataAry));

	var appData = new tizen.ApplicationControlData(
		'Success',
		['Jump TizenWebApplication Success']
	);
	try {
		reqAppCtrl.replyResult([appData]);
	}
	catch(e) {
		console.log('Failed replay to caller',e);
	}	
}

function log(string) {
	result = result + '<br>' + string;
	document.getElementById('result').innerHTML = result;
}

function logClear() {
	result = '';
	document.getElementById('result').innerHTML = '';
}
