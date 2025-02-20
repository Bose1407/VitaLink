import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast, Toaster } from 'react-hot-toast';
import { Heart, UserPlus, Search, Wallet, Activity } from 'lucide-react';

const CONTRACT_ADDRESS = "0xd615c312b3bA41296a3baab9fC5880D402bAED0a";
const CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "checkOrganMatch",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "organ",
				"type": "string"
			}
		],
		"name": "DonationCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "organ",
				"type": "string"
			}
		],
		"name": "DonorRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "MatchFound",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "organ",
				"type": "string"
			}
		],
		"name": "OrganReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "organNeeded",
				"type": "string"
			}
		],
		"name": "ReceiverRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_organ",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_bloodType",
				"type": "string"
			}
		],
		"name": "registerDonor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_organNeeded",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_bloodType",
				"type": "string"
			}
		],
		"name": "registerReceiver",
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
			}
		],
		"name": "donorList",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "donors",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "organ",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "bloodType",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isAvailable",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isCompleted",
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
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "getMatchedDonor",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "matchedDonor",
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
		"name": "receiverList",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "receivers",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "organNeeded",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "bloodType",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isMatched",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isCompleted",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    organ: '',
    bloodType: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);

  const setupEventListeners = useCallback((contractInstance, userAddress) => {
    const eventHandlers = {
      DonorRegistered: (donor, organ) => {
        if (donor.toLowerCase() === userAddress.toLowerCase()) {
          toast.success(`Successfully registered as donor for ${organ}`, { id: 'donor-registered' });
        }
      },
      ReceiverRegistered: (receiver, organNeeded) => {
        if (receiver.toLowerCase() === userAddress.toLowerCase()) {
          toast.success(`Successfully registered as receiver for ${organNeeded}`, { id: 'receiver-registered' });
        }
      },
      MatchFound: async (donor, receiver) => {
        if (donor.toLowerCase() === userAddress.toLowerCase() || 
            receiver.toLowerCase() === userAddress.toLowerCase()) {
          const filter = contractInstance.filters.DonationCompleted(donor);
          const events = await contractInstance.queryFilter(filter);
          const organDetails = events.length > 0 ? events[0].args.organ : '';
          
          setMatchDetails({
            donor: donor,
            receiver: receiver,
            organ: organDetails,
            timestamp: new Date().toLocaleString()
          });
          toast.success("Match found! Donation process initiated.", { id: 'match-found' });
        }
      },
      DonationCompleted: (donor, organ) => {
        if (donor.toLowerCase() === userAddress.toLowerCase()) {
          toast.success(`Donation completed for ${organ}`, { id: 'donation-completed' });
        }
      },
      OrganReceived: (receiver, organ) => {
        if (receiver.toLowerCase() === userAddress.toLowerCase()) {
          toast.success(`Organ received: ${organ}`, { id: 'organ-received' });
        }
      }
    };

    // Remove existing listeners before adding new ones
    Object.keys(eventHandlers).forEach(event => {
      contractInstance.removeAllListeners(event);
      contractInstance.on(event, eventHandlers[event]);
    });
  }, []);

  const setupContract = async (userAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setContract(contractInstance);
      setupEventListeners(contractInstance, userAddress);

    } catch (error) {
      console.error("Error setting up contract:", error);
      toast.error("Failed to setup contract connection", { id: 'setup-error' });
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setContract(null);
      toast.error('Please connect to MetaMask.', { id: 'metamask-disconnect' });
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      setupContract(accounts[0]);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask!", { id: 'metamask-missing' });
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setupContract(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      toast.error("Failed to connect to wallet", { id: 'wallet-connect-error' });
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Please install MetaMask!", { id: 'metamask-missing' });
        return;
      }

      setIsLoading(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      setAccount(accounts[0]);
      await setupContract(accounts[0]);
      toast.success("Wallet connected successfully!", { id: 'wallet-connected' });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        toast.error("Please connect to MetaMask.", { id: 'metamask-rejected' });
      } else {
        toast.error("Failed to connect wallet", { id: 'wallet-connect-error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      toast.error("Please connect your wallet first", { id: 'wallet-required' });
      return;
    }
    setIsLoading(true);
    try {
      const tx = await contract.registerDonor(
        formData.name,
        formData.organ,
        formData.bloodType
      );
      await tx.wait();
      setFormData({ name: '', organ: '', bloodType: '' });
    } catch (error) {
      console.error(error);
      toast.error(error.reason || "Failed to register as donor", { id: 'donor-error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiverSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      toast.error("Please connect your wallet first", { id: 'wallet-required' });
      return;
    }
    setIsLoading(true);
    try {
      const tx = await contract.registerReceiver(
        formData.name,
        formData.organ,
        formData.bloodType
      );
      await tx.wait();
      setFormData({ name: '', organ: '', bloodType: '' });
    } catch (error) {
      console.error(error);
      toast.error(error.reason || "Failed to register as receiver", { id: 'receiver-error' });
    } finally {
      setIsLoading(false);
    }
  };

  const checkMatch = async () => {
    if (!contract) {
      toast.error("Please connect your wallet first", { id: 'wallet-required' });
      return;
    }
    setIsLoading(true);
    try {
      const tx = await contract.checkOrganMatch();
      await tx.wait();
      toast.success("Match check completed!", { id: 'match-check' });
    } catch (error) {
      console.error(error);
      toast.error(error.reason || "Failed to check for matches", { id: 'match-error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-75"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex items-center justify-center space-x-2 mb-8">
                  <Heart className="w-8 h-8 text-red-500" />
                  <h1 className="text-3xl font-bold text-gray-800">Organ Donation DApp</h1>
                </div>
                
                {!account ? (
                  <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                  </button>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600">Connected Account:</p>
                      <p className="font-mono text-xs text-gray-800 mt-1">{account}</p>
                    </div>

                    {matchDetails && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg animate-fade-in">
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          <h3 className="text-lg font-semibold text-green-800">Match Found!</h3>
                        </div>
                        <div className="space-y-2 text-sm text-green-700">
                          <p><strong>Donor:</strong> {`${matchDetails.donor.slice(0, 6)}...${matchDetails.donor.slice(-4)}`}</p>
                          <p><strong>Receiver:</strong> {`${matchDetails.receiver.slice(0, 6)}...${matchDetails.receiver.slice(-4)}`}</p>
                          {matchDetails.organ && (
                            <p><strong>Organ:</strong> {matchDetails.organ}</p>
                          )}
                          <p><strong>Matched at:</strong> {matchDetails.timestamp}</p>
                        </div>
                      </div>
                    )}

                    <form className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <input
                        type="text"
                        name="organ"
                        value={formData.organ}
                        onChange={handleInputChange}
                        placeholder="Organ"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <input
                        type="text"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        placeholder="Blood Type"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />

                      <div className="flex space-x-4">
                        <button
                          onClick={handleDonorSubmit}
                          disabled={isLoading}
                          className="flex-1 bg-green-500 text-white rounded-lg px-4 py-3 hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                          <UserPlus className="w-5 h-5" />
                          <span>{isLoading ? 'Processing...' : 'Register as Donor'}</span>
                        </button>
                        <button
                          onClick={handleReceiverSubmit}
                          disabled={isLoading}
                          className="flex-1 bg-purple-500 text-white rounded-lg px-4 py-3 hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                          <UserPlus className="w-5 h-5" />
                          <span>{isLoading ? 'Processing...' : 'Register as Receiver'}</span>
                        </button>
                      </div>

                      <button
                        onClick={checkMatch}
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <Search className="w-5 h-5" />
                        <span>{isLoading ? 'Checking...' : 'Check for Match'}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;