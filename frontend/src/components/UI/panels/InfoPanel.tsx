import { Collapse } from "@material-tailwind/react";
import { Info } from "../../../types/types";
import InfoCard from "../cards/InfoCard";

interface InfoPanelProps {
    infoItems: Info[] | [],
    openInfo: boolean
}
const InfoPanel = ({ infoItems, openInfo }: InfoPanelProps) => {
    return (
        <Collapse
            className="flex flex-row gap-4 flex-wrap"
            open={openInfo}
        >
            {infoItems.map((info) => (
                <InfoCard key={info.id} info={info} />
            ))}
        </Collapse>
    )
}

export default InfoPanel;