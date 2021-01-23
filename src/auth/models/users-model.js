const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET || 'z1337z';

const user = mongoose.model(
  'user',
  mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, require: true },
    role: { type: String, require: true, default: 'writer' },
  }),
);

class Users {
  constructor() {
    this.roles = {
      writer: ['read', 'create'],
      admin: ['read', 'create', 'update', 'delete'],
    };
  }
  async save(record) {
    const check = await user.find({ username: record.username });
    if (check.length > 0) {
      return Promise.reject();
    } else {
      record.password = await bcrypt.hash(record.password, 5);
      const newRecord = new user(record);
      return newRecord.save();
    }
  }
  async authenticateBasic(username, password) {
    const check = await user.find({ username: username });
    if (check.length > 0) {
      const valid = await bcrypt.compare(password, check[0].password);
      return valid ? check : Promise.reject();
    }

    return Promise.reject();
  }

  async generateToken(user) {
    let token = jwt.sign({ username: user.username, userID: user._id, role: user.role }, SECRET);
    return token;
  }

  async authenticateToken(token) {
    try {
      const tokenObject = jwt.verify(token, SECRET);
      const check = await this.read(tokenObject.username);
      console.log('token obj', tokenObject);

      if (check) {
        return Promise.resolve(tokenObject);
      } else {
        return Promise.reject();
      }
    } catch (e) {
      return Promise.reject(e.message);
    }
  }

  async can(permission) {
    const userData = await user.find({ username: permission.user });
    const role = userData[0].role;
    const check = this.roles[role].includes(permission.capability);
    console.log(check);
    if (check) {
      return true;
    } else {
      return false;
    }
  }

  read(element) {
    const query = element ? { username: element } : {};
    return user.find(query);
  }
}
module.exports = new Users();
