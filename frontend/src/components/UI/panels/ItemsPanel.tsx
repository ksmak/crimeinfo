import { Collapse } from "@material-tailwind/react";
import { IDict, IItem } from "../../../types/types";
import ItemCard from "../cards/ItemCard";


interface ItemsPanelProps {
    items: IItem[] | undefined,
    regions: IDict[] | undefined,
    districts: IDict[] | undefined,
    openItems: boolean,
}

const ItemsPanel = ({ items, regions, districts, openItems }: ItemsPanelProps) => {

    return (
        <Collapse
            className="flex flex-row gap-4 flex-wrap overflow-x-auto"
            open={openItems}
        >
            {items
                ? items.map((item) => {
                    return (
                        <ItemCard
                            key={item.id}
                            item={item}
                            regions={regions}
                            districts={districts}
                        />)
                })
                : null}
        </Collapse>
    )
}

export default ItemsPanel;