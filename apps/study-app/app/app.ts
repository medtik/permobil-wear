﻿import {
  APP_KEY,
  APP_SECRET,
  SentryService,
  SERVICES,
  Log
} from '@permobil/core';
import { ReflectiveInjector } from 'injection-js';
import { Kinvey } from 'kinvey-nativescript-sdk';
import { Sentry } from 'nativescript-sentry';
import * as application from 'tns-core-modules/application';
import { ad as androidUtils } from 'tns-core-modules/utils/utils';
import './utils/async-await';
import * as themes from 'nativescript-themes';

declare const com: any;

Log.D('Setting the default theme for the app styles');
// apply our default theme for the app
themes.applyTheme(themes.getAppliedTheme('theme-default.css'));

/**
 * Exposing the system time from app.ts so we can use it throughout the app if needed.
 * Right now, it's only being used here in the ambient mode callbacks. This way we can bind/print
 * the time on the screen during the ambient update callback.
 */
export const currentSystemTime = () =>
  new java.text.SimpleDateFormat('h:mm a', java.util.Locale.US).format(
    new java.util.Date()
  );
Log.D(`Current system time: ${currentSystemTime()}`);

// initialize Kinvey
Kinvey.init({ appKey: `${APP_KEY}`, appSecret: `${APP_SECRET}` });

// init sentry - DNS key for permobil-wear Sentry project
Sentry.init(
  'https://234acf21357a45c897c3708fcab7135d:bb45d8ca410c4c2ba2cf1b54ddf8ee3e@sentry.io/1376181'
);

// setup injection-js for dependency injection of services
Log.D('Creating the injectable services...');
export const injector = ReflectiveInjector.resolveAndCreate([...SERVICES]);
const sentryService: SentryService = injector.get(SentryService);

// Create the Sensor Service to collect data
const sensorServiceIntent = new android.content.Intent(
  androidUtils.getApplicationContext(),
  com.github.maxmobility.SensorService.class
);
this.startService(sensorServiceIntent);
Log.D('native SensorService created...', com.github.maxmobility.SensorService);

// handle ambient mode callbacks
application.on('enterAmbient', args => {
  Log.D('enterAmbient', args.data, currentSystemTime());
  themes.applyTheme('theme-ambient.css');
});

// handle ambient mode callbacks
application.on('exitAmbient', args => {
  Log.D('exitAmbient', args.data, currentSystemTime());
  themes.applyTheme('theme-default.css');
});

// handle ambient mode callbacks
application.on('updateAmbient', args => {
  Log.D('updateAmbient', args.data, currentSystemTime());
});

// setup application level events
application.on(
  application.uncaughtErrorEvent,
  (args: application.UnhandledErrorEventData) => {
    sentryService.logError(args.error);
  }
);

application.on(
  application.discardedErrorEvent,
  (args: application.DiscardedErrorEventData) => {
    sentryService.logError(args.error);
  }
);

application.on(application.launchEvent, args => {
  Log.D('App launch event...');
  themes.applyTheme('theme-default.css');
});

application.on(application.displayedEvent, args => {
  // Log.D('app displayed event');
  // this fires often, especially during swiping to close, just FYI to avoid cluttering logs
});

application.on(application.suspendEvent, args => {
  Log.D('App suspend event...');
});

application.on(application.exitEvent, args => {
  Log.D('App exit event');
});

application.on(application.lowMemoryEvent, args => {
  Log.D('app low memory event');
});

application.on(application.resumeEvent, args => {
  const processId = android.os.Process.myPid();
  Log.D(`App resume event -- process ID: ${processId}`);
});

// start the app
application.run({ moduleName: 'app-root' });
