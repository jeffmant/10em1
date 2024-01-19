import { Box, Center, Spinner, Text, VStack } from "native-base";
import { HomeHeader } from "../components/HomeHeader";
import { useEffect, useState } from "react";
import { format, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from "date-fns/locale";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform } from "react-native";
import { useUser } from '@realm/react'
import { useRealm, useQuery } from '@libs/realm'
import { UserChallenge } from "@libs/realm/schemas/UserChallenge.schema";
import { DEFAULT_CHALLENGE } from "../data/challenge-template";
import { DailyList } from "@components/DailyList";
import { TaskList } from "@components/TaskList";

export function Home () {
  const user = useUser()
  const realm = useRealm()
  const userChallengeCollection = useQuery(UserChallenge)

  const [seletedUserChallenge, setSeletedUserChallenge] = useState<UserChallenge>()

  const [isLoading, setIsLoading] = useState(false)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios' ? true : false)

  function handleAndroidDatePicker() {
    if (Platform.OS === 'android') {
      setShowDatePicker(!showDatePicker)

      DateTimePickerAndroid.open({
        value: selectedDate,
        onChange: (event, date) => handleSelectDate(event, date),
        minimumDate: startOfYear(selectedDate),
        maximumDate: endOfYear(selectedDate),
        negativeButton: { label: 'Cancelar' }
      })
    }
  }

  function handleSelectDate(_event: DateTimePickerEvent, date?: Date) {
    if (date) {
      setSelectedDate(date)
    }
  }

  async function fetchUserChallenges(): Promise<UserChallenge[]> {
    return userChallengeCollection.filtered('userId = $0', user.id) as unknown as UserChallenge[]
  }

  async function assignUserToChallenge(): Promise<void> {
    realm.write(() => {
      realm.create(UserChallenge.name, UserChallenge.generate({
        userId: user.id,
        challengeId: DEFAULT_CHALLENGE
      }))
    })
  }

  async function selectUserChallenge () {
    try {
      setIsLoading(true)

      let foundUserChallenges = await fetchUserChallenges()

      if(!foundUserChallenges || foundUserChallenges.length === 0) {
        await assignUserToChallenge()
        foundUserChallenges = await fetchUserChallenges()
      }

      setSeletedUserChallenge(foundUserChallenges[0])
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate) {
      selectUserChallenge()
    }
  }, [selectedDate])

  return (
    <VStack flex={1}>
      <HomeHeader />

      <Center mt={4} flexDirection="row" alignContent="center">
        {
          Platform.OS === 'ios' ? (
              <DateTimePicker
                value={selectedDate} 
                locale="pt-BR"
                onChange={handleSelectDate}
                minimumDate={startOfYear(selectedDate)}
                maximumDate={endOfYear(selectedDate)}
              /> 
          ) : 
          (
            <Box px={2} py={1} bgColor="gray.300" rounded="lg">
              <Text fontFamily="body" fontWeight="normal" fontSize="lg" onPress={handleAndroidDatePicker}>
                {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
              </Text>
            </Box>
          )
        }
      </Center>

      <DailyList selectedDate={selectedDate} handleSelectDate={setSelectedDate} />

      { isLoading ? <Spinner /> : <TaskList selectedDate={selectedDate} userChallenge={seletedUserChallenge!} /> }

    </VStack>
  )
}