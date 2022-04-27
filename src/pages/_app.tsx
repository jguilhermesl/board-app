import { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import '../styles/global.scss'

import { Provider as NextAuthProvider } from 'next-auth/client'

const initialOptions = {
  "client-id": "AQbHJbBidFnxX9hCsdz4TQP0FQ17DSXVl76d6SuTY12_0Rrw1lq9DDKEgD9jDWTod5a7PxgsavoKhXjH",
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
