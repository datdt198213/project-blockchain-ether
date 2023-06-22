class Driver {
    constructor(driver) {
        this.ID = driver.driver;
        this.drivingCost = driver.drivingCost;
        this.capacity = driver.capacity;
        this.confirmedAt = driver.confirmedAt;
        this.originAddress = driver.originAddress;
        this.passengerAccounts = driver.passengerAccts;
    }
}

class Passenger {
    constructor(ID, name, balance, state) {
        this.ID = ID;
        this.name = name;
        this.balance = balance;
        this.state = state;
    }
}


module.exports =  {
    Driver, 
    Passenger, 
}