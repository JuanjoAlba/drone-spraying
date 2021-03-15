// User Contract ABI
const ABI_USER = [{"constant":true,"inputs":[{"name":"_droneId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_minAltitude","type":"uint256"},{"name":"_maxAltitude","type":"uint256"},{"name":"_pesticide","type":"uint256"}],"name":"searchDroneBy","outputs":[{"name":"droneId","type":"uint256"},{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_minAltitude","type":"uint256"},{"name":"_maxAltitude","type":"uint256"},{"name":"_pesticideList","type":"uint256[]"},{"name":"_cost","type":"uint256"}],"name":"addDrone","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_droneId","type":"uint256"}],"name":"getDrone","outputs":[{"name":"name","type":"string"},{"name":"minAltitude","type":"uint256"},{"name":"maxAltitude","type":"uint256"},{"name":"pesticideList","type":"uint256[]"},{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
// Token Contract ABI
const ABI_TOK = [{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"amount","type":"uint256"}],"name":"_mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

//Contratos
var company_contract = "0x14ca1aBdb4Ce8824283c5D8CFfC52a3a1a40cae4";
var owner_contract = "0x1B12d58126ff1fA2A42520754A04f3A0eA438Fc7";
var token_contract = "0x88768D25079646B4634f87f724436A42d694942C";
var spray_contract = "0x7b53394eFAD679c8C96b644d43b165211ff5B716";

// web3 object
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

// Account variables
var companyAccount, ownerAccount, tokenAccount;
// Instances
var companyInstance, ownerInstance, tokenInstance;

async function start() {

    // Gett all the accounts
    const accounts = await web3.eth.getAccounts();

    // We are going to manage eht accounts in that way
    // 0 - Contract Drone
    // 1 - Contract Plot
    // 2 - Contract EREC20
    // 3 - Contract SprayingApp
    // 4 - Contract User for Company
    // 5 - Contract User for Owner

    // Anyway, we are only calling the application from company, owner and ERC20 instances
    tokenAccount = accounts[2];
    companyAccount = accounts[4];
    ownerAccount = accounts[5];
    
    // Spraying instance
    tokenInstance = new web3.eth.Contract(ABI_TOK, token_contract);
    companyInstance = new web3.eth.Contract(ABI_USER, company_contract);
    ownerInstance = new web3.eth.Contract(ABI_USER, owner_contract);
    
    // On start add tokens to owner
    
}

/*
 * Method to give tokens to the owner 
 *
 * Receives user account and role (0 - company, 1 - owner)
 */
function getTokensToOwner(address, name, role) {

    ownerInstance.methods.getCash(250).send({from: ownerAccount, gas: 1000000}, function(error, result){
        if(!error){
            document.getElementById('indexConsole').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
            console.log(result);
        }
        else {
            document.getElementById('indexConsole').innerHTML = "Se ha producido un error";
            console.error(error);
        }
    });        
}

/*
 * Method to create users 
 *
 * Receives user account and role (0 - company, 1 - owner)
 */
function addDron() {

    var name = document.getElementById('name').value;
    var minAltitude = document.getElementById('minAltitude').value;
    var maxAltitude = document.getElementById('maxAltitude').value;
    var cost = document.getElementById('cost').value;
    var pesticides = []
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

    for (var i = 0; i < checkboxes.length; i++) {
        pesticides.push(checkboxes[i].value);
    }

    companyInstance.methods.addDron(name, minAltitude, maxAltitude, pesticides, cost).send({from: companyAccount, gas: 1000000}, function(error, result){
        if(!error){
            document.getElementById('companyConsole').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
            console.log(result);
        }
        else {
            document.getElementById('companyConsole').innerHTML = "Se ha producido un error";
            console.error(error);
        }
    });        
}

/*
 * Method to create users 
 *
 * Receives user account and role (0 - company, 1 - owner)
 */
function addPlot(name, role) {

    ownerInstance.methods.addPlot(name, minAltitude, maxAltitude, pesticide).send({from: ownerAccount, gas: 1000000}, function(error, result){
        if(!error){
            document.getElementById('ownerConsole').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
            console.log(result);
        }
        else {
            document.getElementById('ownerConsole').innerHTML = "Se ha producido un error";
            console.error(error);
        }
    });        
}

function registerPlotToSpray(idPlot, tokensAmount) {

    ownerInstance.methods.toHireDrone(idPlot).send({from: ownerAccount, gas: 1000000}, function(error, result){
        if(!error){
            console.log(result);
        } else {
            document.getElementById('ownerConsole').innerHTML = "Se ha producido un error";
            console.error(error);
        }
    }).on('receipt', function(receipt) {
        executionNonce = receipt.events.ExecutionRequested.returnValues.executionId;
        // Aprbamos el pago
        tokenInstance.methods.approve(spray_contract, tokensAmount).send({from: ownerAccount, gas: 1000000}, function(error, result){
            if(!error){
                document.getElementById('ownerConsole').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
                console.log(result);
            }
            else {
                document.getElementById('ownerConsole').innerHTML = "Se ha producido un error";
                console.error(error);
            }
        });
    });
}

/*
 * Method to get user amount of tokens 
 *
 * Receives user account and role (0 - company, 1 - owner)
 */
function getPlotsToSpray() {

    ownerInstance.methods.getjobsToDo().call(function(error, result){
        if(!error){
            document.getElementById('companyConsole').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
            console.log(result);
        }
        else {
            document.getElementById('companyConsole').innerHTML = "Se ha producido un error";
            console.error(error);
        }
    });
}

function sprayPlot() {

    var idPlot = '1';

    companyInstance.methods.addPlot(idPlot).send({from: companyAccount, gas: 1000000}, function(error, result){
        if(!error){
            document.getElementById('companyConsole').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
            console.log(result);
        }
        else {
            document.getElementById('companyConsole').innerHTML = "Se ha producido un error";
            console.error(error);
        }
    });        
}

/*
 * Method to create users 
 *
 * Receives user account and role (0 - company, 1 - owner)
 */
function addUser(address, name, role) {

    sprayingInstance.methods.addUser(address, name, role).send({from: cuentaUni, gas: 1000000}, function(error, result){
        if(!error){
            console.log(result);
            document.getElementById('console').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
        }
        else {
            document.getElementById('console').innerHTML = "Se ha producido un error";
            console.error(error);
        }
    });        
}

/*
 * Method to get user amount of tokens 
 *
 * Receives user account and role (0 - company, 1 - owner)
 */
function getTokens(userType) {

    var address;
    if (userType == 'C') {
        address = company_contract;
    } else {
        address = owner_contract;
    }

    tokenInstance.methods.balanceOf(address).call(function(error, result){
        if(!error){
            console.log(result);
            document.getElementById('console').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
        }
        else {
            document.getElementById('console').innerHTML = "Se ha producido un error";
            console.error(error);
        }
    });
}



/*
 * Method to get user amount of tokens 
 *
 * Receives user account and role (0 - company, 1 - owner)
 */
function getDron(dronId) {

    sprayingInstance.methods.getDron(dronId).call(function(error, result){
        if(!error){
            console.log(result);
            document.getElementById('console').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
        }
        else {
            document.getElementById('console').innerHTML = "Se ha producido un error";
            console.error(error);
        }
    });
}



