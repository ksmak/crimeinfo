import { Avatar, IconButton } from "@material-tailwind/react";
import { Comment, Profile } from "../../../types/types";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { AiFillDelete } from "react-icons/ai";
import { AuthContext } from "../../../App";

interface CommentCardProps {
    comment: Comment,
    handleRemoveComment: (id: number | null | undefined) => void
}

const CommentCard = ({ comment, handleRemoveComment }: CommentCardProps) => {
    const auth = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const [profile, setProfile] = useState<Profile>();

    const getUserProfile = async (user_id: string) => {
        const { data } = await supabase
            .from('profiles')
            .select()
            .eq('id', user_id)
            .single()
        if (data) {
            setProfile(data);
        }
    }
    useEffect(() => {
        if (comment.user_id) {
            getUserProfile(comment.user_id);
        }
    }, [comment]);

    return (
        <div className="w-full border-2 rounded-lg border-blue-50 mb-4 flex flex-row items-center">
            <div className="mr-5 self-center">
                <Avatar
                    className="p-0.5 border-blue-gray-100 place-self-center"
                    src={profile?.avatar_url ? profile.avatar_url : 'default_avatar.png'}
                    alt="avatar"
                    size="md"
                />
            </div>
            <div className="w-full">
                <div className="flex flex-row justify-between flex-wrap md:flex-nowrap">
                    <div className="text-blue-400 italic text-sm font-bold">{profile?.full_name ? profile.full_name : t('noname')}</div>
                    <div className="text-sm font-serif text-blue-gray-800 italic mr-1">{moment(comment.create_at).locale(i18n.language).format('LLLL')}</div>
                </div>
                <div className="text-sm font-normal">{comment.text}</div>
            </div>
            <div className="w-10 justify-self-end self-center">
                {comment.user_id === auth.session?.user.id
                    ? <IconButton
                        className="rounded-full"
                        size="sm"
                        color="blue"
                        variant="outlined"
                        onClick={() => handleRemoveComment(comment.id)}
                    >
                        <AiFillDelete />
                    </IconButton>
                    : null}
            </div>
        </div>
    )
}

export default CommentCard;