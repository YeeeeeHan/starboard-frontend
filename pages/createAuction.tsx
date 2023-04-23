import {
  Box,
  Button,
  Center,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import router from 'next/router';
import { useEffect, useState } from 'react';
import {
  Address,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import FactoryABI from '../artifacts/contracts/SimpleAuction.sol/SimpleAuctionFactory.json';
// });
const AuctionFactoryContractLink = '0x33Fc533d707A4cb048D99907f1C0398dBC373650';

interface mintNFTVariables {
  userAddress: `0x${string}`;
}

interface txResult {
  frgApproveLoading: boolean;
  frgApproveSuccess: boolean;
  frgApproveError: Error | null;
}

export default function NftMint() {
  const toast = useToast();
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  const { address: userAddress } = useAccount();
  const [auctionNftaddress, setAuctionNftaddress] = useState<string>();
  const [auctionAddress, setAuctionAddress] = useState<string>();

  // Fetch ...?
  const { data: frgBalance } = useBalance({
    address: userAddress,
    token: process.env.NEXT_PUBLIC_FRG_ADDRESS as Address,
  });

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

  // Create Auction contract interaction
  const { config } = usePrepareContractWrite({
    address: AuctionFactoryContractLink,
    abi: FactoryABI.abi,
    functionName: 'createAuction',
    args: [1000],
  });
  const { data: createAuctionData, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      console.log('useContractWrite createAuction success', data);
    },
  });

  // Check TX status for createAuction
  const {
    isSuccess: createAuctionSuccess,
    isLoading: createAuctionLoading,
    error: frgApproveError,
  } = useWaitForTransaction({
    confirmations: 1,
    hash: createAuctionData?.hash,
    onSettled(data, error) {
      console.log('Settled@', data);
      if (data == undefined || data.logs == undefined) {
        return;
      }
      // define signature and hash
      const eventSignature = 'AuctionCreated(address)';
      const eventSignatureHash = ethers.utils.id(eventSignature);

      // write a for loop, for log in logs
      for (let index = 0; index < data?.logs.length; index++) {
        const log = data?.logs[index];
        console.log(log);

        // check topics for your event
        if (log.topics[0] === eventSignatureHash) {
          console.log('@@@@ index', index);
          const decodedEvent = ethers.utils.defaultAbiCoder.decode(['address'], log.topics[1]);
          // console decoded data
          console.log('DECODED EVENT', decodedEvent);
          setAuctionAddress(decodedEvent.toString());
        }
      }

      console.log('Settled@', data);
    },
  });

  useEffect(() => {
    if (createAuctionSuccess) {
      console.log('TX SUCCESS', createAuctionSuccess);
    }
  }, [createAuctionSuccess]);

  const handleUserClick = (auctionAddress: string) => {
    router.push(`/auctions/${auctionAddress}`);
  };

  return (
    <Center>
      <Box
        maxW={'1060px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
      >
        <Stack maxW="lg" mx="auto" py={{ base: '12', md: '16' }} spacing={{ base: '6', md: '10' }}>
          <Heading size="lg" marginBottom={6}>
            Create Auctions Here
          </Heading>
          <Text fontSize="lg">
            Upon auction end, an NFT will be minted to the highest bidder, containing all the relavant auction
            information
          </Text>
          <>
            <SimpleGrid columns={2} spacing={2} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
              <Box>
                <Box as="h4" noOfLines={1} fontWeight="bold" fontSize="sm">
                  NFT address:
                </Box>
              </Box>
              <Box>
                <Box as="h4" noOfLines={2} fontSize="sm">
                  {auctionNftaddress}
                </Box>
              </Box>
            </SimpleGrid>
            <Center>
              {createAuctionLoading ? (
                <Box as="h4" noOfLines={1} fontSize="sm">
                  Creating Auction...
                  <Spinner />
                </Box>
              ) : (
                <Button colorScheme="teal" size="lg" width="xs" onClick={() => write?.()}>
                  Create Auction
                </Button>
              )}
            </Center>
            {createAuctionSuccess ? (
              <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
                <Box>
                  <Box as="h4" noOfLines={2} fontWeight="bold" fontSize="sm">
                    Auction address:
                  </Box>
                </Box>
                <Box>
                  <Box as="h4" noOfLines={2} fontSize="sm">
                    {auctionAddress}
                  </Box>
                  <Button onClick={() => handleUserClick(auctionAddress as string)}>Go auction page</Button>
                </Box>
              </SimpleGrid>
            ) : (
              <></>
            )}
          </>
          <Text fontSize="lg">To Be Worked On: Pass in file storage parameters into auction creation</Text>
        </Stack>
      </Box>
    </Center>
  );
}
