import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { IQuestion, ITestDataRow, ITestResults, ITest, UserRole } from "../../../types/types";
import {
    Chart,
    BarElement,
    CategoryScale,
    LinearScale,
    Legend,
    Title,
    Tooltip
} from 'chart.js';
import { Alert, Button } from "@material-tailwind/react";
import { Bar } from "react-chartjs-2";
import Loading from "../elements/Loading";
import { useAuth } from "../../../lib/auth";
import instance from "../../../api/instance";
import axios from "axios";

interface TestResultViewProps {
    testId: string | undefined
}

const TestResultView = ({ testId }: TestResultViewProps) => {
    const { roles } = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [test, setTest] = useState<ITest>({
        id: null,
        title_ru: null,
        title_kk: null,
        title_en: null,
        data: null,
        user_id: null,
    } as ITest);
    const [testResults, setTestResults] = useState<ITestResults[]>([]);
    const [testData, setTestData] = useState<ITestDataRow[]>([]);
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [participants, setParticipants] = useState('');

    useEffect(() => {
        if (testId) {
            getTest(testId);
            getResults(testId);

        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setParticipants(`${t('participantCount')}: ${testResults.length}`);
        setTitle(String(test[`title_${i18n.language}` as keyof typeof test]));
        const questions = test.data && test.data[`test_${i18n.language}` as keyof typeof test.data];
        if (questions) {
            setQuestions(questions);
        } else {
            setQuestions([]);
        }
    }, [test, i18n.language, testResults.length, t])

    useEffect(() => {
        calcTestResults();
        // eslint-disable-next-line
    }, [questions, testResults]);

    const getTest = async (testId: string) => {
        axios.get(`${process.env.REACT_APP_API_HOST}/api/tests/${testId}/`)
            .then(res => {
                setTest(res.data);
            })
            .catch(err => {
                // console.log(err);
            })
    }

    const getResults = async (testId: string) => {
        axios.get(`${process.env.REACT_APP_API_HOST}/api/test_results/get_by_test?test_id=${testId}`)
            .then(res => {
                setTestResults(res.data);
            })
            .catch(err => {
                // console.log(err);
            })
    }

    const calcTestResults = () => {
        let arr: ITestDataRow[] = [];
        questions.forEach((q, index) => {
            const title = q.title;
            const labels = q.answers ? q.answers : [];
            const res = new Array(q.answers?.length).fill(0);
            let own_answers: string[] = [];
            testResults.forEach(tr => {
                tr.data?.results.forEach(t => {
                    if (t.question === String(index + 1)) {
                        t.answers.forEach((r, i) => {
                            if (r) {
                                res[i]++;
                            }
                        });
                        if (t.own_answer) {
                            if (!(t.own_answer in own_answers)) {
                                own_answers.push(t.own_answer);
                            }
                        }
                    }
                })
            });
            const row: ITestDataRow = {
                title: title,
                labels: labels,
                data: res,
                own_answers: own_answers
            };
            arr.push(row);
        });
        setTestData(arr);
    }

    Chart.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    return (
        <div className="mt-4 p-5 flex flex-col">
            {roles.some(item => item.role === UserRole.admin || item.role === UserRole.test_edit)
                ? <div>
                    <div className="flex flex-row justify-end py-4 pr-5">
                        <Button
                            className=""
                            size="sm"
                            variant="outlined"
                            color="blue"
                            onClick={() => navigate(-1)}
                        >
                            {t('close')}
                        </Button>
                    </div>
                    {test && testResults.length > 0
                        ? <div>
                            <div className="text-2xl font-bold text-primary-500 self-center">{title}</div>
                            <div className="mt-4 text-primary-500">{participants}</div>
                            {testData.map((d, i) => {
                                const data = {
                                    labels: d.labels,
                                    datasets: [{
                                        label: d.title,
                                        data: d.data,
                                        backgroundColor: [
                                            'rgb(153, 102, 255)'
                                        ],
                                        borderColor: [
                                            'rgb(153, 102, 255)'
                                        ],
                                        borderWidth: 1
                                    }]
                                };
                                return (
                                    <div key={i}>
                                        <div className="text-primary-500 mt-5">{i + 1}. {d.title}</div>
                                        <Bar data={data} />
                                        {d.own_answers.length > 0
                                            ? <ul className="text-primary-500">{t('ownAnsers')}:
                                                {d.own_answers.map((a, i) => <li key={i} className="text-blue-gray-800">{a}</li>)}
                                            </ul>
                                            : null}
                                    </div>
                                );
                            })}
                        </div>
                        : <Loading />}

                </div>
                : <Alert className="bg-red-500 my-4">{t('errorAccess')}</Alert>
            }
        </div>
    )
}


export default TestResultView;