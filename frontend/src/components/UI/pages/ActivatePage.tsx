import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import LanguagePanel from "../panels/LanguagePanel";
import { Spinner, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ActivatePage = () => {
    const { t } = useTranslation();
    const { code } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        activateEmail();
        //eslint-disable-next-line
    }, [code])

    const activateEmail = async () => {
        if (code) {
            try {
                setLoading(true);
                setError('');
                setSuccess('');
                const res = await axios.post(`${process.env.REACT_APP_API_HOST}/auth/activate/`,
                    { activation_code: code });
                if (res.status === 200) {
                    setSuccess(t('successActivate'))
                }
                setLoading(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.errors);
                } else {
                    setError(String(error));
                }
                setLoading(false);
                setSuccess('');
            }
        }
    }

    return (
        <div className="mt-24">
            {success
                ? <div className="flex flex-col justify-center items-center ">
                    <div className="mb-10">
                        <LanguagePanel />
                    </div>
                    <div className="mb-10">
                        <Typography variant="h3" color="blue">
                            {success}
                        </Typography>
                    </div>
                    <div className="w-fit bg-primary-500 text-white p-3 rounded-sm cursor-pointer">
                        <Link to='/'>{t('returnHome')}</Link>
                    </div>
                </div>
                : null}
            {error
                ? <div className="mb-10 flex flex-col justify-center items-center">
                    <Typography variant="h3" color="red">
                        {error}
                    </Typography>
                </div>
                : null}
            {loading
                ? <Spinner
                    className="w-24 h-24 text-blue-400 text-center block fixed z-[9999] top-[calc(50%-10rem)] left-[calc(50%-6rem) rounded-lg"
                />
                : null
            }
        </div>
    )
}

export default ActivatePage;