import { Group, Line, Text, useFont } from "@shopify/react-native-skia";
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import * as d3 from 'd3';

interface Props {
    height: number;
    canvasWidth: number;
    maxValue: number;
    topMargin: number;
    bottomMargin: number;
    steps?: number;
    paddingLeft?: number;
}

const YAxis = ({height, canvasWidth, maxValue, topMargin, bottomMargin, steps = 5, paddingLeft = 40}: Props) => {
    const font = useFont(Roboto_400Regular, 10);
    if (!font) {
        return null;
    }

    const tickCount = 5;
    const tickValues = d3.ticks(0, maxValue, tickCount);

    return(
        <Group>
            <Line
                p1={{x: paddingLeft, y: 0}}
                p2={{x: paddingLeft, y: height}}
                color='#666666'
            />
            {
                tickValues.filter((value) => (Number.isInteger(value))).map((value, index) => {
                    const y = (value / maxValue) * height + topMargin ;
                    
                    return (
                        <Group key={value}>
                            <Line
                                p1={{x: paddingLeft, y: y}}
                                p2={{x: canvasWidth, y: y}}
                            />
                            <Text
                                font={font}
                                text={(maxValue - value).toString()}
                                x={5}
                                y={y - 10}
                            />
                        </Group>
                    );
                })
            }
        </Group>
    )
}

export default YAxis;