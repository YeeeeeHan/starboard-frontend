import { Box, Grid, Heading } from '@chakra-ui/react';
import { useEvmWalletNFTs } from '@moralisweb3/next';
import { NFTCard } from 'components/modules';
import { useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const NFTBalances = () => {
  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();
  const {
    data: nfts,
    error,
    total,
    isFetching,
  } = useEvmWalletNFTs({
    address: userAddress as string,
    chain: chain?.id,
  });

  useEffect(() => console.log('nfts: ', nfts), [nfts]);
  useEffect(() => console.log('total: ', total), [total]);
  useEffect(() => console.log('isFetching: ', isFetching), [isFetching]);
  useEffect(() => console.log('error: ', error), [error]);
  useEffect(() => console.log('chain?.id: ', chain?.id));
  useEffect(() => console.log('user: ', userAddress));

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        NFT Balances
      </Heading>
      {nfts?.length ? (
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {nfts.map((nft, key) => (
            <NFTCard nft={nft} key={key} />
          ))}
        </Grid>
      ) : (
        <Box>Looks Like you do not have any NFTs</Box>
      )}
    </>
  );
};

export default NFTBalances;
