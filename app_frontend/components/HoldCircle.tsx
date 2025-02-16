import { SharedValue} from 'react-native-reanimated';
import { Circle, Paint, BlurMask } from '@shopify/react-native-skia';
import type { Hold } from '@/app/(app)/(tabs)/(boards)/board_configuration';

interface HoldCircleProps {
    hold: Hold;
    isActive: boolean;
}

export default function HoldCircle({hold, isActive} : HoldCircleProps) {

    return (
        <Circle 
            cx={hold.x}
            cy={hold.y}
            r={hold.r}
            color={'rgba(0,0,0,0)'}>
            <Paint color={isActive ? '#c705f7' : "#adbce6"} style="stroke" strokeWidth={2} />
        </Circle>
    );
}
