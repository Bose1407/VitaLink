// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrganDonation {
    struct Donor {
        string name;
        string organ;
        string bloodType;
        bool isAvailable;
        bool isCompleted; // Flag to track donation completion
    }

    struct Receiver {
        string name;
        string organNeeded;
        string bloodType;
        bool isMatched;
        bool isCompleted; // Flag to track if receiver got an organ
    }

    mapping(address => Donor) public donors;
    mapping(address => Receiver) public receivers;
    mapping(address => address) public matchedDonor; // Store matched donor for each receiver

    address[] public donorList;
    address[] public receiverList;

    event DonorRegistered(address indexed donor, string organ);
    event ReceiverRegistered(address indexed receiver, string organNeeded);
    event MatchFound(address indexed donor, address indexed receiver);
    event DonationCompleted(address indexed donor, string organ);
    event OrganReceived(address indexed receiver, string organ);

    function registerDonor(
        string memory _name,
        string memory _organ,
        string memory _bloodType
    ) public {
        require(
            donors[msg.sender].isAvailable == false || donors[msg.sender].isCompleted,
            "Cannot donate until previous donation is completed"
        );

        donors[msg.sender] = Donor(_name, _organ, _bloodType, true, false);

        bool exists = false;
        for (uint i = 0; i < donorList.length; i++) {
            if (donorList[i] == msg.sender) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            donorList.push(msg.sender);
        }

        emit DonorRegistered(msg.sender, _organ);
    }

    function registerReceiver(
        string memory _name,
        string memory _organNeeded,
        string memory _bloodType
    ) public {
        require(
            receivers[msg.sender].isMatched == false || receivers[msg.sender].isCompleted,
            "Cannot register again until organ is received"
        );

        receivers[msg.sender] = Receiver(_name, _organNeeded, _bloodType, false, false);

        bool exists = false;
        for (uint i = 0; i < receiverList.length; i++) {
            if (receiverList[i] == msg.sender) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            receiverList.push(msg.sender);
        }

        emit ReceiverRegistered(msg.sender, _organNeeded);
    }

    function checkOrganMatch() public returns (address) {
        require(bytes(receivers[msg.sender].name).length > 0, "Only registered receivers can check for matches");

        if (donorList.length == 0) {
            return address(0);
        }

        for (uint i = 0; i < donorList.length; i++) {
            address donorAddr = donorList[i];

            if (
                donors[donorAddr].isAvailable &&
                keccak256(abi.encodePacked(donors[donorAddr].organ)) == keccak256(abi.encodePacked(receivers[msg.sender].organNeeded)) &&
                keccak256(abi.encodePacked(donors[donorAddr].bloodType)) == keccak256(abi.encodePacked(receivers[msg.sender].bloodType))
            ) {
                donors[donorAddr].isAvailable = false;
                donors[donorAddr].isCompleted = true;
                receivers[msg.sender].isMatched = true;
                receivers[msg.sender].isCompleted = true;

                matchedDonor[msg.sender] = donorAddr; // Store matched donor

                emit MatchFound(donorAddr, msg.sender);
                emit DonationCompleted(donorAddr, donors[donorAddr].organ);
                emit OrganReceived(msg.sender, receivers[msg.sender].organNeeded);

                return donorAddr;
            }
        }

        return address(0);
    }

    // Function to retrieve matched donor
    function getMatchedDonor(address receiver) public view returns (address) {
        return matchedDonor[receiver];
    }
}
