import * as Mongoose from "mongoose";

export interface SpotifyUserModel extends Mongoose.Document {
    display_name: any;
    spotifyUserCountry: string;
    spotifyUserName: string;
    spotifyUserEmail: string;
    spotifyUserExplicitContent: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };
    spotifyUserExternalUrls: {
        spotify: string;
    };
    spotifyUserFollowers: {
        href: string | null;
        total: number;
    };
    spotifyUserHref: string;
    spotifyUserId: string;
    spotifyUserImage: [
        {
            height: number;
            url: string;
            width: number;
        }
    ];
    spotifyUserProduct: string;
    spotifyUserType: string;
    spotifyUserURI: string;
    password: string;
    createdAt: Date;
}
