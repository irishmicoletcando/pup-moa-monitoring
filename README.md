# 📄 PUP MOA Monitoring System
The **MOA Monitoring System** is a web-based application designed to streamline the tracking, management, and maintenance of Memorandums of Agreement (MOAs) for universities. It provides a centralized, user-friendly, and automated platform that enhances efficiency, ensures data accuracy, and improves accessibility for administrators. Key features include real-time tracking of MOA statuses, document storage and retrieval, automated status updates, role-based access control, and data visualization through dashboards and charts.

## Demo
![Preview of the PUP MOA Monitoring System](/docs/preview.gif)

## Features

- 👤 **User Access Levels**
  - Super Admin: Full control, including viewing, editing, and deleting all types of MOAs and admins.
  - Admin Types: Employment, Practicum, and Research, each with restricted access based on their category.
  - Role-based access control to manage user permissions efficiently.

- 👥 **Account Management**
  - Admin account creation facilitated by the Super Admin via ARCDO.
  - No self-sign-up; accounts are registered by the Super Admin.

- 🔒 **Authentication**
  - Secure login using email and password sent via email.
  - Role-specific profile icons with color codes:
    - Violet: Super Admin
    - Blue: Employment Admin
    - Green: Practicum Admin
    - Gray: Research Admin

- 📊 **Dashboard**
  - Displays the total count of different MOA types (Employment, Research, Practicum, Scholarship, Others).
  - Clickable cards to filter and view specific MOA categories.
  - Data visualization through bar graphs and pie charts for MOA status.

- 🗂️ **MOA Management**
  - View MOAs in table or modal format for detailed information.
  - **Add MOA:** Form-based input with fields like MOA name, type, contact details, and attached PDF.
  - **Edit MOA:** Restricted to Super Admin and designated admins based on MOA type.
  - **Delete MOA:** Confirmation prompts to prevent accidental deletions.
  - **Search MOA:** Search by MOA name, contact email, or nature of business.
  - **Filter MOA Table:** Multi-criteria filtering by type, status, branch, and course.
  - **Refresh MOA Table:** Update to the latest data.
  - **Pagination:** Customizable rows per page and easy navigation.

- 📋 **Import and Export**
  - **Import Excel:** Upload and preview Excel files to add multiple MOAs.
  - **Export Excel:** Export filtered or complete MOA data with selectable columns.

- 👤 **Admin Management (Super Admin Only)**
  - **Add Admin:** Create new admin accounts with role-specific permissions.
  - **Delete Admin:** Remove admin accounts with confirmation prompts.
  - **Access Control:** Grant access to "Other" MOA types via a toggle switch.
  - **Search Admin:** Dynamic search by admin name or email.
  - **Filter Admin Table:** Filter by admin role with a "Clear Filters" option.
  - **Refresh Admin Table:** Update admin data to the latest version.

- 📅 **Automated MOA Status Updates**
  - MOA statuses update automatically based on expiration dates:
    - **Active:** Valid agreements.
    - **Expiring:** Three months before expiration.
    - **Expired:** After the expiration date.

- 🛠️ **Navigation and UI**
  - Responsive design for desktops, laptops, tablets, and mobile devices.
  - Navigation bar with quick access to Dashboard, MOA, Admin, and About pages.
  - Color-coded user roles and profile icons for easy identification.

- ❔ **About Page**
  - Provides a guide on system usage and contributor information.
  - Download links for the User Manual and sample Excel files for importing data.