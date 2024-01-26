import { Realm } from "@realm/react";
import { Log } from "./Log.schema";

export type TaskLogsProps = {
  id?: string
  date: string
  logs: Log[]
}

export class TaskLog extends Realm.Object<TaskLog> {
  _id!: string
  date!: string
  logs!: Log[]
  createdAt!: Date
  updatedAt!: Date

  static generate({
    id,
    date,
    logs = []
  }: TaskLogsProps) {
    return {
      _id: id ?? new Realm.BSON.UUID().toString(),
      logs: logs,
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
      date: 'string',
      logs: 'Log[]',
      createdAt: 'date',
      updatedAt: 'date',
    }
  }
}