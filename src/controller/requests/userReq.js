import User from '../../models/User.js';
import CryptoJS from 'crypto-js'
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

/**
 * Handles user login.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>}
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PSWD_DECRYPT_CODE).toString(CryptoJS.enc.Utf8);

      if (decryptedPassword === password) {
        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, userId: user._id, isAdmin: user.isAdmin });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      res.status(401).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/**
 * Decrypts and verifies the provided password against the stored hashed password for a user.
 * @param {Object} user - The user object containing the hashed password.
 * @param {Object} req - The request object containing the user-entered password.
 * @param {Object} res - The response object for sending results.
 * @throws {Object} - Returns a JSON object with a 'message' property if the password is incorrect, resulting in a 401 Unauthorized status.
 *                   - Returns a JSON object with a 'userId' property if the password is correct, resulting in a 200 OK status.
 */
const decryptPassword = (user, req, res) => {
  const hashedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.PSWD_DECRYPT_CODE || ""
  );

  const storedPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  console.log("Contraseña almacenada:", storedPassword);
  console.log("Contraseña ingresada:", req.body.password);

  if (storedPassword !== req.body.password) {
    res.status(401).json({ message: 'Wrong Password' });
  } else {
    res.status(200).json({ userId: user._id, isAdmin: user.isAdmin });
  }
}



/**
 * Regular expression pattern to validate email addresses.
 * - ^[^\s@]+: Must start with one or more characters that are not whitespace or '@'.
 * - @: Must contain the '@' symbol.
 * - [^\s@]+: Followed by one or more characters that are not whitespace or '@'.
 * - \.: Must contain a dot '.'.
 * - [^\s@]+: Followed by one or more characters that are not whitespace or '@'.
 * - $: Must end with the pattern.
 */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Regular expression pattern to validate passwords.
 * - (?=.*[a-z]): Must contain at least one lowercase letter.
 * - (?=.*[A-Z]): Must contain at least one uppercase letter.
 * - (?=.*\d): Must contain at least one digit.
 * - (?=.*[+,\.\-_'"!¿?]): Must contain at least one special character from the provided set.
 * - [A-Za-z\d+,\.\-_'"!¿?]{6,80}: Allowed characters include letters (upper and lower case),
 *   digits, and the specified special characters. Length must be between 6 and 80 characters.
 */
const passwordPattern = /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[+,\.\-_'"!¿?])[A-Za-zñÑ\d+,\.\-_'"!¿?]{6,80}$/;

/**
 * Regular expression pattern to validate names.
 * - ^(?! {0,2}$): Must not start or end with 0 to 2 spaces.
 * - [A-Za-z\s]{3,80}: Allowed characters include letters (upper and lower case) and spaces.
 *   Length must be between 3 and 80 characters.
 */
const namePattern = /^(?! {0,2}$)[A-Za-zñÑ\s]{3,80}$/;

/**
 * Handles user signup.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>}
 */
export const signUp = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword || !username) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PSWD_DECRYPT_CODE).toString();

    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
      isAdmin: false,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id, isAdmin: savedUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, userId: savedUser._id, isAdmin: savedUser.isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * Generates a random verification code
 * @returns {string} - The verification code.
 */
const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); 
};

/**
 * Generates a token with the provided payload and secret.
 * @param {Object} payload - The payload to be used for generating the token.
 * @param {string} secret - The secret to be used for generating the token.
 * @returns {string} - The generated token.
 */
const generateToken = (payload, secret) => {
  return jwt.sign(payload, secret);
};


/**
 * Registers a new user with the provided username, email, and password.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Object} - Returns a JSON object with an 'error' property if an error occurs during registration.
 */
const registerUser = async (username, email,password) => {
  const newUser = new User({
    username: username,
    email: email,
    password: CryptoJS.AES.encrypt(
      password,
      process.env.PSWD_DECRYPT_CODE
    ).toString(),
    isAdmin: false
  });

  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err) {
    return err;
  }
}

export const getUserByToken = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ _id: token }).exec();
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(200).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Bad request" });
  }
}