import PropTypes from 'prop-types';

const getLoadingBackground = (agent) =>
{
    if (agent === 'user')
        return 'bg-tecs-blue';
    if (agent === 'assistant')
        return 'bg-citrus-orange text-white';
};

const getStyleFromStatus = (agent, status) =>
{
    if (status === 'loading')
        return 'animate-pulse' + ' ' + getLoadingBackground(agent);
    if (status === 'error')
        return 'bg-red-200';
    if (status === 'success')
        return getLoadingBackground(agent);
};

const getStyleFromAgent = (agent) => 
{
    if (agent === 'user')
        return 'justify-end';
    if (agent === 'assistant')
        return 'justify-start';
};

const processLinks = (text) =>
{
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

    const parts = [];
    let lastIndex = 0;

    text.replace(regex, (match, linkText, url, index) => 
    {
        if (index > lastIndex) 
        {
            parts.push(text.slice(lastIndex, index));
        }
        
        parts.push(
            <a className="text-blue-700" target="_blank" key={index} href={url} rel="noopener noreferrer">
                {linkText}
            </a>
        );
        
        lastIndex = index + match.length;
    });

    if (lastIndex < text.length) 
    {
        parts.push(text.slice(lastIndex));
    }

    return parts;
};

const Message = ({ agent, status, text }) =>
{
    const parts = processLinks(text);

    return (<div className={`flex ${getStyleFromAgent(agent)} w-full min-h-0 mb-2`}>
        <div
            className={`text-left ${getStyleFromStatus(agent, status)} text-blue-950 text-lg max-w-max w-1/2 p-2 break-words rounded-xl`}>
            {parts.map((part, index) => (
                <span key={index}>{part}</span>
            ))}
        </div>

    </div>);
};

Message.propTypes = {
    agent: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

export default Message;