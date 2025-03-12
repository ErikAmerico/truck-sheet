const fetchTrucksFromDb = async () => {
  try {
    //get trucks instead of lastest trucksheets
    //in trucktable, we will just get the last trucksheet
    //in each trucks trucksheet array
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}//api/trucks/gettrucks`,
      { cache: "no-store" } // Ensures fresh data is always fetched
    );
    const trucks = await response.json();
    return trucks;
  } catch (error) {
    console.error("Error fetching trucks:", error);
    return [];
  }
};

export default fetchTrucksFromDb;
