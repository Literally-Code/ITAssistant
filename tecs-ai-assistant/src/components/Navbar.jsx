function Navbar()
{
    return (
    <header className="flex fixed w-full z-10 top-0 bg-citrus-blue border-b text-white text-center p-3 justify-center items-center md:justify-between">
        <div className="flex">
            <div className="text-3xl md:text-2xl">IT Support</div>
            <div className="hidden md:block text-sm bg-opacity-0">@Citrus College</div>
        </div>
        <div>
            <a className="hidden md:block text-s align-middle hover:text-yellow-300 hover:animate-pulse" target="_blank" href="https://www.linkedin.com/in/jonathan-woline">@Developer</a>
        </div>
    </header>);
}

export default Navbar;