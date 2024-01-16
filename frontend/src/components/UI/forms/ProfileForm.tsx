import { Alert, Button } from "@material-tailwind/react";
import { Media, Profile } from "../../../types/types";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";
import { useTranslation } from "react-i18next";
import Loading from "../elements/Loading";
import InputField from "../elements/InputField";
import uuid from "react-uuid";
import { getFileFromUrl, uploadFiles } from "../../../utils/utils";
import { AuthContext } from "../../../App";
interface ProfileFormProps {
    userId: string
}
const ProfileForm = ({ userId }: ProfileFormProps) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [profile, setProfile] = useState<Profile>({});
    const [isSuccesSave, setIsSuccesSave] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');
    const [photos, setPhotos] = useState<Media[]>([]);

    useEffect(() => {
        if (userId) {
            getProfile(userId);
        }
    }, [userId]);

    const getProfile = async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select(`
                id,
                username,
                full_name,
                avatar_url
            `)
            .eq('id', userId)
            .single();
        if (data) {
            const prunedData = data as Profile;
            setProfile(prunedData);
            if (prunedData.avatar_url) {
                let photosFromBase: Media[] = [];
                const id = uuid();
                const file = await getFileFromUrl(prunedData.avatar_url, id);
                photosFromBase.push({
                    id: id,
                    file: file
                })
                setPhotos(photosFromBase);
            }
        }
    }

    const handleSave = async () => {
        setErrors('');
        setIsError(false);
        setIsSuccesSave(false);
        setLoading(true);
        const { uploadError, urls } = await uploadFiles('avatars', userId, photos);
        if (uploadError) {
            setLoading(false);
            setErrors(uploadError.message);
            setIsError(true);
            setIsSuccesSave(false);
            return;
        }
        if (profile.id) {
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: profile.username,
                    full_name: profile.full_name,
                    avatar_url: urls[0]
                })
                .eq('id', userId);
            if (error) {
                setLoading(false);
                setErrors(error.message);
                setIsError(true);
                setIsSuccesSave(false);
                return;
            }
        } else {
            const { error } = await supabase
                .from('profiles')
                .insert({
                    id: userId,
                    username: profile.username,
                    full_name: profile.full_name,
                    avatar_url: urls[0]
                })
            if (error) {
                setLoading(false);
                setErrors(error.message);
                setIsError(true);
                setIsSuccesSave(false);
                return;
            }
        }
        setLoading(false);
        setIsError(false);
        setIsSuccesSave(true);
        setInterval(() => setIsSuccesSave(false), 3000);
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
                const file_id = uuid();
                setPhotos([{ id: file_id, file: file }]);
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
                            {photos.length
                                ? <img
                                    className="w-full h-full border-2 border-blue-gray-100 rounded-lg"
                                    src={photos.length ? URL.createObjectURL(photos[0].file) : 'default_avatar.png'}
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
                                value={String(auth.session?.user.email)}
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