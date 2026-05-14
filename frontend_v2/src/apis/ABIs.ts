export const PROPERTY_TOKEN_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "_propertyId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_maxSupply",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_identityRegistry",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_compliance",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_paymentToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenPrice",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "compliance",
				"type": "address"
			}
		],
		"name": "ComplianceSet",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "registry",
				"type": "address"
			}
		],
		"name": "IdentityRegistrySet",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "propertyOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "InitialMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "snapshotId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalSupply",
				"type": "uint256"
			}
		],
		"name": "SnapshotCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "oldPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "TokenPriceUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "cost",
				"type": "uint256"
			}
		],
		"name": "TokensPurchased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "PERMIT2",
		"outputs": [
			{
				"internalType": "contract IPermit2",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "snapshotId",
				"type": "uint256"
			}
		],
		"name": "balanceOfAt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "buy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nonce",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "buyWithPermit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "compliance",
		"outputs": [
			{
				"internalType": "contract IModularCompliance",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentSnapshotId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "forcedTransfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "getCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "identityRegistry",
		"outputs": [
			{
				"internalType": "contract IIdentityRegistry",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "propertyOwner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "ownerAmount",
				"type": "uint256"
			}
		],
		"name": "initialMint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initialized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paymentToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "propertyId",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "propertyURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "remainingSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_compliance",
				"type": "address"
			}
		],
		"name": "setCompliance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "registry",
				"type": "address"
			}
		],
		"name": "setIdentityRegistry",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "setPropertyURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "setTokenPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "snapshot",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "snapshotId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "snapshotId",
				"type": "uint256"
			}
		],
		"name": "totalSupplyAt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export const ONCHAINID_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "topic",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			}
		],
		"name": "ClaimAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "topic",
				"type": "uint256"
			}
		],
		"name": "ClaimRemoved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "topic",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			},
			{
				"internalType": "uint256",
				"name": "validFrom",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "validTo",
				"type": "uint256"
			}
		],
		"name": "addClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "topic",
				"type": "uint256"
			}
		],
		"name": "getClaim",
		"outputs": [
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			},
			{
				"internalType": "uint256",
				"name": "validFrom",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "validTo",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "topic",
				"type": "uint256"
			}
		],
		"name": "hasClaim",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "topic",
				"type": "uint256"
			}
		],
		"name": "isValidClaim",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "topic",
				"type": "uint256"
			}
		],
		"name": "removeClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export const DIVIDEND_DISTRIBUTOR_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_paymentToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "dividendId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "holder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "DividendClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "dividendId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "snapshotId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "DividendCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "dividendId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "UnclaimedWithdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dividendId",
				"type": "uint256"
			}
		],
		"name": "claimDividend",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "claimed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "snapshotId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "createDividend",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentDividendId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "dividendIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "dividends",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "snapshotId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dividendPerToken",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "claimedAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "emergencyWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dividendId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "holder",
				"type": "address"
			}
		],
		"name": "getClaimableDividend",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDividendCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDividendIds",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "holder",
				"type": "address"
			}
		],
		"name": "getTotalClaimable",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "total",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dividendId",
				"type": "uint256"
			}
		],
		"name": "getUnclaimedAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paymentToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IPropertyToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalDistributed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "dividendId",
				"type": "uint256"
			}
		],
		"name": "withdrawUnclaimed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export const GOVERNANCE_TOKEN_ABI = [
	{
				"type": "constructor",
				"inputs": [
							{
										"name": "_stoTokenAddress",
										"type": "address",
										"internalType": "address"
							}
				],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "CLOCK_MODE",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "string",
										"internalType": "string"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "DOMAIN_SEPARATOR",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "bytes32",
										"internalType": "bytes32"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "allowance",
				"inputs": [
							{
										"name": "owner",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "spender",
										"type": "address",
										"internalType": "address"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "approve",
				"inputs": [
							{
										"name": "spender",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "value",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "bool",
										"internalType": "bool"
							}
				],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "balanceOf",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "burnFrom",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "amount",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"outputs": [],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "checkpoints",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "pos",
										"type": "uint32",
										"internalType": "uint32"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "tuple",
										"internalType": "struct Checkpoints.Checkpoint208",
										"components": [
													{
																"name": "_key",
																"type": "uint48",
																"internalType": "uint48"
													},
													{
																"name": "_value",
																"type": "uint208",
																"internalType": "uint208"
													}
										]
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "clock",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "uint48",
										"internalType": "uint48"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "decimals",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "uint8",
										"internalType": "uint8"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "delegate",
				"inputs": [
							{
										"name": "delegatee",
										"type": "address",
										"internalType": "address"
							}
				],
				"outputs": [],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "delegateBySig",
				"inputs": [
							{
										"name": "delegatee",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "nonce",
										"type": "uint256",
										"internalType": "uint256"
							},
							{
										"name": "expiry",
										"type": "uint256",
										"internalType": "uint256"
							},
							{
										"name": "v",
										"type": "uint8",
										"internalType": "uint8"
							},
							{
										"name": "r",
										"type": "bytes32",
										"internalType": "bytes32"
							},
							{
										"name": "s",
										"type": "bytes32",
										"internalType": "bytes32"
							}
				],
				"outputs": [],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "delegates",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "address",
										"internalType": "address"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "eip712Domain",
				"inputs": [],
				"outputs": [
							{
										"name": "fields",
										"type": "bytes1",
										"internalType": "bytes1"
							},
							{
										"name": "name",
										"type": "string",
										"internalType": "string"
							},
							{
										"name": "version",
										"type": "string",
										"internalType": "string"
							},
							{
										"name": "chainId",
										"type": "uint256",
										"internalType": "uint256"
							},
							{
										"name": "verifyingContract",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "salt",
										"type": "bytes32",
										"internalType": "bytes32"
							},
							{
										"name": "extensions",
										"type": "uint256[]",
										"internalType": "uint256[]"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "getPastTotalSupply",
				"inputs": [
							{
										"name": "timepoint",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "getPastVotes",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "timepoint",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "getVotes",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "mintFor",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "amount",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"outputs": [],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "name",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "string",
										"internalType": "string"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "nonces",
				"inputs": [
							{
										"name": "owner",
										"type": "address",
										"internalType": "address"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "numCheckpoints",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "uint32",
										"internalType": "uint32"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "owner",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "address",
										"internalType": "address"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "permit",
				"inputs": [
							{
										"name": "owner",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "spender",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "value",
										"type": "uint256",
										"internalType": "uint256"
							},
							{
										"name": "deadline",
										"type": "uint256",
										"internalType": "uint256"
							},
							{
										"name": "v",
										"type": "uint8",
										"internalType": "uint8"
							},
							{
										"name": "r",
										"type": "bytes32",
										"internalType": "bytes32"
							},
							{
										"name": "s",
										"type": "bytes32",
										"internalType": "bytes32"
							}
				],
				"outputs": [],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "propertyToken",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "address",
										"internalType": "address"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "renounceOwnership",
				"inputs": [],
				"outputs": [],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "setPropertyToken",
				"inputs": [
							{
										"name": "_propertyToken",
										"type": "address",
										"internalType": "address"
							}
				],
				"outputs": [],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "stoToken",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "address",
										"internalType": "contract IERC20"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "symbol",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "string",
										"internalType": "string"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "totalSupply",
				"inputs": [],
				"outputs": [
							{
										"name": "",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"stateMutability": "view"
	},
	{
				"type": "function",
				"name": "transfer",
				"inputs": [
							{
										"name": "to",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "value",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "bool",
										"internalType": "bool"
							}
				],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "transferFrom",
				"inputs": [
							{
										"name": "from",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "to",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "value",
										"type": "uint256",
										"internalType": "uint256"
							}
				],
				"outputs": [
							{
										"name": "",
										"type": "bool",
										"internalType": "bool"
							}
				],
				"stateMutability": "nonpayable"
	},
	{
				"type": "function",
				"name": "transferOwnership",
				"inputs": [
							{
										"name": "newOwner",
										"type": "address",
										"internalType": "address"
							}
				],
				"outputs": [],
				"stateMutability": "nonpayable"
	},
	{
				"type": "event",
				"name": "Approval",
				"inputs": [
							{
										"name": "owner",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							},
							{
										"name": "spender",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							},
							{
										"name": "value",
										"type": "uint256",
										"indexed": false,
										"internalType": "uint256"
							}
				],
				"anonymous": false
	},
	{
				"type": "event",
				"name": "DelegateChanged",
				"inputs": [
							{
										"name": "delegator",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							},
							{
										"name": "fromDelegate",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							},
							{
										"name": "toDelegate",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							}
				],
				"anonymous": false
	},
	{
				"type": "event",
				"name": "DelegateVotesChanged",
				"inputs": [
							{
										"name": "delegate",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							},
							{
										"name": "previousVotes",
										"type": "uint256",
										"indexed": false,
										"internalType": "uint256"
							},
							{
										"name": "newVotes",
										"type": "uint256",
										"indexed": false,
										"internalType": "uint256"
							}
				],
				"anonymous": false
	},
	{
				"type": "event",
				"name": "EIP712DomainChanged",
				"inputs": [],
				"anonymous": false
	},
	{
				"type": "event",
				"name": "OwnershipTransferred",
				"inputs": [
							{
										"name": "previousOwner",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							},
							{
										"name": "newOwner",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							}
				],
				"anonymous": false
	},
	{
				"type": "event",
				"name": "Transfer",
				"inputs": [
							{
										"name": "from",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							},
							{
										"name": "to",
										"type": "address",
										"indexed": true,
										"internalType": "address"
							},
							{
										"name": "value",
										"type": "uint256",
										"indexed": false,
										"internalType": "uint256"
							}
				],
				"anonymous": false
	},
	{
				"type": "error",
				"name": "CheckpointUnorderedInsertion",
				"inputs": []
	},
	{
				"type": "error",
				"name": "ECDSAInvalidSignature",
				"inputs": []
	},
	{
				"type": "error",
				"name": "ECDSAInvalidSignatureLength",
				"inputs": [
							{
										"name": "length",
										"type": "uint256",
										"internalType": "uint256"
							}
				]
	},
	{
				"type": "error",
				"name": "ECDSAInvalidSignatureS",
				"inputs": [
							{
										"name": "s",
										"type": "bytes32",
										"internalType": "bytes32"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC20ExceededSafeSupply",
				"inputs": [
							{
										"name": "increasedSupply",
										"type": "uint256",
										"internalType": "uint256"
							},
							{
										"name": "cap",
										"type": "uint256",
										"internalType": "uint256"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC20InsufficientAllowance",
				"inputs": [
							{
										"name": "spender",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "allowance",
										"type": "uint256",
										"internalType": "uint256"
							},
							{
										"name": "needed",
										"type": "uint256",
										"internalType": "uint256"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC20InsufficientBalance",
				"inputs": [
							{
										"name": "sender",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "balance",
										"type": "uint256",
										"internalType": "uint256"
							},
							{
										"name": "needed",
										"type": "uint256",
										"internalType": "uint256"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC20InvalidApprover",
				"inputs": [
							{
										"name": "approver",
										"type": "address",
										"internalType": "address"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC20InvalidReceiver",
				"inputs": [
							{
										"name": "receiver",
										"type": "address",
										"internalType": "address"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC20InvalidSender",
				"inputs": [
							{
										"name": "sender",
										"type": "address",
										"internalType": "address"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC20InvalidSpender",
				"inputs": [
							{
										"name": "spender",
										"type": "address",
										"internalType": "address"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC2612ExpiredSignature",
				"inputs": [
							{
										"name": "deadline",
										"type": "uint256",
										"internalType": "uint256"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC2612InvalidSigner",
				"inputs": [
							{
										"name": "signer",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "owner",
										"type": "address",
										"internalType": "address"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC5805FutureLookup",
				"inputs": [
							{
										"name": "timepoint",
										"type": "uint256",
										"internalType": "uint256"
							},
							{
										"name": "clock",
										"type": "uint48",
										"internalType": "uint48"
							}
				]
	},
	{
				"type": "error",
				"name": "ERC6372InconsistentClock",
				"inputs": []
	},
	{
				"type": "error",
				"name": "InvalidAccountNonce",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							},
							{
										"name": "currentNonce",
										"type": "uint256",
										"internalType": "uint256"
							}
				]
	},
	{
				"type": "error",
				"name": "InvalidShortString",
				"inputs": []
	},
	{
				"type": "error",
				"name": "OwnableInvalidOwner",
				"inputs": [
							{
										"name": "owner",
										"type": "address",
										"internalType": "address"
							}
				]
	},
	{
				"type": "error",
				"name": "OwnableUnauthorizedAccount",
				"inputs": [
							{
										"name": "account",
										"type": "address",
										"internalType": "address"
							}
				]
	},
	{
				"type": "error",
				"name": "SafeCastOverflowedUintDowncast",
				"inputs": [
							{
										"name": "bits",
										"type": "uint8",
										"internalType": "uint8"
							},
							{
										"name": "value",
										"type": "uint256",
										"internalType": "uint256"
							}
				]
	},
	{
				"type": "error",
				"name": "StringTooLong",
				"inputs": [
							{
										"name": "str",
										"type": "string",
										"internalType": "string"
							}
				]
	},
	{
				"type": "error",
				"name": "VotesExpiredSignature",
				"inputs": [
							{
										"name": "expiry",
										"type": "uint256",
										"internalType": "uint256"
							}
				]
	}
];

export const GOVERNANCE_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_governanceToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "ProposalCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "support",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "votes",
				"type": "uint256"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "VOTING_PERIOD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			}
		],
		"name": "createProposal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			}
		],
		"name": "getProposal",
		"outputs": [
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "forVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "againstVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "snapshot",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "executed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "governanceToken",
		"outputs": [
			{
				"internalType": "contract ERC20Votes",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_voter",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "proposalCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposals",
		"outputs": [
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "forVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "againstVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "snapshot",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "executed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_support",
				"type": "bool"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "support",
				"type": "uint8"
			}
		],
		"name": "castVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export const IDENTITY_REGISTRY_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"name": "contains",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"name": "identity",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"name": "isVerified",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "identity",
				"type": "address"
			}
		],
		"name": "registerIdentity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"name": "removeIdentity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "newIdentity",
				"type": "address"
			}
		],
		"name": "updateIdentity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

export const TOKEN_FACTORY_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_identityRegistry",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_paymentToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "oldToken",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newToken",
				"type": "address"
			}
		],
		"name": "PaymentTokenUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			}
		],
		"name": "PropertyDeactivated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "complianceAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "maxSupply",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenPrice",
				"type": "uint256"
			}
		],
		"name": "PropertyTokenCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenPrice",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "complianceAddress",
				"type": "address"
			}
		],
		"name": "createPropertyToken",
		"outputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			}
		],
		"name": "deactivateProperty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getActiveProperties",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllPropertyIds",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			}
		],
		"name": "getProperty",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "propertyId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "symbol",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "tokenAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "complianceAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "dividendAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "governanceAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "totalValue",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxSupply",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "tokenPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct TokenFactory.PropertyInfo",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPropertyCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "identityRegistry",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextPropertyId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paymentToken",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "properties",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "complianceAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "dividendAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "governanceAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxSupply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tokenPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "propertyIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "dividendAddress",
				"type": "address"
			}
		],
		"name": "setDividendContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "governanceAddress",
				"type": "address"
			}
		],
		"name": "setGovernanceContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "registry",
				"type": "address"
			}
		],
		"name": "setIdentityRegistry",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newPaymentToken",
				"type": "address"
			}
		],
		"name": "setPaymentToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "tokenToProperty",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newValue",
				"type": "uint256"
			}
		],
		"name": "updatePropertyValue",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
