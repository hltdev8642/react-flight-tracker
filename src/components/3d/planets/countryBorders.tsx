import boundaries from "../../../assets/bounderies.json?raw";
import { Geojson } from "geojson-parser-js";
import {
  FeatureCollection,
  GeometryType,
  MultiPolygon,
  Polygon,
} from "geojson-parser-js/models/geojson";
import { EARTH_RADIUS } from "../../../constants.ts";
import { convertToCartesian } from "../../../utils.ts";

function mapPolygon(polygon: Polygon, index: number) {
  const vertices = new Float32Array(
    polygon.coordinates
      .map((coordinate) => {
        const cartesian = convertToCartesian(
          coordinate.lat,
          coordinate.lng,
          EARTH_RADIUS + 0.001,
        );
        return [cartesian.x, cartesian.y, cartesian.z];
      })
      .reverse()
      .flat(),
  );
  return (
    <line key={index} strokeWidth={0.1}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={vertices}
          itemSize={3}
          count={vertices.length / 3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="grey"
        linewidth={0.1}
        linecap="round"
        linejoin="round"
      />
    </line>
  );
}

export function CountryBorders() {
  const geojson: FeatureCollection = Geojson.parse(boundaries);
  return (
    <>
      {geojson.geometries
        .filter((geometry) => geometry.type === GeometryType.Polygon)
        .map((polygon, index) => {
          return mapPolygon(polygon as Polygon, index);
        })}
      {geojson.geometries
        .filter((geometry) => geometry.type === GeometryType.MultiPolygon)
        .map((multiPolygon) => {
          const multiPolygonPolygons = (multiPolygon as MultiPolygon).polygons;
          return multiPolygonPolygons.map((polygon, index) => {
            return mapPolygon(polygon, index);
          });
        })}
      {geojson.geometries
        .filter((geometry) => geometry.type === GeometryType.PolygonWithHole)
        .map((polygon, index) => {
          return mapPolygon(polygon as Polygon, index);
        })}
    </>
  );
}
