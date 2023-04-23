import {
  Box,
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import FactoryABI from '../../../../artifacts/contracts/SimpleAuction.sol/SimpleAuctionFactory.json';

const AuctionFactoryContractLink = '0x33Fc533d707A4cb048D99907f1C0398dBC373650';

const Auctions = () => {
  const hoverTrColor = useColorModeValue('gray.100', 'gray.700');
  const [auctionList, setAuctionList] = useState<string[]>();

  // Get Rate from pet contract
  const { data: auctionListData } = useContractRead({
    address: AuctionFactoryContractLink,
    abi: FactoryABI.abi,
    functionName: 'getAuctions',
  });
  useEffect(() => {
    if (auctionListData) {
      console.log('auctionList @@@@@@@@@', auctionListData);
      setAuctionList(auctionListData as string[]);
    }
  }, []);

  const handleUserClick = (auctionAddress: string) => {
    router.push(`/auctions/${auctionAddress}`);
  };

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        Auctions
      </Heading>
      {auctionList?.length ? (
        <Box border="2px" borderColor={hoverTrColor} borderRadius="xl" padding="24px 18px">
          <TableContainer w={'full'}>
            <Table>
              <Thead>
                <Tr>
                  <Th>Address</Th>
                  <Th>Link</Th>
                  {/* <Th>To</Th> */}
                  {/* <Th>Gas used</Th> */}
                  {/* <Th>Date</Th> */}
                  {/* <Th isNumeric>Status</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {auctionList?.map((address) => (
                  <Tr _hover={{ bgColor: hoverTrColor }} cursor="pointer">
                    <Td>{address}</Td>
                    <Td>
                      {' '}
                      <Button onClick={() => handleUserClick(address as string)}>Go auction page</Button>
                    </Td>
                    {/* <Td>{getEllipsisTxt(tx?.from.checksum)}</Td>
                    <Td>{getEllipsisTxt(tx?.to?.checksum)}</Td>
                    <Td>{tx.gasUsed.toString()}</Td>
                    <Td>{new Date(tx.blockTimestamp).toLocaleDateString()}</Td>
                    <Td isNumeric>{tx.receiptStatus}</Td> */}
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Address</Th>
                  <Th>Link</Th>
                  {/* <Th>From</Th>
                  <Th>To</Th>
                  <Th>Gas used</Th>
                  <Th>Date</Th>
                  <Th isNumeric>Status</Th> */}
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box>Looks Like you do not have any auctions</Box>
      )}
    </>
  );
};

export default Auctions;
