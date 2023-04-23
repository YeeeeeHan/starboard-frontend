import { Box, Container, Flex, HStack } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ColorModeButton, NavBar } from 'components/elements';

const Header = () => {
  return (
    <Box borderBottom="1px" borderBottomColor="chakra-border-color">
      <Container maxW="container.xl" p={'10px'}>
        <Flex align="center" justify="space-between">
          <NavBar />
          <HStack gap={'10px'}>
            <ConnectButton />
            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
