import { Alert, Button, Card, CardBody, Input } from "@material-tailwind/react";
import LanguagePanel from "../panels/LanguagePanel";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../elements/Loading";
import { useNavigate } from "react-router";
import axios from "axios";

const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_HOST}/users/reset_password/`, {
            email: email
        })
            .then(res => {
                setLoading(false);
                setError(false);
                navigate('/');
            })
            .catch(err => {
                setLoading(false);
                setMessage(err.message);
                setError(true);
            })
    };

    return (
        <div className="container mx-auto flex flex-col justify-center items-center mt-24">
            <LanguagePanel />
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
            <Alert className="bg-primary-500 mt-4" open={success} onClose={() => setSuccess(false)}>{message}</Alert>
            <Alert className="bg-red-400 mt-4" open={error} onClose={() => setError(false)}>{message}</Alert>
            {loading ? <Loading /> : null}
        </div>
    )
}

export default ResetPasswordPage;