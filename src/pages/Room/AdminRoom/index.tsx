import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import { Question } from 'components/Question'
import { useRoom } from 'hooks/useRoom';
import { database } from 'services/firebase';
import { Button } from 'components/Button';
import { RoomCode } from 'components/RoomCode';

import logoImg from 'assets/images/logo.svg';
import deleteImg from 'assets/images/delete.svg'
import checkImg from 'assets/images/check.svg'
import answerImg from 'assets/images/answer.svg'

import sun from 'assets/images/sun.svg';


import { useTheme } from 'hooks/useTheme';
import LogoDark from 'assets/images/LogoDarkMode.svg'


import '../styles.scss';


type RoomParams = {
    id: string;
}


export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();

    const roomId = params.id;

    const { questions, title } = useRoom(roomId)
    const menuRef = useRef<HTMLDivElement>(null);
    const barsImg = useRef(null);
    const closeMenuRef = useRef<HTMLSpanElement>(null);
    const { theme, toggleTheme } = useTheme();



    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })
        history.push('/')
    }
    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }
    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isAnswered: true })
    }
    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ isHighlighted: true })
    }

    function toggleMenu() {

        if (barsImg.current?.style.display === "none") {
            barsImg.current.style.display = "block";
            closeMenuRef.current.style.display = "none";
            menuRef.current.style.transform = "translateY(-300px)";
        } else {
            barsImg.current.style.display = "none";
            closeMenuRef.current.style.display = "block";
            menuRef.current.style.transform = "translateY(0)";
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


    return (
        <div id="page-room" className={theme === 'dark' ? 'dark' : ''}>
            <header>
                <div className="content">
                    <div>
                        <img onClick={() => history.push('/')} src={theme === 'dark' ? LogoDark : logoImg} alt="Letmeask" />
                        <div onClick={toggleTheme} className="themeSwitch">
                            <img className={theme === 'dark' ? 'dark' : ''} id="sun" src={sun} alt="Tema claro" />

                            <svg className={theme === 'dark' ? 'dark' : ''} id="moon" xmlns="http://www.w3.org/2000/svg" width="29.944" height="29.944" viewBox="0 0 29.944 29.944">
                                <path id="Icon_feather-moon" data-name="Icon feather-moon" d="M31.5,19.185A13.5,13.5,0,1,1,16.815,4.5,10.5,10.5,0,0,0,31.5,19.185Z" transform="translate(-3.056 -3)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                            </svg>
                        </div>
                    </div>
                    <span onClick={toggleMenu} ref={closeMenuRef} >X</span>
                    <svg ref={barsImg} id="menuBar" onClick={toggleMenu} xmlns="http://www.w3.org/2000/svg" width="30" height="21" viewBox="0 0 30 21">
                        <g id="Icon_feather-menu" data-name="Icon feather-menu" transform="translate(-3 -7.5)">
                            <path id="Caminho_7" data-name="Caminho 7" d="M4.5,18h27" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                            <path id="Caminho_8" data-name="Caminho 8" d="M4.5,9h27" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                            <path id="Caminho_9" data-name="Caminho 9" d="M4.5,27h27" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
                        </g>
                    </svg>                    <div ref={menuRef}>
                        <RoomCode code={roomId} />
                        <Button
                            isOutlined
                            onClick={handleEndRoom}
                        >Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map((question) => {
                        return (
                            <Question
                                content={question.content}
                                author={question.author}
                                isHighlighted={question.isHighlighted}
                                isAnswered={question.isAnswered}
                                key={question.id}>
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}>
                                            <img src={answerImg} alt="Dar destaque a pergunta" />
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>

                        )
                    })}
                </div>
            </main>
        </div>
    )
}