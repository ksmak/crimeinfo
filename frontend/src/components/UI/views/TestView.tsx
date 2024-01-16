import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../App";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ResultTest, TestType, UserRole, Question } from "../../../types/types";
import { supabase } from "../../../api/supabase";
import Loading from "../elements/Loading";
import { Alert, Button } from "@material-tailwind/react";

interface TestViewProps {
    testId: string | undefined
}

const TestView = ({ testId }: TestViewProps) => {
    const { session, roles } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [test, setTest] = useState<TestType>({
        id: null,
        title_ru: null,
        title_kk: null,
        title_en: null,
        data: null,
        user_id: null,
    } as TestType);
    const [results, setResults] = useState<ResultTest[]>([]);
    const [openError, setOpenError] = useState(false);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        if (testId) {
            getTest(testId);
        }
        // eslint-disable-next-line
    }, [testId]);

    useEffect(() => {
        setTitle(String(test[`title_${i18n.language}` as keyof typeof test]));
        const questions = test.data && test.data[`test_${i18n.language}` as keyof typeof test.data];
        if (questions) {
            setQuestions(questions);
        } else {
            setQuestions([]);
        }
    }, [test, i18n.language])

    const getTest = async (testId: string) => {
        const { data } = await supabase
            .from('tests')
            .select()
            .or(`and(id.eq.${testId}, is_active.eq.true), and(id.eq.${testId}${session?.user.id ? ', user_id.eq.' + session.user.id : ''})`)
            .single();
        if (data) {
            const prundedData = data as TestType;
            setTest(prundedData);
            const questions = prundedData.data && prundedData.data[`test_${i18n.language}` as keyof typeof prundedData.data];
            if (questions) {
                const newResults: ResultTest[] = questions.map((q, i) => {
                    return ({
                        question: String(i + 1),
                        answers: q.answers ? new Array(q.answers.length).fill(false) : [],
                    })
                });
                setResults(newResults);
            }
        }
    }

    const handleSaveTest = async () => {
        setError('');
        setOpenError(false);
        // check
        for (let i = 0; i < results.length; i++) {
            const checker = results[i].answers.every(a => a === false);
            if (checker && !results[i].own_answer) {
                setError(t('errorCompleteTest'));
                setOpenError(true);
                return;
            }
        }
        const { error } = await supabase
            .from('test_results')
            .insert({
                test_id: test.id,
                data: { results: results }
            });
        if (error) {
            setError(error.message);
            setOpenError(true);
            return;
        }
        navigate('/test_success');
    }

    return (
        <div className="w-full  container mx-auto p-5" >
            <div className="flex flex-row justify-end py-4 pr-5">
                {roles.includes(UserRole.admin) || (roles.includes(UserRole.test_edit) && test.user_id === session?.user.id)
                    ? <Button
                        className="bg-primary-500 mr-3"
                        size="sm"
                        onClick={() => navigate(`/test_result/${test.id}`)}
                    >
                        {t('results')}
                    </Button>
                    : null}
                {roles.includes(UserRole.admin) || (roles.includes(UserRole.test_edit) && test.user_id === session?.user.id)
                    ? <Button
                        className="bg-primary-500 mr-3"
                        size="sm"
                        onClick={() => navigate(`/tests/edit/${test.id}`)}
                    >
                        {t('edit')}
                    </Button>
                    : null}
            </div>
            {test.id && results.length > 0
                ? <div className="flex flex-col">
                    {!test.is_active ? <div className="text-red-400 font-bold px-5">
                        {t('notActive')}
                    </div> : null}
                    <div className="text-2xl font-bold text-primary-500 self-center">
                        {title}
                    </div>
                    {questions
                        ? questions.map((question, questionIndex) => {
                            const questionVal = String(questionIndex + 1);
                            const questionTitle = `${questionIndex + 1}. ${String(question.title)}`;
                            const inputType = question.multyple ? 'checkbox' : 'radio';
                            const handleOnChangeOwnAnswer = (e: ChangeEvent<HTMLInputElement>) => {
                                const nextResults = results.map(r => {
                                    if (r.question === questionVal) {
                                        return {
                                            question: r.question,
                                            answers: r.answers,
                                            own_answer: e.target.value
                                        };
                                    } else {
                                        return r;
                                    }
                                })
                                setResults(nextResults);
                            }
                            const answerElements = question.answers ? question.answers.map((a, answerIndex) => {
                                const answerTitle = a;
                                const id = `id_${questionIndex}_${answerIndex}`;
                                const handleOnChange = (position: number) => {
                                    const nextResults = results.map(r => {
                                        if (r.question === questionVal) {
                                            if (inputType === 'checkbox') {
                                                const nextAnswers = r.answers ? r.answers.map((a, i) => i === position ? !a : a) : [];
                                                return {
                                                    question: r.question,
                                                    answers: nextAnswers,
                                                }
                                            } else {
                                                const nextAnswers = r.answers ? r.answers.map((a, i) => i === position ? true : false) : [];
                                                return {
                                                    question: r.question,
                                                    answers: nextAnswers,
                                                }
                                            }
                                        } else {
                                            return r;
                                        }
                                    })
                                    setResults(nextResults);
                                }

                                return (
                                    <div className="text-blue-gray-900" key={answerIndex}>
                                        <input
                                            id={id}
                                            type={inputType}
                                            onChange={() => handleOnChange(answerIndex)}
                                            checked={
                                                results.length >= 0
                                                && results[questionIndex].answers
                                                && results[questionIndex].answers.length >= 0
                                                && results[questionIndex].answers[answerIndex]}
                                        />
                                        <label htmlFor={id} className="mx-2">{answerTitle}</label>
                                    </div>
                                )
                            }) : null;
                            return (
                                <div className="text-blue-gray-900" key={questionIndex}>
                                    <div className="text-md font-sans  mt-4">
                                        {questionTitle}
                                    </div>
                                    {answerElements}
                                    {question.own_answer
                                        ? <div>
                                            <label htmlFor={`own_answer_${questionIndex}`} className="mx-2">{t('ownAnswer')}</label>
                                            <input className="w-full border-2 border-blue-gray-100 rounded-md" id={`own_answer_${questionIndex}`} type="text" onChange={handleOnChangeOwnAnswer} />
                                        </div>
                                        : null
                                    }
                                </div>
                            )
                        })
                        : null
                    }
                    <Alert className="bg-red-500" open={openError} onClose={() => setOpenError(false)}>{error ? error : t('error')}</Alert>
                    <div className="flex flex-row justify-center py-4 pr-5">
                        <Button
                            className="bg-primary-500 mr-3"
                            size="md"
                            onClick={() => handleSaveTest()}
                        >
                            {t('complete')}
                        </Button>
                    </div>
                </div>
                : <Loading />}
        </div>
    )
}

export default TestView;