import { FormEvent, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Button } from 'components/Button';
import { RoomCode } from 'components/RoomCode';
import { Question } from 'components/Question';
import { ToastContainer, toast } from 'react-toastify';

import { useAuth } from 'hooks/useAuth';
import { useRoom } from 'hooks/useRoom';

import { database } from 'services/firebase';

import logoImg from 'assets/images/logo.svg';
import logoDark from 'assets/images/LogoDarkMode.svg'
import sun from 'assets/images/sun.svg';


import 'react-toastify/dist/ReactToastify.min.css';
import '../styles.scss';
import useWindowDimensions from 'hooks/useWindowDimensions';
import { useTheme } from 'hooks/useTheme';

type RoomParams = {
    id: string;
}


export function Room() {
    const { user } = useAuth();
    const history = useHistory();
    const [newQuestion, setNewQuestion] = useState('')
    const params = useParams<RoomParams>();

    const roomId = params.id;

    const { questions, title } = useRoom(roomId);

    const menuRef = useRef<HTMLDivElement>(null);
    const barsImg = useRef<SVGSVGElement>(null);

    const closeMenuRef = useRef<HTMLSpanElement>(null);
    const { theme, toggleTheme } = useTheme()
    const { width } = useWindowDimensions();


    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            toast.error('Você precisa estar conectado', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return;
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false,
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)

        setNewQuestion('');
        toast.success('Pergunta enviada com sucesso!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        if (likeId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id,
            })
        }


    }


    function toggleMenu() {
        if (barsImg.current?.style.display === "none") {
            barsImg.current.style.display = "block";
            menuRef.current.style.transform = "translateY(-300px)";
            closeMenuRef.current.style.display = "none";
        } else {
            barsImg.current.style.display = "none";
            menuRef.current.style.transform = "translateY(0px)";
            closeMenuRef.current.style.display = "block";

        }
    }

    useEffect(() => {
        const dropdownController = (e) => {
            if (document.body.clientWidth <= 768) { //media query
                if (e.code === 'Escape') {
                    toggleMenu();
                }
            }
        }
        document.addEventListener('keydown', (e) => dropdownController(e))
        return () => {
            document.removeEventListener('keydown', (e) => dropdownController(e))
        }
    }, [])


    useEffect(() => {
        if (width > 768) {
            if (barsImg.current?.style.display === "block") {
                barsImg.current.style.display = "none";
                closeMenuRef.current.style.display = "none";
                menuRef.current.style.transform = "translateY(0px)";
            }
        } else {
            if (menuRef.current?.style.transform === "translateY(0px)") {
                menuRef.current.style.transform = "translateY(-300px)";
                closeMenuRef.current.style.display = "none";
                barsImg.current.style.display = "block";
            }
        }

    }, [width])

    return (
        <div id="page-room" className={theme === 'dark' ? 'dark' : ''}>
            <header>
                <div className="content">
                    <div>
                        <img onClick={() => history.push('/')} src={theme === 'dark' ? logoDark : logoImg} alt="Letmeask" />
                        <div onClick={toggleTheme} className="themeSwitch">
                            <img className={theme === 'dark' ? 'dark' : ''} id="sun" src={sun} alt="Tema claro" />
                            <svg className={theme === 'dark' ? 'dark' : ''} id="moon" xmlns="http://www.w3.org/2000/svg" width="29.944" height="29.944" viewBox="0 0 29.944 29.944">
                                <path id="Icon_feather-moon" data-name="Icon feather-moon" d="M31.5,19.185A13.5,13.5,0,1,1,16.815,4.5,10.5,10.5,0,0,0,31.5,19.185Z" transform="translate(-3.056 -3)" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                            </svg>
                        </div>
                    </div>

                    <span ref={closeMenuRef} onClick={toggleMenu} className="closeMenu">X</span>

                    <svg ref={barsImg} id="menuBar" onClick={toggleMenu} xmlns="http://www.w3.org/2000/svg" width="30" height="21" viewBox="0 0 30 21">
                        <g id="Icon_feather-menu" data-name="Icon feather-menu" transform="translate(-3 -7.5)">
                            <path id="Caminho_7" data-name="Caminho 7" d="M4.5,18h27" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                            <path id="Caminho_8" data-name="Caminho 8" d="M4.5,9h27" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                            <path id="Caminho_9" data-name="Caminho 9" d="M4.5,27h27" fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                        </g>
                    </svg>

                    <div ref={menuRef} className={theme === 'dark' ? 'dark' : ''}>
                        <RoomCode code={roomId} />
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>

                        )
                            :
                            (
                                <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                            )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

                <div className="question-list">
                    {questions.map((question) => {
                        return (
                            <Question
                                content={question.content}
                                author={question.author}
                                isHighlighted={question.isHighlighted}
                                isAnswered={question.isAnswered}
                                key={question.id} >
                                {!question.isAnswered && (
                                    <button
                                        className={`like-button ${question.likeId ? 'liked' : ''}`}
                                        type="button"
                                        aria-label="Marcar como gostei"
                                        onClick={() => handleLikeQuestion(question.id, question.likeId)}>
                                        {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>)}
                            </Question>

                        )
                    })}
                </div>
            </main>
            <ToastContainer />
        </div>
    )
}