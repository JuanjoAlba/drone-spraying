// User Contract ABI
const ABI_USER = ;
// Token Contract ABI
const ABI_TOK = ;

//Contratos
var company_contract = "";
var owner_contract = "";
var token_contract = "";

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
function addDron(name, role) {

    companyInstance.methods.addDron(name, minAltitude, maxAltitude, pesticide).send({from: companyAccount, gas: 1000000}, function(error, result){
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
        tokenInstance.methods.approve(<aprayContract_address/>, tokensAmount).send({from: ownerAccount, gas: 1000000}, function(error, result){
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
function getPlotsToSpray(address) {

    ownerInstance.methods.getjobsToDo(address).call(function(error, result){
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

function sprayPlot(idPlot) {

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
function getTokens(address) {

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



