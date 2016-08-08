var sensor1 = require('jsupm_th02');
var th02 = new sensor1.TH02();

var lcd = require('jsupm_i2clcd');
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
display.write("init");

// Simulate device value
var temp = 24.00;
var humi = 50;
var reported_state = {"Temperature":temp, "Humidity": humi};

// Client token value returned from thingShadows.update() operation//app deps
const thingShadow = require('./node_modules/aws-iot-device-sdk/thing');

// Plug Grove - Temperature&Humidity(High quality) to i2c port

var sensor1 = require('jsupm_th02');
var th02 = new sensor1.TH02();

var awsIot = require('aws-iot-device-sdk');

var rootDir = '/home/root/.node_app_slot/certificat/'

var thingShadows = awsIot.thingShadow({
    keyPath: rootDir + 'iot.pem',
    certPath: rootDir + 'cert.pem',
    caPath: rootDir + 'rootCA.pem',
    clientId: 'myAwsClientId',
    region: 'eu-central-1'
});

//
// Client token value returned from thingShadows.update() operation
//
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

function readSensor(callback){
    temp = th02.getTemperature();
    humi = th02.getHumidity();

    console.log(temp);
    console.log(humi);

    display.setCursor(0,0);
    display.write(temp.toFixed(2).toString());

    callback();
};

function sendData(){
    var reported_state = {"Temperature":temp, "Humidity": humi};
    var relayTH02State = {"state":{desired: reported_state}};  // Use desired attribute can receive delta
    // More info refer to http://docs.aws.amazon.com/iot/latest/developerguide/thing-shadow-mqtt.html#update-pub-sub-message

    clientTokenUpdate = thingShadows.update(thingName, relayTH02State);

    if (clientTokenUpdate === null)
    {
       console.log('update shadow failed, operation still in progress');
    }
};
