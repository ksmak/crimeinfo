import { Spinner } from "@material-tailwind/react"

const Loading = () => {
    return (
        <div className="block fixed z-[9999] top-[calc(50%-75px)] left-[calc(50%-50px)] w-[250px] h-[150px]">
            <Spinner
                className="w-24 h-24 text-blue-400 text-center"
            />
        </div>
    )
}

export default Loading;