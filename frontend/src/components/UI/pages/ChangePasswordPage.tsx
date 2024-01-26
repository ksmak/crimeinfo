import { Alert, Button, Card, CardBody, Input } from "@material-tailwind/react";
import LanguagePanel from "../panels/LanguagePanel";
import Loading from "../elements/Loading";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuth } from "../../../lib/auth";
import instance from "../../../api/instance";
import axios from "axios";
import { useNavigate } from "react-router";

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpdatePassword = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await instance.post(`${process.env.REACT_APP_API_HOST}/auth/users/change_password/`, {
                new_password: password
            })
            setLoading(false);
            setSuccess(t('successUpdatePassword'));
            setError('');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.new_password);
            } else {
                setError(String(error));
            }
            setLoading(false);
            setSuccess('');
        }
    }

    return (
        <div className="container mx-auto flex flex-col justify-center items-center mt-24">
            <LanguagePanel />
            <Alert className="bg-primary-500 mt-4" open={success !== ''} onClose={() => setSuccess('')}>{success}</Alert>
            <Alert className="bg-red-400 mt-4" open={error !== ''} onClose={() => setError('')}>{error}</Alert>
            {isAuthenticated
                ? <Card className="w-96 mt-2">
                    <CardBody>
                        <div className="flex flex-col w-full">
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
                            <div className="flex flex-col justify-center gap-2">
                                <Button
                                    className="bg-primary-500"
                                    onClick={handleUpdatePassword}
                                >
                                    {t('save')}
                                </Button>
                                <Button
                                    className="bg-white border-primary-500 text-primary-500"
                                    onClick={() => navigate('/profile')}
                                >
                                    {t('close')}
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                : <Alert className="bg-red-400 mt-4">{t('errorAccess')}</Alert>}
            {loading ? <Loading /> : null}
        </div>
    )
}

export default ChangePasswordPage;