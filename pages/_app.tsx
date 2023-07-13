import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <main className={inter.className}>
        <Head>
          <title>Votastic</title>
          <meta
            name="description"
            content="Aplikasi voting online indonesia dibuat oleh @aafrzl_"
          />
          <link
            rel="icon"
            href="/favicon.ico"
          />
        </Head>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
