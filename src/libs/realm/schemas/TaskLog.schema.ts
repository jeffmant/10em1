import { Realm } from "@realm/react";

type TaskLogProps = {
  taskId: string
  userChallengeId: string
  date: string
  checked: boolean
}

export class TaskLog extends Realm.Object<TaskLog> {
  _id!: string
  checked!: boolean
  taskId!: string
  userChallengeId!: string
  date!: string
  createdAt!: Date
  updatedAt!: Date

  static generate({
    taskId,
    userChallengeId,
    date,
    checked
  }: TaskLogProps) {
    return {
      _id: new Realm.BSON.UUID().toString(),
      checked,
      taskId,
      userChallengeId,
      date,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  static schema = {
    name: 'TaskLog',
    primaryKey: '_id',

    properties: {
      _id: 'string',
      checked: 'bool',
      taskId: 'string',
      userChallengeId: 'string',
      date: 'string',
      createdAt: 'date',
      updatedAt: 'date',
    }
  }
}