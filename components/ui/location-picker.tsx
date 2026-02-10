import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import {
    GoogleMap,
    Marker,
    Autocomplete,
    useLoadScript,
} from "@react-google-maps/api"
import { useState } from "react"
import { Input } from "./input"
import { useRef } from "react"

const libraries: ("places")[] = ["places"]

export function LocationPicker({
    onSelect,
}: {
    onSelect: (lat: number, lng: number) => void
}) {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
    const [open, setOpen] = useState(false)
    const [position, setPosition] = useState({
        lat: 20.5937, // India default
        lng: 78.9629,
    })

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
        libraries,
    })
    console.log("Checking Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? "Key found" : "Key MISSING");

    if (!isLoaded) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Choose from Map
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Select Location</DialogTitle>
                </DialogHeader>

                {/* Search */}
                

                <Autocomplete
                    onLoad={(ref) => (autocompleteRef.current = ref)}
                    onPlaceChanged={() => {
                        const place = autocompleteRef.current?.getPlace()

                        if (!place || !place.geometry) return

                        const location = place.geometry.location

                        setPosition({
                            lat: location.lat(),
                            lng: location.lng(),
                        })
                    }}
                >
                    <Input placeholder="Search location..." />
                </Autocomplete>


                {/* Map */}
                <GoogleMap
                    center={position}
                    zoom={14}
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    onClick={(e) =>
                        setPosition({
                            lat: e.latLng!.lat(),
                            lng: e.latLng!.lng(),
                        })
                    }
                >
                    <Marker
                        position={position}
                        draggable
                        onDragEnd={(e) =>
                            setPosition({
                                lat: e.latLng!.lat(),
                                lng: e.latLng!.lng(),
                            })
                        }
                    />
                </GoogleMap>

                <DialogFooter>
                    <Button
                        onClick={() => {
                            onSelect(position.lat, position.lng)
                            setOpen(false)
                        }}
                    >
                        Add Location
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
