import { Realm } from "@realm/react";

type ChallengeProps = {
  name: string
  description: string
  durationInDays: number
  startDate: Date
  endDate: Date
}

export class Challenge extends Realm.Object<Challenge> {
  _id!: string
  name!: string
  description!: string
  durationInDays!: number
  startDate!: Date
  endDate!: Date
  createdAt!: Date
  updatedAt!: Date

  static generate({
    name,
    description,
    durationInDays,
    startDate,
    endDate,
  }: ChallengeProps) {
    return {
      _id: new Realm.BSON.UUID().toString(),
      name,
      description,
      durationInDays,
      startDate,
      endDate,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  static schema = {
    name: 'Challenge',
    primaryKey: '_id',

    properties: {
      _id: 'string',
      name: 'string',
      description: 'string',
      durationInDays: 'int',
      startDate: 'date',
      endDate: 'date',
      createdAt: 'date',
      updatedAt: 'date',
    }
  }
}