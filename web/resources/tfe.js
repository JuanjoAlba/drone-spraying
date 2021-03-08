// Spraying Contract ABI
const ABI_SDC = ;
// ERC20Token Contract ABI
const ABI_TKN = ;


//Contratos
var spraying_contract = "";
var erc20_contract = "";

// web3 object
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

// Account variables
var sprayingAccount, ownerAccount, companyAccount;

async function start() {

    // Gett all the accounts
    const accounts = await web3.eth.getAccounts();

    // Account for spraying contract
    sprayingAccount = accounts[0];

    // Accounts 1, 2, 3 and 4 are for contracts user.sol, ERC20.sol, Dron.sol and Plot.sol
    // Add user company and owner
    companyAccount = accounts[5];
    ownerAccount = accounts[6];
    
    // Spraying instance
    sprayingInstance = new web3.eth.Contract(ABI_SDC, spraying_contract);
    tokenInstance = new web3.eth.Contract(ABI_TKN, erc20_contract);
    
    // On start create owner and company
    addUser(companyAccount, 'company-1', 0);
    addUser(ownerAccount, 'owner-1', 1);

    // On start add tokens to owner

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

