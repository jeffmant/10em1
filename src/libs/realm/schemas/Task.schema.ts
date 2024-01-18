import { Realm } from "@realm/react";

type TaskProps = {
  title: string,
  description: string,
  order: number,
  startDate: Date,
  endDate: Date,
  icon: string,
  challengeId: string,
}

export class Task extends Realm.Object<Task> {
  _id!: string
  title!: string
  description!: string
  order!: number
  startDate!: Date
  endDate!: Date
  icon!: string
  challengeId!: string
  createdAt!: Date
  updatedAt!: Date

  static generate({
    title,
    description,
    order,
    challengeId,
    icon,
    startDate,
    endDate
  }: TaskProps) {
    return {
      _id: new Realm.BSON.UUID().toString(),
      title,
      description,
      challengeId,
      order,
      icon,
      startDate,
      endDate,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  static schema = {
    name: 'Task',
    primaryKey: '_id',

    properties: {
      _id: 'string',
      title: 'string',
      description: 'string',
      startDate: 'date',
      endDate: 'date',
      icon: 'string',
      order: 'int',
      challengeId: 'string',
      createdAt: 'date',
      updatedAt: 'date',
    }
  }
}