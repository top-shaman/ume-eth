UME - Decentralized Social Media built on Ethereum Blockchain

currently in development


----------------------------------------------------------

Project Dependencies:
-Node v16.8.0
-Truffle v5.4.6
-Solidity v8.6.0
-React 17.0.2

To run Mockchain, use Ganache-CLI or Ganache-GUI

Ganache-CLI Installation:

ganache-cli is written in JavaScript and distributed as a Node.js package via npm. Make sure you have Node.js (>= v6.11.5) installed.

Using npm:

>npm install -g ganache-cli
or, if you are using Yarn:

>yarn global add ganache-cli

To activate and configure Mockchain for this project, set port to 7545
>ganache-cli --port 7545

----------------------------------------------------------

Truffle Installation:

>npm install -g truffle

----------------------------------------------------------

To run UME you must have MetaMask installed on your browser:
https://metamask.io/download


----------------------------------------------------------

Install dependencies to node_modules by running:
>npm install

----------------------------------------------------------

Compile and deploy smart contract:
>sudo truffle migrate --reset

----------------------------------------------------------

Connect MetaMask to Ganache Import Ganache Wallet:

Set up Network:
1. Make sure Ganache is active
2. Click Network select the option and choose Custom RPC
3. You will be asked for the below details:
     Network Name: This is your Network and name it as anything relevant to your project.
     New RPC URL: This can be obtained from your Server tab of the Ganache Settings section. It has to be in the format http://<hostname>:<port>. Since we are running on local, it would mostly be http://127.0.0.1:7545

Now, pick up one of your accounts from Ganache and add import it to MetaMask wallet, so that you can use the available ETH using MetaMask wallet. Follow the below steps:
1. Open MetaMask wallet and Click on the Account Circle
2. Below the account list, choose Import Account
3. Pick one address from Ganache Desktop UI or Ganache-CLI and copy the Private key from the Key symbol at the right end.
4. Paste your private key string to MetaMask

----------------------------------------------------------

Now that Dependencies have been installed, Smart Contracts have been deployed, MetaMask has been connected to Network, & Ganache Wallet is set up, we can run UME on the browser:

>npm run start

any questions: please send to topshaman@protonmail.com
