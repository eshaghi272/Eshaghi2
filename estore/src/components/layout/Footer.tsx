const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* بخش اطلاعات */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">eStore</h3>
                        <p className="text-gray-400">
                            بهترین فروشگاه اینترنتی برای خرید محصولات با کیفیت
                        </p>
                    </div>

                    {/* لینک‌های سریع */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">لینک‌های سریع</h4>
                        <ul className="space-y-2">
                            <li><a href="/products" className="text-gray-400 hover:text-white transition">محصولات</a></li>
                            <li><a href="/about" className="text-gray-400 hover:text-white transition">درباره ما</a></li>
                            <li><a href="/contact" className="text-gray-400 hover:text-white transition">تماس با ما</a></li>
                            <li><a href="/terms" className="text-gray-400 hover:text-white transition">قوانین</a></li>
                        </ul>
                    </div>

                    {/* اطلاعات تماس */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">تماس با ما</h4>
                        <p className="text-gray-400">ایمیل: info@estore.com</p>
                        <p className="text-gray-400">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} eStore. تمامی حقوق محفوظ است.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;