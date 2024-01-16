import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

type ModileSingleItemProps = {
    link: string,
    title: string,
    icon?: string,
}

export default function ModileSingleItem({ link, title, icon }: ModileSingleItemProps) {
    return (
        <Typography
            className="p-1 text-sm font-normal hover:underline text-primary-500"
        >
            <Link to={link} className="flex items-center gap-4">
                {icon ? <img src={icon} alt={icon} className="h-8" /> : null}
                {title}
            </Link>
        </Typography>
    )
}