pragma solidity ^0.4.25;

import "./Interfaces/IDron.sol";

/*
 * @title Implementation for drons
 *
 * @author Juan José Alba
 */
contract Dron is IDron{
    
    // Dron structure
    struct structDron {
        uint256 dronId; // Dron Id
        string name; // dron's name
        uint256 minAltitude; // minimun altitude
        uint256 maxAltitude; // maximun altitude
        uint256[] pesticideList; // Pesticide (from pesticideList)
        uint256 cost;
    }
    
    // Counter for dron Id's
    uint8 internal dronCounter;
    // Mappring for drons, Id to struct
    mapping (uint256 => structDron) internal dronList;
    // Mapping dron Id to company address
    mapping (uint256 => address) internal dronToCompany;
    // Mapping drons by owner
    mapping (address => uint256[]) internal dronsByCompany;
    // Mapping from dron Id to approved address
    mapping (uint256 => address) private dronApprovals;
    
    function addDron (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256[] _pesticideList, uint256 _cost) external payable returns (uint256) {
        
        // Add new dron to owner dron List
        dronToCompany[dronCounter] = msg.sender;
        
        // Add dron to owner
        dronList[dronCounter].dronId = dronCounter;
        dronList[dronCounter].name = _name;
        dronList[dronCounter].minAltitude = _minAltitude;
        dronList[dronCounter].maxAltitude = _maxAltitude;
        dronList[dronCounter].pesticideList = _pesticideList;
        dronList[dronCounter].cost = _cost;
        
        // Add drons id to company's dron List
        dronsByCompany[msg.sender].push(dronCounter);
        
        // Increment dron´s Id
        dronCounter += 1;
        
        // Falta return
        return dronList[dronCounter].dronId;
    }
    
    function ownerOf(uint256 _dronId) public view returns (address) {
        
        // address owner = dronToCompany[_dronId];
        // require(owner != address(0), "Dron: owner query for nonexistent token");
        return dronToCompany[_dronId];
    }

    function getDron(uint256 _dronId) public constant returns (
            uint256 dronId,
            string name,
            uint256 minAltitude,
            uint256 maxAltitude,
            uint256[] pesticideList,
            uint256 cost)
        {
        
        return (
            dronList[_dronId].dronId,
            dronList[_dronId].name,
            dronList[_dronId].minAltitude,
            dronList[_dronId].maxAltitude,
            dronList[_dronId].pesticideList,
            dronList[_dronId].cost
        );
    }
    
    function getDronsByOwner() external view returns (uint256[]) {
        
        return dronsByCompany[msg.sender];
    }
    
    function searchDronBy(uint256 _minAltitude, uint256 _maxAltitude, uint256 _pesticide) public constant returns (
            uint256 dronId,
            string name,
            uint256 minAltitude,
            uint256 maxAltitude,
            uint256[] pesticideList,
            uint256 cost)
        {
        
        bool _find = false;
        for(uint8 i=0; i<= dronCounter && !_find; i++){
            
            if (checkHigh(i, _minAltitude, _maxAltitude) && checkPesticide(i, _pesticide)) {
                dronId = i;
                _find = true;
            }
        }
        
        
        return (
            dronList[dronId].dronId,
            dronList[dronId].name,
            dronList[dronId].minAltitude,
            dronList[dronId].maxAltitude,
            dronList[dronId].pesticideList,
            dronList[dronId].cost
        );
    }
    
    function checkHigh (uint256 _dronId, uint256 _minAltitude, uint256 _maxAltitude) internal view returns (bool dronValid) {
        
        dronValid = dronList[_dronId].minAltitude <= _minAltitude && dronList[_dronId].maxAltitude <= _maxAltitude;
        return dronValid;
    }
    
    function checkPesticide (uint256 _dronId, uint256 _pesticide) internal view returns (bool dronValid) {
        
        dronValid = false;
        
        for(uint8 i=0; i <= dronList[_dronId].pesticideList.length && !dronValid; i++){
            
            if (dronList[_dronId].pesticideList[i] == _pesticide) {
                dronValid = true;
                break;
            }
        }
        
        return dronValid;
    }
}