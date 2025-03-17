"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import "./homePage.css";

const images = [
  {
    src: "/login.png",
    alt: "Login",
    description:
      "The login system intelligently directs users based on their role within the company. When an office employee logs in, they are automatically redirected to the Office Dashboard, which is optimized for desktop and laptop viewing, providing a comprehensive overview of fleet management. Meanwhile, drivers are redirected to the Truck Sheet Form, a mobile-friendly interface designed for quick and efficient truck inspections, fuel tracking, and reporting directly from their devices.",
    id: "login",
    className: "login",
  },
  {
    src: "/trucksheet-fuel.png",
    alt: "Truck Mileage",
    description:
      "After logging in, drivers are presented with the Fuel & Mileage section of the form. Here, they must select a truck number from the dropdown and enter the truck's current mileage as displayed on the odometer. While recording the fuel level is optional, it provides valuable insights into fuel usage. Selecting a truck and entering mileage are required before the form can be submitted, ensuring accurate tracking of the truck's current state.",
    className: "trucksheet-mileage",
    id: "trucksheet-mileage",
  },
  {
    src: "/trucksheet-remarks.png",
    alt: "Leave Remarks",
    description: `The Remarks section allows drivers to provide additional notes about the truck's condition, issues, or any relevant details. Once submitted, these remarks will be visible in the Truck Table on the Office Dashboard, ensuring office employees have access to the latest updates.\n\n
    While Truck Inspection, Equipment Inspection, and Final Review data are also saved to the database, there is currently no interface in the dashboard to review the full Truck Sheet—this feature is coming soon.\n\n
    After submitting the form, the Office Dashboard will automatically update with the latest data within 30 seconds, keeping fleet management information up to date in near real-time.\n\n`,
    className: "trucksheet-remarks",
    id: "trucksheet-remarks",
  },
  {
    src: "/truckspage.png",
    alt: "Truck Table",
    description: `The Truck Table provides an up-to-date overview of the latest reported Truck Sheets, allowing office employees to efficiently monitor fleet activity. Each row displays key details, including the truck number, mileage, fuel level, remarks, the date the data was reported, and the driver.\n\n
    In addition to reviewing data, users can manage fleet information directly from this interface. The "ADD TRUCK" button allows new trucks to be added to the system. When a truck is selected, this button transforms into a "DELETE TRUCK" button, enabling removal from the fleet. To prevent accidental deletions, a confirmation pop-up appears before finalizing the removal.\n\n
    This centralized table ensures that fleet management remains organized and up-to-date with the most recent truck sheet submissions.`,
    className: "truckTable",
    id: "truckTable",
  },
  {
    src: "/deleteTruckConfirm.png",
    alt: "Delete Truck Confirmation",
    description: `⚠ This action cannot be undone.\n\n

    To improve record-keeping, a Truck Sheet Archive feature will be introduced in the future. This will allow office employees to access and review historical truck data even after a truck has been deleted.`,
    className: "deleteTruck",
    id: "deleteTruck",
  },
  {
    src: "/driverpage.png",
    alt: "Driver Table",
    description: `The Driver Table provides an overview of all drivers, including the date and truck number of their most recently submitted Truck Sheet. You can add a new driver using the "ADD DRIVER" button. Selecting an existing driver changes this button to "EDIT DRIVER", which opens a pop-up for modifying their details.`,
    className: "driversTable",
    id: "driversTable",
  },
  {
    src: "/updateDriver.png",
    alt: "Update Driver",
    description:
      "When the Edit Driver pop-up opens, it is pre-filled with the driver’s existing information, except for the password. If left blank, the current password remains unchanged. You also have the option to delete the driver. This functionality mirrors the Edit Employee feature in the Office Table.",
    className: "updateDriver",
    id: "updateDriver",
  },
  {
    src: "/officepage.png",
    alt: "Office Table",
    description:
      "The Office Table does not display data since no records are collected from office employees. However, you still have the ability to add, edit, or delete office employees as needed. This functionality ensures that office staff can be managed effectively within the system.",
    className: "officeTable",
    id: "officeTable",
  },
  {
    src: "/createemployee.png",
    alt: "Add Employee",
    description:
      "When the Add Office Employee pop-up opens, a form appears requiring input for all fields. This ensures complete employee records are created before submission. This functionality mirrors the Add Driver feature in the Driver Table, maintaining consistency in user management across the system.",
    className: "addEmployee",
    id: "addEmployee",
  },
];

export default function HomePageContent() {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  return (
    <main className="homepage">
      {/* Welcome Section */}
      <section className="welcome-section">
        <motion.h1
          className="welcome-title"
          initial={{ opacity: 0, y: -400 }}
          animate={{ opacity: 1, y: -125 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Welcome to <span>ABC Trucksheets</span>
        </motion.h1>
      </section>

      {images.map((item, index) => {
        if (
          screenWidth < 1750 &&
          ["truckTable", "driversTable", "officeTable"].includes(item.id)
        ) {
          return (
            <motion.section
              key={index}
              id={item.id}
              className="image-text-section table-responsive"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="responsive-title">{item.alt}</h2>

              <div className="responsive-description">
                {item.description.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="description-section">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="responsive-image-container">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={700}
                  height={450}
                  priority={true}
                  quality={100}
                  unoptimized={true}
                  id={item.id}
                  className={item.className}
                />
              </div>
            </motion.section>
          );
        }

        return (
          <motion.section
            key={index}
            className={`image-text-section ${
              index % 2 === 0 ? "left" : "right"
            }`}
            id={item.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="image-container" id={item.id}>
              <Image
                src={item.src}
                alt={item.alt}
                width={700}
                height={450}
                priority={true}
                quality={100}
                unoptimized={true}
                id={item.id}
                className={item.className}
              />
            </div>
            <div className="text-container" id={item.id}>
              <h2>{item.alt}</h2>
              {item.description.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.section>
        );
      })}
    </main>
  );
}
