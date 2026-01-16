const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be set'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'An email must be set'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Provide a valid email...'],
    },
    year: {
      type: String,
      required: [true, 'A Level must be set'],
      enum: {
        values: ['100', '200', '300', '400'],
        message: 'Level is either ||100|200|300|400||',
      },
    },
    phone: {
      type: Number,
      required: [true, 'A phone number must be set'],
    },
    passseen: {
      type: String,
      select: false,
    },
    passseens: [
      {
        type: String,
        select: false,
      },
    ],
    password: {
      type: String,
      required: [true, 'Password must be set'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Confirm Password must be set'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Confirm Password does not match Password',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      default: 'student',
      enum: {
        values: ['admin', 'creator', 'student', 'superadmin'],
        message: 'Role is either ||admin|creator|superadmin|student||',
      },
    },
    description: {
      type: String,
      trim: true,
      default: 'I love BIOSSA - KNUST and I am a proud member...',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiry: Date,
    expoPushToken: {
      type: String,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

/* ----------------------------------
   QUERY MIDDLEWARE
----------------------------------- */
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

/* ----------------------------------
   USERNAME HISTORY TRACKING
----------------------------------- */

// Store original passseen when document is loaded
userSchema.post('init', function (doc) {
  doc._originalPassseen = doc.passseen;
});

// Handle `.save()`
userSchema.pre('save', function (next) {
  if (
    !this.isModified('passsword') ||
    !this.isModified('passseen') ||
    this.isNew
  )
    return next();

  if (this._originalPassseen && this._originalPassseen !== this.passseen) {
    this.passseens = this.passseens || [];
    if (!this.passseens.includes(this._originalPassseen)) {
      this.passseens.push(this._originalPassseen);
    }
  }

  next();
});

// Handle `findOneAndUpdate`
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  const newPassseen = update.passseen || update.$set?.passseen;

  if (!newPassseen) return next();

  const user = await this.model.findOne(this.getQuery()).select('passseen');

  if (!user || user.passseen === newPassseen) return next();

  update.$addToSet = {
    ...(update.$addToSet || {}),
    passseens: user.passseen,
  };

  this.setUpdate(update);
  next();
});

/* ----------------------------------
   PASSWORD MIDDLEWARE
----------------------------------- */

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

/* ----------------------------------
   INSTANCE METHODS
----------------------------------- */

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
