// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyAUf4N0VPNsDH6-nCOJry8Y-ptoMBnRHmE",
    authDomain: "minijuegosjs.firebaseapp.com",
    databaseURL: "https://minijuegosjs.firebaseio.com",
    projectId: "minijuegosjs",
    storageBucket: "minijuegosjs.appspot.com",
    messagingSenderId: "969930521099",
    appId: "1:969930521099:web:d3e984e929c9239349a50e"
  },
  colyseusUrl: 'wss://minijuegosjs.herokuapp.com'
  // colyseusUrl: 'ws://localhost:2567'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
