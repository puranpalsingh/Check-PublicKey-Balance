import { ArrowLeft, ArrowRight, Copy, Search, Shield, Wallet } from "lucide-react";
import { useState } from "react"
import { getethBalance, getTransactionCount, isContract, getBlockNumber, getSolBalance, getSolLatestBlock, getSolTransactionCount,getSolisContract } from "./utils/rpc";

type Screen = 'home' | 'input';
type network = 'Ethereum' | 'Solana';

interface wallet {
  address: string;
  balance: string;
  transactionCount: number;
  isContract: boolean;
  latestBlockNumber?: number;
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedNetwork, setSelectedNetwork] = useState<network | null>(null);
  const [publicKey, setPublicKey] = useState('');
  const [walletData,setWalletData] = useState<wallet | null> (null);
  const [isLoading ,setIsLoading] = useState(false);

  function handleNetworkSelect(networkval : network) {
    setSelectedNetwork(networkval);
    setCurrentScreen('input');
  }

  function handleBack() {
    setCurrentScreen('home');
    setPublicKey('');
    setWalletData(null);
  }
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  function copyToClipboard(address: string) {
    navigator.clipboard.writeText(address);
  }

  async function EthreumHandler() {
    setIsLoading(true);
    try {
      const [balance, txCount, contractCheck, blockNumber] = await Promise.all([
        getethBalance(publicKey),
        getTransactionCount(publicKey),
        isContract(publicKey),
        getBlockNumber()
      ]);

      setWalletData({
        address: publicKey,
        balance: balance.toString(),
        transactionCount: txCount,
        isContract: contractCheck,
        latestBlockNumber: blockNumber
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      alert('Failed to fetch wallet data. Please check the address and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function solanaHandler() {
    setIsLoading(true);
    try {
      const [balance, txCount, contractCheck, blockNumber] = await Promise.all([
        getSolBalance(publicKey),
        getSolTransactionCount(publicKey),
        getSolisContract(publicKey),
        getSolLatestBlock()
      ]);

      setWalletData({
        address: publicKey,
        balance: balance.toString(),
        transactionCount: txCount,
        isContract: contractCheck,
        latestBlockNumber: blockNumber
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      alert('Failed to fetch wallet data. Please check the address and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if(currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-light text-white mb-4">
                Choose Network
              </h1>
              <p className="text-xl text-gray-400">Select the blockchain Network</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div onClick={() => handleNetworkSelect('Ethereum')}
              className="group cursor-pointer bg-gray-900 hover:bg-gray-800 rounded-2xl p-8 transition-all duration-300 border border-gray-800 hover:border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-semibold text-white">ETH</span>
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-4">
                    Ethereum
                  </h3>
                  <p className="text-gray-400 mb-6">check ETH and ERC-20 tokens </p>
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <span >Select</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"/>
                  </div>
                </div>
              </div>
              <div onClick={() => handleNetworkSelect('Solana')}
              className="group cursor-pointer bg-gray-900 hover:bg-gray-800 rounded-2xl p-8 transition-all duration-300 border border-gray-800 hover:border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-semibold text-white">SOL</span>
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-4">
                    Solana
                  </h3>
                  <p className="text-gray-400 mb-6">check SOL and SPL tokens </p>
                  <div className="flex items-center justify-center gap-2 text-violet-400">
                    <span >Select</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-gray-500 text-sm">
            Designed and developed with ❤️ by{" "}
            <span className="text-white font-medium">Puranpal Singh</span>
          </p>
        </footer>
      </div>
    )

    
  }
  
  return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <button onClick={handleBack} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
              <ArrowLeft className="w-5 h-5"/>
              Back
            </button>
            <div className="text-center mb-12">
              <div className= {`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 ${
                selectedNetwork === 'Ethereum' ? 'bg-blue-600' : 'bg-purple-500'
              }`}>
                <span className="text-xl font-semibold text-white">
                  {selectedNetwork === 'Ethereum' ? 'ETH' : 'SOL'}
                </span>
              </div>
              <h1 className="text-4xl font-light text-white mb-4">
                {selectedNetwork === 'Ethereum' ? 'Ethereum' : 'Solana'} Wallet
              </h1>
              <p className="text-xl text-gray-400"> Enter the public Key</p>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">

                  <Wallet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>

                  <input type="text" value={publicKey}onChange={(e) => setPublicKey(e.target.value)} placeholder= {selectedNetwork == 'Ethereum' ? 'Enter Ethereum address (0x... )' : 'Enter the Solana address'} className="w-full pl-12 pr-4 py-4 bg-transparent border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus: ring-white/10 focus:border-gray-600 transition-all duration-500" 
                  onKeyDown={(e) => e.key === "Enter" && (selectedNetwork === 'Ethereum' ? EthreumHandler() : solanaHandler())}/>
                </div>
                <button onClick={() => {
                  if(selectedNetwork === 'Ethereum') {
                    EthreumHandler();
                  } else {
                    solanaHandler();
                  }
                }}
                  disabled={isLoading || !publicKey.trim()}
                  className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span>Checking...</span>
                          
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5"/>
                          <span>Check Balance</span>
                        </>
                      )}
                    </div>
                  </button>
              </div>
            </div>
            {walletData && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6"> 
                  <h2 className="text-2xl font-medium text-whtie">Wallet Overview</h2>
                  <Shield className="w-6 h-6 text-green-400"/>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Address</p>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-mono">
                        {formatAddress(walletData.address)}
                      </span>
                      <button onClick={() => {
                        copyToClipboard(walletData.address)
                      }} className="p-1 hover:bg-gray-800 rounded transition-colors duration-300">
                        <Copy className="w-4 h-4 text-gray-400"/>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Balance</p>
                    <div className="text-3xl font-light text-white">
                      {walletData.balance} {selectedNetwork == 'Ethereum' ? 'ETH' : 'SOL'}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Transaction Count</p>
                    <p className="text-xl font-semibold text-white">{walletData.transactionCount}</p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Type</p>
                    <p className="text-xl font-semibold text-white">
                      {walletData.isContract ? 'Contract' : 'Wallet'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Latest Block</p>
                    <p className="text-xl font-semibold text-white">
                      {walletData.latestBlockNumber?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>

              </div>
            )}
            
          </div>
        </div>
        
        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-gray-500 text-sm">
            Designed and developed with ❤️ by{" "}
            <span className="text-white font-medium">Puranpal Singh</span>
          </p>
        </footer>
      </div>
  )
}

export default App
