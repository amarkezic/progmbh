import db from "../utils/db"
import bcrypt from "bcrypt"

const SALT_WORK_FACTOR = 10;
let userSchema = new db.Schema({
    username: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true },
    password: { type: String, required: true }
},{
    collection: "users"
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

let User = db.model('User', userSchema);

export {User}