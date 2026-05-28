// export const getLocation = (): Promise<{
//     latitude: number
//     longitude: number
//     accuracy: number
// }> => {
//     return new Promise((resolve, reject) => {
//         if (!navigator.geolocation) {
//             reject(new Error("Geolocation is not supported by this browser"))
//             return
//         }

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude, accuracy } = position.coords

//                 resolve({
//                     latitude,
//                     longitude,
//                     accuracy
//                 })
//             },
//             (error) => {
//                 reject(error)
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 15000,
//                 maximumAge: 0
//             }
//         )
//     })
// }



export const getLocation = (): Promise<{
    latitude: number
    longitude: number
    accuracy: number
}> => {
    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"))
            return
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {

                const { latitude, longitude, accuracy } = position.coords

                // accept only good accuracy
                if (accuracy <= 100) {
                    navigator.geolocation.clearWatch(watchId)

                    resolve({
                        latitude,
                        longitude,
                        accuracy
                    })
                }

            },
            (error) => {
                reject(error)
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0
            }
        )
    })
}