import { Alert, Button } from "@material-tailwind/react";
import { Media, IProfile, IApiError } from "../../../types/types";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../elements/Loading";
import InputField from "../elements/InputField";
import uuid from "react-uuid";
import { getFileFromUrl, uploadFiles } from "../../../utils/utils";
import { useAuth } from "../../../lib/auth";
import instance from "../../../api/instance";
interface ProfileFormProps {
    userId: string
}
const ProfileForm = ({ userId }: ProfileFormProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [profile, setProfile] = useState<IProfile>({});
    const [isSuccesSave, setIsSuccesSave] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');
    const [avatar, setAvatar] = useState<Media>();

    useEffect(() => {
        if (userId) {
            getProfile(userId);
        }
    }, [userId]);

    const getProfile = async (userId: string) => {
        try {
            const res = await instance.get(`${process.env.REACT_APP_HOST}/users/${userId}`);
            setProfile(res.data);
            if (res.data.avatar) {
                const file = await getFileFromUrl(res.data.avatar);
                setAvatar({ file: file });
            }
        } catch (error) {
            const err = error as IApiError;
            console.log(err);

        }
    }

    const handleSave = async () => {
        setErrors('');
        setIsError(false);
        setIsSuccesSave(false);
        setLoading(true);
        if (profile.id) {
            try {
                const res = await instance.put(`${process.env.REACT_APP_API_HOST}/users/`, profile);
                setProfile(res.data);
                setLoading(false);
                setIsError(false);
                setIsSuccesSave(true);
                setInterval(() => setIsSuccesSave(false), 3000);
            } catch (error) {
                const err = error as IApiError;
                console.log(err);
                setLoading(false);
                setErrors(err.message);
                setIsError(true);
                setIsSuccesSave(false);
            }
        } else {
            try {
                const res = await instance.post(`${process.env.REACT_APP_API_HOST}/users/`, profile);
                setProfile(res.data);
                setLoading(false);
                setIsError(false);
                setIsSuccesSave(true);
                setInterval(() => setIsSuccesSave(false), 3000);
            } catch (error) {
                const err = error as IApiError;
                console.log(err);
                setLoading(false);
                setErrors(err.message);
                setIsError(true);
                setIsSuccesSave(false);
            }
        }
    }

    const handleClose = () => {
        navigate(-1);
    }

    const handleAddPhoto = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png,.jpg,.gif';
        input.onchange = async (e: Event) => {
            const files = (e.target as HTMLInputElement).files;
            if (e.target && files) {
                const file = files[0];
                setAvatar({ file: file });
            }
        };
        input.click();
    }


    return (
        <div className="p-5">
            <form method="post" action="/profile" className="mt-4 ">
                <div className="flex flex-row gap-4 justify-end py-4">
                    <Button
                        className="bg-blue-400"
                        size="sm"
                        onClick={() => navigate('/profile/change_password')}
                    >
                        {t('resetPassword')}
                    </Button>
                    <Button
                        className="bg-blue-400"
                        size="sm"
                        onClick={handleSave}
                    >
                        {t('save')}
                    </Button>
                    <Button
                        className="bg-blue-400"
                        size="sm"
                        onClick={handleClose}
                    >
                        {t('close')}
                    </Button>
                </div>
                <Alert className="bg-blue mb-4" open={isSuccesSave} onClose={() => setIsSuccesSave(false)}>{t('successSave')}</Alert>
                <Alert className="bg-red-500 mb-4" open={isError} onClose={() => setIsError(false)}>{errors}</Alert>
                <div className="w-full mb-4 flex flex-row flex-wrap">
                    <div className="flex flex-col justify-center items-center">
                        <div className="w-32 h-32 mb-4 border-2 border-blue-gray-50 rounded-sm">
                            {avatar
                                ? <img
                                    className="w-full h-full border-2 border-blue-gray-100 rounded-lg"
                                    src={URL.createObjectURL(avatar.file)}
                                    alt="avatar"
                                />
                                : null}
                        </div>
                        <div className="w-full mb-4 text-center">
                            <Button
                                size="sm"
                                color="blue"
                                onClick={() => {
                                    handleAddPhoto()
                                }}
                            >
                                {t('load')}
                            </Button>
                        </div>
                    </div>
                    <div className="px-4 flex flex-col">
                        <div className="w-full mb-4">
                            <InputField
                                type='text'
                                name='email'
                                label={t('yourEmail')}
                                value={user ? user.email : ''}
                                onChange={() => null}
                                required={false}
                            />
                        </div>
                        <div className="w-full mb-4">
                            <InputField
                                type='text'
                                name='full_name'
                                label={t('yourFullname')}
                                value={profile.full_name ? profile.full_name : ''}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                required={true}
                            />
                        </div>
                    </div>
                </div>
            </form>
            {loading ? <Loading /> : null}
        </div>
    )
}

export default ProfileForm;