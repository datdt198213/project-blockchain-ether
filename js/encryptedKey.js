const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

/*
PRIVATE_KEY is private address in account
PRIVATE_KEY_PASSWORD can set unexpected
*/ 

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const encryptedJsonKey = await wallet.encrypt(
        process.env.PRIVATE_KEY_PASSWORD,
        process.env.PRIVATE_KEY
        );
    console.log(encryptedJsonKey);
    fs.writeFileSync("./json/.encryptedKey.json", encryptedJsonKey);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });