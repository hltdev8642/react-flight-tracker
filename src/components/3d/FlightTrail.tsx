import {miscellaneousOptionsState, selectedFlightState} from "../../atoms.ts";
import {useRecoilValue} from "recoil";
import {useQuery} from "@tanstack/react-query";
import {
    convertToCartesian,
    flightRadarApi,
    listInterpolatedGeoCoordinates
} from "../../utils.ts";
import {EARTH_RADIUS, reductionFactor} from "../../constants.ts";
import {Vector3} from "three";
import {Line, Sphere} from "@react-three/drei";
import {useEffect} from "react";
import {toast} from "react-toastify";
import Callout from "./Callout.tsx";

export default function FlightTrail() {
    const selectedFlight = useRecoilValue(selectedFlightState);
    const annotationsEnabled = useRecoilValue(miscellaneousOptionsState).enableAnnotations
    const {data, refetch, isLoading} = useQuery({
        queryKey: ['flight', selectedFlight?.id],
        queryFn: () => flightRadarApi.fetchFlight(selectedFlight?.id || ''),
        refetchInterval: 10000,
        enabled: !!selectedFlight,
        refetchOnWindowFocus: true,

    })
    if (isLoading && !toast.isActive('flightTrail') && selectedFlight) {
        toast.loading(`Loading flight trail for ${selectedFlight.callsign}...`
            , {
                toastId: 'flightTrail',
            })
    }
    if (!isLoading && toast.isActive('flightTrail')) {
        toast.dismiss('flightTrail')
    }


    useEffect(() => {
            refetch().catch((e) => console.error(e))
        }
        , [refetch, selectedFlight])

    const altitudeFactor = useRecoilValue(miscellaneousOptionsState).altitudeFactor
    const lineWidth = 20000000 * reductionFactor
    let points = data?.trail && data?.trail?.length > 3 && data?.trail?.map((trailPoint) => {
            const cartesian = convertToCartesian(trailPoint.lat, trailPoint.lng, EARTH_RADIUS + trailPoint.alt * reductionFactor * altitudeFactor)
            return new Vector3(cartesian.x, cartesian.y, cartesian.z)
        }
    )
    if (points) {
        const cartesian = convertToCartesian(selectedFlight?.trailEntity.lat || 0, selectedFlight?.trailEntity.lng || 0, EARTH_RADIUS + (selectedFlight?.trailEntity?.alt || 0) * reductionFactor * altitudeFactor)
        points.unshift(new Vector3(cartesian.x, cartesian.y, cartesian.z))
    }

    if (!points || points.length < 2) {
        points = undefined
    }

    const destination = convertToCartesian(data?.airport?.destination?.position.latitude || 0, data?.airport?.destination?.position.longitude || 0, EARTH_RADIUS + (data?.airport?.destination?.position.altitude || 0) * reductionFactor * altitudeFactor + 0.001)
    const origin = convertToCartesian(data?.airport?.origin?.position?.latitude || 0, data?.airport?.origin?.position?.longitude || 0, EARTH_RADIUS + (data?.airport?.origin?.position?.altitude || 0) * reductionFactor * altitudeFactor + 0.001)

    return (
        <>
            <Line
                points={points || [new Vector3(0, 0, 0), new Vector3(0.1, 0.1, 0.11)]}
                color={'green'}
                lineWidth={lineWidth}/>

            {
                (data &&
                    data.airport?.destination &&
                    data.airport?.origin) &&
                <>
                    {
                        points && points.length > 1 && (
                            <Line
                                color={'white'}
                                dashed={true}
                                gapSize={0.01}
                                dashSize={0.01}
                                points={
                                    listInterpolatedGeoCoordinates({
                                            latitude: selectedFlight?.trailEntity.lat || 0,
                                            longitude: selectedFlight?.trailEntity.lng || 0,
                                            altitude: selectedFlight?.trailEntity.alt || 0
                                        }
                                        , {
                                            latitude: data?.airport.destination?.position.latitude || 0,
                                            longitude: data?.airport.destination?.position.longitude || 0,
                                            altitude: data?.airport.destination?.position.altitude || 0
                                        },
                                        100,
                                    ).map(
                                        (point) => {
                                            const cartesian = convertToCartesian(point.latitude, point.longitude, EARTH_RADIUS + point.altitude * reductionFactor * altitudeFactor)
                                            return new Vector3(cartesian.x, cartesian.y, cartesian.z)
                                        }
                                    )
                                }/>
                        )
                    }
                    {
                        annotationsEnabled &&
                        <>
                            <Callout position={
                                new Vector3(destination.x, destination.y, destination.z)

                            } text={`Destination: ${data?.airport?.destination?.name || ''}`}/>
                            <Callout position={
                                new Vector3(origin.x, origin.y, origin.z)
                            } text={`Origin: ${data?.airport?.origin?.name || ''}`}/>

                            <Sphere args={[EARTH_RADIUS / 100, 10, 10]}
                                    position={
                                        new Vector3(destination.x, destination.y, destination.z)
                                    }>
                                <meshStandardMaterial
                                    color={'white'}
                                    emissive={'white'}
                                    emissiveIntensity={0.5}
                                    flatShading={false}

                                />
                            </Sphere>
                            <Sphere args={[EARTH_RADIUS / 100, 10, 10]}
                                    position={
                                        new Vector3(origin.x, origin.y, origin.z)
                                    }>
                                <meshStandardMaterial
                                    color={'white'}
                                    emissive={'white'}
                                    emissiveIntensity={0.5}
                                    flatShading={false}

                                />
                            </Sphere>
                        </>
                    }


                </>
            }
        </>
    )
}
