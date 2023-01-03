
import { ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";
import abi from "./contractAbi/trutsNFT.json";
import { Bounce, toast } from "react-toastify";
// import {useMoralis} from "react-moralis";

export const gaslessTxn = async (address, signature, idNumber, cb) => {
    let rpc = "https://rpc.ankr.com/polygon_mumbai"
    let contractAddress = "0x0d0f14924c1E9e3A9feE8432296f13A1FCFfB497"
    const { ethereum } = window;
    if (ethereum) {
        console.log("ok bro")
        // const signer = provider.getSigner();
        // const address = await signer.getAddress();
        const biconomy = new Biconomy(ethereum, {
            walletProvider: ethereum,
            apiKey: "VPy2_u9yn.20b0e126-46ad-4874-b9aa-38960b495562",
            debug: true,
            contractAddresses: [contractAddress], // list of contract address you want to enable gasless on
        });
        // await biconomy.;
        console.log(biconomy)
        console.log(biconomy.READY)
        biconomy.onEvent(biconomy.READY, async () => {
            console.log("intiated");
        });
        biconomy.onEvent(biconomy.READY, async () => {
            console.log("intiated");
        });


        biconomy
            .onEvent(biconomy.READY, async () => {
                toast.loading("Your NFT is being minted, please wait...");
                let ethersProvider = new ethers.providers.Web3Provider(biconomy);

                const contractInstance = new ethers.Contract(
                    contractAddress,
                    abi,
                    biconomy.getSignerByAddress(address)
                );
                const { data } =
                    await contractInstance.populateTransaction.mintNewNFT(
                        signature,
                        idNumber,

                    );

                let txnn = {
                    data: data,
                    to: contractAddress,
                    from: address,
                    signatureType: "EIP712_SIGN",
                    gasPrice: ethers.utils.parseUnits('200', 'gwei'),
                    gasLimit: 2000000
                };
                let transactionHash;

                try {
                    let ethersProvider = biconomy.getEthersProvider();

                    let txhash = await ethersProvider.send("eth_sendTransaction", [
                        txnn,
                    ]);
                    // let txhash  =await ethersProvider.sen
                    let receipt = await ethersProvider.waitForTransaction(txhash);
                    // toast.dismiss();
                    // toast.success("NFT Minted");
                    //alert("tx")
                    console.log(receipt);
                    cb(receipt);
                    return (receipt);
                } catch (error) {
                    if (error.returnedHash && error.expectedHash) {
                        console.log("Transaction hash : ", error.returnedHash);
                        transactionHash = error.returnedHash;
                    } else {
                        console.log(error);
                    }
                    toast.dismiss();
                    toast.error("NFT Minting Failed!");
                }

                if (transactionHash) {
                    let receipt = await ethersProvider.waitForTransaction(
                        transactionHash
                    );
                } else {
                }
            })
            .onEvent(biconomy.ERROR, (error, message) => {
                console.log(message);
                console.log(error);
            });
    }

};