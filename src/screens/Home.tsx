import { FlatList, HStack, Heading, Text, VStack } from "native-base";
import { HomeHeader } from "../components/HomeHeader";
import { useState } from "react";
import { Daily } from "@components/Daily";
import { TaskCard } from "@components/TaskCard";

const DAYS = [
  { numberDay: '1', weekDay: 'dom' },
  { numberDay: '2', weekDay: 'seg' },
  { numberDay: '3', weekDay: 'ter' },
  { numberDay: '4', weekDay: 'qua' },
  { numberDay: '5', weekDay: 'qui' },
  { numberDay: '6', weekDay: 'sex' },
  { numberDay: '7', weekDay: 'sab' },
]

const EXERCISES = [
  { id: '1', title: 'Beber Água', description: 'Preparando a máquina', checked: true },
  { id: '2', title: 'Boot', description: 'Hoje é dia de TTT', checked: true },
  { id: '4', title: 'Ler a Palavra', description: 'Provérbios 1', checked: true },
  { id: '3', title: 'Exercício Físico', description: 'sdjkbashjbjhdsabjh asdnjdas kjn', checked: false },
  { id: '5', title: 'Ler 10 páginas', description: 'Pai Rico, Pai Pobre', checked: true },
  { id: '6', title: 'Trasbordar', description: 'Passe adiante o que aprendeu hoje', checked: false },
]

export function Home () {
  const [days, setDays] = useState(DAYS)
  const [selectedDay, setSelectedDay] = useState('')

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
      roundedTop="xl"
        data={days}
        keyExtractor={item => item.numberDay}
        renderItem={({ item }) => (
          <Daily
            numberDay={item.numberDay}
            weekDay={item.weekDay}
            isActive={selectedDay === item.numberDay} 
            onPress={() => setSelectedDay(item.numberDay)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        mt={8}
        mb={1}
        maxH={24}
        minH={10}
      />

      <VStack flex={1} px={4}>
        <FlatList 
          data={EXERCISES}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskCard data={item} />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 8 }}
        />
      </VStack>

    </VStack>
  )
}