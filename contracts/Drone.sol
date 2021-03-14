pragma solidity ^0.4.25;

import "./Interfaces/IDrone.sol";

/*
 * @title Implementation for drones
 *
 * @author Juan José Alba
 */
contract Drone is IDrone{
        
    // Drone structure
    struct structDrone {
        string name; // drone's name
        uint256 minAltitude; // minimun altitude
        uint256 maxAltitude; // maximun altitude
        uint256[] pesticideList; // Pesticide (from pesticideList)
        uint256 cost;
    }
    
    // Counter for drone Id's
    uint8 internal droneCounter = 1;
    // Mappring for drones, Id to struct
    mapping (uint256 => structDrone) internal droneList;
    // Mapping drone Id to company address
    mapping (uint256 => address) internal droneToCompany;
    // Mapping drones by owner
    mapping (address => uint256[]) internal dronesByCompany;
    
    function addDrone (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256[] _pesticideList, uint256 _cost) external payable {
        
        // Add drone to owner
        droneList[droneCounter].name = _name;
        droneList[droneCounter].minAltitude = _minAltitude;
        droneList[droneCounter].maxAltitude = _maxAltitude;
        droneList[droneCounter].pesticideList = _pesticideList;
        droneList[droneCounter].cost = _cost;
        
        // Add new drone to owner drone List
        droneToCompany[droneCounter] = msg.sender;
        
        // Add drone's id to company's drone List
        dronesByCompany[msg.sender].push(droneCounter);
        
        // Increment drone´s Id
        droneCounter += 1;
    }
    
    function ownerOf(uint256 _droneId) public view returns (address) {
        
        return droneToCompany[_droneId];
    }

    function getDrone(uint256 _droneId) public constant returns (
            string name,
            uint256 minAltitude,
            uint256 maxAltitude,
            uint256[] pesticideList,
            uint256 cost)
        {
        
        return (
            droneList[_droneId].name,
            droneList[_droneId].minAltitude,
            droneList[_droneId].maxAltitude,
            droneList[_droneId].pesticideList,
            droneList[_droneId].cost
        );
    }
    
    function getDronesByCompany(address _address) public view returns (uint256[]) {
        
        return dronesByCompany[_address];
    }
    
    function searchDroneBy(address _address, uint256 _minAltitude, uint256 _maxAltitude, uint256 _pesticide) public view returns (
            uint256 _droneId,
            uint256 _cost)
        {
        
        bool _find = false;
        uint256 listLength = dronesByCompany[_address].length;
        if (listLength >= 0 ) {
            
            for(uint8 i=0; i <= listLength && !_find; i++){
            
                _droneId = dronesByCompany[_address][i];
                if (checkHigh(_droneId, _minAltitude, _maxAltitude) && checkPesticide(_droneId, _pesticide)) {
                    _find = true;
                    _cost = droneList[_droneId].cost;
                } else {
                    _droneId = 0;
                }
            }
        }
        
        return (_droneId, _cost);
    }
    
    function checkHigh (uint256 _droneId, uint256 _minAltitude, uint256 _maxAltitude) public view returns (bool droneValid) {
         
        droneValid = droneList[_droneId].minAltitude >= _minAltitude && droneList[_droneId].maxAltitude <= _maxAltitude;
        return droneValid;
    }
    
    function checkPesticide (uint256 _droneId, uint256 _pesticide) public view returns (bool droneValid) {
        
        droneValid = false;
        
        for(uint8 i=0; i < droneList[_droneId].pesticideList.length && !droneValid; i++){
            
            if (droneList[_droneId].pesticideList[i] == _pesticide) {
                droneValid = true;
                break;
            }
        }
        
        return droneValid;
    }
}