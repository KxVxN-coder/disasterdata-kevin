import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const API_HOST = process.env.REACT_APP_API_HOST;

const DangerLevel = React.memo(({ urlQuery }) => {
    const style = getComputedStyle(document.documentElement)
    const [dangerLevel, setDangerLevel] = useState({ label: "None", color: style.getPropertyValue('--green'), disasterType: "", location: "" });

    useEffect(() => {
        const fetchDangerLevel = async () => {
            try {
                //const response = await fetch('/fetch-top-disaster-last-day');  // Make sure this route is correct
                const response = await fetch(API_HOST + `/fetch-top-disaster-location${urlQuery ? ("?" + urlQuery) : ""}`); 
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();

                if (data.Error) {
                    console.warn("No valid disaster data found.");
                    return;
                }

                let color = style.getPropertyValue('--green'); // Default green for 'None'
                if (data.danger_level === "high") color = style.getPropertyValue('--red');
                else if (data.danger_level === "moderate") color = style.getPropertyValue('--orange');
                else if (data.danger_level === "low") color = style.getPropertyValue('--yellow');

                setDangerLevel({
                    label: data.danger_level.charAt(0).toUpperCase() + data.danger_level.slice(1),
                    color,
                    disasterType: data.top_label,
                    location: data.location
                });

            } catch (error) {
                console.error("Error fetching danger level:", error);
            }
        };

        fetchDangerLevel();

        const intervalId = setInterval(fetchDangerLevel, 60000);

        return () => clearInterval(intervalId);
    }, [urlQuery]);

    const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

    return (
        <Card className="shadow-sm" style={{ height: "100px", border: `2px solid ${dangerLevel.color}` }}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-start">
            <Card.Title id="danger-level-title">
                Danger Level{dangerLevel.disasterType && ` of ${capitalize(dangerLevel.disasterType)}`}
                {dangerLevel.location && ` in ${dangerLevel.location}`}
            </Card.Title>
                <div id="danger-level" style={{ fontWeight: "bold", color: dangerLevel.color }}>
                    {dangerLevel.label}
                </div>
            </Card.Body>
        </Card>
    );
});

export default DangerLevel;
