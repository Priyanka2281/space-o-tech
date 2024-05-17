import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {  // Ensure IUser is exported
  name: string;
  email: string;
  password: string;
  isDeleted: boolean;
  accessModules: string[];
  resetToken:String,
  resetTokenExpiration:Date,
  isPasswordMatch(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  accessModules: {
    type: [String],
    required: true,
  },
  resetToken:{
    type:String
  },
  resetTokenExpiration:{
    type:Date
  }
}, {
  timestamps: true,
});

userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(password, user.password);
};

userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
