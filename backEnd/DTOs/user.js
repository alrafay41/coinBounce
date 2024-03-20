class UserDTO {
  constructor(user) {
    //this is the data you want to send to user in a response
    this._id = user._id;
    this.email = user.email;
    this.name = user.name;
  }
}

module.exports = UserDTO;
