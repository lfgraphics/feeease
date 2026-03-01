import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <header className="w-full py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/images/assets/logo-horizontal.png"
                        alt="FeeEase Logo"
                        width={140}
                        height={50}
                        className="object-contain"
                        priority
                    />
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                        Features
                    </Link>
                    <Link href="#testimonials" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                        Testimonials
                    </Link>
                    <div className="flex items-center gap-3 ml-4">
                        {/* <Link
                            href="/login"
                            className="text-slate-700 hover:text-blue-600 font-medium px-4 py-2 transition-colors"
                        >
                            Login
                        </Link> */}
                        <Link
                            href="/contactus"
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header
