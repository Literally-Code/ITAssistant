function AssistantMessage({ text })
{
    return (<div className="flex justify-start w-full min-h-0 mb-2">
        <div className="text-left text-blue-950 text-lg max-w-max w-1/2 p-2 break-words bg-yellow-200 rounded-xl">
            {text}
        </div>
    </div>);
}

export default AssistantMessage