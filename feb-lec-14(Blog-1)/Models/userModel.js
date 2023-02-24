const userSchema = require("../Schemas/User");
const bcrypt = require("bcrypt");

let User = class {
  username;
  email;
  name;
  password;

  constructor({ username, email, password, name }) {
    this.email = email;
    this.username = username;
    this.name = name;
    this.password = password;
  }

  //functions
  registerUser() {
    return new Promise(async (resolve, reject) => {
      const hashpassword = await bcrypt.hash(this.password, 10);
      const user = new userSchema({
        username: this.username,
        name: this.name,
        email: this.email,
        password: hashpassword,
      });

      try {
        const userDb = await user.save();

        return resolve(userDb);
      } catch (error) {
        return reject(error);
      }
    });
  }
};

// static fun
// fun

module.exports = User;

//mongooseSchema -----> User(class) ----> controller
