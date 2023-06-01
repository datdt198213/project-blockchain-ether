const ethers = require("ethers");
const fs = require("fs-extra");
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

    const encryptedJson = fs.readFileSync("json/.encryptedKey.json", "utf8");
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson, 
        process.env.PRIVATE_KEY_PASSWORD
    );
    wallet = await wallet.connect(provider);

    const abi = fs.readFileSync("./data/RideShare_sol_RideContract.abi", "utf8");
    const binary = fs.readFileSync("./data/RideShare_sol_RideContract.bin", "utf8");

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

    const transactionResponse = await contract.addPassenger(200,"Dang Dat");
    const transactionReceipt = await transactionResponse.wait(1);
    const updatePassenger = await contract.retrievePassenger();
    console.log(`Passenger 1: ${updatePassenger.toString()}`);

    const transactionResponse1 = await contract.addPassenger(300,"Nguyen Van A");
    const transactionReceipt2 = await transactionResponse1.wait(1);
    const updatePassenger1 = await contract.retrievePassenger();
    console.log(`Passenger 2: ${updatePassenger1.toString()}`);

    const transactionResponse2 = await contract.createRide(
        "0xedad3221c5c1d0709ac772b0D6CA32a38823850b",
        30, 
        4,
        300,
        "Ha noi",
        "Hai phong" 
    );

    const transactionResponse3 = await contract.createRide(
        "0xedad3221c5c1d0709ac772b0D6CA32a38823850b",
        30, 
        4,
        300,
        "Ha noi",
        "Hai phong" 
    );

    const transactionReceipt3 = await transactionResponse2.wait(1);
    const driver1 = await contract.retrieveRide(0);
    const driver2 = await contract.retrieveRide(1);
    console.log(`Driver 1: ${driver1.toString()}`);
    console.log(`Driver 2: ${driver2.toString()}`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });