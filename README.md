# 1. Create solidity file and setup environment

Step 1: create file RideShare.sol

Step 2: Download Solidity - hardhad in extentions of visual studio code

Step 3: Add default formatter in setting.json file, 
```
"[solidity]": {
        "editor.defaultFormatter": "NomicFoundation.hardhat-solidity"
    }
```
Step 4: Create file deploy.js to deploy data in .abi and .bin files to ganache
and encryptedKey.js to encrypt all information of account in ganache to ".encryptedKey.json" file

Step 5: Check yarn version
```
yarn --version
```


# 2. Install dependence in project

Step 1: Install solc with yarn
```
yarn add solc
```

Step 2: Install another fixed version solidity 
```
yarn add solc@0.8.7-fixed
```

Step 3. Install ether with yarn
```
yarn add ethers
```

Step 4. Install fs-extra with yarn
```
yarn add fs-extra
```

Step 5. Install dotenv with yarn 
```
yarn add dotenv
```

Step 6. Install prettier with yarn
```
yarn add prettier
```

Step 7. Install prettier-plugin-solidity with yarn
```
yarn add prettier-plugin-solidity
```


# 3. Download Ganache 
Download ganache from link: https://trufflesuite.com/ganache/


# 4. Compile and run project

Step 1. Compile file RideShare.sol to file .bin and .abi in project
```
yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . RideShare.sol
```

Step 2. Set command in step 1 with "compile" command in package.json (add command below)
```
"scripts": {
    "compile": "yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . RideShare.sol"
  }
```

Step 3. Modify version ethers and reinstall node_modules

Because "process.env" only active in version 5.4 of "ethers" sp we will change from latest version to 5.4.0

Modify version of ethers in package.json
```
  "ethers": "^5.4.0"
```

Delete 'node_modules' and run command below to install again npm package
```
npm install
```

Step 5: Run project

encryptedKey.js file need 2 environment variables, we will pass 2 parameter through command
```
PRIVATE_KEY=0x78a73b581eab3c124e91000a549b259a2727183cd3d4f13de48739e4893097fa PRIVATE_KEY_PASSWORD=password node encyptedKey.js
```

Run file deploy.js, PRIVATE_KEY_PASSWORD in deploy.js must be duplicate with PRIVATE_KEY_PASSWORD in encryptedKey.js
```
RPC_URL=http://127.0.0.1:7545 PRIVATE_KEY_PASSWORD=password node deploy.js
```
