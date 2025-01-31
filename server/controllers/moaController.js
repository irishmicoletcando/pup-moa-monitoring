const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { pool } = require('../config/db');

// Configure multer to use memory storage instead of disk
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  }
});

// Azure Blob Storage configuration
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = 'moa-documents';

// Initialize Azure Blob Service Client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

const uploadToBlob = async (file, fileName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    
    // Force the content type to 'application/pdf'
    const uploadOptions = {
      blobHTTPHeaders: { blobContentType: 'application/pdf' }
    };

    // Upload the file as a PDF to Azure Blob Storage
    await blockBlobClient.upload(file.buffer, file.size, uploadOptions);

    return blockBlobClient.url;  // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to blob storage:', error);
    throw new Error('Failed to upload file to storage');
  }
};


const addMOA = async (req, res) => {
  const uploadFiles = upload.array('files', 10);

  uploadFiles(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        message: "File upload error", 
        error: err.message 
      });
    } else if (err) {
      return res.status(500).json({ 
        message: "Server error during upload",
        error: err.message 
      });
    }

    const connection = await pool.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // Parse the JSON data from the FormData
      const formData = JSON.parse(req.body.data);
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
      } = formData;

      // Convert typeOfMoa string to corresponding type_id
      const type_id = {
        Practicum: 1,
        Employment: 2,
        Scholarship: 3,
        Research: 4,
      }[typeOfMoa];

      if (!type_id) {
        await connection.rollback();
        return res.status(400).json({ message: "Invalid MOA type selected." });
      }

      // Check for existing contact
      const [contactResults] = await connection.query(
        "SELECT contact_id FROM moa_contact WHERE contact_number = ? AND email = ?",
        [contactNumber, emailAddress]
      );

      let contact_id;
      if (contactResults.length > 0) {
        contact_id = contactResults[0].contact_id;
      } else {
        const [contactInsertResult] = await connection.query(
          "INSERT INTO moa_contact (firstname, lastname, contact_number, email) VALUES (?, ?, ?, ?)",
          [contactFirstName, contactLastName, contactNumber, emailAddress]
        );
        contact_id = contactInsertResult.insertId;
      }

      // Insert MOA
      const [moaInsertResult] = await connection.query(
        "INSERT INTO moa_info (name, type_id, nature_of_business, contact_id, status, user_id) VALUES (?, ?, ?, ?, ?, ?)",
        [name, type_id, nature_of_business, contact_id, status, user_id]
      );
      
      const moa_id = moaInsertResult.insertId;

      // Insert validity period
      const [validityInsertResult] = await connection.query(
        "INSERT INTO moa_validity_period (moa_id, years_validity, date_notarized, expiry_date, year_submitted) VALUES (?, ?, ?, ?, ?)",
        [moa_id, years_validity, date_notarized, expiry_date, year_submitted]
      );      

      const validity_id = validityInsertResult.insertId;

      // Update MOA with validity_id
      await connection.query(
        "UPDATE moa_info SET validity_id = ? WHERE moa_id = ?",
        [validity_id, moa_id]
      );

      // Upload files to Azure Blob Storage and save references in database
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileName = `${Date.now()}-${file.originalname}`;
          const blobUrl = await uploadToBlob(file, fileName);
          
          await connection.query(
            "INSERT INTO moa_documents (moa_id, document_name, file_path, uploaded_at, uploaded_by) VALUES (?, ?, ?, NOW(), ?)",
            [moa_id, file.originalname, blobUrl, user_id]
          );
        }
      }

      // Commit the transaction
      await connection.commit();
      
      res.status(201).json({ 
        message: "MOA added successfully", 
        moa_id 
      });
      
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      console.error("Error in MOA creation process:", error);
      res.status(500).json({ 
        message: "Error creating MOA",
        error: error.message 
      });
    } finally {
      connection.release(); // Always release the connection
    }
  });
};

// Get All MOAs
const getAllMOAs = async (req, res) => {
  const query = `
      SELECT 
          moa_info.moa_id, 
          moa_info.name, 
          moa_type.type_name AS type_of_moa, 
          moa_info.nature_of_business, 
          CONCAT(moa_contact.firstname, ' ', moa_contact.lastname) AS contact_person, 
          moa_contact.contact_number, 
          moa_contact.email, 
          moa_info.status AS moa_status, 
          moa_validity_period.years_validity, 
          moa_validity_period.date_notarized, 
          moa_validity_period.expiry_date, 
          moa_validity_period.year_submitted, 
          moa_documents.file_path -- Now mapping 1 file_path per MOA
      FROM moa_info
      JOIN moa_contact ON moa_info.contact_id = moa_contact.contact_id
      JOIN moa_validity_period ON moa_info.validity_id = moa_validity_period.validity_id
      JOIN moa_type ON moa_info.type_id = moa_type.type_id
      LEFT JOIN moa_documents ON moa_info.moa_id = moa_documents.moa_id -- Ensures only one document per MOA
      ORDER BY moa_info.moa_id;
  `;

  try {
      const [results] = await pool.query(query);
      res.status(200).json({ moas: results });
  } catch (err) {
      console.error("Error fetching MOAs:", err);
      res.status(500).send('Error retrieving MOAs');
  }
};

// Update MOA
const updateMOA = async (req, res) => {
    const { id } = req.params;
    const { name, type_id, nature_of_business, contact_id, status, validity_id, user_id } = req.body;

    const query = `
        UPDATE moa_info
        SET name = ?, type_id = ?, nature_of_business = ?, contact_id = ?, status = ?, validity_id = ?, user_id = ?
        WHERE moa_id = ?
    `;
    
    try {
        const [result] = await pool.query(query, [name, type_id, nature_of_business, contact_id, status, validity_id, user_id, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('MOA not found');
        }
        res.status(200).send('MOA updated successfully');
    } catch (err) {
        console.error('Error updating MOA:', err);
        res.status(500).send('Error updating MOA');
    }
};

// Delete MOA
const deleteMOA = async (req, res) => {
  const { id } = req.params;

  // Define the queries for altering foreign key constraints
  const dropForeignKey_moa_info_contact_id = `
    ALTER TABLE moa_info
    DROP FOREIGN KEY fk_moa_info_contact_id;
  `;

  const addForeignKey_moa_info_contact_id = `
    ALTER TABLE moa_info
    ADD CONSTRAINT fk_moa_info_contact_id
    FOREIGN KEY (contact_id) REFERENCES moa_contact(contact_id)
    ON DELETE CASCADE;
  `;

  const alterForeignKey_moa_validity_period_drop = `
    ALTER TABLE moa_validity_period
    DROP FOREIGN KEY fk_moa_validity_period_moa_id;
  `;

  const alterForeignKey_moa_validity_period_add = `
    ALTER TABLE moa_validity_period
    ADD CONSTRAINT fk_moa_validity_period_moa_id
    FOREIGN KEY (moa_id) REFERENCES moa_info(moa_id)
    ON DELETE CASCADE;
  `;

  // Alter the foreign key for validity_id in moa_info, referencing moa_validity_period
  const alterForeignKey_validity_id_moa_info = `
    ALTER TABLE moa_info
    DROP FOREIGN KEY fk_moa_info_validity_id;
  `;
  
  const addForeignKey_validity_id_moa_info = `
    ALTER TABLE moa_info
    ADD CONSTRAINT fk_moa_info_validity_id
    FOREIGN KEY (validity_id) REFERENCES moa_validity_period(validity_id)
    ON DELETE CASCADE;
  `;

  const querySELECT = `
    SELECT contact_id, validity_id FROM moa_info WHERE moa_id = ?;
  `;

  let connection;

  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // Start the transaction
    await connection.beginTransaction();

    // Drop and add the foreign key for moa_info to moa_contact (with CASCADE)
    await connection.query(dropForeignKey_moa_info_contact_id);
    await connection.query(addForeignKey_moa_info_contact_id);

    // Alter foreign key for moa_validity_period (separate commands for DROP and ADD)
    await connection.query(alterForeignKey_moa_validity_period_drop);
    await connection.query(alterForeignKey_moa_validity_period_add);

    // Alter foreign key for validity_id in moa_info
    await connection.query(alterForeignKey_validity_id_moa_info);
    await connection.query(addForeignKey_validity_id_moa_info);

    // Get the contact_id and validity_id from the moa_info table
    const [result_contact_id_validity_id] = await connection.query(querySELECT, [id]);

    // If no record is found, return 404
    if (result_contact_id_validity_id.length === 0) {
      return res.status(404).send('MOA not found');
    }

    // Extract contact_id and validity_id from the result
    const { contact_id, validity_id } = result_contact_id_validity_id[0];

    // Delete dependent records from other tables first
    await connection.query('DELETE FROM moa_documents WHERE moa_id = ?', [id]);
    await connection.query('DELETE FROM moa_status_history WHERE moa_id = ?', [id]);

    // Now you can delete the moa_info record (it will automatically delete related rows in moa_contact and moa_validity_period due to CASCADE)
    await connection.query('DELETE FROM moa_info WHERE moa_id = ?', [id]);

    // Commit the transaction
    await connection.commit();

    // Return success message
    res.status(200).send('MOA deleted successfully');
  } catch (err) {
    // Rollback the transaction if an error occurs
    if (connection) {
      await connection.rollback();
    }
    console.error('Error deleting MOA:', err);
    res.status(500).send('Error deleting MOA');
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
};

// const getMOADocument = async (req, res) => {
//   const { document_id } = req.params;
  
//   if (!document_id) {
//       return res.status(400).json({ message: "Document ID is required" });
//   }
  
//   const query = `
//       SELECT file_path FROM moa_documents
//       WHERE document_id = ?
//       LIMIT 1;
//   `;
  
//   try {
//       const [results] = await pool.query(query, [document_id]);
//       if (results.length === 0) {
//           return res.status(404).json({ message: "Document not found." });
//       }
      
//       res.redirect(results[0].file_path);
//   } catch (err) {
//       console.error("Error fetching MOA document:", err);
//       res.status(500).json({ message: "Error retrieving MOA document" });
//   }
// };

module.exports = {
    addMOA,
    getAllMOAs,
    updateMOA,
    deleteMOA,
    // getMOADocument,
};
