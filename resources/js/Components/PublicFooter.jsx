import { Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function PublicFooter() {
    const [legalModal, setLegalModal] = useState(null);

    return (
        <>
            <footer className="border-t border-[#1F2923] bg-[#0B0F0D] mt-24">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-md bg-[#22C55E] flex items-center justify-center">
                                    <span className="text-[#0B0F0D] font-bold text-xs">P</span>
                                </div>
                                <span className="text-[#F5F7F5] font-semibold">Playscore</span>
                            </div>
                            <p className="text-[#8B948F] text-sm leading-relaxed hover:text-white transition-colors cursor-default">
                                Rate it. Review it. Remember it.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-[#F5F7F5] text-sm font-semibold mb-3">Product</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('register')} className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
                                        Sign Up
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('login')} className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
                                        Log In
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[#F5F7F5] text-sm font-semibold mb-3">Resources</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://rawg.io/apidocs"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
                                    >
                                        Game Data by RAWG API
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[#F5F7F5] text-sm font-semibold mb-3">Legal</h4>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => setLegalModal('privacy')}
                                        className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all text-left"
                                    >
                                        Privacy Policy
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setLegalModal('terms')}
                                        className="text-[#8B948F] text-sm hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all text-left"
                                    >
                                        Terms of Service
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-[#1F2923] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[#8B948F] text-sm hover:text-white transition-colors cursor-default">
                            © {new Date().getFullYear()} Playscore. All rights reserved.
                        </p>
                        <a
                            href="https://rawg.io/apidocs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B948F] text-xs hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"
                        >
                            Game data powered by RAWG API
                        </a>
                    </div>
                </div>
            </footer>

            {/* Legal Modal Popup */}
            <Modal show={legalModal !== null} onClose={() => setLegalModal(null)}>
                <div className="p-6 sm:p-8 bg-[#131916] text-[#F5F7F5] border border-[#1F2923] rounded-xl max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#1F2923] pb-4 mb-6">
                        <h3 className="text-xl font-bold text-[#F5F7F5]">
                            {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                        </h3>
                        <button
                            onClick={() => setLegalModal(null)}
                            className="text-[#8B948F] hover:text-white text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#1F2923] transition"
                        >
                            ✕
                        </button>
                    </div>

                    {legalModal === 'privacy' && (
                        <div className="space-y-4 text-sm text-[#8B948F] leading-relaxed">
                            <p>
                                Welcome to Playscore. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">1. Information We Collect</h4>
                            <p>
                                We collect information you provide directly to us when creating an account, such as your username and email address, as well as your game ratings, reviews, and list preferences.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">2. How We Use Your Information</h4>
                            <p>
                                We use your data to personalize your gaming recommendations, maintain your personal game tracker, and display community ratings and reviews across the platform.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">3. Data Protection</h4>
                            <p>
                                We implement security measures to ensure the safety of your personal information. We do not sell or rent your personal data to third parties.
                            </p>
                        </div>
                    )}

                    {legalModal === 'terms' && (
                        <div className="space-y-4 text-sm text-[#8B948F] leading-relaxed">
                            <p>
                                By accessing or using Playscore, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">1. Account Responsibility</h4>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">2. User Content & Conduct</h4>
                            <p>
                                Reviews and ratings submitted to Playscore must follow community guidelines. Spam, offensive content, or misleading reviews are strictly prohibited.
                            </p>
                            <h4 className="text-white font-semibold text-base mt-4">3. External Data Attribution</h4>
                            <p>
                                Game metadata and imagery are provided via the RAWG API. Playscore claims no ownership over official game artwork, titles, or trademarks.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-4 border-t border-[#1F2923] flex justify-end">
                        <button
                            onClick={() => setLegalModal(null)}
                            className="bg-[#22C55E] text-[#0B0F0D] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#4ADE80] transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
