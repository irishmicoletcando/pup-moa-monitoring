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
          user_id,
          hasNDA
        } = moa;


        const type_id = {
          Practicum: 1,
          Employment: 2,
          Scholarship: 3,
          Research: 4,
          Others: 5,
        }[typeOfMoa];
        
        console.log("MOA Type:", typeOfMoa, "Type ID:", type_id);

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
        try {
          if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            // No files uploaded at all, insert a default record
            await connection.query(
              "INSERT INTO moa_documents (moa_id, document_name, file_path, uploaded_at, uploaded_by, has_nda) VALUES (?, ?, NULL, NOW(), ?, ?)",
              [moa_id, "No PDF Uploaded", user_id, hasNDA]
            );
          } else {
            // Track if any valid PDFs were uploaded
            const uploadPromises = req.files
              .filter(file => file.mimetype === "application/pdf") // Filter out non-PDF files
              .map(async (file) => {
                const fileName = `${Date.now()}-${file.originalname}`;
                const blobUrl = await uploadToBlob(file, fileName);
        
                await connection.query(
                  "INSERT INTO moa_documents (moa_id, document_name, file_path, uploaded_at, uploaded_by, has_nda) VALUES (?, ?, ?, NOW(), ?, ?)",
                  [moa_id, file.originalname, blobUrl, user_id, hasNDA]
                );
              });
        
            if (uploadPromises.length > 0) {
              // Wait for all PDF uploads and inserts to complete in parallel
              await Promise.all(uploadPromises);
            } else {
              // If no valid PDFs were uploaded, insert NULL
              await connection.query(
                "INSERT INTO moa_documents (moa_id, document_name, file_path, uploaded_at, uploaded_by, has_nda) VALUES (?, ?, NULL, NOW(), ?, ?)",
                [moa_id, "No PDF Uploaded", user_id, hasNDA]
              );
            }
          }
        } catch (error) {
          console.error("Error uploading files or inserting records:", error);
          // Handle the error (e.g., send a response to the client or log it)
          res.status(500).json({ error: 'An error occurred while processing the files.' });
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
          moa_documents.has_nda, 
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
    // Improved data parsing logic
    let moaData;
    if (req.files && req.files.length > 0) {
      // If files are present, data should be in req.body.data
      try {
        moaData = JSON.parse(req.body.data);
      } catch (error) {
        console.error('Error parsing FormData JSON:', error);
        return res.status(400).json({
          message: "Invalid form data format",
          error: error.message
        });
      }
    } else {
      // If no files, data should be directly in req.body
      moaData = req.body;
    }

     // Validate that we have data
     if (!moaData || Object.keys(moaData).length === 0) {
      return res.status(400).json({
        message: "No MOA data received",
        receivedBody: req.body,
        contentType: req.headers['content-type']
      });
    }

    console.log('Parsed MOA Data:', moaData);

    // Required fields for MOA update (documents are now optional)
    const requiredFields = [
      { name: 'name', type: 'string' },
      { name: 'type_of_moa', type: 'number' },
      { name: 'nature_of_business', type: 'string' },
      { name: 'address', type: 'string' },
      { name: 'firstname', type: 'string' },
      { name: 'lastname', type: 'string' },
      { name: 'position', type: 'string' },
      { name: 'contact_number', type: 'string' },
      { name: 'email_address', type: 'string' },
      { name: 'status', type: 'string' },
      { name: 'years_validity', type: 'number' },
      { name: 'date_notarized', type: 'string' },
      { name: 'expiry_date', type: 'string' },
      { name: 'year_submitted', type: 'number' },
      { name: 'branch', type: 'string' },
      { name: 'course', type: 'string' },
      { name: 'user_id', type: 'string' },
      { name: 'has_nda', type: 'number' }
    ];

    const missingOrInvalidFields = requiredFields.filter(field => {
      const value = moaData[field.name];
      const valueType = typeof value;
      
      // Check if value is missing or empty
      const isEmpty = value === undefined || value === null || value === '';
      
      // Check if type matches (but skip if empty as we handle that separately)
      const wrongType = !isEmpty && valueType !== field.type;
      
      // Log the validation result
      if (isEmpty || wrongType) {
        console.log(`Field "${field.name}": Value = ${value}, Type = ${valueType}, Required Type = ${field.type}`);
      }
      
      return isEmpty || wrongType;
    });
    
    if (missingOrInvalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid or missing fields",
        fields: missingOrInvalidFields.map(field => field.name),
        fieldDetails: missingOrInvalidFields.map(field => ({
          field: field.name,
          value: moaData[field.name],
          expectedType: field.type,
          actualType: typeof moaData[field.name]
        }))
      });
    }

    // Convert specific fields to their proper types
    moaData.type_of_moa = parseInt(moaData.type_of_moa);
    moaData.years_validity = parseInt(moaData.years_validity);
    moaData.year_submitted = parseInt(moaData.year_submitted);

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

      // Handle file uploads with better error handling
      if (!req.files || req.files.length === 0) {
        // No files uploaded at all, insert a default record
        await connection.query(
          `UPDATE moa_documents 
           SET has_nda = ?
           WHERE moa_id = ?`,
          [moaData.has_nda || false, id ]
        );
      } else if (req.files && req.files.length > 0) {
        // Delete existing documents
        const [existingDocs] = await connection.query(
          "SELECT document_id, file_path FROM moa_documents WHERE moa_id = ?",
          [id]
        );

        for (const doc of existingDocs) {
          if (doc.file_path) {
            try {
              await deleteFromBlob(doc.file_path);
            } catch (err) {
              console.warn(`Warning: Could not delete file ${doc.file_path}:`, err);
            }
          }
          await connection.query(
            "DELETE FROM moa_documents WHERE document_id = ?",
            [doc.document_id]
          );
        }

        // Upload new files
        for (const file of req.files) {
          const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          let blobUrl;
          
          try {
            blobUrl = await uploadToBlob(file, fileName);
          } catch (err) {
            throw new Error(`Failed to upload file ${file.originalname}: ${err.message}`);
          }

          await connection.query(
            `INSERT INTO moa_documents 
             (moa_id, document_name, file_path, uploaded_at, uploaded_by, has_nda)
             VALUES (?, ?, ?, NOW(), ?, ?)`,
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