import { useEffect, useState } from "react";

const disasterTypes = ["hurricane", "flood", "wildfire", "tornado", "earthquake"];

const useFetchCoordinates = () => {
  // State to hold coordinates for each disaster type
  const [coordinatesByDisaster, setCoordinatesByDisaster] = useState({
    hurricane: [],
    flood: [],
    wildfire: [],
    tornado: [],
    earthquake: [],
  });

  useEffect(() => {
    const fetchCoordinates = async (disasterType) => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/fetch-location-coordinates?disaster_type=${disasterType}`);
        if (!response.ok) {
          throw new Error("Failed to fetch coordinates");
        }
        const data = await response.json();

        // Store the coordinates for the given disaster type
        setCoordinatesByDisaster(prevState => ({
          ...prevState,
          [disasterType]: data,
        }));
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    // Fetch coordinates for each disaster type when the component mounts
    disasterTypes.forEach(disasterType => {
      fetchCoordinates(disasterType);
    });

    const interval = setInterval(() => {
      disasterTypes.forEach(disasterType => {
        fetchCoordinates(disasterType);
      });
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return coordinatesByDisaster;
};

export default useFetchCoordinates;
