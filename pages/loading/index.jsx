import Head from 'next/head'
import Image from 'next/image'
import styles from './home.module.scss'
import { useState, useEffect, useCallback } from 'react'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useProvider } from 'wagmi';
import Router from 'next/router';
import axios from 'axios';
import { gaslessTxn } from './biconomyTx'
import Web3 from 'web3';



export default function Home({ refer, share }) {
    const { openConnectModal } = useConnectModal();
    const { address, connector: activeConnector, isConnected } = useAccount()
    const [walletStatus, setwalletStatus] = useState(false);

    useEffect(() => {
        setwalletStatus(isConnected)
    }, [isConnected])

    useEffect(() => {
        if (!isConnected) {
            alert("Wallet error")
            return Router.push('/')
        }
        genAndMint()

    }, [])

    const web3 = new Web3(Web3.givenProvider);
    const signerOwn = web3.eth.accounts.privateKeyToAccount(
        "815e1a532d39242c9edc8fc7e90592fe9d07c10a7fd94f42f7b70531a7adebd9"
    );


    const provider = useProvider()

    const genAndMint = async () => {
        let user_address = address
        if (share.length > 1) {
            user_address = share
        }

        try {
            let res = await axios.get(`/api/wallet-data?key=${user_address}`);
            if (res.status == 200) {
                let data = res.data;
                localStorage.setItem("gen-data", JSON.stringify(data));
                console.log(data)
                if (share.length > 1) {
                    return Router.push(`/generate?share=${user_address}`);
                }
                let resolve = await mintTransaction(user_address, data.NumberToBeAssigned, async (res) => {
                    if (res.status = 1) {
                        if (refer.length > 1) {
                            await axios.get(`/api/record?from=${refer}&to=${user_address}`);
                        }

                        Router.push(`/generate`);
                    }
                });
                //alert(JSON.stringify(resolve));
                console.log(resolve);

            }
            else {
                alert("Network Error")
            }
        } catch (error) {
            alert("Network_Error")
            throw error
        }
    }

    const mintTransaction = async (address, NFT_ID, cb) => {

        console.log("function")
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const provider = new ethers.providers.Web3Provider(ethereum);
                console.log(provider)
                // console.log(signer)

                // const signer = provider.getSigner();
                // let userAddress = await signer.getAddress()
                // console.log("userAddress: ", address)

                let message = `0x000000000000000000000000${address.substring(2)}`;
                let { signature } = signerOwn.sign(message);
                console.log("signerOwn: ", signerOwn.address)
                console.log("signature: ", signature)

                await gaslessTxn(address, signature, NFT_ID, cb)
            }
        } catch (err) {
            console.log(err);
        }
    }



    return (
        <div className={styles.home}>
            {/* <span className={styles.connectBtn}><ConnectButton /></span> */}
            <GridCon />
            <img className={styles.cube} src="/hero/cube.png" alt="" />
            <img className={styles.orb} src="/hero/orb2.png" alt="" />
            <div className={styles.loading}>
                <h1>Minting...</h1>
                <p>Stay tuned! Your year in web3 will be minted as a unique NFT based on web3 journey in 2022</p>
            </div>
        </div>
    )
}

const GridCon = () => {
    const [count, setcount] = useState({ x: 6, y: 6 })
    const [gap, setgap] = useState({ x: {}, y: {} })
    useEffect(() => {
        updateGrid();
        document.body.onresize = function () {
            updateGrid();
        }
    }, [])

    const updateGrid = () => {
        //console.log("update")
        let width = window.innerWidth;
        let height = document.body.scrollHeight;

        setcount((c) => {
            c.x = Math.ceil(height / (width / (count.y + 1)));
            return { ...c }
        })

        setgap((g) => {
            g.y = { columnGap: `${(width / (count.y + 1))}px` }
            g.x = { rowGap: `${(width / (count.y + 1))}px` }
            return { ...g }
        })
        //debugger
    }
    return (
        <div className={styles.grid}>
            <div className={styles.yGridCon}
                style={gap.y}
            >
                {
                    [...Array(count.y + 1)].map((x, id) => {
                        if (id == 0) {
                            return <span style={{ background: "transparent" }} key={'x' + id} className={styles.yGrid} ></span>
                        }
                        return (
                            <span key={'y' + id} className={styles.yGrid} ></span>
                        )
                    })
                }

            </div>
            <div className={styles.xGridCon}
                style={gap.x}
            >
                {
                    [...Array(count.x + 1)].map((y, id) => {
                        if (id == 0) {
                            return <span style={{ background: "transparent" }} key={'y' + id} className={styles.xGrid} ></span>
                        }
                        return (
                            <span key={'y' + id} className={styles.xGrid} ></span>
                        )
                    })
                }

            </div>
        </div>
    )
}


export function getServerSideProps(ctx) {

    let refer = ctx.query.refer
    let share = ctx.query.share

    return {
        props: {
            refer: refer || '',
            share: share || ''
        }
    }
}