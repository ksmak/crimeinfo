import { useTranslation } from "react-i18next";
import NavigatorPanel from "../panels/NavigatorPanel";
import { Alert, Typography } from "@material-tailwind/react";
import ProfileForm from "../forms/ProfileForm";
import { useAuth } from "../../../lib/auth";

const Profile = () => {
    const { t } = useTranslation();
    const { user, isAuthenticated } = useAuth();

    return (
        <div>
            <NavigatorPanel />
            <Typography variant="h3" color="blue" className="text-center">{t('userProfile')}</Typography>
            {isAuthenticated && user?.id
                ? <ProfileForm userId={user.id} />
                : <Alert>{t('errorAccess')}</Alert>}
        </div>
    )
}

export default Profile;