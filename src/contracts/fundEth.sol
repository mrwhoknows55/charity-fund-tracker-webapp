// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract fundEth {
    uint donation_id = 1;

    struct Donation {
        uint donation_id;
        address from_address;
        address to_address;
        uint eth_in_wei;
        uint256 date;
        bool anonymous_state;
        string doner;
        uint donerId;
        string charity;
        uint charityId;
        bool donated;
    }

    mapping(address => Donation[]) public Donations;
    mapping(uint => Donation) public DonationsById;

    function createDonation(address payable to_address, uint256 date, bool anonymous_state, string memory doner, uint donerId, string memory charity, uint charityId) public payable returns(Donation memory) {
        require(msg.value > 0, "sender must send some value greater than 0 wei");
        to_address.transfer(msg.value);
            Donation memory donation_data;
        if(anonymous_state)
            donation_data = Donation(donation_id, msg.sender, to_address, msg.value, date, anonymous_state, "Anonymous", 0, charity, charityId, true);
        else
            donation_data = Donation(donation_id, msg.sender, to_address, msg.value, date, anonymous_state, doner, donerId, charity, charityId, true);
        Donations[msg.sender].push(donation_data);
        Donations[to_address].push(donation_data);
        DonationsById[donation_id] = donation_data;
        donation_id++;
        return  DonationsById[donation_id];
    }

    function getDonationsOf(address of_address) public view returns(Donation[] memory) {
        return Donations[of_address];
    }

    function getDonationByID(uint d_id) public view returns(uint, address, address, uint, uint256, bool, string memory, uint, string memory, uint) {
        Donation memory d = DonationsById[d_id];
        return (d.donation_id, d.from_address, d.to_address, d.eth_in_wei, d.date, d.anonymous_state, d.doner, d.donerId, d.charity, d.charityId);
    }
}