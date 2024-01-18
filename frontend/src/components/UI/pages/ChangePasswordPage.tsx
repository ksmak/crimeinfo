import { Alert, Button, Card, CardBody, Input } from "@material-tailwind/react";
import LanguagePanel from "../panels/LanguagePanel";
import Loading from "../elements/Loading";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../lib/auth";
import instance from "../../../api/instance";

const ChangePasswordPage = () => {
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        setMessage('');
        setError(false);
        setSuccess(false);
        setLoading(true);
        instance.post(`${process.env.REACT_APP_API_HOST}/users/change_password/`, {
            password: password
        })
            .then(res => {
                setMessage(t('successUpdatePassword'));
                setSuccess(true);
                setInterval(() => navigate('/'), 2000);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setMessage(err.message);
                setError(true);
            })
    }

    return (
        <div className="container mx-auto flex flex-col justify-center items-center mt-24">
            <LanguagePanel />
            {isAuthenticated
                ? <Card className="w-96">
                    <CardBody>
                        <div className="flex flex-col w-full">
                            <div className="mb-5 text-red-600">
                                {t('newPassword')}
                            </div>
                            <div className="mb-5">
                                <Input
                                    type="password"
                                    name="password"
                                    value={password}
                                    label={t('newPassword')}
                                    crossOrigin=""
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="self-center">
                                <Button
                                    className="bg-primary-500"
                                    onClick={handleUpdatePassword}
                                >
                                    {t('save')}
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                : <Alert className="bg-red-400 mt-4">{t('errorAccess')}</Alert>}
            <Alert className="bg-primary-500 mt-4" open={success} onClose={() => setSuccess(false)}>{message}</Alert>
            <Alert className="bg-red-400 mt-4" open={error} onClose={() => setError(false)}>{message}</Alert>
            {loading ? <Loading /> : null}
        </div>
    )
}

export default ChangePasswordPage;