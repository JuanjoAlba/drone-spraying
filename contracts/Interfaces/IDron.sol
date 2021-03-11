pragma solidity ^0.4.25;

/*
 * @title Interface for Drons
 *
 * @author Juan José Alba
 */
interface IDron {
    

    // Add dron to a map associated with a company
    function addDron (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256[] _pesticideList, uint256 _cost) external payable returns (uint256);
    
    // Returns the company that owns of the dron
    function ownerOf(uint256 _dronId) external view returns (address);

    // Get the values of a dron
    function getDron(uint256 _dronId) external view returns (uint256 dronId, string name, uint256 minAltitude, uint256 maxAltitude, uint256[] pesticideList, uint256 cost);
    
    // Get the list of drons of a company
    function getDronsByOwner() external view returns (uint256[]);
    
    // Search dron by altitud and pesticide
    function searchDronBy(uint256 _minAltitude, uint256 _maxAltitude, uint256 _pesticide) external view returns (
            uint256 dronId,
            string name,
            uint256 minAltitude,
            uint256 maxAltitude,
            uint256[] pesticideList,
            uint256 cost);
    
}