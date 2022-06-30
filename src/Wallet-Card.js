import { useState } from "react";
import {ethers} from 'ethers';

const WalletCard = () => {
    const [walletConnected, setWalletConnected] = useState('false');
    const [buttonState, setButtonState] = useState('connect')
    const [chainConnected, setChainConnected] = useState(null);
    const [accConnected, setAccConnected] = useState(null)
    const [accBalance, setAccBalance] = useState(null);

    const detectChain = async() => {
        const chainid = await window.ethereum.request(
            {
                method: 'eth_chainId'
            }
        )

        setChainConnected(chainid);
    }

    const getBalance = async(account) => {
        const balance  = await window.ethereum.request({
            "method":'eth_getBalance',
            'params': [account, 'latest']
        })
        setAccBalance(ethers.utils.formatEther(balance))
    }

    const accountChangeHandler = (account) => {
        setWalletConnected('true');
        detectChain();
        setAccConnected(account);
        getBalance(account.toString());        
    }


    const connectWallet = async() => {
        if(window.ethereum){
            //alert('metamask is installed')
            setButtonState('loading')
            const result = await window.ethereum.request({
                    method: 'eth_requestAccounts'
            })

            await accountChangeHandler(result[0])  
            setButtonState('connected')      

        } else {
            alert('install metamask!')
        }
    }

    window.ethereum.on('accountsChanged', accountChangeHandler);
    window.ethereum.on('chainChanged', () => window.location.reload());

    return (
        <div className = 'wallet-card'>
            <h2>Is wallet connected : {walletConnected}</h2>
            <button onClick={connectWallet}>{buttonState}</button>
            <h2>Connected Chain : {chainConnected} </h2>
            <h2>Connected Account : {accConnected}</h2>
            <h2>Balance : {accBalance} </h2>
        </div>
        
    )
}


export default WalletCard;