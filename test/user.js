const Drone = artifacts.require("../Contracts/Drone.sol");
const Plot = artifacts.require("../Contracts/Plot.sol");
const ERC20 = artifacts.require("../Contracts/ERC20Token.sol");
const SContract = artifacts.require("../Contracts/SprayingContract.sol");
const User = artifacts.require("../Contracts/User.sol");

const truffleAssert = require("truffle-assertions");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("User", function (accounts) {

  const role_C = 1;
  const role_O = 2;

  const droneAcc = accounts[0];
  const plotAcc = accounts[1];
  const erc20Acc = accounts[2];
  const scontractAcc = accounts[3];
  const companyAcc = accounts[4];
  const ownerAcc = accounts[5];

  let droneDep;
  let plotDep;
  let erc20Dep;
  let scontractDep;
  let companyDep; 
  let ownerDep; 
  
  before("deploy contracts", async function () {
    const accounts = await web3.eth.getAccounts();
	
    this.droneDep = await Drone.deployed({from: droneAcc});
    this.plotDep = await Plot.deployed({from: plotAcc});
    this.erc20Dep = await ERC20.deployed({from: erc20Acc});
    this.scontractDep = await SContract.deployed(this.plotDep.address, this.droneDep.address, this.erc20Dep.address, {from: scontractAcc});
    // Como deployed genera un singleton, uso new para poder tener dos usuarios.
    this.companyDep = await User.new('Company', role_C, this.scontractDep.address, this.droneDep.address, this.plotDep.address, this.erc20Dep.address, {from: companyAcc}); 
    this.ownerDep = await User.new('Owner', role_O, this.scontractDep.address, this.droneDep.address, this.plotDep.address, this.erc20Dep.address, {from: ownerAcc}); 
    
    console.log('Contratos desplegados');
  });


  // Comprobar que los test despliegan bien
	it("should assert true", async function () {
		return assert.isTrue(true);
	});

  it("TestAddDrone: Se comprueba que se añade un dron a la compañía", async function () {

    await this.companyDep.addDrone('Drone-1', 10, 40, [1,2,3], 25, {from:companyAcc});
    let ownerOf = await this.droneDep.ownerOf.call(1);
    assert.equal(this.companyDep.address, ownerOf);
  });

  it("TestAddDroneFail: Se comprueba que se no se añade un dron a un propietario", async function () {

    await this.ownerDep.addDrone('Drone-1', 10, 40, [1,2,3], 25, {from:ownerAcc})
    .then((response)=>{
      console.log(response);
    }, (error)=>{
      assert.isNotEmpty(error.message.indexOf('revert').toString());
    });
  });

  it("TestAddPlot: Se comprueba que se añade una parcela al propietario", async function () {
     
    await this.ownerDep.addPlot('Plot-1', 10, 40, 1, {from:ownerAcc});
    let ownerOf = await this.plotDep.ownerOf.call(1);
    assert.equal(this.ownerDep.address, ownerOf);
  });

  it("TestAddPlotFail: Se comprueba que se no se añade una pardela a la compañía", async function () {

    await this.companyDep.addPlot('Plot-1', 10, 40, 1, {from:companyAcc})
    .then((response)=>{
      console.log(response);
    }, (error)=>{
      assert.isNotEmpty(error.message.indexOf('revert').toString());
    });
  });

  it("TestHireDrone: Se registra una parcela para fumigar", async function () {
     
    // Primero necesitamos registrar la parcela
    await this.ownerDep.addPlot('Plot-1', 10, 40, 1, {from:ownerAcc});
    // Ahora se contrata el trabajo
    let response = await this.ownerDep.toHireDrone(1, {from:ownerAcc});
    truffleAssert.eventEmitted(response, "jobRequested", (evento) =>{
      return evento.plotId == 1;
    })
  });

  it("TestApprove: Se comprueba que se aprueba una cantidad de tokens para que el contrato pueda pagar", async function () {
     
    // Primero necesitamos darle tokens al propietario
    await this.ownerDep.getCash (200, {from:ownerAcc});
    // Permitimos al contrato gestor utilizar esos tokens
    await this.ownerDep.approveToken(50);
    // Recuperamos del contrato de tokens los datos
    let allowance = await this.erc20Dep.allowance(this.ownerDep.address, this.scontractDep.address);
    assert.equal(allowance, 50);
  });

  
});
