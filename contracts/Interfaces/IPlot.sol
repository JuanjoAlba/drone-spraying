pragma solidity ^0.4.25;

/*
 * @title Interfaces for plots
 *
 * @author Juan José Alba
 */
interface IPlot {
    
    // Add plot to a map
    function addPlot (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256 _pesticide) external payable;
    
    // Get values of a plot by id
    function getPlot(uint256 _plotId) external view returns (uint256 minAltitude, uint256 maxAltitude, uint256 pesticide);
    
    // Get a list of plots by owner
    function getPlotsByOwner() external view returns (uint256[]);

    // Returns the owner of a plot by id
    function ownerOf(uint256 _poltId) external view returns (address);
}