import { Realm } from "@realm/react";

type UserChallengeProps = {
  userId: string
  challengeId: string
}

export class UserChallenge extends Realm.Object<UserChallenge> {
  _id!: string
  userId!: string
  challengeId!: string
  createdAt!: Date
  updatedAt!: Date
  
  static generate({
    userId,
    challengeId
  }: UserChallengeProps) {
    return {
      _id: new Realm.BSON.UUID().toString(),
      userId,
      challengeId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  static schema = {
    name: 'UserChallenge',
    primaryKey: '_id',

    properties: {
      _id: 'string',
      userId: 'string',
      challengeId: 'string',
      createdAt: 'date',
      updatedAt: 'date',
    }
  }
}