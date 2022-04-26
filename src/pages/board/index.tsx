import React, { useState, FormEvent } from 'react'
import styles from './styles.module.scss';
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'

import { format, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'react-toastify'

import Head from 'next/head'
import Link from 'next/link'

import { SupportButton } from '../../components/SupportButton'
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi'

import firebase from '../../services/firebaseConnection'

type TaskList = {
    id: string;
    created: string | Date;
    createdFormated?: string;
    task: string;
    userId: string;
    name: string;
}

interface BoardProps {
    user: {
        id: string;
        nome: string;
        vip: boolean;
        lastDonate: string | Date;
    }
    data: string;
}

export default function Board({ user, data }: BoardProps) {
    const [input, setInput] = useState('');
    const [tasks, setTasks] = useState<TaskList[]>(JSON.parse(data))

    const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)

    async function handleAddTask(e: FormEvent) {
        e.preventDefault();

        if (input === '') {
            toast.info('Digite uma tarefa.', {
                position: "top-left",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            return
        }

        if (taskEdit) {
            await firebase.firestore().collection('tasks')
                .doc(taskEdit.id)
                .update({
                    task: input,
                })
                .then(() => {
                    let data = tasks;
                    let taskIndex = tasks.findIndex(item => item.id === taskEdit.id);
                    data[taskIndex].task = input

                    setTasks(data);
                    setTaskEdit(null);
                    setInput('')
                    toast.success('Task editada com sucesso!', {
                        position: "top-left",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                })

            return
        }

        await firebase.firestore().collection('tasks')
            .add({
                created: new Date(),
                task: input,
                name: user.nome,
                userId: user.id,
            })
            .then((doc) => {
                toast.success('Task cadastrada com sucesso!', {
                    position: "top-left",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                let data = {
                    id: doc.id,
                    created: new Date(),
                    createdFormated: format(new Date(), 'dd MMMM yyyy'),
                    task: input,
                    userId: user.id,
                    name: user.nome
                }

                setTasks([...tasks, data])
                setInput('')
            })
            .catch(err => {
                alert('Deu erro!')
            })
    }

    async function handleDelete(id: string) {
        await firebase.firestore().collection('tasks').doc(id).delete()
            .then(() => {
                toast.success('Task deletada com sucesso!', {
                    position: "top-left",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                let taskDeleted = tasks.filter(item => {
                    return (item.id !== id)
                })

                setTasks(taskDeleted)
            })
    }

    function handleEdit(task: TaskList) {
        setInput(task.task);
        setTaskEdit(task)
    }

    function handleCancelEdit() {
        setInput('');
        setTaskEdit(null);
    }


    return (
        <>
            <Head>
                <title>Board - Minhas tarefas</title>
            </Head>
            <main className={styles.container}>
                {taskEdit && (
                    <span className={styles.warningText}>
                        Você está editando uma tarefa.
                        <button onClick={handleCancelEdit}><FiX color="#FF3636" /></button>
                    </span>
                )}
                <form onSubmit={handleAddTask} >
                    <input type="text" placeholder="Digite sua tarefa..." value={input} onChange={(e) => setInput(e.target.value)} />
                    <button type="submit"><FiPlus /></button>
                </form>

                <section>
                    <h1>Você tem {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}!</h1>
                    {tasks.map(task => (

                        <article className={styles.taskList} key={task.id}>
                            <div className={styles.boxAction}>
                                <Link href={`/board/${task.id}`}>
                                    <p>{task.task}</p>
                                </Link>
                                <div className={styles.actions}>
                                    <div className={styles.calendar}>
                                        <FiCalendar color="#FFB800" />
                                        <time>{task.createdFormated}</time>
                                    </div>
                                    {user.vip && (
                                        <button className={styles.edit} onClick={() => handleEdit(task)}>
                                            <FiEdit2 />
                                            Editar
                                        </button>
                                    )}
                                    <button className={styles.delete} onClick={() => handleDelete(task.id)}>
                                        <FiTrash color="#FF3636" />
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}

                </section>

            </main>
            {user.vip && (
                <div className={styles.thanks}>
                    <h1>Obrigado por apoiar esse projeto.</h1>
                    <div>
                        <FiClock color="#fff" />
                        <time>
                            Última doação foi há {formatDistance(new Date(user.lastDonate), new Date(), {locale: ptBR})}.
                        </time>
                    </div>
                </div>
            )}

            <SupportButton />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });

    if (!session?.id) {
        // se o user nao tiver logado -> redirecionamento 
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const tasksLoad = await firebase.firestore().collection('tasks')
        .where('userId', '==', session?.id)
        .orderBy('created', 'asc').get();

    const data = JSON.stringify(tasksLoad.docs.map(item => {
        return {
            id: item.id,
            createdFormated: format(item.data().created.toDate(), 'dd MMMM yyyy'),
            ...item.data(),
        }
    }))

    console.log(session?.vip)

    const user = {
        nome: session?.user.name,
        id: session?.id,
        vip: session?.vip,
        lastDonate: session?.lastDonate
    }

    return {
        props: {
            user,
            data
        }
    }
}