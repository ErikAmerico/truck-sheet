const fetchOfficeEmployees = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/employees/getofficeemployees`,
      { cache: "no-store" } // Ensures fresh data is always fetched
    );
    const employees = await response.json();
    return employees;
  } catch (error) {
    console.error("Error fetching office employees:", error);
    return [];
  }
};

export default fetchOfficeEmployees;
