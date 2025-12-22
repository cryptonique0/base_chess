// Chess Contract ABI - Generated from Chess.sol
export const CHESS_ABI = [
  // Events
  {
    type: "event",
    name: "GameCreated",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "whitePlayer", type: "address", indexed: true },
      { name: "blackPlayer", type: "address", indexed: true },
      { name: "wager", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "MoveMade",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "player", type: "address", indexed: true },
      { name: "fromPos", type: "uint8", indexed: false },
      { name: "toPos", type: "uint8", indexed: false }
    ]
  },
  {
    type: "event",
    name: "GameEnded",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "result", type: "uint8", indexed: false }
    ]
  },
  {
    type: "event",
    name: "GameAbandoned",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "winner", type: "address", indexed: false }
    ]
  },

  // State Variables
  {
    type: "function",
    name: "gameCounter",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "MOVE_TIMEOUT",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "games",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [
      { name: "whitePlayer", type: "address" },
      { name: "blackPlayer", type: "address" },
      { name: "whiteTurn", type: "bool" },
      { name: "state", type: "uint8" },
      { name: "wager", type: "uint256" },
      { name: "startTime", type: "uint256" },
      { name: "lastMoveTime", type: "uint256" },
      { name: "whiteKingMoved", type: "bool" },
      { name: "blackKingMoved", type: "bool" },
      { name: "whiteRookA1Moved", type: "bool" },
      { name: "whiteRookH1Moved", type: "bool" },
      { name: "blackRookA8Moved", type: "bool" },
      { name: "blackRookH8Moved", type: "bool" },
      { name: "enPassantCol", type: "uint8" },
      { name: "moveCount", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "playerGames",
    inputs: [
      { name: "player", type: "address" },
      { name: "index", type: "uint256" }
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },

  // Functions
  {
    type: "function",
    name: "createGame",
    inputs: [{ name: "opponent", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "joinGame",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "makeMove",
    inputs: [
      { name: "gameId", type: "uint256" },
      { name: "fromPos", type: "uint8" },
      { name: "toPos", type: "uint8" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "makeMoveProm",
    inputs: [
      { name: "gameId", type: "uint256" },
      { name: "fromPos", type: "uint8" },
      { name: "toPos", type: "uint8" },
      { name: "promotionPiece", type: "uint8" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "claimTimeout",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "offerDraw",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "acceptDraw",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "resign",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getBoard",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [{ name: "", type: "uint8[64]" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getGameState",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [
      { name: "whitePlayer", type: "address" },
      { name: "blackPlayer", type: "address" },
      { name: "board", type: "uint8[64]" },
      { name: "whiteTurn", type: "bool" },
      { name: "state", type: "uint8" },
      { name: "wager", type: "uint256" },
      { name: "moveCount", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getPlayerGames",
    inputs: [{ name: "player", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view"
  }
] as const;

// ChessFactory Contract ABI
export const CHESS_FACTORY_ABI = [
  // Events
  {
    type: "event",
    name: "GameListingCreated",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "wager", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "GameListingFilled",
    inputs: [
      { name: "gameId", type: "uint256", indexed: true },
      { name: "joiner", type: "address", indexed: true }
    ]
  },

  // Constructor
  {
    type: "constructor",
    inputs: [{ name: "_chessContract", type: "address" }],
    stateMutability: "nonpayable"
  },

  // State Variables
  {
    type: "function",
    name: "chessContract",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "openGames",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [
      { name: "gameId", type: "uint256" },
      { name: "creator", type: "address" },
      { name: "wager", type: "uint256" },
      { name: "timestamp", type: "uint256" },
      { name: "filled", type: "bool" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "gameIdToListingIndex",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },

  // Functions
  {
    type: "function",
    name: "createOpenGame",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "joinOpenGame",
    inputs: [{ name: "gameId", type: "uint256" }],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "getOpenGames",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "gameId", type: "uint256" },
          { name: "creator", type: "address" },
          { name: "wager", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "filled", type: "bool" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "createPrivateGame",
    inputs: [{ name: "opponent", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable"
  }
] as const;
