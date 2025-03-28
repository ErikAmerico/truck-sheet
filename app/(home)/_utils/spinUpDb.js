export default async function SpinUpDb() {
  console.log("spinning up the db");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/spinupdb`,
      { cache: "no-store" }
    );
    const spinup = await response.json();
    return spinup;
  } catch (error) {
    console.error("Error fetching employee to spin up DB:", error);
  }
}
