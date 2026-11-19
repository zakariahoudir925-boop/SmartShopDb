const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor(driver) {
    this.driver = driver;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  }

  // Hacher un password
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Comparer password avec hash
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Créer JWT token
  createToken(userId, email, role) {
    return jwt.sign(
      { userId, email, role },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  // Vérifier JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  // Trouver utilisateur par email
  async findUserByEmail(email) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {email: $email}) 
         RETURN u.id as id, u.email as email, u.password_hash as passwordHash, u.role as role`,
        { email }
      );
      if (result.records.length === 0) return null;
      const record = result.records[0];
      return {
        id: record.get('id'),
        email: record.get('email'),
        passwordHash: record.get('passwordHash'),
        role: record.get('role')
      };
    } finally {
      await session.close();
    }
  }

  // Créer un nouvel utilisateur
  async createUser(email, password, role = 'CLIENT') {
    const session = this.driver.session();
    try {
      const passwordHash = await this.hashPassword(password);
      const userId = `user_${Date.now()}`;

      await session.run(
        `CREATE (u:User {
          id: $id,
          email: $email,
          password_hash: $passwordHash,
          role: $role,
          created_at: timestamp()
        })`,
        { id: userId, email, passwordHash, role }
      );

      return { id: userId, email, role };
    } finally {
      await session.close();
    }
  }

  // Login utilisateur
  async login(email, password) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = this.createToken(user.id, user.email, user.role);
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}

module.exports = AuthService;
