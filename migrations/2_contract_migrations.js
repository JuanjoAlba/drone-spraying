const Drone = artifacts.require("../Contracts/Drone.sol");
const Plot = artifacts.require("../Contracts/Plot.sol");
const ERC20 = artifacts.require("../Contracts/ERC20Token.sol");
const SContract = artifacts.require("../Contracts/SprayingContract.sol");
const User = artifacts.require("../Contracts/User.sol");


module.exports = async function (deployer) {
	
	/*
    accounts[0] Cuenta de los drones
    accounts[1] Cuenta de las parcelas
    accounts[2] cuenta del token
    accounts[3] cuenta del contrato gestor
    accounts[4] cuenta de la compañía
    accounts[5] cuenta del propietario
	*/
	
	// get accounts
	const accounts = await web3.eth.getAccounts();
	
	const droneAcc = accounts[0];
	const plotAcc = accounts[1];
	const erc20Acc = accounts[2];
	const scontractAcc = accounts[3];
	const companyAcc = accounts[4];
	const ownerAcc = accounts[5];
	
	
	let droneDep = await deployer.deploy(Drone, {from: droneAcc});
	let plotDep = await deployer.deploy(Plot, {from: plotAcc});
	let erc20Dep = await deployer.deploy(ERC20, {from: erc20Acc});
	let scontractDep = await deployer.deploy(SContract, plotDep.address, droneDep.address, erc20Dep.address, {from: scontractAcc});
	let companyDep = await deployer.deploy(User, 'Company', 1, scontractDep.address, droneDep.address, plotDep.address, erc20Dep.address, {from: companyAcc}); 
	let ownerDep = await deployer.deploy(User, 'Owner', 2, scontractDep.address, droneDep.address, plotDep.address, erc20Dep.address, {from: ownerAcc}); 
};