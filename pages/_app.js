import { ThemeProvider } from '../components/theme-provider';
import '../globals.css';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
    <Head>
      <title>Hitster Digital</title>
      <meta name="description" content="A music game built with Next.js" />
      <link rel="icon" type="image/x-icon" href="/favicon.png" />
    </Head>
    <SessionProvider session={session}>
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
    </SessionProvider>
    </>
  );
}

export default MyApp;