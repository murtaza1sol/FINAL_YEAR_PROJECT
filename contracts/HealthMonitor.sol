// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthMonitor {
    struct Analysis {
        string result;
        uint timestamp;
    }

    mapping(address => Analysis[]) private patientHistory;

    event RecordAdded(address indexed user, string result, uint timestamp);

    function addRecord(string memory _result) public {
        Analysis memory record = Analysis(_result, block.timestamp);
        patientHistory[msg.sender].push(record);
        emit RecordAdded(msg.sender, _result, block.timestamp);
    }

    function getRecords(address user) public view returns (Analysis[] memory) {
        return patientHistory[user];
    }
}
