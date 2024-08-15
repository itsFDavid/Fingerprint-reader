export const Result = ({result}) => {
    return (
        <pre className="bg-gray-100 p-4 rounded mt-4">
            {result && result}
        </pre>
    );
}