// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AnalysisHistory {
    struct Analysis {
        string name;
        string residence;
        string result; // "Positive" or "Negative"
        uint256 timestamp;
    }

    mapping(address => Analysis[]) public userHistory;

    function addAnalysis(string memory name, string memory residence, string memory result) public {
        userHistory[msg.sender].push(
            Analysis(name, residence, result, block.timestamp)
        );
    }

    function getHistory(address user) public view returns (Analysis[] memory) {
        return userHistory[user];
    }
}
