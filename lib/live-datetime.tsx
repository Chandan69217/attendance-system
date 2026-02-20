"use client";

import { useEffect, useState } from "react";

export function LiveDateTime() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const formatted =
        now.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }) +
        ", " +
        now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });


    return (<span>{ formatted } </span>);
}
