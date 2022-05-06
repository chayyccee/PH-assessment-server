import * as Mongoose from "mongoose";
import * as Bcrypt from "bcryptjs";
import { SpotifyUserModel } from "../types/spotifyUserModelTypes";

const SpotifyUserSchema = new Mongoose.Schema({
    spotifyUserCountry: { type: String, required: true },
    spotifyUserName: { type: String, required: true },
    spotifyUserEmail: { type: String, required: true },
    spotifyUserExplicitContent: { type: Object, required: true },
    spotifyUserExternalUrls: { type: Object, required: true },
    spotifyUserFollowers: { type: Object, required: true },
    spotifyUserHref: { type: String, required: true },
    spotifyUserId: { type: String, required: true },
    spotifyUserImage: { type:Array, required: true },
    spotifyUserProduct: { type: String, required: true },
    spotifyUserType: { type: String, required: true },
    spotifyUserURI: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// bcrypt not working with arrow function
SpotifyUserSchema.pre('save', async function (next) {
    // it is important to not use arrow function here
    // avoid re-hash on already hashed password
    const spotifyUser = this;
  
    if (!spotifyUser.isModified('password')) {
      next();
    }

    // Hashes password
    const salt = await Bcrypt.genSalt(10);
    const hash = await Bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

  
SpotifyUserSchema.methods.matchPasswords = async function (password: string) {
     // usually, it should be
    // const comparison = await bcrypt.compare(password, this.password),
   // but i just chose to assign the this keyword to the user variable as below
    const spotifyUser = this;
    const comparison = await Bcrypt.compare(password, spotifyUser.password);
    return comparison;
};

const SpotifyUser = Mongoose.model<SpotifyUserModel>("SpotifyUser", SpotifyUserSchema);

export default SpotifyUser;
