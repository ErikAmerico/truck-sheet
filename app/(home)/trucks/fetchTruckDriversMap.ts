const fetchTruckDriversMap = async (trucks: any[]) => {
  // Get unique employee IDs from the trucks data
  const driverIds: number[] = [];
  trucks.forEach((truck: any) => {
    truck.trucksheet.forEach((sheet: any) => {
      if (sheet.employeeId && !driverIds.includes(sheet.employeeId)) {
        // Ensuring employeeId is valid (not null/undefined) and unique before adding
        driverIds.push(sheet.employeeId);
      }
    });
  });

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASEURL + `/api/employees/getdrivers`,
    { cache: "no-store" }
  );
  const allDrivers = await response.json();

  // Filter only the needed drivers
  const driverDetails: any[] = allDrivers.filter((driver: any) =>
    driverIds.includes(driver.id)
  );

  // Create a map of driver IDs to driver names
  const drivers: { [key: number]: string } = {};
  driverDetails.forEach((driver) => {
    if (driver && driver.id) {
      drivers[driver.id] = `${driver.firstName} ${driver.lastName}`;
    }
  });

  return drivers;
};

export default fetchTruckDriversMap;
