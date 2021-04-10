import Head from 'next/head'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import { isEmpty } from 'lodash'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { ETHIcon } from '../src/components/icons/eth'
import { MMIcon } from '../src/components/icons/metamask'
import { isBrowser } from '../src/utils/is-browser'

const paymentAddress = process.env.NEXT_PUBLIC_ETH_ADDRESS

function getWeb3Instance() {
  if (window.ethereum) {
    return new Web3(window.ethereum)
  } else {
    toast.error('No Metamask (or other Web3 Provider) installed')
  }
}

export default function Home() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const [isConnected, setConnected] = useState()

  const [connectedWallet, setWallet] = useState()

  const checkConnection = async () => {
    // Check if browser is running Metamask
    const web3 = getWeb3Instance()

    if (!web3) {
      return
    }

    setConnected(true)

    // Check if User is already connected by retrieving the accounts
    const accounts = await web3.eth.getAccounts()

    if (!isEmpty(accounts)) {
      setWallet(accounts[0])
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const connectWallet = async () => {
    try {
      await ethereum.enable()

      const accounts = await web3.eth.getAccounts()

      if (!isEmpty(accounts)) {
        setWallet(accounts[0])
      }
    } catch (err) {
      toast.error('User denied account access')
    }
  }

  const onSubmit = async (data) => {
    if (!isConnected) {
      await checkConnection()
    }

    if (!connectedWallet && isConnected) {
      await connectWallet()
    }

    if (!connectedWallet) {
      return
    }

    const { amountEth } = data

    if (!amountEth) {
      toast.error('Type an amount')

      return
    }

    let accounts = await web3.eth.getAccounts()
    window.web3.eth.defaultAccount = accounts[0]

    window.web3.eth.sendTransaction(
      {
        from: window.web3.eth.defaultAccount,
        to: paymentAddress,
        value: window.web3.utils.toWei(amountEth, 'ether'),
      },
      (err, transactionId) => {
        if (err) {
          console.log('Payment failed', err)
          $('#status').html('Payment failed')
        } else {
          console.log('Payment successful', transactionId)
          $('#status').html('Payment successful')
        }
      },
    )
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
          <Input name='ethAmount' type='number' />
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
