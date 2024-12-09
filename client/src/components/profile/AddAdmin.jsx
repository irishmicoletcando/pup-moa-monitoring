export default function AddAdmin() {
  return (
    <form>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" name="firstName" />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" name="lastName" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
      </div>
      <div>
        <label htmlFor="role">Role</label>
        <select id="role" name="role">
          <option value="superAdmin">Super Admin</option>
          <option value="employmentAdmin">Employment Admin</option>
          <option value="practicumAdmin">Practicum Admin</option>
          <option value="researchAdmin">Research Admin</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact">Contact Number</label>
        <input type="tel" id="contact" name="contact" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" />
      </div>
      <button type="submit">CREATE</button>
    </form>
  );
}