import { Box, Button, Heading, Input } from '@chakra-ui/react';
import { Default } from 'components/layouts/Default';
import { BigNumber, ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite, useProvider } from 'wagmi';
import AuctionABI from '../../artifacts/contracts/SimpleAuction.sol/SimpleAuction.json';

const AuctionPage = () => {
  const router = useRouter();
  const provider = useProvider();
  // const { data: signer, isError, isLoading } = useSigner();
  const { address } = router.query;
  const [bidAmount, setBidAmount] = useState<string>('0.0');
  const [beneficiary, setBeneficiary] = useState<string>();
  const [highestBidder, setHighestBidder] = useState<string>();
  const [highestBid, setHighestBid] = useState<string>();
  const [ended, setEnded] = useState<boolean>();
  const [auctionEndTime, setAuctionEndTime] = useState('');

  // Get beneficiary from auction contract
  const { data: beneficiaryData } = useContractRead({
    address: address as string,
    abi: AuctionABI.abi,
    functionName: 'beneficiary',
  });
  useEffect(() => {
    if (beneficiaryData) {
      console.log('beneficiary @@@@@@@@@', beneficiaryData);
      setBeneficiary(beneficiaryData as string);
    }
  }, []);

  // Get highest bidder from auction contract
  const { data: highestBidderData } = useContractRead({
    address: address as string,
    abi: AuctionABI.abi,
    functionName: 'highestBidder',
  });
  useEffect(() => {
    if (highestBidderData) {
      console.log('highestBidder @@@@@@@@@', highestBidderData);
      setHighestBidder(highestBidderData as string);
    }
  }, []);

  // Get highest bidder from auction contract
  const { data: highestBidData } = useContractRead({
    address: address as string,
    abi: AuctionABI.abi,
    functionName: 'highestBid',
  });
  useEffect(() => {
    if (highestBidData) {
      console.log('highestBidData @@@@@@@@@', highestBidData);
      const bid = ethers.utils.formatEther(highestBidData);
      setHighestBid(bid as number);
    }
  }, []);

  // Get auctionEndData from auction contract
  useEffect(() => {
    const contract = new ethers.Contract(address, AuctionABI.abi, provider);

    async function fetchData() {
      const boolValue = await contract.ended();
      console.log('boolValue @@@@!!!!@@@@@', boolValue);
      setEnded(boolValue);
    }

    fetchData();
  }, [address]);

  // Get auctionEndData from auction contract
  const { data: auctionEndTimeData } = useContractRead({
    address: address as string,
    abi: AuctionABI.abi,
    functionName: 'auctionEndTime',
  });
  useEffect(() => {
    if (auctionEndTimeData) {
      console.log('auctionEndTimeData @@@@@@@@@', auctionEndTimeData);
      const time = BigNumber.from(auctionEndTimeData).toNumber();
      console.log('auctionEndTimeData @@@@@@@@@', time);
      const dateObject = new Date(time * 1000);
      const humanDate = dateObject.toLocaleString();
      setAuctionEndTime(humanDate);
    }
  }, []);

  // Bid contract interaction
  const { config } = usePrepareContractWrite({
    address: address as string,
    abi: AuctionABI.abi,
    functionName: 'bid',
    args: [],
    overrides: {
      gasLimit: ethers.utils.parseEther('0.00000000123'),
      value: ethers.utils.parseEther(bidAmount),
    },
    onSuccess(data) {
      console.log('Success', data);
    },
  });
  const { data: bidData, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      console.log('Bid success', data);
    },
  });
  const handleBid = async () => {
    try {
      await write?.({
        args: [],
        overrides: {
          value: ethers.utils.parseEther(bidAmount),
        },
      });
    } catch (err) {
      console.error('Failed to place bid:', err);
    }
  };
  const handleBidAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || value === undefined) {
      setBidAmount('0.0');
      return;
    }
    if (value != '' || /^\d*\.?\d*$/.test(value)) {
      // check for valid float input
      setBidAmount(value);
    }
  };

  // Withdraw contract interaction
  const { config: withdrawConfig } = usePrepareContractWrite({
    address: address as string,
    abi: AuctionABI.abi,
    functionName: 'auctionEnd',
    args: [],
    overrides: {
      gasLimit: ethers.utils.parseEther('0.00000000123'),
      value: ethers.utils.parseEther(bidAmount),
    },
    onSuccess(data) {
      console.log('Success', data);
    },
    onError(error) {
      console.log('Error @@@@@@@@@@@@@@@@@@@@', error);
    },
  });
  const { data: withdrawData, write: withdrawWrite } = useContractWrite({
    ...withdrawConfig,
    onSuccess(data) {
      console.log('end success', data);
    },
    onError(error) {
      console.log('Error!!!!!!!!!!', error);
    },
  });
  const handleWithdraw = async () => {
    try {
      await withdrawWrite?.();
    } catch (err) {
      console.log('HERE2');
      console.error('Failed to place bid:', err);
    }
  };

  // End auction contract interaction
  const { config: endConfig } = usePrepareContractWrite({
    address: address as string,
    abi: AuctionABI.abi,
    functionName: 'auctionEnd',
    args: [],
    overrides: {
      gasLimit: ethers.utils.parseEther('0.00000000123'),
      value: ethers.utils.parseEther(bidAmount),
    },
    onSuccess(data) {
      console.log('Success', data);
    },
    onError(error) {
      console.log('Error @@@@@@@@@@@@@@@@@@@@', error);
    },
  });
  const { data: endAuctionData, write: endWrite } = useContractWrite({
    ...endConfig,
    onSuccess(data) {
      console.log('end success', data);
    },
    onError(error) {
      console.log('Error!!!!!!!!!!', error);
    },
  });
  const handleEndAuction = async () => {
    try {
      await endWrite?.();
    } catch (err) {
      console.log('HERE2');
      console.error('Failed to place bid:', err);
    }
  };

  return (
    <Default pageName="Auctions">
      <Heading size="lg" marginBottom={6}>
        Auction: {address}
      </Heading>
      <Box border="2px" borderRadius="xl" padding="24px 18px">
        <Box mt={3}>
          <strong>Auction:</strong> {address}
        </Box>
        <Box mt={3}>
          <strong>Ended:</strong> {ended?.toString()}
        </Box>
        <Box mt={3}>
          <strong>EndTime:</strong> {auctionEndTime}
        </Box>
        <Box mt={3}>
          <strong>Beneficiary:</strong> {beneficiary}
        </Box>
        <Box mt={3}>
          <strong>Highest bidder:</strong> {highestBidder}
        </Box>
        <Box mt={3}>
          <strong>Highest bid:</strong> {highestBid}
        </Box>
        <Box mt={3}>
          <Input placeholder="Bid amount (FIL)" value={bidAmount} onChange={handleBidAmountChange} />
        </Box>
        <Box mt={3}>
          <Button onClick={handleBid}>Place bid</Button>
        </Box>
        <Box mt={3}>
          <Button onClick={handleWithdraw}>Withdraw</Button>
        </Box>
        <Box mt={3}>
          <Button onClick={handleEndAuction}>End auction - Auction creator only</Button>
        </Box>
      </Box>
    </Default>
  );
};

export default AuctionPage;
