import executeQuery, { executeTransaction } from "@/helpers/dbConnection";
import { logFleetActivity } from "./fleetActivityModel";

let isTableInitialized = false;

// Default initial fleets seed in case database is freshly configured
const defaultSeedFleets = [
  {
    vehicle_number: "MH 04 EF 9101",
    vehicle_model: "Tata Prima 5530.S",
    vehicle_type: "Multi-Axle Trailer (28-40T)",
    capacity: "35 Tons",
    fuel_type: "Diesel",
    ownership_type: "Owned",
    manufacturing_year: "2023",
    gps_tracking_id: "GPS-TRK-9101",
    chassis_number: "MAT5530SXYZ12345",
    status: "Active",
    notes: "Assigned for western corridor express freight.",
  },
  {
    vehicle_number: "MH 12 UV 0123",
    vehicle_model: "Ashok Leyland 2820-6x2",
    vehicle_type: "Heavy Truck (16-25T)",
    capacity: "20 Tons",
    fuel_type: "Diesel",
    ownership_type: "Owned",
    manufacturing_year: "2022",
    gps_tracking_id: "GPS-TRK-0123",
    chassis_number: "AL2820AB567890",
    status: "In Transit",
    notes: "Currently on route Pune -> Ahmedabad.",
  },
  {
    vehicle_number: "MH 01 JB 1122",
    vehicle_model: "BharatBenz 3528R",
    vehicle_type: "Container Body (20-32 FT)",
    capacity: "25 Tons",
    fuel_type: "Diesel",
    ownership_type: "Leased / Financed",
    manufacturing_year: "2023",
    gps_tracking_id: "GPS-TRK-1122",
    chassis_number: "BB3528RC998877",
    status: "Active",
    notes: "High-value container consignment vehicle.",
  },
  {
    vehicle_number: "MH 03 CD 5678",
    vehicle_model: "Eicher Pro 6028",
    vehicle_type: "Tanker (Chemical/Oil)",
    capacity: "18 KL / 20 Tons",
    fuel_type: "CNG",
    ownership_type: "Attached / Vendor",
    manufacturing_year: "2021",
    gps_tracking_id: "GPS-TRK-5678",
    chassis_number: "EP6028D112233",
    status: "Maintenance",
    notes: "Periodic brake inspection and wheel alignment scheduled.",
  },
  {
    vehicle_number: "MH 05 GH 2345",
    vehicle_model: "Mahindra Blazo X 28",
    vehicle_type: "Tipper / Dumper",
    capacity: "16 Cu.M",
    fuel_type: "Diesel",
    ownership_type: "Owned",
    manufacturing_year: "2022",
    gps_tracking_id: "GPS-TRK-2345",
    chassis_number: "MBX28E445566",
    status: "Active",
    notes: "Operating on civil construction materials route.",
  },
];

export async function ensureFleetTable() {
  if (isTableInitialized) return;
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS fleets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_number VARCHAR(50) NOT NULL UNIQUE,
        vehicle_model VARCHAR(100) NULL,
        vehicle_type VARCHAR(100) NULL,
        capacity VARCHAR(50) NULL,
        fuel_type VARCHAR(50) NULL,
        ownership_type VARCHAR(50) NULL,
        manufacturing_year VARCHAR(10) NULL,
        gps_tracking_id VARCHAR(100) NULL,
        chassis_number VARCHAR(100) NULL,
        engine_number VARCHAR(100) NULL,
        status VARCHAR(50) DEFAULT 'Active',
        notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await executeQuery(createTableQuery);

    // Check count, seed default records if table is brand new/empty
    const countRes = await executeQuery(`SELECT COUNT(*) as total FROM fleets`);
    const count = countRes?.[0]?.total || 0;
    if (count === 0) {
      for (const item of defaultSeedFleets) {
        try {
          await executeQuery(`INSERT INTO fleets SET ?`, item);
        } catch (seedErr) {
          console.warn("Fleet seed item error:", seedErr?.message);
        }
      }
    }
    isTableInitialized = true;
  } catch (error) {
    console.error("Error inspecting/initializing fleets table:", error);
  }
}

export function getAllFleetsModel() {
  return new Promise(async (resolve, reject) => {
    try {
      await ensureFleetTable();
      const selectQuery = `
        SELECT 
          f.*,
          d.id AS driver_id,
          d.driver_name AS driver_name,
          d.contact_number AS driver_contact,
          d.license_number AS driver_license_number,
          d.license_type AS driver_license_type,
          d.status AS driver_status,
          d.profile_photo AS driver_profile_photo
        FROM fleets f
        LEFT JOIN drivers d ON d.fleet_id = f.id
        ORDER BY f.id DESC
      `;
      const rows = await executeQuery(selectQuery);
      resolve({
        status: true,
        data: Array.isArray(rows) && rows.length > 0 ? rows : defaultSeedFleets.map((f, idx) => ({ id: idx + 1, ...f })),
        message: "Fleets fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching fleets:", error);
      // Fallback to default records if db fails
      resolve({
        status: true,
        data: defaultSeedFleets.map((f, idx) => ({ id: idx + 1, ...f })),
        message: "Fleets retrieved from fallback dataset",
      });
    }
  });
}

export function getFleetByIdModel(id) {
  return new Promise(async (resolve, reject) => {
    try {
      await ensureFleetTable();
      const fleetId = Number(id);
      if (!fleetId || isNaN(fleetId)) {
        return resolve({ status: false, message: "Invalid fleet ID" });
      }

      const selectQuery = `
        SELECT 
          f.*,
          d.id AS driver_id,
          d.driver_name AS driver_name,
          d.contact_number AS driver_contact,
          d.license_number AS driver_license_number,
          d.license_type AS driver_license_type,
          d.status AS driver_status,
          d.profile_photo AS driver_profile_photo
        FROM fleets f
        LEFT JOIN drivers d ON d.fleet_id = f.id
        WHERE f.id = ?
        LIMIT 1
      `;
      const rows = await executeQuery(selectQuery, [fleetId]);

      if (!Array.isArray(rows) || rows.length === 0) {
        return resolve({ status: false, message: "Fleet not found" });
      }

      const fleet = rows[0];

      // Fetch dynamic counts for tabs: Documents, EMI, Drivers, Maintenance
      const [docRes, emiRes, driverRes, maintRes] = await Promise.all([
        executeQuery(
          `SELECT COUNT(*) AS total FROM vehicle_documents WHERE vehicleNo = ?`,
          [fleet.vehicle_number]
        ).catch(() => [{ total: 0 }]),
        executeQuery(
          `SELECT COUNT(*) AS total FROM emi_master WHERE vehicle_number = ?`,
          [fleet.vehicle_number]
        ).catch(() => [{ total: 0 }]),
        executeQuery(
          `SELECT COUNT(*) AS total FROM drivers WHERE fleet_id = ?`,
          [fleet.id]
        ).catch(() => [{ total: 0 }]),
        executeQuery(
          `SELECT COUNT(*) AS total FROM fleet_activity_history WHERE fleet_id = ? AND operation_type = 'MAINTENANCE'`,
          [fleet.id]
        ).catch(() => [{ total: 0 }]),
      ]);

      const counts = {
        documents: docRes?.[0]?.total || 0,
        emi: emiRes?.[0]?.total || 0,
        driver: driverRes?.[0]?.total || (fleet.driver_id ? 1 : 0),
        maintenance: maintRes?.[0]?.total || (fleet.status === "Maintenance" ? 1 : 0),
      };

      // Auto-ensure driver assignment is recorded in activity history if driver is linked
      if (fleet.driver_id && fleet.driver_name) {
        try {
          const existingDriverAct = await executeQuery(
            `SELECT id FROM fleet_activity_history WHERE fleet_id = ? AND operation_type = 'DRIVER' LIMIT 1`,
            [fleet.id]
          );
          if (!existingDriverAct || existingDriverAct.length === 0) {
            await logFleetActivity({
              fleetId: fleet.id,
              operationType: "DRIVER",
              entityType: "DRIVER_ALLOCATION",
              entityId: String(fleet.driver_id),
              action: "ASSIGN",
              title: "Driver assigned",
              description: `Driver: ${fleet.driver_name}`,
              oldValue: null,
              newValue: { driver_id: fleet.driver_id, driver_name: fleet.driver_name },
              changedFields: ["driver_id", "driver_name"],
              performedByName: "Admin User",
              source: "driver",
              metadata: { vehicle_number: fleet.vehicle_number, driver_name: fleet.driver_name },
            });
          }
        } catch (syncErr) {
          console.warn("Could not sync driver activity:", syncErr?.message);
        }
      }

      resolve({
        status: true,
        data: {
          ...fleet,
          counts,
        },
        message: "Fleet details fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching fleet by ID:", error);
      resolve({
        status: false,
        message: error?.message || "Failed to fetch fleet details",
      });
    }
  });
}

export function addNewFleetModel(data) {
  return new Promise(async (resolve, reject) => {
    try {
      await ensureFleetTable();

      const {
        vehicle_number,
        vehicle_model,
        vehicle_type,
        capacity,
        fuel_type,
        ownership_type,
        manufacturing_year,
        gps_tracking_id,
        chassis_number,
        engine_number,
        status,
        notes,
        driver_id,
      } = data;

      const parsedDriverId =
        driver_id !== undefined && driver_id !== null && driver_id !== "" && Number(driver_id) > 0
          ? Number(driver_id)
          : null;

      const payload = {
        vehicle_number: vehicle_number ? vehicle_number.toUpperCase().trim() : null,
        vehicle_model: vehicle_model || null,
        vehicle_type: vehicle_type || null,
        capacity: capacity || null,
        fuel_type: fuel_type || null,
        ownership_type: ownership_type || null,
        manufacturing_year: manufacturing_year || null,
        gps_tracking_id: gps_tracking_id || null,
        chassis_number: chassis_number || null,
        engine_number: engine_number || null,
        status: status || "Active",
        notes: notes || null,
      };

      const result = await executeTransaction(async (queryFn) => {
        const insertRes = await queryFn(`INSERT INTO fleets SET ?`, payload);
        const newFleetId = insertRes.insertId;

        // If driver was selected, update driver.fleet_id
        if (parsedDriverId && newFleetId) {
          // Unassign any driver previously on this new fleet (just in case)
          await queryFn(`UPDATE drivers SET fleet_id = NULL WHERE fleet_id = ?`, [newFleetId]);
          // Assign selected driver to this fleet
          await queryFn(`UPDATE drivers SET fleet_id = ? WHERE id = ?`, [newFleetId, parsedDriverId]);
        }

        return insertRes;
      });

      if (result && result.affectedRows > 0) {
        const newFleetId = result.insertId;
        // Centralized Fleet Activity Logging: Registration
        await logFleetActivity({
          fleetId: newFleetId,
          operationType: "FLEET",
          entityType: "VEHICLE_INFO",
          entityId: String(newFleetId),
          action: "CREATE",
          title: "Fleet vehicle registered",
          description: `Vehicle ${payload.vehicle_number} (${payload.vehicle_model || payload.vehicle_type || "Commercial"}) registered to fleet`,
          oldValue: null,
          newValue: payload,
          changedFields: Object.keys(payload),
          performedByName: data.performedByName || "Admin User",
          source: "fleets",
          metadata: { vehicle_number: payload.vehicle_number, model: payload.vehicle_model },
        });

        // Activity Logging: Driver Assignment during registration
        if (parsedDriverId) {
          await logFleetActivity({
            fleetId: newFleetId,
            operationType: "DRIVER",
            entityType: "DRIVER_ALLOCATION",
            entityId: String(parsedDriverId),
            action: "ASSIGN",
            title: "Driver assigned on registration",
            description: `Driver (ID: ${parsedDriverId}) assigned to vehicle ${payload.vehicle_number}`,
            oldValue: null,
            newValue: { driver_id: parsedDriverId },
            changedFields: ["driver_id"],
            performedByName: data.performedByName || "Admin User",
            source: "fleet-driver",
          });
        }

        resolve({
          status: true,
          id: result.insertId,
          message: "Fleet vehicle added successfully",
        });
      } else {
        resolve({
          status: false,
          message: "Failed to add fleet vehicle.",
        });
      }
    } catch (error) {
      console.error("Error adding fleet:", error);
      if (error.code === "ER_DUP_ENTRY") {
        resolve({
          status: false,
          message: "A vehicle with this registration number already exists in your fleet.",
        });
      } else {
        resolve({
          status: false,
          message: "Database error while adding fleet vehicle.",
        });
      }
    }
  });
}

export function updateFleetModel(id, data) {
  return new Promise(async (resolve, reject) => {
    try {
      await ensureFleetTable();

      const parsedDriverId =
        data.driver_id !== undefined
          ? data.driver_id !== null && data.driver_id !== "" && Number(data.driver_id) > 0
            ? Number(data.driver_id)
            : null
          : undefined;

      const updateData = {
        vehicle_number: data.vehicle_number ? data.vehicle_number.toUpperCase().trim() : undefined,
        vehicle_model: data.vehicle_model,
        vehicle_type: data.vehicle_type,
        capacity: data.capacity,
        fuel_type: data.fuel_type,
        ownership_type: data.ownership_type,
        manufacturing_year: data.manufacturing_year,
        gps_tracking_id: data.gps_tracking_id,
        chassis_number: data.chassis_number,
        engine_number: data.engine_number,
        status: data.status,
        notes: data.notes,
      };

      // Clean undefined keys
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      // Fetch old record and old driver for diffing and audit trail
      const oldRows = await executeQuery(`SELECT * FROM fleets WHERE id = ?`, [id]);
      const oldFleet = Array.isArray(oldRows) && oldRows.length > 0 ? oldRows[0] : null;

      const oldDriverRows = await executeQuery(`SELECT id, driver_name FROM drivers WHERE fleet_id = ?`, [id]);
      const oldDriver = Array.isArray(oldDriverRows) && oldDriverRows.length > 0 ? oldDriverRows[0] : null;

      await executeTransaction(async (queryFn) => {
        if (Object.keys(updateData).length > 0) {
          await queryFn(`UPDATE fleets SET ? WHERE id = ?`, [updateData, id]);
        }

        // Manage driver assignment if provided in update payload
        if (parsedDriverId !== undefined) {
          if (parsedDriverId) {
            // Remove previous driver on this fleet (if different)
            await queryFn(`UPDATE drivers SET fleet_id = NULL WHERE fleet_id = ? AND id != ?`, [
              id,
              parsedDriverId,
            ]);
            // Assign selected driver to this fleet
            await queryFn(`UPDATE drivers SET fleet_id = ? WHERE id = ?`, [id, parsedDriverId]);
          } else {
            // Unassign whoever was on this fleet
            await queryFn(`UPDATE drivers SET fleet_id = NULL WHERE fleet_id = ?`, [id]);
          }
        }
      });

      // Centralized Activity Logging for Fleet Update
      if (oldFleet) {
        // Status change specific audit log
        if (updateData.status && updateData.status !== oldFleet.status) {
          await logFleetActivity({
            fleetId: id,
            operationType: "STATUS",
            entityType: "STATUS_CHANGE",
            entityId: String(id),
            action: updateData.status === "Active" ? "ACTIVATE" : "UPDATE",
            title: "Vehicle status changed",
            description: `${oldFleet.status} → ${updateData.status}`,
            oldValue: { status: oldFleet.status },
            newValue: { status: updateData.status },
            changedFields: ["status"],
            performedByName: data.performedByName || "Admin User",
            source: "fleets",
          });
        }

        // Driver Assignment Change Audit Log
        if (parsedDriverId !== undefined && (parsedDriverId !== (oldDriver?.id || null))) {
          if (parsedDriverId) {
            const newDriverRows = await executeQuery(`SELECT id, driver_name FROM drivers WHERE id = ?`, [parsedDriverId]);
            const newDriverName = newDriverRows?.[0]?.driver_name || `Driver #${parsedDriverId}`;
            await logFleetActivity({
              fleetId: id,
              operationType: "DRIVER",
              entityType: "DRIVER_ALLOCATION",
              entityId: String(parsedDriverId),
              action: "ASSIGN",
              title: "Driver assigned",
              description: `Driver: ${newDriverName}`,
              oldValue: oldDriver ? { driver_id: oldDriver.id, driver_name: oldDriver.driver_name } : null,
              newValue: { driver_id: parsedDriverId, driver_name: newDriverName },
              changedFields: ["driver_id", "driver_name"],
              performedByName: data.performedByName || "Admin User",
              source: "fleet-driver",
            });
          } else if (oldDriver) {
            await logFleetActivity({
              fleetId: id,
              operationType: "DRIVER",
              entityType: "DRIVER_ALLOCATION",
              entityId: String(oldDriver.id),
              action: "UNASSIGN",
              title: "Driver removed",
              description: `${oldDriver.driver_name} unassigned from vehicle`,
              oldValue: { driver_id: oldDriver.id, driver_name: oldDriver.driver_name },
              newValue: null,
              changedFields: ["driver_id"],
              performedByName: data.performedByName || "Admin User",
              source: "fleet-driver",
            });
          }
        }

        // General Fleet Vehicle Details Update
        const hasOtherChanges = Object.keys(updateData).some(
          (k) => k !== "status" && String(oldFleet[k] ?? "") !== String(updateData[k] ?? "")
        );

        if (hasOtherChanges) {
          await logFleetActivity({
            fleetId: id,
            operationType: "FLEET",
            entityType: "VEHICLE_DETAILS",
            entityId: String(id),
            action: "UPDATE",
            title: "Vehicle details updated",
            description: `Vehicle details updated for ${updateData.vehicle_number || oldFleet.vehicle_number}`,
            oldValue: oldFleet,
            newValue: { ...oldFleet, ...updateData },
            performedByName: data.performedByName || "Admin User",
            source: "fleets",
          });
        }
      }

      resolve({ status: true, message: "Fleet vehicle updated successfully" });
    } catch (error) {
      console.error("Error updating fleet:", error);
      if (error.code === "ER_DUP_ENTRY") {
        resolve({
          status: false,
          message: "A vehicle with this registration number already exists.",
        });
      } else {
        resolve({
          status: false,
          message: "Database error while updating fleet vehicle",
        });
      }
    }
  });
}

export function deleteFleetModel(ids) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return resolve({ status: false, message: "No vehicle IDs provided for deletion" });
      }

      await ensureFleetTable();

      // Fetch fleet info before deletion for permanent audit logging
      const fleetRows = await executeQuery(`SELECT id, vehicle_number, vehicle_model FROM fleets WHERE id IN (?)`, [ids]);

      const result = await executeTransaction(async (queryFn) => {
        // Unassign any drivers assigned to the fleets being deleted
        await queryFn(`UPDATE drivers SET fleet_id = NULL WHERE fleet_id IN (?)`, [ids]);
        // Delete fleets
        const deleteRes = await queryFn(`DELETE FROM fleets WHERE id IN (?)`, [ids]);
        return deleteRes;
      });

      if (result.affectedRows > 0) {
        // Centralized Activity Logging for Fleet Deletion
        if (Array.isArray(fleetRows)) {
          for (const f of fleetRows) {
            await logFleetActivity({
              fleetId: f.id,
              operationType: "FLEET",
              entityType: "VEHICLE_INFO",
              entityId: String(f.id),
              action: "DELETE",
              title: "Fleet vehicle deleted",
              description: `Vehicle ${f.vehicle_number} (${f.vehicle_model || "Fleet vehicle"}) removed from fleet system`,
              oldValue: f,
              newValue: null,
              changedFields: ["deleted"],
              performedByName: "Admin User",
              source: "fleets",
            });
          }
        }

        resolve({
          status: true,
          message: `${result.affectedRows} fleet vehicle${result.affectedRows > 1 ? "s" : ""} deleted successfully`,
        });
      } else {
        resolve({
          status: false,
          message: "No fleet vehicles found with the given IDs",
        });
      }
    } catch (error) {
      console.error("Error deleting fleet:", error);
      resolve({
        status: false,
        message: "Database error while deleting fleet vehicle(s)",
      });
    }
  });
}
