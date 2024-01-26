import { Realm } from "@realm/react";

export type LogProps = {
  id?: string
  taskId: string
  checked: boolean
}

export class Log extends Realm.Object<Log> {
  _id!: string
  taskId!: string
  checked!: boolean

  static generate({
    id,
    taskId,
    checked
  }: LogProps) {
    return {
      _id: id ?? new Realm.BSON.UUID().toString(),
      taskId,
      checked
    }
  }

  static schema = {
    name: 'Log',
    primaryKey: '_id',

    properties: {
      _id: 'string',
      taskId: 'string',
      checked: 'bool'
    }
  }
}