import { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import '../styles/global.scss'

import { Provider as NextAuthProvider } from 'next-auth/client'

const initialOptions = {
  "client-id": "AR0k6fA8ty2_0omr5zKy2aVt4LnPFLIKg7k8_95ThrQeFDyK2XlkPupy2sy_QPXVicZ-NIJR5k7Dr2j5",
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
          <ToastContainer />
        </PayPalScriptProvider>
      </NextAuthProvider>
    </>
  )

}

export default MyApp
