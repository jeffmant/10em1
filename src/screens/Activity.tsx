import { Box, HStack, Heading, Text, VStack, useTheme } from "native-base";
import { useState } from "react";
import { Dimensions, TouchableHighlight, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";

export function Activity () {
  const [selectedMenuOption, setSelectedMenuOption] = useState('Semanal')

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
            <TouchableOpacity onPress={() => setSelectedMenuOption('Semanal')}>
              <Box borderRadius="full" py={2} px={16} backgroundColor={selectedMenuOption === 'Semanal' ? 'gray.100' : 'gray.300'}>
                  <Text
                    fontFamily="body"
                    fontSize={20}
                  >
                    Semanal
                  </Text>
              </Box>
            </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedMenuOption('Mensal')} >
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
                98%
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
                12
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
              <Box py={1} px={4} bgColor="blue.400" rounded="full">
                <Heading
                  color="gray.700"
                  fontSize="2xl"
                  textAlign="left"
                >
                 🏆 32
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
                4
              </Heading>
            </VStack>
          </HStack>

        </Box>
      </VStack>

      <VStack mt={8} px={8}>
        <LineChart
          data={{
            labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
            datasets: [
              {
                data: [5, 3, 3, 1, 0, 1, 6],
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
      </VStack>
    </VStack>
  )
}