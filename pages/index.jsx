import Head from 'next/head'
import Image from 'next/image'
import styles from './Home/home.module.scss'
import { useState, useEffect, useCallback } from 'react'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Router from 'next/router';


export default function Home({ refer }) {
  const { openConnectModal } = useConnectModal();
  const { address, connector: activeConnector, isConnected } = useAccount()
  const [walletStatus, setwalletStatus] = useState(false);

  console.log(refer);

  useEffect(() => {
    setwalletStatus(isConnected)
  }, [isConnected])


  const initiate = () => {
    if (!isConnected) {
      return openConnectModal()
    }
    localStorage.setItem("wallet", address);
    Router.push(`/loading?refer=${refer}`);
  }

  return (
    <div className={styles.home}>
      <span className={styles.connectBtn}><ConnectButton /></span>
      <GridCon />
      <img className={styles.cube} src="/hero/cube.png" alt="" />
      <img className={styles.orb} src="/hero/orb2.png" alt="" />
      <div className={styles.heroText}>
        <div className={styles.title}>
          <h1>WEB3
            <img src="/hero/star.png" alt="" />
          </h1>
          <h1 className={styles.color}>WRAPPED!</h1>
        </div>
        <p className={styles.subText}>
          Connect your wallet to mint your own unique web3 wrapped NFTs and share it with your friends
        </p>
        {
          (walletStatus) ? <button className={styles.btn} onClick={initiate} >
            Unwrap it!
            <img src="/hero/glit.png" alt="" />
          </button> : <button className={styles.btn} onClick={initiate} >
            Connect Wallet
            <img src="/hero/glit.png" alt="" />
          </button>
        }
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
