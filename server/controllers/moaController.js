const db = require('../config/db');

// Add MOA
const addMOA = (req, res) => {
  const {
    name,
    typeOfMoa,
    nature_of_business,
    contactFirstName,
    contactLastName,
    contactNumber,
    emailAddress,
    status,
    years_validity,
    date_notarized,
    expiry_date,
    year_submitted,
    user_id,
  } = req.body;

  // Convert typeOfMoa string to corresponding type_id
  const type_id = {
    Practicum: 1,
    Employment: 2,
    Scholarship: 3,
    Research: 4,
  }[typeOfMoa];

  if (!type_id) {
    return res.status(400).json({ message: "Invalid MOA type selected." });
  }

  const checkContactQuery =
    "SELECT contact_id FROM moa_contact WHERE contact_number = ? AND email = ?";

  db.query(checkContactQuery, [contactNumber, emailAddress], (err, contactResults) => {
    if (err) {
      console.error("Error checking contact:", err);
      return res.status(500).json({ message: "Error checking contact" });
    }

    if (contactResults.length > 0) {
      insertMOA(contactResults[0].contact_id);
    } else {
      const insertContactQuery =
        "INSERT INTO moa_contact (firstname, lastname, contact_number, email) VALUES (?, ?, ?, ?)";

      db.query(insertContactQuery, [contactFirstName, contactLastName, contactNumber, emailAddress], (err, contactInsertResult) => {
        if (err) {
          console.error("Error inserting contact:", err);
          return res.status(500).json({ message: "Error inserting contact" });
        }
        insertMOA(contactInsertResult.insertId);
      });
    }
  });

  function insertMOA(contact_id) {
    const insertMOAQuery =
      "INSERT INTO moa_info (name, type_id, nature_of_business, contact_id, status, user_id) VALUES (?, ?, ?, ?, ?, ?)";
  
    db.query(insertMOAQuery, [name, type_id, nature_of_business, contact_id, status, user_id], (err, moaInsertResult) => {
      if (err) {
        console.error("Error inserting MOA:", err);
        return res.status(500).json({ message: "Error inserting MOA" });
      }
  
      const moa_id = moaInsertResult.insertId;
  
      const insertValidityQuery = `
        INSERT INTO moa_validity_period (moa_id, years_validity, date_notarized, expiry_date, year_submitted)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(insertValidityQuery, [moa_id, years_validity, date_notarized, expiry_date, year_submitted], (err, validityInsertResult) => {
        if (err) {
          console.error("Error inserting validity period:", err);
          return res.status(500).json({ message: "Error inserting validity period" });
        }
  
        const validity_id = validityInsertResult.insertId;
  
        // Update MOA with the validity_id
        const updateMOAQuery = "UPDATE moa_info SET validity_id = ? WHERE moa_id = ?";
        db.query(updateMOAQuery, [validity_id, moa_id], (err) => {
          if (err) {
            console.error("Error updating MOA with validity ID:", err);
            return res.status(500).json({ message: "Error updating MOA with validity ID" });
          }
  
          res.status(201).json({ message: "MOA added successfully", moa_id });
        });
      });
    });
  }  
};

// Get All MOAs
const getAllMOAs = (req, res) => {
    const query = `
        SELECT 
            moa_info.moa_id, moa_info.name, moa_info.type_id, moa_info.nature_of_business, 
            moa_contact.firstname, moa_contact.lastname, moa_contact.contact_number, moa_contact.email, 
            moa_info.status, moa_validity_period.years_validity, moa_validity_period.date_notarized, 
            moa_validity_period.expiry_date, moa_validity_period.year_submitted
        FROM moa_info
        JOIN moa_contact ON moa_info.contact_id = moa_contact.contact_id
        JOIN moa_validity_period ON moa_info.validity_id = moa_validity_period.validity_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching MOAs:", err);
            return res.status(500).send('Error retrieving MOAs');
        }
        res.status(200).json({ moas: results });
    });
};

// Update MOA
const updateMOA = (req, res) => {
    const { id } = req.params;
    const { name, type_id, nature_of_business, contact_id, status, validity_id, user_id } = req.body;

    const query = `
        UPDATE moa_info
        SET name = ?, type_id = ?, nature_of_business = ?, contact_id = ?, status = ?, validity_id = ?, user_id = ?
        WHERE moa_id = ?
    `;
    
    db.query(query, [name, type_id, nature_of_business, contact_id, status, validity_id, user_id, id], (err, result) => {
        if (err) {
            console.error('Error updating MOA:', err);
            return res.status(500).send('Error updating MOA');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('MOA not found');
        }
        res.status(200).send('MOA updated successfully');
    });
};

// Delete MOA
const deleteMOA = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM moa_info WHERE moa_id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting MOA:', err);
            return res.status(500).send('Error deleting MOA');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('MOA not found');
        }

        res.status(200).send('MOA deleted successfully');
    });
};

module.exports = {
    addMOA,
    getAllMOAs,
    updateMOA,
    deleteMOA,
};
