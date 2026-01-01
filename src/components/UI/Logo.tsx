export const LogoMN = ({ className }: { className?: string }) => {
    const pixelMap = [
        "1....1..2...2",
        "11..11..22..2",
        "11.111..2.2.2",
        "11.111..2..22",
        "11..11..2...2",
        "11..11..2...2",
        "11..11..2...2",
    ];
    const getOpacity = (x: number, y: number) => {
        const noise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const val = Math.abs(noise - Math.floor(noise));
        return val > 0.8 ? 0.6 : 1;
    };

    return (
        <svg
            viewBox="0 0 15 7"
            className={className}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            {pixelMap.map((row, y) => (
                row.split('').map((char, x) => {
                    if (char === '.') return null;

                    const isN = char === '2';

                    return (
                        <circle
                            key={`${x}-${y}`}
                            cx={x + 0.5}
                            cy={y + 0.5}
                            r={0.4}
                            className={isN ? 'text-[#055df5]' : 'text-white'}
                            style={{ opacity: getOpacity(x, y) }}
                        />
                    );
                })
            ))}
        </svg>
    );
};