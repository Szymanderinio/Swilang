import { PieChart as PieChartKit } from 'react-native-chart-kit';
import { PieChartProps } from 'react-native-chart-kit/dist/PieChart';
import { Dimensions, Text, View, StyleSheet } from 'react-native';

import { Colors } from '../constants/colors';

const windowWidth = Dimensions.get('window').width;

const chartConfig = {
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
};

type Props = {
  data: Record<string, any>[];
  accessor: string;
  title: string;
} & Partial<PieChartProps>;

export default function PieChart({
  data,
  accessor,
  title,
  ...restProps
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <PieChartKit
        {...restProps}
        data={data}
        width={windowWidth - 100}
        height={120}
        chartConfig={chartConfig}
        accessor={accessor}
        backgroundColor={'transparent'}
        center={[0, 0]}
        paddingLeft='0'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackgroundColor,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
