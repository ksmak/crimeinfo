import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import axios from "axios";
import LanguagePanel from "../panels/LanguagePanel";
import { useTranslation } from "react-i18next";
import Loading from "../elements/Loading";
import { Alert, Button, Card, CardBody, Input } from "@material-tailwind/react";
import { useAuth } from "../../../lib/auth";

const ConfirmResetPasswordPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation();
    const { code } = useParams();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUpdatePassword = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post(`${process.env.REACT_APP_API_HOST}/auth/confirm_reset/`, {
                activation_code: code,
                new_password: password
            })
            setLoading(false);
            setError('');
            navigate('/confirm_success');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.new_password);
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
            <Card className="w-96 mt-2">
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
                        </div>
                    </div>
                </CardBody>
            </Card>
            {loading ? <Loading /> : null}
        </div>
    )
}

export default ConfirmResetPasswordPage;