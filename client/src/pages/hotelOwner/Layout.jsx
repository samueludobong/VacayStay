const Layout = () => {
    const { isOwner, navigate } = useAppContext()

    useEffect(() => {
        if (!isOwner) navigate('/')
    }, [isOwner])

    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />

            <div className='flex flex-1 overflow-hidden'>
                <Sidebar />

                {/* main content */}
                <div className='flex-1 p-4 pt-16 md:px-10 overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
