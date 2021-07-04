const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  pictureUrl: { type: String },
  role: { type: String, default: "User" },
  dateRegister: { type: Date, default: Date.now() },
  friends: { type: [mongoose.Schema.ObjectId], default: [] },
  isOnline: { type: Boolean, default: false, required: true },
  methods: {
    type: [String],
    required: true,
  },
  google: {
    id: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
  },
  local: {
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.methods.includes("local")) {
      next();
    }

    const user = this;

    if (!user.isModified("local.password")) {
      next();
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const hashedPass = await bcrypt.hash(this.local.password, salt);
    this.local.password = hashedPass;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.isValidPassword = function (password, cb) {
  bcrypt.compare(password, this.local.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

mongoose.model("users", userSchema);
