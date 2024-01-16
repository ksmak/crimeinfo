import NavigatorPanel from "../panels/NavigatorPanel";
import { useParams } from "react-router";
import TestForm from "../forms/TestForm";
import TestView from "../views/TestView";

interface TestPageProps {
    isEdit: boolean
}
const TestPage = ({ isEdit }: TestPageProps) => {
    const { testId } = useParams();
    return (
        <div>
            <NavigatorPanel />
            <div className="w-full h-[calc(100vh-5.75rem)] overflow-y-auto">
                {isEdit
                    ? <TestForm testId={testId} />
                    : <TestView testId={testId} />}
            </div>
        </div>
    )
}

export default TestPage;