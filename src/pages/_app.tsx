import { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import '../styles/global.scss'

import { Provider as NextAuthProvider } from 'next-auth/client'

const initialOptions = {
  "client-id": "AdPlXQIXOxOfKuuobt7CamZRs0cr8VzMp7jS2CRhEO8QA7Aen-DbVYd8-ocJ_mroeTVCvKjvPyeKumWS",
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
