pragma solidity ^0.4.25;

/*
 * @title Interface for Drones
 *
 * @author Juan José Alba
 */
interface IDrone {
    

    // Add drone to a map associated with a company
    function addDrone (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256[] _pesticideList, uint256 _cost) external payable;
    
    // Returns the company that owns of the drone
    function ownerOf(uint256 _droneId) external view returns (address);

    // Get the values of a drone
    function getDrone(uint256 _droneId) external view returns (string name, uint256 minAltitude, uint256 maxAltitude, uint256[] pesticideList, uint256 cost);
    
    // Search drone by altitud and pesticide
    function searchDroneBy(address _address, uint256 _minAltitude, uint256 _maxAltitude, uint256 _pesticide) external view returns (
            uint256 droneId,
            uint256 cost);
    
}