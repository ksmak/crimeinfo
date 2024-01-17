import { IconButton, SpeedDial, SpeedDialHandler, SpeedDialContent, SpeedDialAction, Typography } from "@material-tailwind/react";
import { IAction, UserRole } from "../../../types/types";
import { AiOutlinePlus } from 'react-icons/ai';
import { useAuth } from "../../../lib/auth";

interface ActionsPanelProps {
    actions: IAction[]
}

const ActionsPanel = ({ actions }: ActionsPanelProps) => {
    const { roles } = useAuth();

    return (
        <SpeedDial placement="top">
            <SpeedDialHandler>
                <IconButton size="lg" className="rounded-full" color="blue">
                    <AiOutlinePlus />
                </IconButton>
            </SpeedDialHandler>
            <SpeedDialContent>
                {actions.map((action, index) => (
                    roles.some(item => item.role == UserRole.admin) || roles.some(item => item.role == action.role)
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