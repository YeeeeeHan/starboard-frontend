import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@rainbow-me/rainbowkit/styles.css';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const RainbowKitWrapper = dynamic(() => import('provider/RainbowKitProvider'), {
  ssr: false,
});

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <RainbowKitWrapper>
          <ChakraProvider resetCSS theme={theme}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
              <Component {...pageProps} />
            </SessionProvider>
          </ChakraProvider>
        </RainbowKitWrapper>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default MyApp;
