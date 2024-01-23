import { Alert, Button } from "@material-tailwind/react";
import { Media, IProfile, IApiError } from "../../../types/types";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../elements/Loading";
import instance from "../../../api/instance";
import uuid from 'react-uuid';
import { getFileFromUrl, uploadFiles } from "../../../utils/utils";
interface ProfileFormProps {
    userId: number
}
const ProfileForm = ({ userId }: ProfileFormProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [profile, setProfile] = useState<IProfile>({});
    const [isSuccesSave, setIsSuccesSave] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');
    const [avatar, setAvatar] = useState<Media[]>();

    useEffect(() => {
        if (userId) {
            getProfile(userId);
        }
    }, [userId]);

    const getProfile = async (userId: number) => {
        try {
            const res = await instance.get(`${process.env.REACT_APP_API_HOST}/api/profiles/${userId}`);
            setProfile(res.data);
        } catch (error) {
            const err = error as IApiError;

        }
    }

    const handleSave = async () => {
        setErrors('');
        setIsError(false);
        setIsSuccesSave(false);
        setLoading(true);
        if (profile.id) {
            try {
                const res = await instance.put(`${process.env.REACT_APP_API_HOST}/api/profiles/${userId}/`, profile);
                setProfile(res.data);
                if (res.data.avatar) {
                    const id = uuid();
                    const file = await getFileFromUrl(res.data.avatar, id);
                    setAvatar([{ file: file }]);
                }
                setLoading(false);
                setIsError(false);
                setIsSuccesSave(true);
                setInterval(() => setIsSuccesSave(false), 3000);
            } catch (error) {
                setLoading(false);
                const err = error as IApiError;
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
                setAvatar([{ file: file }]);
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
                                    src={URL.createObjectURL(avatar[0].file)}
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
                            <label
                                htmlFor="email"
                                className="text-blue-400 bold mr-1"
                            >
                                {t('yourEmail')}
                            </label>
                            <input
                                id="email"
                                className="border-2 border-blue-gray-200 p-1 w-full rounded-md"
                                type="text"
                                disabled={true}
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label
                                htmlFor="name"
                                className="text-blue-400 bold mr-1"
                            >
                                {t('yourName')}
                            </label>
                            <input
                                id="name"
                                className="border-2 border-blue-gray-200 p-1 w-full rounded-md"
                                type="text"
                                value={profile.name ? profile.name : ''}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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