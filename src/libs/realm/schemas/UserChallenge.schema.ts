import { Realm } from "@realm/react";
import { TaskLog } from "./TaskLog.schema";

export type UserChallengeProps = {
  id?: string
  userId: string
  challengeId: string
  tasksLogs: TaskLog[]
}

export class UserChallenge extends Realm.Object<UserChallenge> {
  _id!: string
  userId!: string
  challengeId!: string
  tasksLogs!: TaskLog[]
  createdAt!: Date
  updatedAt!: Date
  
  static generate({
    id,
    userId,
    challengeId,
    tasksLogs
  }: UserChallengeProps) {
    return {
      _id: id ?? new Realm.BSON.UUID().toString(),
      userId,
      challengeId,
      tasksLogs,
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
      tasksLogs: 'TaskLog[]',
      createdAt: 'date',
      updatedAt: 'date',
    }
  }
}