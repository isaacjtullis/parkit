var latitude;
var longitude;
var parkedLatitude;
var parkedLongitude;

var storage;

function init(){
  document.addEventListener('deviceready', onDeviceReady, false);
  storage = window.localStorage;
}

function onDeviceReady() {
  var node = document.createElement('link');
  node.setAttribute('rel', 'stylesheet');
  node.setAttribute('type', 'text/css');
  if(cordova.platformId == 'ios'){
    node.setAttribute('href', 'parkItIos.css');
    window.StatusBar.overlaysWebView(false);
    window.StatusBar.styleDefault();
  } else {
    node.setAttribute('href', 'parkItAndroid.css');
    window.StatusBar.backgroundColorByHexString('#1565c0');
  }
  document.getElementsByTagName('head')[0].appendChild(node);
}

// To check a complete list of events supported by Cordova go to
// cordova.apache.org/docs/en/latest/cordova/events/events.html
