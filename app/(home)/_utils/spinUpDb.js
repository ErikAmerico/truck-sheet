export default async function SpinUpDb() {
  console.log("spinning up the db");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL}/api/spinupdb`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    console.error("❌ Failed to spin up DB:", response.statusText);
    return null;
  }

  const spinup = await response.json();
  return spinup;
}
