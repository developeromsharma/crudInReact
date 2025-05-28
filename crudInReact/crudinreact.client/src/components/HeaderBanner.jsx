import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const HeaderBanner = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000); // update every second

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ background: '#f5f5f5', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
            Welcome to Course Management System By OM SHARMA {currentTime.format('DD-MM-YYYY hh:mm:ss A')}
        </div>
    );
};

export default HeaderBanner;
