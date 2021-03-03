pragma solidity ^0.4.25;

import "./IERC721.sol";

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard
 * 
 */
contract DronToken is IERC721 {
    
    
        // Plot structure
    struct Dron {
        uint256 dronId; // Plot Id
        string name; // plot's name
        uint256 minAltitude; // minimun altitude
        uint256 maxAltitude; // maximun altitude
        uint256[] pesticideList; // Pesticide (from pesticideList)
        uint256 cost;
    }
    
    // Counter for dron Id's
    uint256 internal dronCounter;
    // Mappring for drons, Id to struct
    mapping (uint256 => Dron) internal dronList;
    // Mapping dron Id to company address
    mapping (uint256 => address) internal dronToCompany;
    // Mapping drons by owner
    mapping (address => uint256[]) internal dronsByCompany;
    // Mapping from dron Id to approved address
    mapping (uint256 => address) private dronApprovals;
    
    function addDron (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256[] _pesticideList, uint256 _cost) public {
        
        // Add new plot to owner plot List
        dronToCompany[dronCounter] = msg.sender;
        
        // Add plot to owner
        dronList[dronCounter].dronId = dronCounter;
        dronList[dronCounter].name = _name;
        dronList[dronCounter].minAltitude = _minAltitude;
        dronList[dronCounter].maxAltitude = _maxAltitude;
        dronList[dronCounter].pesticideList = _pesticideList;
        dronList[dronCounter].cost = _cost;
        
        // Add drons id to company's dron List
        dronsByCompany[msg.sender].push(dronCounter);
        
        // Increment plot´s Id
        dronCounter += 1;
        
        // Falta return

    }
    
    function ownerOf(uint256 _dronId) public view returns (address) {
        
        // address owner = dronToCompany[_dronId];
        // require(owner != address(0), "Dron: owner query for nonexistent token");
        return dronToCompany[_dronId];
    }
    
    function approve(address _to, uint256 _dronId) public {
        
        address owner = ownerOf(_dronId);
        
        require(_to != owner, "Dron: approval to current owner");
        require(msg.sender == owner, "Dron: approve caller is not owner");

        dronApprovals[_dronId] = _to;
        emit Approval(owner, _to, _dronId);
    }
    
    function getApproved(uint256 tokenId) public view returns (address) {
        
        require(exists(tokenId), "Dron: approved query for nonexistent token");

        return dronApprovals[tokenId];
    }
    
    function exists(uint256 _dronId) internal view returns (bool) {
        
        return dronToCompany[_dronId] != address(0);
    }
    
    function spray (uint256 _dronId) public {
        
        require (dronApprovals[_dronId] == msg.sender, "Dron: Use not approved for dron");
        
        // set approval to no one as dros as get used
        dronApprovals[_dronId] = address(0);
        
        emit Sprayed(msg.sender, _dronId);
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
}