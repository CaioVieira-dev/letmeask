
import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { useAuth } from 'hooks/useAuth';
import { database } from 'services/firebase'
import { Button } from 'components/Button'

import illustrationImg from 'assets/images/illustration.svg'
import logoImg from 'assets/images/logo.svg'
import LogoDark from 'assets/images/LogoDarkMode.svg'
import sun from 'assets/images/sun.svg';

import './styles.scss';
import { useTheme } from 'hooks/useTheme';


export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');
    const { theme, toggleTheme } = useTheme();


    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/rooms/${firebaseRoom.key}`)
    }



    return (
        <>
            <div onClick={toggleTheme} className="themeSwitch">
                <img className={theme === 'dark' ? 'dark' : ''} id="sun" src={sun} alt="Tema claro" />
                <svg className={theme === 'dark' ? 'dark' : ''} id="moon" xmlns="http://www.w3.org/2000/svg" width="29.944" height="29.944" viewBox="0 0 29.944 29.944">
                    <path id="Icon_feather-moon" data-name="Icon feather-moon" d="M31.5,19.185A13.5,13.5,0,1,1,16.815,4.5,10.5,10.5,0,0,0,31.5,19.185Z" transform="translate(-3.056 -3)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                </svg>
            </div>
            <div id="page-auth" className={theme === 'dark' ? 'dark' : ''}>
                <aside>
                    <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                    <strong>Crie salas de Q&amp;A ao-vivo</strong>
                    <p>Tire duvidas da sua audiência em tempo real</p>
                </aside>
                <main>
                    <div className="main-content">
                        <img src={theme === 'dark' ? LogoDark : logoImg} alt="Letmeask" />
                        <h2>Criar uma nova sala</h2>
                        <form onSubmit={handleCreateRoom} >
                            <input
                                type="text"
                                placeholder="Nome da sala"
                                onChange={event => setNewRoom(event.target.value)}
                                value={newRoom}
                            />
                            <Button type="submit">
                                Criar sala
                            </Button>
                        </form>
                        <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                    </div>
                </main>
            </div>
        </>
    )
}