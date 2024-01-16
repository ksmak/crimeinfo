import { useParams } from "react-router";
import NavigatorPanel from "../panels/NavigatorPanel";
import ItemForm from "../forms/ItemForm";
import ItemView from "../views/ItemView";

interface ItemPageProps {
    isEdit: boolean
}

const ItemPage = ({ isEdit }: ItemPageProps) => {
    const { itemId } = useParams();

    return (
        <div>
            <NavigatorPanel />
            <div className="w-full h-[calc(100vh-5.75rem)] overflow-y-auto">
                {isEdit
                    ? <ItemForm itemId={itemId} />
                    : <ItemView itemId={itemId} />}
            </div>
        </div>
    )
}

export default ItemPage;