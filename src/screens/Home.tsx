import { Box, HStack, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { format, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from "date-fns/locale";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, TouchableOpacity } from "react-native";
import { useUser } from '@realm/react'
import { useRealm, useQuery } from '@libs/realm'
import { UserChallenge } from "@libs/realm/schemas/UserChallenge.schema";
import { DailyList } from "@components/DailyList";
import { TaskList } from "@components/TaskList";
import { useNavigation } from "@react-navigation/native";
import { AppRoutesNavigatiorProps } from "@routes/app.routes";
import { BellRinging } from 'phosphor-react-native'
import { Loading } from "@components/Loading";
import { Challenge } from "@libs/realm/schemas/Challenge.schema";
import { useCurrentDate } from "@contexts/date.context";

export function Home () {
  const { navigate } = useNavigation<AppRoutesNavigatiorProps>()

  const user = useUser()
  const realm = useRealm()
  const userChallengeCollection = useQuery(UserChallenge)
  const challengeCollection = useQuery(Challenge)

  const [seletedUserChallenge, setSeletedUserChallenge] = useState<UserChallenge>()

  const [isLoading, setIsLoading] = useState(true)

  const { state: { currentDate }, dispatch } = useCurrentDate()

  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios' ? true : false)

  function handleAndroidDatePicker() {
    if (Platform.OS === 'android') {
      setShowDatePicker(!showDatePicker)

      DateTimePickerAndroid.open({
        value: currentDate,
        onChange: (event, date) => handleSelectDate(event, date),
        minimumDate: startOfYear(currentDate),
        maximumDate: endOfYear(currentDate),
        negativeButton: { label: 'Cancelar' }
      })
    }
  }

  function handleSelectDate(_event: DateTimePickerEvent, date?: Date) {
    if (date) {
      dispatch({ type: 'update', updatedDate: date })
    }
  }

  async function fetchUserChallenges(): Promise<UserChallenge[]> {
    return userChallengeCollection.filtered('userId = $0', user.id) as unknown as UserChallenge[]
  }

  async function assignUserToChallenge(): Promise<void> {
    realm.write(() => {
      const challenges = challengeCollection.filtered('name = $0', '10em1')

      if(challenges?.[0]) {
        realm.create(UserChallenge.name, UserChallenge.generate({
          userId: user.id,
          challengeId: challenges[0]._id,
          tasksLogs: []
        }))
      }

    })
  }

  async function selectUserChallenge () {
    try {

      let foundUserChallenges = await fetchUserChallenges()

      if(!foundUserChallenges || foundUserChallenges.length === 0) {
        await assignUserToChallenge()
        foundUserChallenges = await fetchUserChallenges()
      }

      setSeletedUserChallenge(foundUserChallenges[0])
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (realm?.syncSession?.isConnected()) {
      selectUserChallenge()
    }
  }, [realm?.syncSession?.isConnected()])

  return (
    <VStack flex={1}>

      <HStack pt={16} pb={4} px={4} alignItems="center" justifyContent="space-between">

        <TouchableOpacity onPress={() => navigate('notification')}>
          {
            Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={currentDate} 
                  locale="pt-BR"
                  onChange={handleSelectDate}
                  minimumDate={startOfYear(currentDate)}
                  maximumDate={endOfYear(currentDate)}
                /> 
            ) : 
            (
              <Box px={2} py={1} bgColor="gray.300" rounded="lg">
                <Text fontFamily="body" fontWeight="normal" fontSize="lg" onPress={handleAndroidDatePicker}>
                  {format(currentDate, 'dd/MM/yyyy', { locale: ptBR })}
                </Text>
              </Box>
            )
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('notification')}>
          <BellRinging color="#78716c" size={32} />
        </TouchableOpacity>
      </HStack>

      <DailyList selectedDate={currentDate} handleSelectDate={(date) => dispatch({ type: 'update', updatedDate: date })} />

      { isLoading ? <Loading /> : <TaskList selectedDate={currentDate} userChallenge={seletedUserChallenge!} /> }

    </VStack>
  )
}