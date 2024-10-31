function getLoadingBackground(agent)
{
    if (agent === 'user')
        return 'bg-yellow-200';
    if (agent === 'assistant')
        return 'bg-yellow-100';
}

function getStyleFromStatus(agent, status)
{
    if (status === 'loading')
        return 'animate-pulse' + ' ' + getLoadingBackground(agent);
    if (status === 'error')
        return 'bg-red-200';
    if (status === 'success')
        return getLoadingBackground(agent)
}

function getStyleFromAgent(agent)
{
    if (agent === 'user')
        return 'justify-end';
    if (agent === 'assistant')
        return 'justify-start';
}

function Message({ agent, status, text })
{
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

    const parts = [];
    let lastIndex = 0;

    text.replace(regex, (match, linkText, url, index) => {
        if (index > lastIndex) {
            parts.push(text.slice(lastIndex, index));
        }
        
        parts.push(
            <a className="text-blue-700" target="_blank" key={index} href={url} rel="noopener noreferrer">
                {linkText}
            </a>
        );
        
        lastIndex = index + match.length;
    });

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return (<div className={`flex ${getStyleFromAgent(agent)} w-full min-h-0 mb-2`}>
        <div
                className={`text-left ${getStyleFromStatus(agent, status)} text-blue-950 text-lg max-w-max w-1/2 p-2 break-words rounded-xl`}>
                {parts.map((part, index) => (
                    <span key={index}>{part}</span>
                ))}
            </div>

    </div>);
}

export default Message