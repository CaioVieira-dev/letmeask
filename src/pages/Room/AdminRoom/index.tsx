import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { Question } from 'components/Question'
import { useRoom } from 'hooks/useRoom';
import { database } from 'services/firebase';
import { Button } from 'components/Button';
import { RoomCode } from 'components/RoomCode';

import logoImg from 'assets/images/logo.svg';
import deleteImg from 'assets/images/delete.svg'
import checkImg from 'assets/images/check.svg'
import answerImg from 'assets/images/answer.svg'
import menuBarsImg from 'assets/images/menu.svg';

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
    const barsImg = useRef<HTMLImageElement>(null);



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
            menuRef.current.style.transform = "translateY(-300px)";
        } else {
            barsImg.current.style.display = "none";
            menuRef.current.style.transform = "translateY(0)";
        }
    }

    const dropdownController = (e) => {
        console.log("funfo")
        if (document.body.clientWidth <= 768) { //media query
            if (e.code === 'Escape') {
                toggleMenu();
            }
        }
    }
    useEffect(() => {
        document.addEventListener('keydown', (e) => dropdownController(e))
        return () => {
            document.removeEventListener('keydown', (e) => dropdownController(e))
        }
    }, [])


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img onClick={() => history.push('/')} src={logoImg} alt="Letmeask" />
                    <img ref={barsImg} id="menuBar" onClick={toggleMenu} src={menuBarsImg} alt="Menu" />
                    <div ref={menuRef}>
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