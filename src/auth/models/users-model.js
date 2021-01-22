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

const tokendb = mongoose.model(
  'token',
  mongoose.Schema({
    token: { type: String, required: true },
    use: { type: Number, require: true },
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
      // console.log('__Check__',check.length);
      console.log('username already used');
      return Promise.reject();
    } else {
      record.password = await bcrypt.hash(record.password, 5);
      const newRecord = new user(record);
      return newRecord.save();
    }
  }
  async authenticateBasic(username, password) {
    // console.log(username,password);
    const check = await user.find({ username: username });
    // console.log(check);
    if (check.length > 0) {
      const valid = await bcrypt.compare(password, check[0].password);
      return valid ? check : Promise.reject();
    }

    return Promise.reject();
  }

  async generateToken(user) {
    // console.log(SECRET);

    // console.log(singleUse);

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
    // console.log(userData[0]);
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
    // console.log(element);
    const query = element ? { username: element } : {};
    // console.log(query);
    return user.find(query);
  }
}
module.exports = new Users();
