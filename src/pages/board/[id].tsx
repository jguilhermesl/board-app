import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import firebase from '../../services/firebaseConnection'
import { format } from 'date-fns'

import Head from 'next/head'
import Link from 'next/link'

import { FiCalendar, FiArrowLeft } from 'react-icons/fi'

import styles from './task.module.scss'

type Task = {
    id: string,
    created: string | Date;
    createdFormated?: string;
    task: string;
    userId: string;
    name: string;
}

interface TaskListProps {
    data: string;
}

export default function Task({ data }: TaskListProps) {
    const task = JSON.parse(data) as Task;

    return (
        <>
            <Head>
                <title>Board - Detalhes da sua tarefa</title>
            </Head>
            <article className={styles.box}>
                <div className={styles.info}>
                    <FiCalendar />
                    <span>Tarefa criada:</span>
                    <time>{task.createdFormated}</time>
                </div>
                <p>{task.task}</p>
                <Link href="/board"><FiArrowLeft className={styles.iconBack} /></Link>
            </article>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req });
    const { id } = params

    if (!session?.vip) {
        return {
            redirect: {
                destination: '/board',
                permanent: false
            }
        }
    }

    const data = await firebase.firestore().collection('tasks')
        .doc(String(id))
        .get()
        .then((snapshot) => {
            const data = {
                id: snapshot.id,
                created: snapshot.data().created,
                createdFormated: format(snapshot.data().created.toDate(), 'dd MMMM yyyy'),
                task: snapshot.data().task,
                userId: snapshot.data().user,
                name: snapshot.data().name
            }

            return JSON.stringify(data);
        })
        .catch( () => {
            return {}
        })

        if(Object.keys(data).length === 0){
            return {
                redirect: {
                    destination: '/board',
                    permanent: false
                }
            }
        }

    return {
        props: {
            data
        }
    }
}