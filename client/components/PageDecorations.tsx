import React from 'react';

interface Props {
    variant?: 'landing' | 'onboarding' | 'dashboard' | 'login';
}

const PageDecorations: React.FC<Props> = ({ variant = 'landing' }) => {
    if (variant === 'landing') {
        return (
            <>
                {/* Left Side */}
                <div className="fixed left-[-6%] top-1/2 -translate-y-1/2 hidden xl:block w-[35%] z-0 opacity-90 transition-all duration-700 pointer-events-none">
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-emerald/10 blur-[100px] rounded-full scale-125 mix-blend-soft-light animate-pulse" />
                        <img
                            src="/image.png"
                            alt=""
                            className="w-full h-auto drop-shadow-2xl brightness-110 contrast-110"
                            style={{ maskImage: 'linear-gradient(to right, black 80%, transparent)' }}
                        />
                    </div>
                </div>
                {/* Right Side */}
                <div className="fixed right-[-6%] top-1/2 -translate-y-1/2 hidden xl:block w-[35%] z-0 opacity-90 transition-all duration-700 pointer-events-none">
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-emerald/10 blur-[100px] rounded-full scale-125 mix-blend-soft-light animate-pulse" />
                        <img
                            src="/image 2.jpg"
                            alt=""
                            className="w-full h-auto drop-shadow-2xl brightness-110 contrast-110"
                            style={{ maskImage: 'linear-gradient(to left, black 80%, transparent)' }}
                        />
                    </div>
                </div>
            </>
        );
    }

    if (variant === 'onboarding') {
        return (
            <>
                {/* Top Left Float */}
                <div className="fixed left-[2%] top-[10%] hidden lg:block w-[20%] z-0 opacity-60 transition-all duration-700 pointer-events-none animate-float">
                    <img
                        src="/image.png"
                        alt=""
                        className="w-full h-auto drop-shadow-lg"
                        style={{ maskImage: 'radial-gradient(circle, black 50%, transparent 100%)' }}
                    />
                </div>
                {/* Bottom Right Float */}
                <div className="fixed right-[2%] bottom-[5%] hidden lg:block w-[20%] z-0 opacity-60 transition-all duration-700 pointer-events-none animate-float" style={{ animationDelay: '2s' }}>
                    <img
                        src="/image 2.jpg"
                        alt=""
                        className="w-full h-auto drop-shadow-lg"
                        style={{ maskImage: 'radial-gradient(circle, black 50%, transparent 100%)' }}
                    />
                </div>
            </>
        );
    }

    if (variant === 'login') {
        return (
            <>
                {/* Mirrored Centralized Decoration */}
                <div className="fixed inset-0 flex justify-between items-center px-[5%] pointer-events-none">
                    <img
                        src="/image.png"
                        alt=""
                        className="w-[20%] opacity-40 blur-[4px] lg:blur-0 lg:opacity-60 transition-all"
                        style={{ maskImage: 'linear-gradient(to right, black, transparent)' }}
                    />
                    <img
                        src="/image 2.jpg"
                        alt=""
                        className="w-[20%] opacity-40 blur-[4px] lg:blur-0 lg:opacity-60 transition-all"
                        style={{ maskImage: 'linear-gradient(to left, black, transparent)' }}
                    />
                </div>
            </>
        );
    }

    return (
        <div className="fixed inset-0 pointer-events-none opacity-20 transition-opacity">
            <img src="/image.png" alt="" className="absolute -left-20 -bottom-20 w-1/4" />
            <img src="/image 2.jpg" alt="" className="absolute -right-20 -top-20 w-1/4" />
        </div>
    );
};

export default PageDecorations;
