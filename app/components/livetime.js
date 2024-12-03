import { useEffect, useState } from 'react';

export default function LiveTime() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="bg-transparent text-white p-4 rounded-lg text-center max-w-sm mx-auto">
            <p className="text-lg mt-2">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
        </div>
    );
}
