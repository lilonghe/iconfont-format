import icons from "./icons";

export type IconType = keyof typeof icons;
export default function Icon({
    type,
    size = "1em",
    color,
}: {
    type: IconType;
    size?: number | string;
    color?: string;
}) {
    return <svg width={size} height={size} fill={color} viewBox="0 0 100 100">{icons[type]}</svg>;
}
