const fetchDriversAndLatestTruckSheet = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASEURL + "/api/employees/getdrivers",
      { cache: "no-store" }
    );
    const drivers = await response.json();

    const trucksResponse = await fetch(
      process.env.NEXT_PUBLIC_BASEURL + "/api/trucks/gettrucks",
      { cache: "no-store" }
    );
    const trucks = await trucksResponse.json();

    const truckMap = trucks.reduce(
      (map: { [key: string]: string }, truck: any) => {
        map[truck.id] = truck.number;
        return map;
      },
      {}
    );

    const formattedDrivers = drivers.map((driver: any) => {
      const lastSheet = driver.trucksheet[driver.trucksheet.length - 1];
      const lastReport = lastSheet
        ? {
            date: new Date(lastSheet.date).toLocaleDateString(),
            truckNumber: truckMap[lastSheet.truckId] || "Unknown",
          }
        : null;

      return { ...driver, lastReport };
    });

    console.log("Drivers fetched successfully:", formattedDrivers);

    return formattedDrivers;
  } catch (error) {
    console.error("Error fetching drivers:", error);
  }
};

export default fetchDriversAndLatestTruckSheet;
