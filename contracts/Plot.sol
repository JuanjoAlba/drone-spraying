pragma solidity ^0.4.25;

import "./Interfaces/IPlot.sol";

/*
 * @title Implementation for plots
 *
 * @author Juan José Alba
 */
contract Plot is IPlot {
    
    // Plot structure
    struct PlotStruct {
        string name; // plot's name
        uint256 minAltitude; // minimun altitude
        uint256 maxAltitude; // maximun altitude
        uint256 pesticide; // Pesticide (from pesticideList)
    }

    // Counter for plot Id's
    uint256 internal plotCounter = 1;
    // Mapping plotId to Plot
    mapping (uint256 => PlotStruct) internal plotList;
    // Mapping plot to owner
    mapping (uint256 => address) internal plotToOwner;
    // Mapping plots by owner
    mapping (address => uint256[]) internal plotsByOwner;
    
    function addPlot (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256 _pesticide) external payable {
        
        // Add plot to owner
        plotList[plotCounter].name = _name;
        plotList[plotCounter].minAltitude = _minAltitude;
        plotList[plotCounter].maxAltitude = _maxAltitude;
        plotList[plotCounter].pesticide = _pesticide;
        
        // add plot to owner
        plotToOwner[plotCounter] = msg.sender;
        
        // Add new plot to owner plot List
        plotsByOwner[msg.sender].push(plotCounter);
        
        // Increment plot´s Id
        plotCounter += 1;
    }
    
    function getPlot(uint256 _plotId) public constant returns (
            uint256 minAltitude,
            uint256 maxAltitude,
            uint256 pesticide)
        {
        
        return (
            plotList[_plotId].minAltitude,
            plotList[_plotId].maxAltitude,
            plotList[_plotId].pesticide
        );
    }
    
    function getPlotsByOwner() public view returns (uint256[]) {
        
        return plotsByOwner[msg.sender];
    }

    function ownerOf(uint256 _poltId) public view returns (address) {
        
        return plotToOwner[_poltId];
    }
    
    

}