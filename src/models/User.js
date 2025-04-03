import { Schema, model } from 'mongoose';

/* 
  User schema
*/
const UserSchema = new Schema({
    username: { 
      type: String, 
      required: true, 
      unique: false 
  },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }, 
    isAdmin: {
      type: Boolean,
      required: false
    }
  },
  { timestamps: true }
);

  
const User = model('Users', UserSchema);
export default User;