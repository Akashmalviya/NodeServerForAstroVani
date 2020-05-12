const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const schema = mongoose.Schema

const userSchema = new schema({
    email: String,
    password: String,
    saltSecret: String
})
userSchema.pre('save', function(next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});
userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', userSchema, 'users')