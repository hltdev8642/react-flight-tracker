import {miscellaneousOptionsState, selectedFlightState} from "../../atoms.ts";
import {useRecoilValue} from "recoil";
import {useQuery} from "@tanstack/react-query";
import {convertToCartesian, flightRadarApi} from "../../utils.ts";
import {EARTH_RADIUS, reductionFactor} from "../../constants.ts";
import {Vector3} from "three";
import {Line} from "@react-three/drei";
import {useEffect} from "react";
import {toast} from "react-toastify";

export default function FlightTrail() {
    const selectedFlight = useRecoilValue(selectedFlightState);
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

    return (
        <Line
            points={points || [new Vector3(0, 0, 0), new Vector3(0.1, 0.1, 0.11)]}
            color={'green'}
            lineWidth={lineWidth}
        />

    )
}

