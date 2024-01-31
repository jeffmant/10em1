import { Loading } from "@components/Loading";
import { useQuery } from "@libs/realm";
import { Log } from "@libs/realm/schemas/Log.schema";
import { TaskLog } from "@libs/realm/schemas/TaskLog.schema";
import { UserChallenge } from "@libs/realm/schemas/UserChallenge.schema";
import { useUser } from "@realm/react";
import { addDays, eachDayOfInterval, eachWeekOfInterval, endOfDay, endOfMonth, endOfWeek, format, getDate, isSameMonth, lastDayOfMonth, startOfDay, startOfMonth, startOfWeek, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Box, HStack, Heading, Text, VStack, useTheme } from "native-base";
import { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";

enum MenuOptionEnum {
  weekly = "Semanal",
  monthly = "Mensal"
}

type Stats = {
  weeklyCheckedTasks: number
  monthlyCheckedTasks: number
  weeklySuccessRate: number
  monthlySuccessRate: number
  weeklyUnchecked: number
  monthlyUnchecked: number
  weeklyPoints: number
  monthlyPoints: number
}

export function Activity () {
  const user = useUser()
  const userChallengesCollection = useQuery(UserChallenge)
  
  const [selectedMenuOption, setSelectedMenuOption] = useState<MenuOptionEnum>(MenuOptionEnum.weekly)

  const [weeksOfMonth, setWeeksOfMonth] = useState<{key: string, value: number}[]>()
  const [daysOfWeek, setDaysOfWeek] = useState<{key: string, value: number}[]>()

  const currentDate = new Date()

  const [stats, setStats] = useState<Stats>({
    weeklyCheckedTasks: 0,
    monthlyCheckedTasks: 0,
    weeklySuccessRate: 0,
    monthlySuccessRate: 0,
    weeklyUnchecked: 0,
    monthlyUnchecked: 0,
    weeklyPoints: 0,
    monthlyPoints: 0,
  } as Stats)

  const { colors } = useTheme()

  const chartConfig = {
    backgroundGradientFrom: colors.gray['100'],
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: colors.gray['100'],
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 0, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  function mountActiviyAndChart() {
    const userChallenges = userChallengesCollection.filtered('userId = $0', user.id)

    if(userChallenges?.[0]) {
      const userChallenge = userChallenges[0]
      mountWeeksOfMonthChartParams(userChallenge)
      mountDaysOfWeekChartParams(userChallenge)
      calculateActivity(userChallenge)
    }
  }

  function mountWeeksOfMonthChartParams(userChallenge: UserChallenge){
    setWeeksOfMonth(
      eachWeekOfInterval({ 
        start: startOfMonth(currentDate), 
        end: endOfDay(currentDate) 
      }, {
        locale: ptBR
      })
      .map((weekDate, index, array) => {
        let startDate = weekDate
        let endDate = endOfWeek(weekDate)

        if (index === 0) {
          if(!isSameMonth(currentDate, startDate)) {
            startDate = addDays(startDate, (getDate(lastDayOfMonth(startDate)) + 1) - getDate(startDate) )
          }
        } else if (index === array.length - 1) {
          if(!isSameMonth(currentDate, endDate)) {
            endDate = subDays(endDate, getDate(endOfWeek(endDate)))
          }
        }

        let checkedTasksLogs = 0

        const dateInterval = eachDayOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 }))
        
        userChallenge.tasksLogs?.forEach((taskLog: TaskLog) => {
          if(dateInterval.includes(taskLog.date)) {
            checkedTasksLogs += taskLog.logs?.filter((log: Log) => log.checked).length
          }
        })


        return {key: `${format(startDate, 'dd', { locale: ptBR })} - ${format(endDate, 'dd', { locale: ptBR })}`, value: checkedTasksLogs }
      })
    )
  }

  function mountDaysOfWeekChartParams(userChallenge: UserChallenge){
    setDaysOfWeek(
      eachDayOfInterval({ 
        start: startOfWeek(currentDate, { locale: ptBR, weekStartsOn: 1 }), 
        end: endOfWeek(currentDate, { locale: ptBR, weekStartsOn: 1 })
      })
      .map((date) => {
        let checkedTasksLogs = 0 

        
        userChallenge.tasksLogs?.forEach((taskLog: TaskLog) => {
          if (taskLog.date === format(date, 'yyyy-MM-dd', { locale: ptBR, weekStartsOn: 1 })) {
            checkedTasksLogs += taskLog.logs?.filter((log: Log) => log.checked)?.length || 0
          }
        })

        return { key: `${format(date, 'iiii', { locale: ptBR, weekStartsOn: 1 }).slice(0, 3)}`, value: checkedTasksLogs || 0 }
      })
    )
  }

  function calculateActivity (userChallenge: UserChallenge) {
    let weeklyCheckedTasks = 0
    let monthlyCheckedTasks = 0

    let startDate = selectedMenuOption === MenuOptionEnum.weekly ? startOfWeek(currentDate) : startOfMonth(currentDate) 
    let endDate = selectedMenuOption === MenuOptionEnum.weekly ? endOfWeek(currentDate) : endOfMonth(currentDate)


    const rangeDateTasksLogs = userChallenge?.tasksLogs
      ?.filter((taskLog: TaskLog) =>
        new Date(taskLog.date) >= startDate &&
        new Date(taskLog.date) <= endDate
      )

      rangeDateTasksLogs?.forEach((taskLog: TaskLog) => {
        if(selectedMenuOption === MenuOptionEnum.weekly) {
          weeklyCheckedTasks += taskLog.logs.filter(log => log.checked === true).length
        } else if (selectedMenuOption === MenuOptionEnum.monthly) {
          monthlyCheckedTasks += taskLog.logs.filter(log => log.checked === true).length
        }
      })

    //TODO: hardcoded tasks quantity
    const weeklySuccessRate = +((100 * weeklyCheckedTasks) / (6 * 7)).toFixed()
    const monthlySuccessRate = +((100 * monthlyCheckedTasks) / (6 * 7 * 4)).toFixed()

    const weeklyUnchecked = (6 * 7) - weeklyCheckedTasks
    const monthlyUnchecked = (6 * 7 * 4) - monthlyCheckedTasks

    const weeklyPoints = weeklyCheckedTasks * 3
    const monthlyPoints = monthlyCheckedTasks * 3

    setStats({
      weeklyCheckedTasks,
      monthlyCheckedTasks,
      weeklySuccessRate,
      monthlySuccessRate,
      weeklyUnchecked,
      monthlyUnchecked,
      weeklyPoints,
      monthlyPoints,
    })
  }

  useEffect(() => {
    mountActiviyAndChart()
  }, [selectedMenuOption])

  return (
    <VStack>
      <VStack>
        <Heading
          fontFamily="heading"
          fontSize={32}
          px={6}
          pt={16}
          pb={4}
        >
          Resultados
        </Heading>
      </VStack>

      <VStack px={8} mt={2}>
        <HStack borderRadius="full" bgColor="gray.300" justifyContent="space-around">
            <TouchableOpacity onPress={() => setSelectedMenuOption(MenuOptionEnum.weekly)}>
              <Box borderRadius="full" py={2} px={16} backgroundColor={selectedMenuOption === 'Semanal' ? 'gray.100' : 'gray.300'}>
                  <Text
                    fontFamily="body"
                    fontSize={20}
                  >
                    Semanal
                  </Text>
              </Box>
            </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedMenuOption(MenuOptionEnum.monthly)} >
            <Box borderRadius="full" py={2} px={16} backgroundColor={selectedMenuOption === 'Mensal' ? 'gray.100' : 'gray.300'}>
              <Text
                fontFamily="body"
                fontSize={20}
              >
                Mensal
              </Text>
            </Box>
          </TouchableOpacity>
        </HStack>
      </VStack>

      <VStack mt={8} px={8}>
        <Box
          rounded="2xl"
          bgColor="gray.100"
          width="100%"
          height={48}
          p={4}
          justifyContent="space-between"
        > 
          <HStack justifyContent="space-around">
            <VStack>
              <Text 
                fontFamily="heading" 
                fontSize="xl" 
                textTransform="uppercase" 
                fontWeight="bold" 
                color="gray.500" 
                letterSpacing={2}
              >
                Ritmo
              </Text>
              <Heading
                color="green.500"
                fontSize="3xl"
                textAlign="left"
              >
                { 
                  selectedMenuOption === MenuOptionEnum.weekly ? stats.weeklySuccessRate : 
                    selectedMenuOption === MenuOptionEnum.monthly ? stats.monthlySuccessRate : 0
                }%
              </Heading>
            </VStack>

            <VStack>
            <Text 
                fontFamily="heading" 
                fontSize="xl" 
                textTransform="uppercase" 
                fontWeight="bold" 
                color="gray.500" 
                letterSpacing={2}
              >
                Concluídas
              </Text>
              <Heading
                color="gray.700"
                fontSize="3xl"
                textAlign="right"
              >
                { 
                  selectedMenuOption === MenuOptionEnum.weekly ? stats.weeklyCheckedTasks : 
                    selectedMenuOption === MenuOptionEnum.monthly ? stats.monthlyCheckedTasks : 0
                }
              </Heading>
            </VStack>
          </HStack>

          <HStack justifyContent="space-around">
            <VStack>
              <Text 
                fontFamily="heading" 
                fontSize="xl" 
                textTransform="uppercase" 
                fontWeight="bold" 
                color="gray.500" 
                letterSpacing={2}
              >
                Pontos
              </Text>
              <Box py={1} px={6} bgColor="blue.400" rounded="full">
                <Heading
                  color="gray.700"
                  fontSize="2xl"
                  textAlign="left"
                >
                { 
                    selectedMenuOption === MenuOptionEnum.weekly ? stats.weeklyPoints : 
                      selectedMenuOption === MenuOptionEnum.monthly ? stats.monthlyPoints : 0
                 }
                {" "} 🏆                 
                </Heading>
              </Box>
            </VStack>

            <VStack>
            <Text 
                fontFamily="heading" 
                fontSize="xl" 
                textTransform="uppercase" 
                fontWeight="bold" 
                color="gray.500" 
                letterSpacing={2}
              >
                Falhas
              </Text>
              <Heading
                color="red.500"
                fontSize="3xl"
                textAlign="right"
              >
                 { 
                    selectedMenuOption === MenuOptionEnum.weekly ? stats.weeklyUnchecked : 
                      selectedMenuOption === MenuOptionEnum.monthly ? stats.monthlyUnchecked : 0
                 }
              </Heading>
            </VStack>
          </HStack>

        </Box>
      </VStack>

      <VStack mt={8} px={8}>
        {
          weeksOfMonth && daysOfWeek ? (
            <LineChart
              data={{
                labels: 
                  selectedMenuOption === MenuOptionEnum.weekly ? 
                      daysOfWeek!.map(date => date.key) :
                  weeksOfMonth!.map((weekDate) => weekDate.key) 
                ,
                datasets: [
                  {
                    data: 
                      selectedMenuOption === MenuOptionEnum.weekly ? 
                        daysOfWeek!.map(date => date.value) :
                      weeksOfMonth!.map((weekDate) => weekDate.value),
                    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                    strokeWidth: 2,
                  }
                ],
                legend: ["Tarefas realizadas"]
              }}
              width={Dimensions.get("window").width - 64}
              height={256}
              chartConfig={chartConfig}
              withHorizontalLines={false}
              withVerticalLines={false}
              formatYLabel={(value) => value.split('.')[0]}
              bezier
              style={{
                borderRadius: 16
              }}
            /> 
          ) : <Loading />
        }
      </VStack>
    </VStack>
  )
}