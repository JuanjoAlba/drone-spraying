pragma solidity ^0.4.25;

import "./Interfaces/IERC20.sol";
import "./Interfaces/IPlot.sol";
import "./Interfaces/IDrone.sol";
import "./Interfaces/ISprayingContract.sol";

/*
 * @title Implementation for the application contract
 *
 * @dev This contract manages the aplication, adding drones to companies, plots to owners,
 *      managing request for spraying and working as a proxy for payments.
 *
 * @author Juan José Alba
 */
contract SprayingContract is ISprayingContract{
    
    event log(string);
    
    // Contracts
    IDrone droneContract;
    IPlot plotContract;
    IERC20 tokenContract;
    
    struct record {
        uint256 plotId;
        uint256 droneId;
        uint256 cost;
        bool sprayed;
    }
    
    // Plots to be fumigated
    uint256 numberOfJobsRequested = 1;
    mapping (uint256 => record) internal requestList;
    // plot Id to job requested
    mapping (uint256 => uint256) internal plotToRequest;
    // Jobs done (owner => sprayed plots)
    mapping (address => uint256[]) internal done;

    // Constructor
    constructor (address _plotC, address _droneC, address _tokenC) public {
        
        plotContract = IPlot(_plotC);
        droneContract = IDrone(_droneC);
        tokenContract = IERC20(_tokenC);
        
    }
    
    function giveTokens (uint256 _amount) external {
        
        tokenContract._mint(msg.sender, _amount);
    }
    
    function registerPlot (uint256 _plotId) external payable returns (bool) {
        
        // Check that user is the owner of the plot
        require( plotContract.ownerOf(_plotId) == msg.sender, "Plot does not belong to that address");
        
        // Register plot to be fumigated
        requestList[numberOfJobsRequested].plotId = _plotId;
        requestList[numberOfJobsRequested].sprayed = false;
        plotToRequest[_plotId] = numberOfJobsRequested;
        
        numberOfJobsRequested += 1;
        
        return true;
    }

    /*
     * Spray plot with drone
     *
     * This operation is called by the company
     */
    function sprayPlot (uint256 _plotToSpray) external payable returns (uint256 _droneId) {
        
        // Plot values
        address _plotOwner = plotContract.ownerOf(_plotToSpray);
        uint256 _plotMinAltitude;
        uint256 _plotMaxAltitude;
        uint256 _plotPesticide;

        // Drone values
        uint256 _droneCost;
        
        // get plot's characteristics
        require( plotToRequest[_plotToSpray] != 0, "Plot is not waiting to be sprayed");
        (_plotMinAltitude, _plotMaxAltitude, _plotPesticide) = plotContract.getPlot(_plotToSpray);
        
        emit log("Parcela encontrada");

        // get the drone
        (_droneId, _droneCost) = droneContract.searchDroneBy(msg.sender, _plotMinAltitude, _plotMaxAltitude, _plotPesticide);
        
        emit log("Drone encontrado");
        
        // spary (Mapping)
        require ( _droneId != 0, "There is no drone that fits to plot characteristics");
        require ( tokenContract.allowance(_plotOwner, address(this)) >= _droneCost, "Not enough tokens");
        uint256 _requestID = plotToRequest[_plotToSpray];
        requestList[_requestID].droneId = _droneId;
        requestList[_requestID].sprayed = true;
        plotToRequest[_plotToSpray] = 0;
        done[_plotOwner].push(_plotToSpray);
        
        emit log("Parcela fumigada");
        
        // Pay job done to company
        tokenContract.transferFrom(_plotOwner, msg.sender, _droneCost);
        
        emit log("Transferencia realizada");

        return _droneId;        
    }
    
    function getjobsToDo () external view returns (uint256[5] memory jobsToDo) {
        
        for(uint8 i=1; i<= numberOfJobsRequested; i++){
            
            if (requestList[i].sprayed == false) jobsToDo[i-1] = requestList[i].plotId;
        }

        return jobsToDo;        
    }
    
    function getjobsDone () external view returns (uint256[] jobsDone) {
        
        return done[msg.sender];        
    }
}