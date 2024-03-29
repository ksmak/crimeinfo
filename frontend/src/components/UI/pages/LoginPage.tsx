import { Button, Card, CardBody, Input, Spinner, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";
import LanguagePanel from "../panels/LanguagePanel";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../lib/auth";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorLogin, setErrorLogin] = useState<string>('');
    const [errorRegisterEmail, setErrorRegisterEmail] = useState<string>('');
    const [errorRegisterPassword, setErrorRegisterPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSignUp = async () => {
        setErrorRegisterEmail('');
        setErrorRegisterPassword('');
        setLoading(true);
        if (password !== confirmPassword) {
            setLoading(false);
            setErrorRegisterPassword(t('errorPasswordConfirm'));
            return;
        }
        axios.post(`${process.env.REACT_APP_API_HOST}/auth/register/`, {
            email: email,
            password: password,
            password2: confirmPassword,
        })
            .then(res => {
                setLoading(false);
                navigate('/register_success');
            })
            .catch(err => {
                setLoading(false);
                if (err.response.data.email) {
                    let errMessage = err.response.data.email.join('\n');
                    setErrorRegisterEmail(errMessage);
                }
                if (err.response.data.password) {
                    let errMessage = err.response.data.password.join('\n');
                    setErrorRegisterPassword(errMessage);
                }
            })
    }

    const handleEmailLogin = async () => {
        setErrorLogin('');
        setLoading(true);
        axios.post(`${process.env.REACT_APP_API_HOST}/auth/login/`, {
            email: email,
            password: password,
        })
            .then(res => {
                setLoading(false);
                login(res.data.access, res.data.refresh);
                navigate(-1);
            })
            .catch(err => {
                setLoading(false);
                setErrorLogin(t('errorLogin'));
            })
    }

    return (
        <div className="flex flex-col justify-center items-center mt-24">
            <LanguagePanel />
            <Card className="w-96">
                <CardBody>
                    <Tabs value='enter'>
                        <TabsHeader>
                            <Tab key={0} value='enter' className="capitalize">
                                {t('enter')}
                            </Tab>
                            <Tab key={1} value='register' className="capitalize">
                                {t('register')}
                            </Tab>
                        </TabsHeader>
                        <TabsBody
                            animate={{
                                initial: { x: 250 },
                                mount: { x: 0 },
                                unmount: { x: 250 },
                            }}

                        >
                            <TabPanel className="p-0" key={0} value='enter'>
                                <div className="flex flex-col w-full">
                                    <div className="my-5">
                                        <Input
                                            type="email"
                                            name="email"
                                            value={email}
                                            label={t('email')}
                                            crossOrigin=""
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-1">
                                        <Input
                                            type="password"
                                            name="password"
                                            value={password}
                                            label={t('password')}
                                            crossOrigin=""
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <div className="text-red-600 text-sm">
                                            {errorLogin}
                                        </div>
                                    </div>
                                    <div className="mb-5 text-center">
                                        <a className="text-sm text-blue-400" href="/reset_password">{t('forgetPassword')}</a>
                                    </div>
                                    <div className="self-center">
                                        <Button
                                            className="bg-blue-400"
                                            onClick={handleEmailLogin}
                                        >
                                            {t('enter')}
                                        </Button>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel className="p-0" key={1} value='register'>
                                <div className="flex flex-col w-full">
                                    <div className="my-5">
                                        <Input
                                            type="email"
                                            name="email"
                                            value={email}
                                            label={t('email')}
                                            crossOrigin=""
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <div className="text-red-600 text-sm">
                                            {errorRegisterEmail}
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <Input
                                            type="password"
                                            name="password"
                                            value={password}
                                            label={t('password')}
                                            crossOrigin=""
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Input
                                            type="password"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            label={t('repeatPassword')}
                                            crossOrigin=""
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <div className="text-red-600 text-sm">
                                            {errorRegisterPassword}
                                        </div>
                                    </div>
                                    <div className="self-center">
                                        <Button
                                            className="bg-blue-400"
                                            onClick={handleSignUp}
                                        >
                                            {t('register')}
                                        </Button>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabsBody>
                    </Tabs>
                </CardBody>
            </Card>
            {loading
                ? <Spinner
                    className="w-24 h-24 text-blue-400 text-center block fixed z-[9999] top-[calc(50%-10rem)] left-[calc(50%-6rem) rounded-lg"
                />
                : null
            }
        </div>
    )
}

export default LoginPage;