import {FC} from "react";
import {WithAppNavs} from "./index";
import {Text} from "react-native-paper";

export const Appointment: FC<WithAppNavs<"Appointment">> = ({route: {params: {id}}}) => <>
    <Text>Appointment {id}</Text>
</>