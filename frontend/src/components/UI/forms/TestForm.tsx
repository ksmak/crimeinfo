import { useEffect, useState } from "react";
import { ITest, UserRole } from "../../../types/types";
import { Alert, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import InputField from "../elements/InputField";
import TextareaField from "../elements/TextareaField";
import { useNavigate } from "react-router";
import Loading from "../elements/Loading";
import { useAuth } from "../../../lib/auth";
import instance from "../../../api/instance";


interface TestFormProps {
    testId: string | undefined
}

const TestForm = ({ testId }: TestFormProps) => {
    const { roles } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isSuccesSave, setIsSuccesSave] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');
    const [test, setTest] = useState<ITest>({
        id: null,
        is_active: false,
        title_ru: null,
        title_kk: null,
        title_en: null,
        data: null,
        user_id: null,
    } as ITest);
    const [jsonData, setJsonData] = useState('');

    useEffect(() => {
        if (testId) {
            getTest(testId);
        }
        // eslint-disable-next-line 
    }, []);

    const getTest = async (testId: string) => {
        instance.get(`${process.env.REACT_APP_API_HOST}/tests/${testId}/`)
            .then(res => {
                setTest(res.data);
                setJsonData(res.data.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleChangeJson = (e: any) => {
        try {
            const json = JSON.parse(e.target.value);
            setJsonData(json);
        } catch (e) {
            console.log(e);
        }
    }

    const handleSave = async () => {
        let newId = '';
        setErrors('');
        setIsError(false);
        setIsSuccesSave(false);
        setLoading(true);
        if (test?.id) {
            instance.put(`${process.env.REACT_APP_API_HOST}/tests/`, test)
                .then(res => {
                    setTest(res.data);
                    setLoading(false);
                    setIsError(false);
                    setIsSuccesSave(true);
                    setInterval(() => setIsSuccesSave(false), 3000);

                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                    setErrors(err.message);
                    setIsError(true);
                    setIsSuccesSave(false);

                })
        } else {
            instance.post(`${process.env.REACT_APP_API_HOST}/tests/`, test)
                .then(res => {
                    setTest(res.data);
                    newId = res.data.id;
                    setLoading(false);
                    setIsError(false);
                    setIsSuccesSave(true);
                    setInterval(() => setIsSuccesSave(false), 3000);
                    navigate(`/tests/edit/${newId}`);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                    setErrors(err.message);
                    setIsError(true);
                    setIsSuccesSave(false);
                })
        }
    }

    const handleClose = () => {
        navigate(-1);
    }

    return (
        <div className="p-5">
            {roles.some(item => item.role === UserRole.admin || item.role === UserRole.test_edit)
                ? <form method="post" action="/item" className="mt-4">
                    <div className="flex flex-row justify-end py-4">
                        <Button
                            className="bg-blue-400 mr-4"
                            size="sm"
                            onClick={handleSave}
                        >
                            {t('save')}
                        </Button>
                        <Button
                            className=""
                            variant="outlined"
                            size="sm"
                            color="blue"
                            onClick={handleClose}
                        >
                            {t('close')}
                        </Button>
                    </div>
                    <Alert className="bg-blue-400 mb-4" open={isSuccesSave} onClose={() => setIsSuccesSave(false)}>{t('successSave')}</Alert>
                    <Alert className="bg-red-500 mb-4" open={isError} onClose={() => setIsError(false)}>{errors}</Alert>
                    <div className="mb-4 w-fit">
                        <label
                            htmlFor="is_active"
                            className="text-blue-400 bold mr-1"
                        >
                            {t('active')}
                        </label>
                        <input
                            id="is_active"
                            type='checkbox'
                            name='is_active'
                            checked={test.is_active}
                            onChange={(e) => setTest({ ...test, is_active: !test.is_active })}
                            required={true}
                        />
                    </div>
                    <div className="w-full bg-white mb-4">
                        <InputField
                            type='text'
                            name='title_kk'
                            label={t('title_kk')}
                            value={test.title_kk ? test.title_kk : ''}
                            onChange={(e) => setTest({ ...test, title_kk: e.target.value })}
                            required={true}
                        />
                    </div>

                    <div className="w-full bg-white mb-4">
                        <InputField
                            type='text'
                            name='title_ru'
                            label={t('title_ru')}
                            value={test.title_ru ? test.title_ru : ''}
                            onChange={(e) => setTest({ ...test, title_ru: e.target.value })}
                            required={true}
                        />
                    </div>

                    <div className="w-full bg-white mb-4">
                        <InputField
                            type='text'
                            name='title_en'
                            label={t('title_en')}
                            value={test.title_en ? test.title_en : ''}
                            onChange={(e) => setTest({ ...test, title_en: e.target.value })}
                            required={true}
                        />
                    </div>
                    <div className="w-full bg-white mb-4">
                        <TextareaField
                            rows={20}
                            name='data'
                            label="JSON"
                            value={jsonData ? JSON.stringify(jsonData, null, 4) : ''}
                            onChange={handleChangeJson}
                            required={true}
                        />
                    </div>
                    {loading ? <Loading /> : null}
                </form>
                : <Alert className="bg-red-500 my-4">{t('errorAccess')}</Alert>}
        </div>
    )
}

export default TestForm;