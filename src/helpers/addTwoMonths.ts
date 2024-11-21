import { Timestamp } from "firebase/firestore";

export const addTwoMonths = (timestamp: Timestamp) => {
    const fecha = timestamp.toDate();        // Convertir Timestamp a Date
    fecha.setMonth(fecha.getMonth() + 2);    // Sumar 2 meses
    return Timestamp.fromDate(fecha);        // Convertir Date de vuelta a Timestamp
};