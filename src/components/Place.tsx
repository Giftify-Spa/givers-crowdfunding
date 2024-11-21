/* eslint-disable no-unsafe-optional-chaining */
import { useRef } from "react";
import { StandaloneSearchBox, Libraries, useJsApiLoader } from "@react-google-maps/api";
import { TextInput } from "@mantine/core";


interface Props {
    updateAddress: (address: string, lat: string, lng: string) => void;
}

const libraries: Libraries = ["places"]; // Define libraries outside the component

const GooglePlace = ({ updateAddress }: Props) => {
    const inputRef = useRef<google.maps.places.SearchBox | null>(null);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        libraries,
    });

    const handlePlaceChanged = () => {
        const [place] = inputRef.current?.getPlaces();

        if (place) {
            updateAddress(
                place.formatted_address || '',
                place.geometry?.location.lat().toString() || '',
                place.geometry?.location.lng().toString() || '');
        }

    }

    if (loadError) {
        return <div>Error al cargar Google Maps</div>;
    }

    if (!isLoaded) {
        return null;
    }

    return (
        <StandaloneSearchBox
            onLoad={(ref) => (inputRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}
        >
            <TextInput label="Dirección" placeholder="Av condell, Antofagasta, Chile" />
        </StandaloneSearchBox>
    )
}

export default GooglePlace;