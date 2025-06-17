// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedHealthSystem {
    struct Doctor {
        string name;
        string specialization;
        string hospitalLocation;
        address wallet;
    }

    struct Patient {
        string name;
        string residence;
        uint256 timestamp;
    }

    struct Analysis {
        string name;
        string residence;
        string result; // "Positive" or "Negative"
        uint256 timestamp;
    }

    mapping(address => Doctor) public doctors;
    address[] public doctorList;

    mapping(address => Patient[]) public doctorToPatients;
    mapping(address => Analysis[]) public userHistory;

    event DoctorRegistered(address indexed wallet, string name, string specialization, string location);
    event PatientAdded(address indexed doctor, string name, string residence, uint256 timestamp);
    event PatientDeleted(address indexed doctor, uint256 index);
    event AnalysisAdded(address indexed user, string name, string residence, string result, uint256 timestamp);

    function registerDoctor(string memory _name, string memory _specialization, string memory _hospitalLocation) external {
        require(bytes(doctors[msg.sender].name).length == 0, "Doctor already registered");

        Doctor memory newDoctor = Doctor({
            name: _name,
            specialization: _specialization,
            hospitalLocation: _hospitalLocation,
            wallet: msg.sender
        });

        doctors[msg.sender] = newDoctor;
        doctorList.push(msg.sender);

        emit DoctorRegistered(msg.sender, _name, _specialization, _hospitalLocation);
    }

    function getAllDoctors() public view returns (Doctor[] memory) {
        Doctor[] memory allDoctors = new Doctor[](doctorList.length);
        for (uint i = 0; i < doctorList.length; i++) {
            allDoctors[i] = doctors[doctorList[i]];
        }
        return allDoctors;
    }

    function addPatient(string memory _name, string memory _residence) external {
        address matchingDoctor = address(0);

        for (uint i = 0; i < doctorList.length; i++) {
            if (keccak256(abi.encodePacked(doctors[doctorList[i]].hospitalLocation)) == keccak256(abi.encodePacked(_residence))) {
                matchingDoctor = doctorList[i];
                break;
            }
        }

        require(matchingDoctor != address(0), "No doctor found in this location");

        doctorToPatients[matchingDoctor].push(Patient({
            name: _name,
            residence: _residence,
            timestamp: block.timestamp
        }));

        emit PatientAdded(matchingDoctor, _name, _residence, block.timestamp);
    }

    function getPatientsByDoctor(address _doctor) public view returns (Patient[] memory) {
        return doctorToPatients[_doctor];
    }

    function deletePatient(uint256 index) external {
        require(index < doctorToPatients[msg.sender].length, "Invalid index");

        uint256 lastIndex = doctorToPatients[msg.sender].length - 1;
        if (index != lastIndex) {
            doctorToPatients[msg.sender][index] = doctorToPatients[msg.sender][lastIndex];
        }
        doctorToPatients[msg.sender].pop();

        emit PatientDeleted(msg.sender, index);
    }

    function addAnalysis(string memory _name, string memory _residence, string memory _result) public {
        userHistory[msg.sender].push(Analysis({
            name: _name,
            residence: _residence,
            result: _result,
            timestamp: block.timestamp
        }));

        emit AnalysisAdded(msg.sender, _name, _residence, _result, block.timestamp);
    }

    function getHistory(address _user) public view returns (Analysis[] memory) {
        return userHistory[_user];
    }

    function isDoctor(address _addr) public view returns (bool) {
        return bytes(doctors[_addr].name).length > 0;
    }
}
