// Plug Grove - Temperature&Humidity(High quality) to i2c port
// On importe la bibliothèque du capteur de température et d'humidité TH02 puis on le déclare
var sensor1 = require('jsupm_th02');
var th02 = new sensor1.TH02();

// On importe la bibliothèque de l'écran LCD puis on le déclare
var lcd = require('jsupm_i2clcd');
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
// On affiche "init" à l'écran
display.write("init");

// Client token value returned from thingShadows.update() operation
// On importe la bibliothèque de thingShadow
const thingShadow = require('./node_modules/aws-iot-device-sdk/thing');

// On importe la bibliothèque AWS IoT
var awsIot = require('aws-iot-device-sdk');

// Répertoire contenant les certificats (sur le thing)
var rootDir = '/home/root/.node_app_slot/certificat/'

// Toutes les explications de la bibliothèque aws-iot-device-sdk
// sont données en détail dans le readme du git du package
// https://github.com/aws/aws-iot-device-sdk-js
var thingShadows = awsIot.thingShadow({
    keyPath: rootDir + 'iot.pem',
    certPath: rootDir + 'cert.pem',
    caPath: rootDir + 'rootCA.pem',
    clientId: 'myAwsClientId',
    region: 'eu-central-1'
});

// Client token value returned from thingShadows.update() operation
var clientTokenUpdate;

var thingName = "Edison";
thingShadows.on('connect', function() {
    thingShadows.register(thingName);
    console.log(thingName + ' registering...');

    setInterval(function(){
      readSensor(sendData);
    }, 120000);
});

thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
    console.log('   received '+stat+' on '+thingName+': '+ JSON.stringify(stateObject));
    //
    // These events report the status of update(), get(), and delete()
    // calls.  The clientToken value associated with the event will have
    // the same value which was returned in an earlier call to get(),
    // update(), or delete().  Use status events to keep track of the
    // status of shadow operations.
    //
});

thingShadows.on('delta', function(thingName, stateObject) {
    console.log('    received delta on '+thingName+': '+ JSON.stringify(stateObject));

});

thingShadows.on('timeout', function(thingName, clientToken) {
    console.log('    received timeout on '+thingName + ' with token: '+ clientToken);
    //
    // In the event that a shadow operation times out, you'll receive
    // one of these events.  The clientToken value associated with the
    // event will have the same value which was returned in an earlier
    // call to get(), update(), or delete().
    //
});

// Cette fonction va lire les données du capteur TH02 puis affiché la température sur l'écran
function readSensor(callback){
    temp = th02.getTemperature();
    humi = th02.getHumidity();
    display.setCursor(0,0);
    display.write(temp.toFixed(2).toString());
    callback();
};

// Cette fonction va envoyer les données sur AWS IoT
function sendData(){
    var reported_state = {"Temperature":temp, "Humidity": humi};
    var desired = {"state":{desired: reported_state}};  // Use desired attribute can receive delta
    clientTokenUpdate = thingShadows.update(thingName, desired);
    if (clientTokenUpdate === null)
    {
       console.log('update shadow failed, operation still in progress');
    }
};
