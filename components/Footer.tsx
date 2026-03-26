import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-card text-muted-foreground py-12 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <img
                        src="/images/assets/logo-horizontal.png"
                        alt="FeeEase"
                        width={240}
                        height={40}
                        className="mb-4"
                    />
                    <p className="text-sm leading-relaxed max-w-xs">
                        FeeEase is the comprehensive operating system for modern schools, designed to simplify administration and improve efficiency.
                    </p>
                </div>
                <div>
                    <h4 className="text-foreground font-bold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-primary transition-colors">Fee Management</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Attendance</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Staff & Salary</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Expense Tracking</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-foreground font-bold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        <li><Link href="/contactus" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border text-center text-sm">
                &copy; {new Date().getFullYear()} FeeEase. All rights reserved. FeeEase is a proprietary software owned and operated by <a className="text-primary hover:text-primary/80" target="_blank" href="https://www.codvista.com">Cod Vista</a>.
            </div>
        </footer>
    )
}

export default Footer
