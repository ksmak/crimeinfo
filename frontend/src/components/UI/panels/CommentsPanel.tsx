import { Typography } from "@material-tailwind/react";
import { Comment } from "../../../types/types";
import CommentCard from "../cards/CommentCard";
import { useTranslation } from "react-i18next";

interface CommentsPanelProps {
    comments: Comment[] | undefined,
    handleRemoveComment: (id: number | null | undefined) => void
}
const CommentsPanel = ({ comments, handleRemoveComment }: CommentsPanelProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <Typography variant="h6" color="blue" className="uppercase">
                {t('comments')}
            </Typography>
            {comments
                ? comments.map(comment => (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                        handleRemoveComment={handleRemoveComment}
                    />
                ))
                : null}
        </div>
    )
}

export default CommentsPanel;