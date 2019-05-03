// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false, 
  firebase: {
      apiKey: "AIzaSyCYSFGKSZR9xHXxrbS_tYJi5DGTSMA3vG4",
      authDomain: "brodys-192703.firebaseapp.com",
      databaseURL: "https://brodys-192703.firebaseio.com",
      projectId: "brodys-192703",
      storageBucket: "brodys-192703.appspot.com",
      messagingSenderId: "496912351206"
    }
};
