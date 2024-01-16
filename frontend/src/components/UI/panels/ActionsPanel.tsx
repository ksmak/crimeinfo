import { IconButton, SpeedDial, SpeedDialHandler, SpeedDialContent, SpeedDialAction, Typography } from "@material-tailwind/react";
import { Action, UserRole } from "../../../types/types";
import { AiOutlinePlus } from 'react-icons/ai';
import { useContext } from "react";
import { AuthContext } from "../../../App";

interface ActionsPanelProps {
    actions: Action[]
}

const ActionsPanel = ({ actions }: ActionsPanelProps) => {
    const { roles } = useContext(AuthContext);

    return (
        <SpeedDial placement="top">
            <SpeedDialHandler>
                <IconButton size="lg" className="rounded-full" color="blue">
                    <AiOutlinePlus />
                </IconButton>
            </SpeedDialHandler>
            <SpeedDialContent>
                {actions.map((action, index) => (
                    roles.includes(UserRole.admin) || roles.includes(action.role)
                        ? <SpeedDialAction key={index} onClick={action.onclick}>
                            {action.icon}
                            <Typography
                                className="absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal bg-blue-gray-50 p-1"
                                variant="small"
                                color="blue"
                            >
                                {action.label}
                            </Typography>
                        </SpeedDialAction>
                        : null)
                )}
            </SpeedDialContent>
        </SpeedDial>
    );
}

export default ActionsPanel;