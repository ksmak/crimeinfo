import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

type SingleMenuItemProps = {
    link: string,
    title: string,
    icon?: string,
}

export default function SingleMenuItem({ link, title, icon }: SingleMenuItemProps) {
    return (
        <Button
            className="text-sm tracking-normal font-normal normal-case text-primary-500 hover:bg-blue-400 hover:text-white"
            variant="text"
            color="blue"
        >
            <Link to={link} className="flex items-center gap-1">
                {icon ? <img src={icon} alt={icon} className="h-8" /> : null}
                {title}
            </Link>
        </Button>
    )
}