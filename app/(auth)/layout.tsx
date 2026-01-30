export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] font-poppins">
            <div className="w-full max-w-lg px-6 py-12">
                {children}
            </div>
        </div>
    )
}
