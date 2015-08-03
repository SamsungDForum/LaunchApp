(function () {
    'use strict';

    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     */
    function log(msg) {
        var logsEl = document.getElementById('logs');

        if (msg) {
            // Update logs
            console.log('[App2AppCallee]: ', msg);
            logsEl.innerHTML += msg + '<br />';
        } else {
            // Clear logs
            logsEl.innerHTML = '';
        }

        logsEl.scrollTop = logsEl.scrollHeight;
    }

    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 10182 : // Exit Key
                    tizen.application.getCurrentApplication().exit();
                    break;
                case 10009 : // Return Key
                    tizen.application.getCurrentApplication().hide();
                    break;
            }
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
     * This function checks if application is called from another application with parameters
     */
    function checkParameters () {
        // Get the ApplicationControl instance sent from TizenCaller. This object
        // contains data sent from the caller application.
        var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
        var appControl = reqAppControl.appControl;
        var data;

        if (appControl && appControl.operation === 'http://tizen.org/appcontrol/operation/default') {
            data = appControl.data;
            log('Data from App2AppCaller successfully received:' + JSON.stringify(data));
            log('Data sent from application with ID: ' + reqAppControl.callerAppId);

            // Parse and display data received from TizenCaller
            data.forEach(function (dataItem) {
                if (dataItem.key === 'App2AppCaller') {
                    dataItem.value.forEach(function (value) {
                        log('App2AppCaller sent: ' + value);
                    });
                }
            });

            // Send a reply to TizenCaller. As of 09.12.2014 .replyResult can only
            // be called once.
            var appControlData = new tizen.ApplicationControlData(
                'fromTizenCallee',
                ['Thank you for the fruits!']
            );

            reqAppControl.replyResult([appControlData]);
        } else {
            log('No data received from App2AppCaller.');
        }
    };


    // When application is sent to background or summonned from backgrount the 'visibilitychange' event
    // is emitted.
    // By testing the value of document.hidden we can discover whether the application is being sent to
    // background or it is summoned back.
    document.addEventListener('visibilitychange', function () {
        log('New visibility (document.visibilityState):' + document.visibilityState);
        if (!document.hidden) {
            // Application is brought back from background
            // Reshow the initial application launch params
            checkParameters();
        }
    }, false);


    window.onload = function () {
        if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }

        displayVersion();
        registerKeyHandler();
        checkParameters();

    };




}());
