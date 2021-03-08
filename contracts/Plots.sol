pragma solidity ^0.4.25;

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard
 * 
 */
contract Plot {
    
    // Plot structure
    struct PlotStruct {
        uint256 plotId; // Plot Id 
        string name; // plot's name
        uint256 minAltitude; // minimun altitude
        uint256 maxAltitude; // maximun altitude
        uint256 pesticide; // Pesticide (from pesticideList)
    }

    // Counter for plot Id's
    uint256 internal plotCounter;
    // Mapping plotId to Plot
    mapping (uint256 => PlotStruct) internal plotList;
    // Mapping plot to owner
    mapping (uint256 => address) internal plotToOwner;
    // Mapping plots by owner
    mapping (address => uint256[]) internal plotsByOwner;
    
    function addPlot (string _name, uint256 _minAltitude, uint256 _maxAltitude, uint256 _pesticide) external {
        
        // Check that address is an owner
        // require( addres != null && role == 1, "Address does not belongs to an owner");
        
        // Add plot to owner
        plotList[plotCounter].plotId = plotCounter;
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
    
    function getPlot(uint256 _plotId) external constant returns (
            uint256 plotId,
            string name,
            uint256 minAltitude,
            uint256 maxAltitude,
            uint256 pesticide)
        {
        
        return (
            plotList[_plotId].plotId,
            plotList[_plotId].name,
            plotList[_plotId].minAltitude,
            plotList[_plotId].maxAltitude,
            plotList[_plotId].pesticide
        );
    }
    
    function getPlotsByOwner() external view returns (uint256[]) {
        
        return plotsByOwner[msg.sender];
    }

    function ownerOf(uint256 _poltId) external view returns (address) {
        
        return plotToOwner[_poltId];
    }
    
    

}