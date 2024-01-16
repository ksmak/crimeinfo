import { Link } from "react-router-dom";

const Logo = () => {
    return (
        <Link to="/">
            < img
                className="h-full w-full object-cover object-center"
                src="/logo.png"
                alt="crime info"
            />
        </Link >
    )
}

export default Logo;