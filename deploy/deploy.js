const ethers = require("ethers");
const fs = require("fs-extra");
Consensus = require("../consensus/Consensus.js");
Model = require("../consensus/Model.js");
require("dotenv").config();

/*
RPC_URL is url of test network (localhost, testnet)
PRIVATE_KEY is private address in account
PRIVATE_KEY_PASSWORD can set unexpected
*/ 

async function main(){
    // http://127.0.0.1:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const encryptedJson = fs.readFileSync("../encryption/.encryptedKey.json", "utf8");
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson, 
        process.env.PRIVATE_KEY_PASSWORD
    );
    wallet = await wallet.connect(provider);

    const abi = fs.readFileSync("../data/RideShare_sol_RideContract.abi", "utf8");
    const binary = fs.readFileSync("../data/RideShare_sol_RideContract.bin", "utf8");

    let provider1 = ethers.getDefaultProvider();
    

    // Get the Wallet address
    let address = ethers.utils.getJsonWalletAddress(abi.toString());

    // Look up the balance
    let balance = await provider.getBalance(address);

    console.log(address + ':' + ethers.utils.formatEther(balance));

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy(); // STOP here! Wait for contract to deploy
    await contract.deployTransaction.wait(1);
    
    // console.log("Here is the deployment transaction (transaction response): ");
    // console.log(contract.deployTransaction);
    // console.log("Here is the transaction receipt: ");
    // console.log(transactionReceipt);

    // Get currentPassenger
    // const currentPassenger = await contract.retrievePassenger();
    // console.log(`Current passenger: ${currentPassenger.toString()}`);

    // const transactionResponse = await contract.addPassenger(200,"Dang Dat");
    // const transactionReceipt = await transactionResponse.wait(1);
    // const updatePassenger = await contract.retrievePassenger();
    // console.log(`Passenger 1: ${updatePassenger.toString()}`);

    const transactionResponse2 = await contract.createRide(
        "0xc33103f168f2Fc20f5886E62e538dD908b2ad380",
        30, 
        4,
        300,
        "Ha noi",
        "Hai phong" 
    );

    const transactionResponse3 = await contract.createRide(
        "0xAe4644cD4b6f71a7A31eE5583D27e8B198d9f489",
        31, 
        120,
        70,
        "Ha noi",
        "Hai phong" 
    );

    const transactionResponse4 = await contract.createRide(
        "0x67EafE1b6148DBC773B456F86413699aDd2bA5a5",
        120, 
        120,
        70,
        "Ha noi",
        "Hai phong" 
    );
    
    const transactionResponse5 = await contract.createRide(
        "0x65671c446F26ee916E5f4e46947787aB5cf6437f",
        1, 
        120,
        70,
        "Ha noi",
        "Hai phong" 
    );

    const transactionReceipt2 = await transactionResponse2.wait(1);
    const transactionReceipt3 = await transactionResponse3.wait(1);
    const transactionReceipt4 = await transactionResponse4.wait(1);
    const transactionReceipt5 = await transactionResponse5.wait(1);

        
    const driver1 = await contract.retrieveRide(0);
    const driver2 = await contract.retrieveRide(1);
    const driver3 = await contract.retrieveRide(2);
    const driver4 = await contract.retrieveRide(3);
    // console.log(`Driver 1: ${driver1.toString()}`);
    // console.log(`Driver 2: ${driver2.toString()}`);

    
    const d1 = new Model.Driver(driver1);
    const d2 = new Model.Driver(driver2);
    const d3 = new Model.Driver(driver3);
    const d4 = new Model.Driver(driver4);

    const list = []
    list.push(d1);
    list.push(d2);
    list.push(d3);
    list.push(d4);
  
    // const w = Consensus.calculateAverageCoint(list)
    // const nodePod = Consensus.rule(list, w);
    
    // console.log(nodePod.length)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });