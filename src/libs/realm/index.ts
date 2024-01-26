import { createRealmContext, Realm,  } from '@realm/react'
import { Challenge } from './schemas/Challenge.schema'
import { Task } from './schemas/Task.schema';
import { UserChallenge } from './schemas/UserChallenge.schema';
import { TaskLog } from './schemas/TaskLog.schema';
import { Log } from './schemas/Log.schema';

const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
  type: Realm.OpenRealmBehaviorType.OpenImmediately
}

export const syncConfig: any = {
  flexible: true,
  newRealmFileBehavior: realmAccessBehavior,
  existingRealmFileBehavior: realmAccessBehavior,
  initialSubscriptions: {
    update(subs: any, realm: Realm) {
      subs.add(realm.objects(Challenge));
      subs.add(realm.objects(Task));
      subs.add(realm.objects(UserChallenge));
      subs.add(realm.objects(TaskLog));
      subs.add(realm.objects(Log));
    },
  },
}

export const {
  RealmProvider,
  useRealm,
  useQuery,
  useObject
} = createRealmContext({
  schema: [ Challenge, Task, UserChallenge, TaskLog, Log ]
})