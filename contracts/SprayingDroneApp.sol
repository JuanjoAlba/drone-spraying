pragma solidity ^0.4.25;

import "./Tokens/ERC20Token.sol";
import "./User.sol";
import "./Plots.sol";
import "./Tokens/Dron.sol";

contract SprayingDroneApp {
    
    // Contracts
    User userContract;
    Plot plotContract;
    Dron dronContract;
    ERC20Token tokenContract;
    
    struct records {
        uint256 plotId;
        uint256 dronId;
        uint256 cost;
    }
    
    // Plots to be fumigated
    mapping (uint256 => bool) internal requestList;
    // Records of work works performed
    uint256 worksId;
    mapping (uint256 => records) internal workPerformed;
    
    // events
    event Request(address indexed from, uint256 plotId, uint256 amount);
    event fumigationFinished(uint256 plotId, uint256 dronId, uint256 value);
    
    // Empty constructor
    constructor () public {}
    
    
    function addUser (address _address, string _name, uint256 _role) public payable {
        
        userContract.addUser(_address, _name, _role);
    }
    
    /*
     * Hire dron to spray land
     *
     * This operation is called by the owner of plots
     */
    function toHireDron (uint256 _plotId, address _appAddress, uint256 _amount) public {
        
        // 1º Check that user is the owner of the plot
        require( plotContract.ownerOf(_plotId) == msg.sender, "Plot does not belongs to that address");
        
        // 2º Register plot to be fumigated
        requestList[_plotId] = false;
        
        // 3º Approve this to use ERC20 from owner
        tokenContract.approve(_appAddress, _amount);
        
        // 4º Emit event (plot to spray)
        emit Request(msg.sender, _plotId, _amount);
        
    }
    
    /*
     * Spray plot with dron
     *
     * This operation is called by the company
     */
    function spray (uint256 _plotToSpray) public {
        
        // Plot values
        uint256 _plotId;
        string memory _plotName;
        uint256 _plotMinAltitude;
        uint256 _plotMaxAltitude;
        uint256 _plotPesticide;
        
        // Dron values
        uint256 _dronId;
        string memory _dronName;
        uint256 _dronMinAltitude;
        uint256 _dronMaxAltitude;
        uint256[] memory _dronPesticideList;
        uint256 _dronCost;
        
        // 1º get of plot characteristics
        require( requestList[_plotToSpray] == true, "Plot is not waiting to be sprayed");
        (_plotId, _plotName, _plotMinAltitude, _plotMaxAltitude, _plotPesticide) = plotContract.getPlot(_plotToSpray);
        
        // 2º get the dron
        (_dronId, _dronName, _dronMinAltitude, _dronMaxAltitude, _dronPesticideList, _dronCost) = dronContract.searchDronBy(_plotMinAltitude, _plotMaxAltitude, _plotPesticide);
        
        // 3º spary (Mapping)
        requestList[_plotId] = true;
        workPerformed[worksId].plotId = _plotId;
        workPerformed[worksId].dronId = _dronId;
        workPerformed[worksId].cost = _dronCost;
        worksId += 1;
        
        // 4º Emit event (plot sprayed)
        emit fumigationFinished(_plotId, _dronId, _dronCost);
        
        // 5º Pay job done to company
        // Si quiero que este contrato haga de proxy, debe ser él el que efectue el pago. ¿Pero quién hace la llamada?
        // tokenContract.transferFrom();
        
    }
}