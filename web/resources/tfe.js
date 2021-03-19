// User Contract ABI
const ABI_USER = [{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_minAltitude","type":"uint256"},{"name":"_maxAltitude","type":"uint256"},{"name":"_pesticideList","type":"uint256[]"},{"name":"_cost","type":"uint256"}],"name":"addDrone","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_minAltitude","type":"uint256"},{"name":"_maxAltitude","type":"uint256"},{"name":"_pesticide","type":"uint256"}],"name":"addPlot","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"approveToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"getCash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_plotId","type":"uint256"}],"name":"sprayPlot","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_plotId","type":"uint256"}],"name":"toHireDrone","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_role","type":"uint256"},{"name":"_sprayingContract","type":"address"},{"name":"_droneC","type":"address"},{"name":"_plotC","type":"address"},{"name":"_tokenC","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"plotId","type":"uint256"}],"name":"jobRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"plotId","type":"uint256"}],"name":"jobDone","type":"event"},{"constant":true,"inputs":[],"name":"getjobsDone","outputs":[{"name":"jobsDone","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getjobsToDo","outputs":[{"name":"jobsToDo","type":"uint256[5]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenBalance","outputs":[{"name":"_balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getUserData","outputs":[{"name":"name","type":"string"},{"name":"role","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
// Token Contract ABI
const ABI_TOK = [{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"amount","type":"uint256"}],"name":"_mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

//Contratos
var company_contract = "0x0298EF6423662BD699F70e4d3a3eEC872869E7B4";
var owner_contract = "0xb8C47c40D1C4f57fF819F779A62B91415c0a1549";
var token_contract = "0x9AA3f4237db955581209Ae2Cbc384b7fB519398E";

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
    // tokenInstance = new web3.eth.Contract(ABI_TOK, token_contract);
    companyInstance = new web3.eth.Contract(ABI_USER, company_contract);
    ownerInstance = new web3.eth.Contract(ABI_USER, owner_contract);
}

/*
 * Method to add drones. Only for role company
 *
 */
function addDrone() {

    document.getElementById('companyConsole').innerHTML = '';

    var name = document.getElementById('droneName').value;
    var minAltitude = document.getElementById('droneMinAltitude').value;
    var maxAltitude = document.getElementById('droneMaxAltitude').value;
    var cost = document.getElementById('droneCost').value;
    var pesticides = [];
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

    for (var i = 0; i < checkboxes.length; i++) {
        pesticides.push(checkboxes[i].value);
    }

    companyInstance.methods.addDrone(name, minAltitude, maxAltitude, pesticides, cost).send({from: companyAccount, gas: 1000000}, function(error, result){
        if(!error){

            document.getElementById('companyConsole').innerHTML = "El dron " + name + " se ha dado de alta correctamente";
        } else {

            document.getElementById('companyConsole').innerHTML = error.message;
        }
    });        
}

/*
 * Method to add plots. Only for role owner.
 *
 */
async function addPlot() {

    document.getElementById('ownerConsole').innerHTML = '';

    var name = document.getElementById('plotName').value;
    var minAltitude = document.getElementById('plotMinAltitude').value;
    var maxAltitude = document.getElementById('plotMaxAltitude').value;
    var pesticide = document.getElementById('plotPesticide').value;


    ownerInstance.methods.addPlot(name, minAltitude, maxAltitude, pesticide).send({from: ownerAccount, gas: 2000000}, function(error, result){
        if(!error){
            document.getElementById('ownerConsole').innerHTML = "La parcela " + name + " se ha dado de alta correctamente";
        } else {
            document.getElementById('ownerConsole').innerHTML = error.message;
        }
    }).on('receipt', function(receipt) {
        
        // Owner gets 100 token for each plot
        ownerInstance.methods.getCash(100).send({from: ownerAccount, gas: 1000000}, function(error, result){
            if(!error){
                document.getElementById('ownerConsole').innerHTML = document.getElementById('ownerConsole').innerHTML + "<br>" + "Se le han asignado 100 tokens por registrar la parcela";
            }
            else {
                document.getElementById('ownerConsole').innerHTML = "Se ha producido un error al concederle los tokens";
            }
        });      
    });      
}

/*
 * Method to get user amount of tokens 
 *
 * Receives user account and role (0 - company, 1 - owner)
 */
async function getTokens(userType) {
    
    if (userType == 'C') {

        companyInstance.methods.getTokenBalance().call(function(error, result){
            if(!error){
    
                document.getElementById('companyConsole').innerHTML = "Actualmente su saldo en tokens es de " + result + " tokens";
            } else {
    
                document.getElementById('companyConsole').innerHTML = "Se ha producido un error al recuperar los tokens del usuario";
            }
        });
    } else {

        document.getElementById('ownerConsole').innerHTML = '';

        ownerInstance.methods.getTokenBalance().call(function(error, result){
            if(!error){
    
                document.getElementById('ownerConsole').innerHTML = "Actualmente su saldo en tokens es de " + result + " tokens";
            } else {
    
                document.getElementById('ownerConsole').innerHTML = "Se ha producido un error al recuperar los tokens del usuario";
            }
        });
    }
}

/*
 * Method to regiter a plot to be sprayed
 *
 */
async function registerPlotToSpray() {

    document.getElementById('ownerConsole').innerHTML = '';

    var idPlot = document.getElementById('idPlot').value;
    var amount = document.getElementById('amount').value;

    ownerInstance.methods.toHireDrone(idPlot).send({from: ownerAccount, gas: 1000000}, function(error, result){
        if(!error){

            document.getElementById('ownerConsole').innerHTML = "Se ha contratado la fumigaci&oacute;n de la  parcela " + idPlot;
        }  else {
            document.getElementById('ownerConsole').innerHTML = error.message;
        }
    }).on('receipt', function(receipt) {
        
        ownerInstance.methods.approveToken(amount).send({from: ownerAccount, gas: 1000000}, function(error, result){
            if(!error){
                
                document.getElementById('ownerConsole').innerHTML = document.getElementById('ownerConsole').innerHTML + "<br>" + "Se ha realizado un dep&oacute;sito de " + amount;
            }
            else {
                document.getElementById('ownerConsole').innerHTML = error.message;
            }
        });
    });
}

/*
 * Gets plots to spray
 *
 */
function getPlotsToSpray() {

    var select = document.getElementById('jobsToDo');
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
        select.options[i] = null;
    }

    companyInstance.methods.getjobsToDo().call(function(error, result){
        if(!error){

            for(var i = 0; i < result.length; i++) {
                if (result[i] != 0){
                    var opt = document.createElement('option');
                    opt.innerHTML = 'Parcela - ' + result[i];
                    opt.value = result[i];
                    select.appendChild(opt);
                }
            }
        } else {

            document.getElementById('companyConsole').innerHTML = "Se ha producido un error al recuperar las parcelas para fumigar";
        }
    });
}

/*
 * Spray selected plot
 *
 */
async function sprayPlot() {

    var idPlot = document.getElementById('jobsToDo').value;

    companyInstance.methods.sprayPlot(idPlot).send({from: companyAccount, gas: 1000000}, function(error, result) {
        if(!error){

            document.getElementById('companyConsole').innerHTML = "Se ha fumigado la parcela " + idPlot;
        } else {

            document.getElementById('companyConsole').innerHTML = error.message;
        }
    });
}

/*
 * Gets jobs already done
 *
 */
function getjobsDone() {

    document.getElementById('ownerConsole').innerHTML = '';

    ownerInstance.methods.getjobsDone().call(function(error, result){
        if(!error){

            document.getElementById('ownerConsole').innerHTML = "Se ha terminado de fumigar las siguientes parcelas: " + result;
        } else {

            document.getElementById('ownerConsole').innerHTML = "Se ha producido un error al recuperar las parcelas fumigadas";
        }
    });
}






//////////////////////////////////////// PENDIENTES DE REVISIÓN PARA SU ELIMINACIÓN /////////////////////////////////////////////


/*
 * Method to give tokens to the owner 
 *
 */
function getTokensToOwner(address, name, role) {

    ownerInstance.methods.getCash(250).send({from: ownerAccount, gas: 1000000}, function(error, result){
        if(!error){
            document.getElementById('indexConsole').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
        }
        else {
            document.getElementById('indexConsole').innerHTML = "Se ha producido un error";
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

            document.getElementById('companyConsole').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
        }
        else {

            document.getElementById('companyConsole').innerHTML = "Se ha producido un error";
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

            document.getElementById('companyConsole').innerHTML = document.getElementById('console').innerHTML+"<br>"+result;
        }
        else {

            document.getElementById('companyConsole').innerHTML = "Se ha producido un error";
        }
    });
}



