import { useState, useEffect } from "react";
import { ethers } from "ethers";
import walletAbi from "../artifacts/contracts/SimpleWallet.sol/SimpleWallet.json";

export default function App() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [walletSigner, setWalletSigner] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amountEntered, setAmountEntered] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const walletABI = walletAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      getWalletContract(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);
  };

  const getWalletContract = async (account) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(account);

    const walletContractSigner = new ethers.Contract(
      contractAddress,
      walletABI,
      signer
    );
    setWalletSigner(walletContractSigner);
  };

  const depositFunds = async () => {
    if (walletSigner && amountEntered > 0) {
      try {
        const valueInWei = ethers.parseUnits(amountEntered.toString(), "wei");

        let tx = await walletSigner.deposit({
          value: valueInWei,
          gasLimit: ethers.toBeHex(300000),
        });

        await tx.wait();
        getBalance(); // Update balance after deposit
      } catch (error) {
        console.error("Deposit failed:", error);
      }
    } else {
      console.error(
        "walletSigner is not set or amountEntered is not valid"
      );
    }
  };

  const withdrawFunds = async () => {
    if (walletSigner && amountEntered > 0) {
      try {
        const tx = await walletSigner.withdraw(amountEntered);
        await tx.wait();
        getBalance(); // Update balance after withdrawal
      } catch (error) {
        console.error("Withdrawal failed:", error);
      }
    }
  };

  const getBalance = async () => {
    if (walletSigner) {
      const balance = await walletSigner.getBalance();
      setBalance(balance);
    }
  };

  useEffect(() => {
    getWallet();
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (walletSigner) {
      getBalance();
    }
  }, [walletSigner]);

  const initUser = () => {
    if (!ethWallet) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            style={{
              color: "white",
              cursor: "pointer",
              backgroundColor: "#1a202c",
              fontSize: "24px",
              padding: "20px",
              borderRadius: "8px",
              textDecoration: "underline",
              border: "3px solid gray",
              textAlign: "center",
            }}
          >
            Please install MetaMask to use this DApp.
          </a>
        </div>
      );
    }

    if (!account) {
      return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <button
            onClick={connectAccount}
            style={{
              backgroundColor: "#f7fafc",
              border: "2px solid #000",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "24px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor : "pointer"
            }}
          >
            Connect via MetaMask
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", gap: "10px" }}>
        <p style={{ color: "white", fontSize: "40px", fontWeight: "bold" }}>
          Wallet Balance: {balance !== undefined ? `${balance} WEI` : "Loading..."}
        </p>
        <input
          placeholder="Enter the amount in WEI"
          style={{
            border: "2px solid gray",
            fontSize: "20px",
            backgroundColor: "#1a202c",
            borderRadius: "8px",
            padding: "10px",
            color: "white",
          }}
          onChange={(e) => setAmountEntered(e.target.value)}
        />
        <button
          onClick={depositFunds}
          style={{
            border: "2px solid gray",
            color: "white",
            backgroundColor: "#2d3748",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Deposit
        </button>
        <button
          onClick={withdrawFunds}
          style={{
            border: "2px solid gray",
            color: "white",
            backgroundColor: "#2d3748",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Withdraw
        </button>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", backgroundColor: "#2d3748" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        {initUser()}
      </div>
    </div>
  );
}
