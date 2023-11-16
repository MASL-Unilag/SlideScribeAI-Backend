import { Schema, model } from "mongoose";

export interface IBlacklistToken {
  token: string;
  expiry: Date;
}

export const blacklistTokenSchema = new Schema<IBlacklistToken>(
  {
    token: {
      type: String,
      required: true,
    },
    expiry: {
      type: Date,
      required: false,      
    }
  },
  { timestamps: true },
);


export const BlackListToken = model('blacklistokens', blacklistTokenSchema);
export type BlackListRepository = typeof BlackListToken;