(function () {
    'use strict';

    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     * @param {object} obj - Object to log.
     */
    function log(msg, obj) {
        var logsEl = document.getElementById('logs');

        if (msg) {
            // Update logs
            console.log('[CallerAppSample]: ', msg, obj);
            msg = obj ? msg += ' [see console]' : msg;
            logsEl.innerHTML = logsEl.innerHTML + msg + '<br>';
        } else if (msg === null) {
            // Clear logs
            logsEl.innerHTML = '';
        }

        logsEl.scrollTop = logsEl.scrollHeight;
    }

    /**
     * Register keys used in this application
     */
    function registerKeys() {
        var usedKeys = ['0', '1', '2'];

        usedKeys.forEach(function (keyName) {
            tizen.tvinputdevice.registerKey(keyName);
        });
    }

    /**
     * Display application version
     */
    function displayVersion() {
        var el = document.createElement('div');
        el.id = 'version';
        el.innerHTML = 'ver: ' + tizen.application.getAppInfo().version;
        document.body.appendChild(el);
    }

    /**
     * Displays information that TizenCallee application has been successfully
     * launched.
     */
    function onLaunchSuccess() {
        log('CalleeAppSample has been successfully launched.');
        console.log('CalleeAppSample started with args');
        console.log(arguments);
    }


    /**
     * Displays error message and information that TizenCallee application hasn't
     * been launched.
     */
    function onLaunchError(e) {
        log('TizenCallee launch error :' + JSON.stringify(e));
    }

    /**
     * Contains success and failure handlers for handling replies from TizenCallee.
     * @type {Object}
     */
    var replyHandler = {
        //function to be called when data from Callee application is received successfully
        onsuccess: function (data) {
            log('CalleeAppSample sent back data: ', data);

            // Display data returned from TizenCallee.
            data.forEach(function (dataItem) {
                log(dataItem);
                if (dataItem.key === 'CalleeAppSample') {
                    dataItem.value.forEach(function (value) {
                        log('CalleeAppSample sent back: ' + value);
                    });
                }
            });
        },

        //function to be called when there is an error in communication with Callee application
        onfailure: function () {
            log('CalleeAppSample failed to send data back.');
        }
    };

    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener('keydown', function (e) {
            var data;
            var appControl;

            switch (e.keyCode) {
                // Key 0: Clear logs
                case 48:
                    log();
                    break;
                // Key 1: Launch TizenCallee without any data
                case 49:
                    log('Launching CalleeAppSample without any data.');
                    // This is the simplest application launch
                    // No arguments can be passed to it nor received from it
                    // If application is already running in the background, it will be brought back
                    tizen.application.launch('iw98RgTdbA.CalleeAppSample', onLaunchSuccess, onLaunchError);
                    break;
                // Key 2: Launch TizenCallee and send data
                case 50:
                    // The first param is a key and the second parameter is a value.
                    // Second parameter must be in the form of an array.
                    data = new tizen.ApplicationControlData(
                        'CallerAppSample',
                        ['apples', 'bananas']
                    );

                    appControl = new tizen.ApplicationControl(
                        'http://tizen.org/appcontrol/operation/default', //This describes action to be performed by Application Service
                        null, //URI - defines the data on which the action will be performed
                        null, //MIME 0 defines MIME type of the URI
                        null, //category of the application to be launched
                        [data] //data to sent to another application
                    );

                    log('Launching CalleeAppSample and sending data:', appControl);

                    // Here we send ApplicationControl instance with the data to
                    // the other application. TizenCallee will attempt to get this
                    // object and read sent data from it.
                    // If instance of TizenCallee is already running, it will be killed and spawned a new instance.
                    // There is no possibility to pass launch params to app already running.
                    tizen.application.launchAppControl(
                        appControl,
                       'iw98RgTdbA.CalleeAppSample',
                        onLaunchSuccess,
                        onLaunchError,
                        replyHandler
                    );
                    break;
                // Return Key
                case 10009:
                case 27:
                    tizen.application.getCurrentApplication().hide();
                    break;
            }
        });
    }

    /**
     * Initializes the application with appropriate listeners and their handlers.
     */
    window.onload = function () {

        if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }

        displayVersion();
        registerKeys();
        registerKeyHandler();

    };

}());
