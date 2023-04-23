import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useContractRead, useProvider } from 'wagmi';

import { BigNumber } from 'ethers';
import NftABI from '../../artifacts/contracts/AuctionNft.sol/AuctionNft.json';
import FactoryABI from '../../artifacts/contracts/SimpleAuction.sol/SimpleAuctionFactory.json';
const AuctionFactoryContractLink = '0x33Fc533d707A4cb048D99907f1C0398dBC373650';

const UserPage = () => {
  const router = useRouter();
  const provider = useProvider();
  // const { data: signer, isError, isLoading } = useSigner();
  const { userAddress } = router.query;
  const [auctionNftaddress, setAuctionNftaddress] = useState<string>();
  const [bidAmount, setBidAmount] = useState<string>('0.0');
  const [beneficiary, setBeneficiary] = useState<string>();
  const [highestBidder, setHighestBidder] = useState<string>();
  const [highestBid, setHighestBid] = useState<string>();
  const [ended, setEnded] = useState<boolean>();
  const [auctionEndTime, setAuctionEndTime] = useState('');

  // Get Auction NFT address
  const { data: auctionNft } = useContractRead({
    address: AuctionFactoryContractLink,
    abi: FactoryABI.abi,
    functionName: 'auctionNft',
  });
  useEffect(() => {
    if (auctionNft) {
      console.log('auctionNft @@@@@@@@@', auctionNft);
      setAuctionNftaddress(auctionNft as string);
    }
  }, []);

  // Get beneficiary from auction contract
  const { data: beneficiaryData } = useContractRead({
    address: auctionNftaddress,
    abi: NftABI.abi,
    functionName: 'balanceOf',
    args: [userAddress],
    onError: (error) => {
      console.log('error', error);
    },
  });
  useEffect(() => {
    if (beneficiaryData) {
      const balance = (beneficiaryData as BigNumber).toNumber();
      console.log('beneficiary @@@@@@@@@', balance);
      setBeneficiary(beneficiaryData as string);
    }
  }, []);

  return (
    <>
      {/* {loading && <div>Loading...</div>}
      {!loading && (
        <div>
          <h1>NFTs for {userAddress}</h1>
          <ul>
            {nfts.map((nft) => (
              <li key={nft.tokenId}>
                <img src={nft.imageUrl} alt={nft.name} />
                <div>{nft.name}</div>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </>
  );
};

export default UserPage;
