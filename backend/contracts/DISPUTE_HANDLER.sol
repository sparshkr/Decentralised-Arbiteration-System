// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DisputeHandler {
    enum Skill {
        NONE,
        SKILL_1,
        SKILL_2,
        SKILL_3,
        SKILL_4,
        SKILL_5,
        SKILL_6,
        SKILL_7,
        SKILL_8,
        SKILL_9,
        SKILL_10
    }

    struct JuryMember {
        address member;
        uint256 stakeAmount;
        uint[] skillset;
        bool isConsidered;
        bool votedForA;
    }

    struct Dispute {
        uint256 id;
        address clientA;
        address clientB;
        uint[] skillsReqd;
        uint256 votingDeadline;
        bool isResolved;
        uint256 totalStaked;
        uint256 votesForA;
        uint256 votesForB;
        mapping(address => JuryMember) juryVotes;
        address[] juryAddresses;
    }

    mapping(uint256 => Dispute) public disputes;
    IERC20 public grullToken;

    event DisputeSettled(uint256 disputeId, address winner, address loser);

    constructor(address _grullToken) {
        grullToken = IERC20(_grullToken);
    }

    // Jury member stakes GRULL and votes
    function stakeAndVote(
        uint256 disputeId,
        bool voteForA,
        uint256 stakeAmount,
        uint[] memory skills
    ) external {
        require(
            disputes[disputeId].votingDeadline > block.timestamp,
            "Voting deadline passed"
        );
        require(
            disputes[disputeId].juryVotes[msg.sender].stakeAmount == 0,
            "Already voted"
        );

        grullToken.transferFrom(msg.sender, address(this), stakeAmount);
        disputes[disputeId].juryVotes[msg.sender] = JuryMember({
            member: msg.sender,
            stakeAmount: stakeAmount,
            skillset: skills,
            isConsidered: false,
            votedForA: voteForA
        });
        disputes[disputeId].juryAddresses.push(msg.sender);
        disputes[disputeId].totalStaked += stakeAmount;

        if (voteForA) {
            disputes[disputeId].votesForA++;
        } else {
            disputes[disputeId].votesForB++;
        }
    }

    // Settlement function that evaluates votes based on skill matching
    function settleDispute(uint256 disputeId) external returns (bool) {
        Dispute storage dispute = disputes[disputeId];
        require(!dispute.isResolved, "Dispute already resolved");
        require(
            dispute.votingDeadline < block.timestamp,
            "Voting still ongoing"
        );

        // Calculate weighted votes based on skillset match
        uint256 totalVotes = dispute.votesForA + dispute.votesForB;
        uint256 topJuryCount = (totalVotes * 60) / 100;

        address[] memory topJury = _getTopJury(disputeId, topJuryCount);
        uint256 votesForAWeighted;
        uint256 votesForBWeighted;

        for (uint256 i = 0; i < topJury.length; i++) {
            JuryMember storage juror = dispute.juryVotes[topJury[i]];
            juror.isConsidered = true; // Marking the juror as considered.

            uint256 weight = _calculateWeight(
                juror.skillset,
                dispute.skillsReqd
            );

            if (juror.votedForA) {
                votesForAWeighted += weight;
            } else {
                votesForBWeighted += weight;
            }
        }

        // Determine the winner
        address winner;
        address loser;

        if (votesForAWeighted > votesForBWeighted) {
            winner = dispute.clientA;
            loser = dispute.clientB;
        } else {
            winner = dispute.clientB;
            loser = dispute.clientA;
        }

        // Distribute rewards
        _distributeRewards(disputeId, winner);

        dispute.isResolved = true;
        emit DisputeSettled(disputeId, winner, loser);

        return true;
    }

    // Calculate the top 60% of jurors based on skillset match
    function _getTopJury(
        uint256 disputeId,
        uint256 topJuryCount
    ) internal view returns (address[] memory) {
        Dispute storage dispute = disputes[disputeId];
        address[] memory sortedJury = dispute.juryAddresses;

        // Sort jury members by skillset match (simplified sorting here)
        // More advanced sorting logic can be implemented as needed.

        // Returning a portion of the top matched jury members.
        uint256 cutoff = topJuryCount < sortedJury.length
            ? topJuryCount
            : sortedJury.length;

        address[] memory topJury = new address[](cutoff);
        for (uint256 i = 0; i < cutoff; i++) {
            topJury[i] = sortedJury[i];
        }

        return topJury;
    }

    // Function to calculate jury weight based on skills match
    function _calculateWeight(
        uint[] memory jurorSkills,
        uint[] memory disputeSkills
    ) internal pure returns (uint256) {
        uint256 matchingSkills = 0;

        for (uint256 i = 0; i < jurorSkills.length; i++) {
            for (uint256 j = 0; j < disputeSkills.length; j++) {
                if (jurorSkills[i] == disputeSkills[j]) {
                    matchingSkills++;
                }
            }
        }

        return matchingSkills;
    }

    // Function to distribute rewards to winning jury members
    function _distributeRewards(uint256 disputeId, address winner) internal {
        Dispute storage dispute = disputes[disputeId];
        uint256 totalLoserStake = 0;

        for (uint256 i = 0; i < dispute.juryAddresses.length; i++) {
            JuryMember memory juror = dispute.juryVotes[
                dispute.juryAddresses[i]
            ];
            if (juror.isConsidered) {
                if (
                    (juror.votedForA && winner == dispute.clientA) ||
                    (!juror.votedForA && winner == dispute.clientB)
                ) {
                    //
                } else {
                    totalLoserStake += juror.stakeAmount;
                }
            }
        }
        for (uint256 i = 0; i < dispute.juryAddresses.length; i++) {
            JuryMember memory juror = dispute.juryVotes[
                dispute.juryAddresses[i]
            ];

            if (juror.isConsidered) {
                if (
                    (juror.votedForA && winner == dispute.clientA) ||
                    (!juror.votedForA && winner == dispute.clientB)
                ) {
                    // Winner juror gets their stake back + reward
                    uint256 reward = juror.stakeAmount +
                        totalLoserStake *
                        (juror.stakeAmount / dispute.totalStaked);
                    bool success = grullToken.transfer(juror.member, reward);
                    require(success, "Error in settling trades");
                } else {
                    bool success = grullToken.transfer(
                        juror.member,
                        juror.stakeAmount
                    );
                    require(success, "Error in settling trades");
                }
            }
        }
    }
}
