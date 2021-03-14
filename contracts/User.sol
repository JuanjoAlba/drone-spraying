pragma solidity ^0.4.25;

// import "./Interfaces/IUser.sol";
import "./Interfaces/IPlot.sol";
import "./Interfaces/IDrone.sol";
import "./Interfaces/ISprayingContract.sol";
import "./Interfaces/IERC20.sol";


/*
 * @title Implementation for users (Can be companies or owners)
 *
 * @author Juan José Alba
 */
contract User {
    
    uint constant ROLE_COMPANY = 1;
    uint constant ROLE_OWNER = 2;
    
    // events
    event jobRequested(uint256 plotId);
    event jobDone(uint256 plotId);
    
    // Contracts
    ISprayingContract sprayingContract;
    IDrone droneContract;
    IPlot plotContract;
    IERC20 tokenContract;
    
    // Name
    string userName;
    uint256 userRole;
         
    // Add new User
    constructor (string _name, uint256 _role, address _sprayingContract, address _droneC, address _plotC, address _tokenC) public {
        
        require (_role == ROLE_COMPANY || _role == ROLE_OWNER, "Not a valid role");
        
        userName = _name;
        userRole = _role;
        
        sprayingContract = ISprayingContract(_sprayingContract);
        droneContract = IDrone(_droneC);
        plotContract = IPlot(_plotC);
        tokenContract = IERC20(_tokenC);
    }
    
    function getUserData () external view returns (string name, uint256 role) {
        
        return (
            userName,
            userRole
        );
    }
    
    function addDrone (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256[] _pesticideList, uint256 _cost) external payable {
        
        // Check that address is a company
        require( userRole == 1, "Address does not belongs to a company");
        
        droneContract.addDrone(_name, _minAltitude, _maxAltitude, _pesticideList, _cost);
    }
    
    function addPlot (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256 _pesticide) external payable {
        
        require( userRole == 2, "Address does not belongs to an owner");
        
        plotContract.addPlot(_name, _minAltitude, _maxAltitude, _pesticide);
    }
    
    function getjobsToDo () external view returns (uint256[5] memory jobsToDo) {
        
        require( userRole == 1, "Address does not belongs to a company");
        
        return sprayingContract.getjobsToDo();
    }
    
    function toHireDrone (uint256 _plotId) external payable {
        
        require( userRole == 2, "Address does not belongs to an owner");
        
        bool _plotRegistered = sprayingContract.registerPlot( _plotId);
        
        if (_plotRegistered) emit jobRequested( _plotId);
    }
    
    function sprayPlot (uint256 _plotId) external payable {
        
        require( userRole == 1, "Address does not belongs to a company");
        
        uint256 _droneID = sprayingContract.sprayPlot( _plotId);
        
        if (_droneID != 0) emit jobDone( _plotId);
    }
    
    function getCash (uint256 _amount) external {
        
        require( userRole == 2, "Address does not belongs to an owner");
        
        sprayingContract.giveTokens(_amount);
    }
    
    function approveToken (address _spender, uint256 _amount) external {
     
        tokenContract.approve(_spender, _amount);
    }
    
}