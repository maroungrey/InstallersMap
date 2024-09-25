Admin Login Future features:
   - Implement rate limiting to prevent brute-force attacks.
   - Use HTTPS for all communications.
   - Implement proper password hashing (if not already done) using bcrypt or Argon2.
   - Consider adding two-factor authentication for admin accounts.
   - Implement CSRF protection.
   - Use refresh tokens along with access tokens for better security and user experience.
   - Store tokens securely (HttpOnly cookies for web applications).
   - Implement token revocation for logout functionality.
   - Consider using a stateless authentication mechanism to allow for horizontal scaling.
   - Implement system health checks.
   - Set up monitoring for failed login attempts, unusual activity, etc.
   - Add button to NavBar for logged in users
   - Connect forms to admin dash
   - Store access logs somewhere, show on admin dash

Map Page Future Features:
   - Cluster circles are different colors and sizes based on amount they contain

Battery Comparison New Features:
   - Image handling
   - Anti scraping mechanisms