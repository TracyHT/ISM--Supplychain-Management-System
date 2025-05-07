import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material';

const SalesLineChart = ({ data }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === 'light';

  // Set text color based on theme mode
  const textColor = isLightMode ? '#333' : '#fff';

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 30, right: 110, bottom: 70, left: 80 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: '0',
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 15,
        tickRotation: 0,
        legend: 'Month',
        legendOffset: 50,
        legendPosition: 'middle',
        legendTextStyle: {
          fontSize: 12,
          fill: textColor,
        },
        tickTextStyle: {
          fontSize: 12,
          fill: textColor,
        }
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 15,
        tickRotation: 0,
        legend: 'Sales',
        legendOffset: -70,
        legendPosition: 'middle',
        legendTextStyle: {
          fontSize: 12,
          fill: textColor,
        },
        tickTextStyle: {
          fontSize: 12,
          fill: textColor,
        }
      }}
      enableGridX={true}
      enableGridY={true}
      colors={['#ff7f0e', '#1f77b4', '#2ca02c', '#d62728']}
      pointSize={8}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      gridYValues={5}
      gridXValues={12}
      gridLineColor={isLightMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)"}
      theme={{
        axis: {
          ticks: {
            text: {
              fill: textColor,
              fontSize: 12,
            },
          },
          legend: {
            text: {
              fill: textColor,
              fontSize: 12,
              fontWeight: 'bold',
            },
          },
        },
        grid: {
          line: {
            stroke: isLightMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)",
            strokeWidth: 1,
          },
        },
        tooltip: {
          container: {
            background: isLightMode ? '#fff' : '#333',
            color: isLightMode ? '#333' : '#fff',
            fontSize: 12,
            borderRadius: 4,
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }
        },
      }}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          itemTextColor: textColor,
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: isLightMode ? 'rgba(0, 0, 0, .03)' : 'rgba(255, 255, 255, .1)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default SalesLineChart;
