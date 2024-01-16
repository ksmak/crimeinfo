import { useParams } from "react-router";
import NavigatorPanel from "../panels/NavigatorPanel";
import InfoForm from "../forms/InfoForm";
import InfoView from "../views/InfoView";

interface InfoPageProps {
    isEdit: boolean
}

const InfoPage = ({ isEdit }: InfoPageProps) => {
    const { infoId } = useParams();

    return (
        <div>
            <NavigatorPanel />
            <div className="w-full h-[calc(100vh-5.75rem)] overflow-y-auto">
                {isEdit
                    ? <InfoForm infoId={infoId} />
                    : <InfoView infoId={infoId} />}
            </div>
        </div>
    )
}

export default InfoPage;