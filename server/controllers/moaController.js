const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { pool } = require('../config/db');

// Configure multer to use memory storage instead of disk
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
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
    throw new Error('Failed to upload file to storage');
  }
};

const addMOA = async (req, res) => {
  const uploadFiles = upload.array('files', 10);

  uploadFiles(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    } else if (err) {
      return res.status(500).json({ message: "Server error during upload", error: err.message });
    }

    const connection = await pool.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      const formData = JSON.parse(req.body.data);

      // Check if formData contains multiple MOAs
      const moas = formData.moas || [formData];

      const insertedMOAs = [];

      for (const moa of moas) {
        const {
          name,
          typeOfMoa,
          natureOfBusiness,
          address,
          contactFirstName,
          contactLastName,
          position,
          contactNumber,
          emailAddress,
          status,
          years_validity,
          date_notarized,
          expiry_date,
          year_submitted,
          branch,
          course,
          user_id
        } = moa;

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
            "INSERT INTO moa_contact (firstname, lastname, position, contact_number, email) VALUES (?, ?, ?, ?, ?)",
            [contactFirstName, contactLastName, position, contactNumber, emailAddress]
          );
          contact_id = contactInsertResult.insertId;
        }

        // Insert MOA
        const [moaInsertResult] = await connection.query(
          "INSERT INTO moa_info (name, type_id, nature_of_business, address, contact_id, status, branch, course, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [name, type_id, natureOfBusiness, address, contact_id, status, branch, course, user_id]
        );

        const moa_id = moaInsertResult.insertId;

        // Insert validity period if provided
        if (years_validity && date_notarized && expiry_date) {
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
        }

        // Handle file uploads for the current MOA
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

        insertedMOAs.push({ moa_id, name });
      }

      // Commit the transaction
      await connection.commit();

      res.status(201).json({ message: "MOAs added successfully", insertedMOAs });

    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: "Error creating MOAs", error: error.message });
    } finally {
      connection.release();
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
          moa_info.address,
          moa_info.branch,
          moa_info.course,
          moa_contact.firstname,
          moa_contact.lastname,
          CONCAT(moa_contact.firstname, ' ', moa_contact.lastname) AS contact_person, 
          moa_contact.contact_number, 
          moa_contact.email, 
          moa_contact.position,
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
      res.status(500).send('Error retrieving MOAs');
  }
};

const getMOAById = async (req, res) => {
  const { id } = req.params;
  
  const moaId = parseInt(id, 10);
  if (isNaN(moaId)) {
    return res.status(400).json({ error: 'Invalid MOA ID' });
  }

  const query = `
    SELECT 
      moa_info.moa_id, 
      moa_info.name, 
      moa_type.type_name AS type_of_moa, 
      moa_info.nature_of_business, 
      moa_info.address,
      moa_info.branch,
      moa_info.course,
      moa_contact.firstname,
      moa_contact.lastname,
      moa_contact.contact_number, 
      moa_contact.position,
      moa_contact.email AS email_address, 
      moa_info.status, 
      moa_validity_period.years_validity, 
      moa_validity_period.date_notarized, 
      moa_validity_period.expiry_date, 
      moa_validity_period.year_submitted,
      moa_documents.file_path,
      moa_documents.has_nda
    FROM moa_info
    JOIN moa_contact ON moa_info.contact_id = moa_contact.contact_id
    JOIN moa_validity_period ON moa_info.validity_id = moa_validity_period.validity_id
    JOIN moa_type ON moa_info.type_id = moa_type.type_id
    LEFT JOIN moa_documents ON moa_info.moa_id = moa_documents.moa_id
    WHERE moa_info.moa_id = ?
  `;

  try {
    const [results] = await pool.query(query, [moaId]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'MOA not found' });
    }
    
    res.status(200).json({ moa: results[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving MOA' });
  }
};

// Update MOA
const updateMOA = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Parse the JSON data from FormData
    let moaData;
    try {
      moaData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
      console.log('Parsed MOA Data:', moaData);
    } catch (error) {
      console.error('Error parsing MOA data:', error);
      return res.status(400).json({
        message: "Invalid request data format",
        error: error.message
      });
    }

    // Required fields for MOA update (documents are now optional)
    const requiredFields = [
      'name',
      'type_of_moa',
      'nature_of_business',
      'address',
      'firstname',
      'lastname',
      'position',
      'contact_number',
      'email_address',
      'status',
      'years_validity',
      'date_notarized',
      'expiry_date',
      'year_submitted',
      'branch',
      'course',
      'user_id'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = moaData[field];
      const isEmpty = value === undefined || value === null || value === '';
      if (isEmpty) {
        console.log(`Field "${field}" is missing or empty. Value:`, value);
      }
      return isEmpty;
    });
    
    if (missingFields.length > 0) {
      console.log('All received data:', moaData);
      console.log('Missing fields detail:', missingFields.map(field => ({
        field,
        value: moaData[field],
        type: typeof moaData[field]
      })));
      
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields,
        receivedData: moaData,
        fieldDetails: missingFields.map(field => ({
          field,
          value: moaData[field],
          type: typeof moaData[field]
        }))
      });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Verify MOA exists
      const [moaExists] = await connection.query(
        "SELECT moa_id FROM moa_info WHERE moa_id = ?",
        [id]
      );

      if (moaExists.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "MOA not found" });
      }

      // Update contact details
      const [contactResults] = await connection.query(
        "SELECT contact_id FROM moa_contact WHERE contact_number = ? AND email = ?",
        [moaData.contact_number, moaData.email_address]
      );

      let contact_id;
      if (contactResults.length > 0) {
        contact_id = contactResults[0].contact_id;
        await connection.query(
          "UPDATE moa_contact SET firstname = ?, lastname = ?, position = ?, contact_number = ?, email = ? WHERE contact_id = ?",
          [moaData.firstname, moaData.lastname, moaData.position, moaData.contact_number, moaData.email_address, contact_id]
        );
      } else {
        const [contactInsertResult] = await connection.query(
          "INSERT INTO moa_contact (firstname, lastname, position, contact_number, email) VALUES (?, ?, ?, ?, ?)",
          [moaData.firstname, moaData.lastname, moaData.position, moaData.contact_number, moaData.email_address]
        );
        contact_id = contactInsertResult.insertId;
      }

      // Update MOA details
      await connection.query(
        `UPDATE moa_info 
         SET name = ?, 
             type_id = ?, 
             nature_of_business = ?, 
             address = ?, 
             contact_id = ?, 
             status = ?, 
             branch = ?, 
             course = ?, 
             user_id = ?
         WHERE moa_id = ?`,
        [
          moaData.name,
          moaData.type_of_moa,
          moaData.nature_of_business,
          moaData.address,
          contact_id,
          moaData.status,
          moaData.branch,
          moaData.course,
          moaData.user_id,
          id
        ]
      );

      // Update validity period
      const [validityResults] = await connection.query(
        "SELECT validity_id FROM moa_validity_period WHERE moa_id = ?",
        [id]
      );

      if (validityResults.length > 0) {
        await connection.query(
          "UPDATE moa_validity_period SET years_validity = ?, date_notarized = ?, expiry_date = ?, year_submitted = ? WHERE moa_id = ?",
          [moaData.years_validity, moaData.date_notarized, moaData.expiry_date, moaData.year_submitted, id]
        );
      } else {
        await connection.query(
          "INSERT INTO moa_validity_period (moa_id, years_validity, date_notarized, expiry_date, year_submitted) VALUES (?, ?, ?, ?, ?)",
          [id, moaData.years_validity, moaData.date_notarized, moaData.expiry_date, moaData.year_submitted]
        );
      }

      // Handle file uploads only if files are present
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const fileName = `${Date.now()}-${file.originalname}`;
          const blobUrl = await uploadToBlob(file, fileName);

          await connection.query(
            "INSERT INTO moa_documents (moa_id, document_name, file_path, uploaded_at, uploaded_by, has_nda) VALUES (?, ?, ?, NOW(), ?, ?)",
            [id, file.originalname, blobUrl, moaData.user_id, moaData.has_nda || false]
          );
        }
      }

      await connection.commit();
      res.status(200).json({ 
        message: "MOA updated successfully",
        moa_id: id
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error updating MOA:", error);
    res.status(500).json({ 
      message: "Error updating MOA", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const deleteMOA = async (req, res) => {
  const { id } = req.params;
  
  // Convert id to number and validate
  const moaId = parseInt(id, 10);
  if (isNaN(moaId)) {
    return res.status(400).json({ error: 'Invalid MOA ID' });
  }

  const querySELECT = `
    SELECT contact_id, validity_id FROM moa_info WHERE moa_id = ?;
  `;

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Use the parsed moaId in queries
    const [result_contact_id_validity_id] = await connection.query(querySELECT, [moaId]);

    if (result_contact_id_validity_id.length === 0) {
      return res.status(404).json({ error: 'MOA not found' });
    }

    const { contact_id, validity_id } = result_contact_id_validity_id[0];

    // Delete dependent records
    await connection.query('DELETE FROM moa_documents WHERE moa_id = ?', [moaId]);
    await connection.query('DELETE FROM moa_status_history WHERE moa_id = ?', [moaId]);
    await connection.query('DELETE FROM moa_info WHERE moa_id = ?', [moaId]);
    await connection.query('DELETE FROM moa_validity_period WHERE moa_id = ?', [moaId]);

    await connection.commit();
    res.status(200).json({ message: 'MOA deleted successfully' });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({ error: 'Error deleting MOA' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  addMOA,
  getAllMOAs,
  getMOAById,
  updateMOA,
  deleteMOA,
};