
import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { database } from 'services/firebase';
import { useAuth } from 'hooks/useAuth';
import { Button } from 'components/Button/index'
import { useTheme } from 'hooks/useTheme';

import illustrationImg from 'assets/images/illustration.svg'
import logoImg from 'assets/images/logo.svg'
import googleIconImg from 'assets/images/google-icon.svg'
import LogoDark from 'assets/images/LogoDarkMode.svg'
import sun from 'assets/images/sun.svg';


import './styles.scss';


export function Home() {
    const history = useHistory();
    const { signInWithGoogle, user } = useAuth();
    const [roomCode, setRoomCode] = useState('');
    const { theme, toggleTheme } = useTheme();

    async function handleCreateRoom() {

        if (!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new');

    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            alert('Room does not exist');
            return;
        }
        if (roomRef.val().endedAt) {
            alert('Room already closed')
            return;
        }

        history.push(`rooms/${roomCode}`);
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
                        <Button onClick={handleCreateRoom} className="create-room">
                            <img src={googleIconImg} alt="Logo do Google" />
                            Crie sua sala com o Google
                        </Button>
                        <div className="separator">
                            ou entre em uma sala
                        </div>
                        <form onSubmit={handleJoinRoom}>
                            <input
                                type="text"
                                placeholder="Digite o código da sala"
                                onChange={event => setRoomCode(event.target.value)}
                                value={roomCode}
                            />
                            <Button type="submit">
                                Entrar na sala
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    )
}