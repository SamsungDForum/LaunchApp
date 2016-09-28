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
	var paramAppId = 'org.tizen.browser';
	var paramData = {
						url: 'https://www.samsungdforum.com',
						info: 'samsungdforum'
					};
	var appCtrlDataAry = [];

	for(var keyName in paramData) {
		var temp = new tizen.ApplicationControlData(keyName, [paramData[keyName]]);
		appCtrlDataAry.push(temp);
	}

	var browserAppCtrl = new tizen.ApplicationControl(null, (appCtrlDataAry[0].value)[0], null, null, appCtrlDataAry);
	tizen.application.launchAppControl(
		browserAppCtrl,
		paramAppId,
		function() {
			text = 'Jump Browser Success';
			log(text);
		},
		function(error) {
			text = 'Jump Browser Error : ' + JSON.stringify(error);
			log(text);
		}, 
		null
	);
}

function test2() {
	tizen.application.launch(
		'YScviknAUI.CalleeApp',
		function() {
			text = 'Jump TizenWebApplication Success';
			log(text);
		}, function(error) {
			text = 'Jump TizenWebApplication Error : ' + JSON.stringify(error);
			log(text);
		});
}

function test3() {
	var paramAppId = 'YScviknAUI.CalleeApp';	
	var appData = new tizen.ApplicationControlData('pets', ['dog','cat','bird']);
	
	var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/default', null, null, null, [appData]);
	tizen.application.launchAppControl(
		appControl,
		paramAppId,
		function() {
			text = 'Jump TizenWebApplication with Data Success';
			log(text);
		},
		function(error) {
			text = 'Jump TizenWebApplication with Data Error : ' + JSON.stringify(error);
			log(text);
		}, 
		{
			onsuccess: function (data) {
				text = 'Reply is ' + JSON.stringify(data);
				log(text);
			},
			onfailure: function (error) {
				text = 'Jump TizenWebApplication Error : ' + JSON.stringify(error);
				log(text);
			}
		}
	);
}

function main() {
	console.log('[TestApp] onload');

	tizen.tvinputdevice.registerKey('0');
	tizen.tvinputdevice.registerKey('1');
	tizen.tvinputdevice.registerKey('2');
	tizen.tvinputdevice.registerKey('3');
}

function log(string) {
	result = result + '<br>' + string;
	document.getElementById('result').innerHTML = result;
}

function logClear() {
	result = '';
	document.getElementById('result').innerHTML = '';
}
