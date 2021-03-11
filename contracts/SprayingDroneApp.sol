pragma solidity ^0.4.25;

import "./Interfaces/IERC20.sol";
import "./Interfaces/IUser.sol";
import "./Interfaces/IPlot.sol";
import "./Interfaces/IDron.sol";

/*
 * @title Implementation for users
 *
 * @dev This contract manages the aplication, adding drons to companies, plots to owners,
 *      managing request for spraying and working as a proxy for payments.
 *
 * @author Juan José Alba
 */
contract SprayingDroneApp {
    
    // Contracts
    IUser userContract;
    IPlot plotContract;
    IDron dronContract;
    IERC20 tokenContract;
    
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
    event jobRequested(address indexed from, uint256 plotId, uint256 amount);
    event fumigationFinished(uint256 plotId, uint256 dronId, uint256 value);
    
    // Empty constructor
    constructor (address _userC, address _plotC, address _dronC, address _tokenC) public payable {
        
        userContract = IUser(_userC);
        plotContract = IPlot(_plotC);
        dronContract = IDron(_dronC);
        tokenContract = IERC20(_tokenC);
        
    }
    
    
    function addUser (address _address, string _name, uint256 _role) public payable {
        
        userContract.addUser(_address, _name, _role);
    }
    
    function addDron (address _address, string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256[] _pesticideList, uint256 _cost) public payable returns (uint256) {
        
        // Check that address is a company
        string memory _company;
        uint256 _role;
        (_company, _role) = userContract.getUserData(_address);
        require( _address != address(0) && _role == 0, "Address does not belongs to a company");
        
        uint256 _dronId = dronContract.addDron(_name, _minAltitude, _maxAltitude, _pesticideList, _cost);
        
        return _dronId;
    }
    
    function addPlot (address _address, string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256 _pesticide) public payable returns (uint256) {
        
        // Check that address is a company
        string memory _company;
        uint256 _role;
        (_company, _role) = userContract.getUserData(_address);
        require( _address != address(0) && _role == 1, "Address does not belongs to an owner");
        
        uint256 _plotId = plotContract.addPlot(_name, _minAltitude, _maxAltitude, _pesticide);
        
        return _plotId;
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
        emit jobRequested(msg.sender, _plotId, _amount);
        
    }
    
    /*
     * Spray plot with dron
     *
     * This operation is called by the company
     */
    function sprayPlot (uint256 _plotToSpray) public {
        
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