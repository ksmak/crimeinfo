import { useTranslation } from "react-i18next";
import LanguagePanel from "../panels/LanguagePanel";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const SuccessTest = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col justify-center items-center mt-24">
            <div className="mb-10">
                <LanguagePanel />
            </div>
            <div className="mb-10">
                <Typography variant="h3" color="blue">
                    {t('successTest')}
                </Typography>
            </div>
            <div className="bg-primary-500 text-white p-3 rounded-sm cursor-pointer">
                <Link to='/'>{t('returnHome')}</Link>
            </div>
        </div>
    )
}

export default SuccessTest;