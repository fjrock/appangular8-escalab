// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_COCKTAIL: 'https://www.thecocktaildb.com/api/json/v1/1',
  firebaseConfig: {
    apiKey: "AIzaSyBcF_DPOLUtB9UzS_weg5N0baf16G2GTVM",
    authDomain: "angular-escalab.firebaseapp.com",
    databaseURL: "https://angular-escalab.firebaseio.com",
    projectId: "angular-escalab",
    storageBucket: "angular-escalab.appspot.com",
    messagingSenderId: "924022427191",
    appId: "1:924022427191:web:0a4472002232d5af3279b2",
    measurementId: "G-NNZKHTKTZ1"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
