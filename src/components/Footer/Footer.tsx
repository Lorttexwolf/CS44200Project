export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Column 1 */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">About</h2>
                    <p className="text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus
                        feugiat, porta ligula sed, ullamcorper lorem.
                    </p>
                </div>

                {/* Column 2 */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Links</h2>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="hover:text-white transition">Lorem</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition">Ipsum</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition">Dolor</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition">Sit Amet</a>
                        </li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Contact</h2>
                    <p className="text-sm">123 Lorem St, Ipsum City</p>
                    <p className="text-sm">+1 (555) 123-4567</p>
                    <p className="text-sm">info@example.com</p>
                </div>
            </div>

            {/* Bottom */}
            <div
                className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
                made with ❤️ by PNW students.
            </div>
        </footer>
    );
}
