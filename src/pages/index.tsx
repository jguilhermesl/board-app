import styles from '../styles/styles.module.scss'

import Head from 'next/head'
import Image from 'next/image'

import { GetStaticProps } from 'next'
import { useState } from 'react';

import boardUser from '../../public/images/board-user.svg'

import firebase from '../services/firebaseConnection'

type Data = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
}
interface HomeProps{ 
  data: string;
}

export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data))

  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={boardUser} alt="Ferramenta board" width={350} height={280} />

        <section className={styles.callToAction}>
          <h1>Uma ferramenta pra seu dia a dia!</h1>
          <h2>Escreva, planeje e organize-se...</h2>
          <p><span>100% gratuita</span> e online.</p>
        </section>

        <div className={styles.donaters}>
          {donaters.map( item => (
            <img key={item.image} src={item.image} alt="Usuario 1" />
          ))}
        </div>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async() => {

  const donaters = await firebase.firestore().collection('users').get();

  const data = JSON.stringify(donaters.docs.map( item => {
    return {
      id: item.id,
      ... item.data(),
    }
  }))

  return {
    props: {
      data
    },
    revalidate: 60 * 60 // atualiza a cada 60 minutos 
  }
}
