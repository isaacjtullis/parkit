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

function setCss(elm, prop,val) {
  var node = document.getElementById(elm).style;
  node.setProperty(prop, val);
}

function setParkingLocation() {
  navigator.geolocation.getCurrentPosition(setParkingLocationSuccess, locationError, {enableHighAccuracy: true})
}

function setParkingLocationSuccess(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  storage.setItem('parkedLatitude', latitude);
  storage.setItem('parkedLongitude', longitude);
  navigator.notification.alert('Parking location was successfully saved');
  showParkingLocation();
}

function locationError(err) {
  navigator.notification.alert("Error: " + err.code + "\n Error Message: " + err.message);
}

function showParkingLocation() {
  setCss('directions', 'visibility','hidden');
  setCss('instructions', 'display', 'none');
  var latLong = new google.maps.LatLng(latitude, longitude);
  var map = new google.maps.Map(document.getElementById('map'));
  map.setZoom(16);
  map.setCenter(latLong);
  var marker = new google.maps.Marker({
    position: latLong,
    map: map
  });
  setCss('map','visibility','visible');
}

function getParkingLocation() {
  navigator.geolocation.getCurrentPosition(getParkingLocationSuccess, locationError, {enableHighAccuracy: true})
}

function getParkingLocationSuccess(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  parkedLatitude = storage.getItem('parkedLatitude');
  parkedLongitude = storage.getItem('parkedLongitude');
  showDirections();
}

function showDirections() {
  var dRenderer = new google.maps.DirectionsRenderer;
  var dService = new google.maps.DirectionsService;
  var curLatLong = new google.maps.LatLng(latitude, longitude);
  var parkedLatLong = new google.maps.LatLng(parkedLatitude, parkedLongitude);
  var map = new google.maps.Map(document.getElementById('map'));
  map.setZoom(16);
  map.setCenter(curLatLong);
  dRenderer.setMap(map);
  dService.route({
    origin: curLatLong,
    destination: parkedLatLong,
    travelMode: 'DRIVING'
  }, function(response, status){
    if(status == "OK"){
      dRenderer.setDirections(response);
      document.getElementById('directions').innerHTML = '';
      dRenderer.setPanel(document.getElementById('directions'));
    } else {
      navigator.notification.alert('ERROR!');
    }
  });
  setCss('map', 'visibility','visible');
  setCss('directions', 'visibility','visible');
  setCss('instructions', 'display','none');
}
// To check a complete list of events supported by Cordova go to
// cordova.apache.org/docs/en/latest/cordova/events/events.html