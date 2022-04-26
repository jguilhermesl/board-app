import React, { useState } from 'react'
import styles from './styles.module.scss';
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'

import { PayPalButtons } from '@paypal/react-paypal-js'

// CLIENT ID = Aba8gEitHYoh-JhOprWNGIt3gMtakyaOdmFe4Hs_mHjFXoA2q_zt9o4GXg-gV57fwH2eYYYnQsj9ShcV
// <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

import Head from 'next/head'
import Link from 'next/link'

import { SupportButton } from '../../components/SupportButton'
import { toast } from 'react-toastify'

import Image from 'next/image'
import rocketImg from '../../../public/images/rocket.svg'
import firebase from '../../services/firebaseConnection'

interface DonateProps {
    user: {
        nome: string,
        id: string,
        image: string
    }
}

export default function Donate({ user }: DonateProps) {

    const [vip, setVip] = useState(false)

    async function handleSaveDonate() {
        await firebase.firestore().collection('users')
            .doc(user.id)
            .set({
                donate: true,
                lastDonate: new Date(),
                image: user.image
            })
            .then(() => {
                setVip(true)
            })
    }

    return (
        <>
            <Head>
                <title>Board - Seja um apoiador</title>
            </Head>
            <main className={styles.container}>
                <Image src={rocketImg} alt="Seja apoiador" />

                {vip && (
                    <div className={styles.vip}>
                        <img src={user.image} alt="Foto de perfil do usuario" />
                        <p>Parabéns, agora você é um novo apoiador.</p>
                    </div>
                )}

                <h1>Seja um apoiador deste projeto 🏆️</h1>
                <h3>Contribua com apenas <span>R$1, 00</span>.</h3>
                <strong>Apareça na nossa home, tenha funcionalidades exclusivas.</strong>

                <PayPalButtons
                    createOrder={ (data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '1'
                                }
                            }]
                        })
                    }}
                    onApprove={ (data, actions) => {
                        return actions.order.capture().then( (details) => {
                            toast.success('Compra aprovada!', {
                                position: "top-left",
                                autoClose: 4000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                });
                            handleSaveDonate();
                        })
                    }}
                />
            </main>

        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session?.id) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const user = {
        nome: session?.user.name,
        id: session?.id,
        image: session?.user.image
    }

    return {
        props: {
            user
        }
    }
}