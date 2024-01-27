import { Alert, Button } from "@material-tailwind/react";
import { Media, IProfile } from "../../../types/types";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../elements/Loading";
import instance from "../../../api/instance";
import { getFileFromUrl } from "../../../utils/utils";
import axios from "axios";
interface ProfileFormProps {
    userId: number
}
const ProfileForm = ({ userId }: ProfileFormProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [profile, setProfile] = useState<IProfile>({ email: '', name: '', avatar: null });
    const [avatar, setAvatar] = useState<Media>();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (userId) {
            getProfile(userId);
        }
    }, [userId]);

    const getProfile = async (userId: number) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await instance.get(`${process.env.REACT_APP_API_HOST}/auth/users/${userId}`);
            setProfile(res.data);
            if (res.data.avatar) {
                const file = await getFileFromUrl(res.data.avatar);
                setAvatar({ file: file });
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

    const handleSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            let formData = new FormData();
            if (profile?.name) {
                formData.append('name', profile.name);
            }
            if (avatar?.file) {
                formData.append('avatar', avatar.file);
            }
            await instance.put(`${process.env.REACT_APP_API_HOST}/auth/users/${userId}/`,
                formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false);
            setError('');
            setSuccess(t('successSave'));
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

    const handleClose = () => {
        navigate('/');
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
            <Alert className="bg-blue-500 mb-4" open={success !== ''} onClose={() => setSuccess('')}>{success}</Alert>
            <Alert className="bg-red-500 mb-4" open={error !== ''} onClose={() => setError('')}>{error}</Alert>
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
                <div className="w-full mb-4 flex flex-row flex-wrap">
                    <div className="flex flex-col justify-center items-center">
                        <div className="w-32 h-32 mb-4 border-2 border-blue-gray-50 rounded-sm">
                            <img
                                className="w-full h-full border-2 border-blue-gray-100 rounded-lg"
                                src={avatar ? URL.createObjectURL(avatar.file) : "default_avatar.png"}
                                alt="avatar"
                            />
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
                                type="email"
                                value={profile?.email ? profile.email : ''}
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
                                value={profile?.name ? profile.name : ''}
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