import { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'

import '../styles/global.scss'

import { Provider as NextAuthProvider } from 'next-auth/client'

const initialOptions = {
  "client-id": "AZlph7abEeYc7k4V3lJSGBHnzb8qEal5Q11KqE48rs9-DUaoHtbyTtEpyVgV9WUQMlDCDxhLpGgZvf8L",
  currency: "BRL",
  intent: "capture"
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextAuthProvider session={pageProps.session}>
        <PayPalScriptProvider options={initialOptions}>
          <Header />
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </NextAuthProvider>
    </>
  )

}

export default MyApp
