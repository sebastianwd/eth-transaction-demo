import Head from 'next/head'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import { isEmpty } from 'lodash'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { ETHIcon } from '../src/components/icons/eth'
import { MMIcon } from '../src/components/icons/metamask'
import { isBrowser } from '../src/utils/is-browser'
import { payWithMetamask } from '../src/utils/pay-with-metamask'

const paymentAddress = process.env.NEXT_PUBLIC_ETH_ADDRESS

export default function Home() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const [isConnectionAvailable, setConnectionAvailable] = useState(false)

  const [connectedWallet, setWallet] = useState()

  console.log('state', isConnectionAvailable, connectedWallet)

  function checkConnection() {
    if (window.ethereum) {
      return true
    }

    toast.error('No Metamask (or other Web3 Provider) installed')

    return false
  }

  useEffect(() => {
    const isConnected = checkConnection()

    setConnectionAvailable(isConnected)

    if (isConnected) {
      // Check if user has wallet already connected
      connectWalletAccount()
    }
  }, [])

  const connectWalletAccount = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (!isEmpty(accounts)) {
      setWallet(accounts[0])

      return accounts[0]
    }
  }

  const requestWalletConnection = async () => {
    try {
      await ethereum.enable()

      return await connectWalletAccount()
    } catch (err) {
      toast.error('User denied account access')
    }
  }

  const onSubmit = async (data) => {
    if (!isConnectionAvailable) {
      checkConnection()
    }

    let wallet = connectedWallet

    if (isConnectionAvailable && !wallet) {
      wallet = await requestWalletConnection()
    }

    if (!wallet) {
      return
    }

    const { ethAmount } = data

    console.log('dcvsdfs', data)

    if (!ethAmount) {
      toast.error('Type an amount')

      return
    }

    await payWithMetamask(wallet, paymentAddress, ethAmount)
  }

  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <ETHIcon />
          <Input {...register('ethAmount')} />
          <span>ETH</span>
        </InputContainer>
        <Button type='submit'>
          {connectedWallet ? (
            'Send'
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ marginRight: 4 }}>Connect Wallet</span>
              <MMIcon />
            </div>
          )}
        </Button>
      </FormContainer>
    </Container>
  )
}

const Button = styled.button`
  box-shadow: rgb(50 50 93 / 11%) 0px 5.93478px 8.90217px, rgb(0 0 0 / 8%) 0px 1.4837px 4.45109px;
  background-color: #5435d5;
  color: rgb(255, 255, 255);
  font-size: 18px;
  height: 44px;
  line-height: 1;
  min-height: 40px;
  padding: 0 20px;
  width: 100%;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  appearance: none;
  outline-style: none;
  text-align: center;
  text-decoration: none;
  transition-duration: 200ms;
  user-select: none;
  white-space: nowrap;
`

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  > svg:first-child {
    position: absolute;
    margin-left: 12px;
  }

  > span:last-child {
    position: absolute;
    color: rgb(255, 255, 255);
    margin-right: 12px;
    right: 0px;
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 2px;
  }
`

const Input = styled.input`
  border: none;
  background-color: #525669;
  border-radius: 8px;
  height: 50px;
  padding: 0 52px;
  font-size: 18px;
  width: 100%;
  color: rgb(255, 255, 255);
`

const FormContainer = styled.form`
  flex-grow: 1;
  margin: auto;
  background-color: #3e4256;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;

  input {
    text-align: right;
  }

  > :not(:last-child) {
    margin-bottom: 20px;
  }
`

const Container = styled.main`
  display: flex;
  margin: 0 auto;
  max-width: 1920px;
  min-height: 100vh;
`
