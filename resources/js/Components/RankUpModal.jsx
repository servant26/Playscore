import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { router, usePage } from '@inertiajs/react';
import { getRankInfo } from '@/Utils/rankSystem';

export default function RankUpModal({ show, onClose, rankUpData }) {
    const authUser = usePage().props.auth.user;
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (show) {
            setUploaded(false);
            setUploading(false);

            // Trigger celebration confetti burst animation
            const timer = setTimeout(() => {
                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;

                    const particles = [];
                    const colors = ['#22C55E', '#EAB308', '#3B82F6', '#EC4899', '#A855F7', '#F97316', '#FFFFFF'];

                    for (let i = 0; i < 150; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * 15 + 7;
                        particles.push({
                            x: canvas.width / 2,
                            y: canvas.height / 2 - 50,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed - Math.random() * 5,
                            size: Math.random() * 9 + 4,
                            color: colors[Math.floor(Math.random() * colors.length)],
                            rotation: Math.random() * 360,
                            rotationSpeed: (Math.random() - 0.5) * 14,
                            opacity: 1,
                            decay: Math.random() * 0.014 + 0.007,
                            gravity: 0.28,
                            shape: Math.random() > 0.5 ? 'rect' : 'circle',
                        });
                    }

                    let animationFrame;
                    function render() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        let active = 0;

                        particles.forEach((p) => {
                            if (p.opacity <= 0) return;
                            active++;
                            p.x += p.vx;
                            p.y += p.vy;
                            p.vy += p.gravity;
                            p.vx *= 0.98;
                            p.rotation += p.rotationSpeed;
                            p.opacity -= p.decay;

                            ctx.save();
                            ctx.globalAlpha = Math.max(0, p.opacity);
                            ctx.translate(p.x, p.y);
                            ctx.rotate((p.rotation * Math.PI) / 180);
                            ctx.fillStyle = p.color;

                            if (p.shape === 'rect') {
                                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
                            } else {
                                ctx.beginPath();
                                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                                ctx.fill();
                            }
                            ctx.restore();
                        });

                        if (active > 0) {
                            animationFrame = requestAnimationFrame(render);
                        }
                    }

                    render();
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!show || !rankUpData || typeof document === 'undefined') return null;

    const { new_count } = rankUpData;
    const { currentRank } = getRankInfo(new_count);

    const handleUploadToStory = () => {
        if (uploading || uploaded) return;
        setUploading(true);

        router.post(
            route('stories.rank'),
            {
                rank_name: currentRank.name,
                rank_count: new_count,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setUploading(false);
                    setUploaded(true);
                    setTimeout(() => {
                        onClose();
                    }, 1200);
                },
                onError: () => {
                    setUploading(false);
                },
            }
        );
    };

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
            {/* Confetti Explosion Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-[100000]"
            />

            {/* Dark Blur Backdrop */}
            <div
                className="fixed inset-0 bg-[#050706]/92 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Spacious Congratulatory Card Container */}
            <div className="relative z-10 w-full max-w-lg bg-[#131916] border border-[#1F2923] rounded-3xl shadow-2xl p-7 sm:p-9 text-[#F5F7F5] transform transition-all duration-300 scale-100 my-auto text-center overflow-hidden">
                {/* Celebration Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F5] tracking-tight">
                    Congratulations, {authUser?.name || 'Gamer'}!
                </h2>
                <p className="text-sm text-[#8B948F] mt-2 max-w-sm mx-auto leading-relaxed">
                    You have unlocked a new reviewer rank milestone on Playscore.
                </p>

                {/* Rank Achievement Card Container */}
                <div className="my-6 p-6 sm:p-7 rounded-2xl bg-[#0B0F0D] border border-[#1F2923] flex flex-col items-center shadow-inner">
                    {/* Rank Badge Icon */}
                    <div
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl bg-gradient-to-br ${currentRank.badgeGradient} border-2 border-white/20 shadow-xl mb-4`}
                    >
                        {currentRank.icon}
                    </div>

                    {/* Rank Title */}
                    <h3 className={`text-xl sm:text-2xl font-black ${currentRank.color} tracking-wide`}>
                        {currentRank.name}
                    </h3>

                    {/* Total Reviews Count */}
                    <div className="mt-2 text-xs sm:text-sm font-semibold text-[#8B948F] bg-[#131916] border border-[#1F2923] px-4 py-1 rounded-full">
                        {new_count} Verified Game Reviews
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:flex-1 py-3 rounded-xl bg-[#0B0F0D] border border-[#1F2923] text-[#8B948F] hover:text-[#F5F7F5] hover:border-[#2E3A32] text-sm font-semibold transition"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={handleUploadToStory}
                        disabled={uploading || uploaded}
                        className="w-full sm:flex-1 py-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0B0F0D] text-sm font-bold transition disabled:opacity-75 flex items-center justify-center gap-2 shadow-lg"
                    >
                        {uploading ? (
                            <span>Publishing...</span>
                        ) : uploaded ? (
                            <span>Uploaded to Story! ✓</span>
                        ) : (
                            <span>Upload to Story</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
