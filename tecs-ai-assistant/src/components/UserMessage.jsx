function UserMessage({ text })
{
    return (<div className="flex justify-end w-full min-h-0 mb-2">
        <div className="text-left text-blue-950 text-lg max-w-max w-1/2 p-2 whitespace-break-spaces break-words bg-yellow-100 rounded-xl">
            {text}
        </div>
    </div>);
}

export default UserMessage