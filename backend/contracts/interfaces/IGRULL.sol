// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGRULL {
    // ERC20 standard functions
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    // ERC20Burnable extension
    function burn(uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;

    // ERC20Pausable extension
    function pause() external;

    function unpause() external;

    function paused() external view returns (bool);

    // ERC20Mintable functionality
    function mint(address to, uint256 amount) external;

    // ERC20Permit extension
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function nonces(address owner) external view returns (uint256);

    function DOMAIN_SEPARATOR() external view returns (bytes32);

    // ERC20Votes extension
    function getVotes(address account) external view returns (uint256);

    function delegate(address delegatee) external;

    function delegates(address account) external view returns (address);

    function clock() external view returns (uint48);

    function CLOCK_MODE() external pure returns (string memory);

    function castVote(uint256 proposalId, uint8 support) external returns (uint256);

    // ERC20FlashMint extension
    function maxFlashLoan(address token) external view returns (uint256);

    function flashFee(address token, uint256 amount) external view returns (uint256);

    function flashLoan(
        address receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external returns (bool);

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Paused(address account);
    event Unpaused(address account);
}
