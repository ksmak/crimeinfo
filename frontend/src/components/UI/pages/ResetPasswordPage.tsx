import { Alert, Button, Card, CardBody, Input } from "@material-tailwind/react";
import LanguagePanel from "../panels/LanguagePanel";
import { useState } from "react";
import Loading from "../elements/Loading";
import { useNavigate } from "react-router";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_HOST}/auth/reset_password/`, {
                email: email
            })
            setLoading(false);
            setError('');
            navigate('/reset_success');

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.errors);
            } else {
                setError(String(error));
            }
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto flex flex-col justify-center items-center mt-24">
            <LanguagePanel />
            <Alert className="bg-red-400 mt-4" open={error !== ''} onClose={() => setError('')}>{error}</Alert>
            <Card className="w-96">
                <CardBody>
                    <div className="flex flex-col w-full">
                        <div className="mb-5 text-primary-500">
                            {t('resetPasswordText')}
                        </div>
                        <div className="mb-5">
                            <Input
                                type="email"
                                name="email"
                                value={email}
                                label={t('email')}
                                crossOrigin=""
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="self-center flex flex-row gap-4">
                            <Button
                                className="bg-primary-500"
                                onClick={handleResetPassword}
                            >
                                {t('send')}
                            </Button>
                            <Button
                                className="bg-primary-500"
                                onClick={() => navigate(-1)}
                            >
                                {t('cancel')}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
            {loading ? <Loading /> : null}
        </div>
    )
}

export default ResetPasswordPage;