import { ethers, utils } from 'ethers'

export async function payWithMetamask(sender, receiver, strEther) {
  console.log(`payWithMetamask(receiver=${receiver}, sender=${sender}, ether=${strEther})`)

  let ethereum = window.ethereum

  // Request account access if needed
  await ethereum.enable()

  const provider = new ethers.providers.Web3Provider(ethereum)

  // Acccounts now exposed
  const params = [
    {
      from: sender,
      to: receiver,
      value: ethers.utils.parseUnits(strEther, 'ether').toHexString(),
    },
  ]

  const transactionHash = await provider.send('eth_sendTransaction', params)

  console.log('transactionHash is ' + transactionHash)
}
