const mongoose = require('mongoose');
//const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
 

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'User must have a name'],
			trim: true,
			minLength: [4, 'Name must have atleat - 4 characters'],
		},
		about: {
			type: String,
		},
		phone: {
			type: Number,
		},
		email: {
			type: String,
			required: [true, 'Every User must have a unique email'],
			unique: [true, 'Email already in use'],
			validate: [validator.isEmail, 'Invalid Email'],
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'Every user must have a password'],
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Please enter passwordConfirm'],
			validate: {
				validator: function (val) {
					return val === this.password;
				},
				message: 'Passwords does not match',
			},
		},
		passwordChangedAt: {
			type: Date,
			select: false
		},
		passwordResetToken: {
			type: String,
			select: false
		},
		passwordResetExpires: {
			type: Date,
			select: false
		},
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
		role: {
			type: String,
			default: 'user',
			enum: ['user', 'admin', 'administrator', 'director'],
		},
		image: {
			type: String,
			default: 'default.jpg',
		},
		country: {
			type: String,
			default: 'India',
		},
		userId: {
			type: String,
		},
		joinedAt: {
			type: Date,
			default: Date.now(),
		},
		tags: {
			type: [String],
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
// MONGOOSE MIDDLEWARES ->>

// Password encryption ->
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.pre(/^find/, async function (next) {
	this.find({ active: { $ne: false } });

	next();
});

// userSchema functions ->>

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		//console.log(changedTimestamp, JWTTimestamp);
		return JWTTimestamp < changedTimestamp;
	}

	return false; // false means NOT changed.
};
userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex'); // <- Crypto is pre-installed encryption library

	this.passwordResetToken = crypto // <- Crypto is not as strong as bcrypt,
		.createHash('sha256') //    but in this case we don't need such strong encryption.
		.update(resetToken)
		.digest('hex');

	//console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
