const crypto = require('node:crypto');
const dataJson = require('../data/vehicle.json')

// Define driver class 
class Driver {
    constructor(id, distance, time, coin) { 
        this.id = id;
        this.distance = Number (distance);
        this.time = Number (time);
        this.coin = Number (coin);
    }

    display() {
        console.log("id: " + this.id + ", Distance: " + this.distance + ", Time: " + this.time + " , Coin: " + this.coin);
    }
}

// Define vehicle class 
class Vehicle {
    constructor(vehicle, time) {
        this.id = vehicle.id;
        this.x = vehicle.x;
        this.y = vehicle.y;
        this.angle = vehicle.angle;
        this.type = vehicle.type;
        this.speed = vehicle.speed;
        this.pos = vehicle.pos;
        this.lane = vehicle.lane;
        this.slope = vehicle.slope;
        this.time = time;
    }
}

// Hash string by sha512 
function sha512(inputString) {
    return crypto.createHash('sha512').update(inputString).digest('hex');
}

// Classify data of a node, return new array is classified
function classifyList(drivers) {
    newDrivers = [];

    check = [];

    for (let i = 0 ; i < drivers.length;i++) {
        check.push(false);
    }

    for (let i = 0; i < drivers.length; i++) {
        list = [];
        if (check[i] == false) {
            list.push(drivers[i]);
            check[i] = true;
            for (let j = i + 1; j < drivers.length; j++) {
                if (drivers[i].id === drivers[j].id && check[j] == false) {
                    list.push(drivers[j]);
                    check[j] = true;
                }
            }
            newDrivers.push(list);
        }
    }

    return newDrivers;
}

// Calculate average coin in blockchain network
function calculateAverageCoin(coins) {
    w = 0;
    for (let i = 0; i < coins.length; i++) {
        w += coins[i];
    }

    w /= coins.length;
    return w;
}

// Calculate coin of a driver through distance
function calculateCoinDriver(drivers, distance, begin, end) {
    n = drivers.length;
    temp = 0;

    // Drivers of a class, only belong node 0, node 1, ...
    for (let i = begin; i <= end; i = i + 0.1) {
        // When plus 0.1, it will overflow number after point
        currentTime = parseFloat(i.toFixed(1));
        for (let j = 0; j < n; j++) {
            if (drivers[j].time == currentTime) {
                temp = (temp + drivers[j].distance);
                if (temp >= distance) {
                    drivers[j].coin++;
                    temp -= distance;
                }
                break;
            }
        }
    }
    
    totalCoins = 0;
    for (let i = 0; i < n; i++) {
        totalCoins += drivers[i].coin;
    }

    return totalCoins;
}

// Get last of element in a array node at current time (array of node 1, array of node 2)
function getLastElememt(drivers) {
    return drivers.map(subarray => subarray[subarray.length - 1]);
}

function getFistElement(drivers) {
    return drivers.map(subarray => subarray[0]);
}

// Return satisfy node proof of driving
function rule(drivers, coins, w) {
    nodePod = [];

    //  Get hash value of w
    let hashW = sha512(w.toString());

    for (let i = 0; i < coins.length; i++) {
        //  Get hash value of driver
        hashCurrent = sha512(coins[i].toString());
        // if (hashCurrent <= hashW) {
        //     nodePod.push(drivers[i]);
        // }
        if (hashCurrent.localeCompare(hashW) <= 0) {
            nodePod.push(drivers[i]);
        } 
    }
        
    return nodePod;
}

// Get data from json and return list of vehicle
function getDataFromJson() {
    const data = dataJson['fcd-export']['timestep']; 

    dataList = [];

    data.forEach(element => {

        // Having a object
        if (element.vehicle.length == undefined) {
            // Push data to list
            dataList.push(new Vehicle(element.vehicle, element.time));
        } else {
            vehicles = element.vehicle;
            // Having more than one object
            vehicles.forEach( v => {
                // Push data to list
                dataList.push(new Vehicle(v, element.time));
            })
        }
    });

    return dataList;
}

// Check object exist in array
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

// Calculate distance at 2 points
function calculateDistance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Calculate distance of a vehicle list, return a driver list
function calculateDistanceList(vehicles) {
    drivers = [];

    d = new Driver(vehicles[0].id, 0, vehicles[0].time, 0);
    drivers.push(d);

    for (let i = 1; i < vehicles.length; i++) {
        timestep = vehicles[i].time - vehicles[i - 1].time;
        roundTime = parseFloat(timestep.toFixed(1));
        if (roundTime === 0.10) {
            distance = calculateDistance(vehicles[i], vehicles[i-1]);
            d = new Driver(vehicles[i].id, distance, vehicles[i].time, 0);
            drivers.push(d);
        }
    }

    return drivers;
}



function main () {
    coins = [];

    dataList = getDataFromJson();

    dataList = classifyList(dataList);

    newList = []
    for(let i = 0; i < dataList.length; i++) {
        // console.log(dataList[i]);
        a = calculateDistanceList(dataList[i]);
        newList.push(a);
    }

    for (let i = 0; i < newList.length; i++) {
        w = calculateCoinDriver(newList[i], 0.1, 0.0, 1.0);
        coins.push(w);
    }

    w = calculateAverageCoin(coins);

    // Get all last elements from classify driver list
    lastElememts = getLastElememt(newList);

    nPOD = rule(lastElememts, coins, w);

    nPOD.forEach(element => {
        console.log(element)
    });
}

main();

module.exports =  {
    calculateAverageCoin, 
    rule
} 