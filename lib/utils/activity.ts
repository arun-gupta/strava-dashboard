import {
  FaPersonRunning,
  FaBicycle,
  FaPersonSwimming,
  FaPersonHiking,
  FaPersonWalking,
  FaPersonSkiing,
  FaPersonSnowboarding,
  FaDumbbell,
  FaPersonRays,
  FaWater,
  FaFutbol,
  FaBolt,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

const ACTIVITY_MAP: Record<string, { icon: IconType; label: string }> = {
  Run: { icon: FaPersonRunning, label: "Run" },
  TrailRun: { icon: FaPersonRunning, label: "Trail Run" },
  VirtualRun: { icon: FaPersonRunning, label: "Virtual Run" },
  Ride: { icon: FaBicycle, label: "Ride" },
  MountainBikeRide: { icon: FaBicycle, label: "Mountain Bike" },
  GravelRide: { icon: FaBicycle, label: "Gravel Ride" },
  EBikeRide: { icon: FaBicycle, label: "E-Bike Ride" },
  VirtualRide: { icon: FaBicycle, label: "Virtual Ride" },
  Swim: { icon: FaPersonSwimming, label: "Swim" },
  Hike: { icon: FaPersonHiking, label: "Hike" },
  Walk: { icon: FaPersonWalking, label: "Walk" },
  AlpineSki: { icon: FaPersonSkiing, label: "Alpine Ski" },
  NordicSki: { icon: FaPersonSkiing, label: "Nordic Ski" },
  BackcountrySki: { icon: FaPersonSkiing, label: "Backcountry Ski" },
  Snowboard: { icon: FaPersonSnowboarding, label: "Snowboard" },
  WeightTraining: { icon: FaDumbbell, label: "Weight Training" },
  Workout: { icon: FaDumbbell, label: "Workout" },
  Yoga: { icon: FaPersonRays, label: "Yoga" },
  Rowing: { icon: FaWater, label: "Rowing" },
  Kayaking: { icon: FaWater, label: "Kayaking" },
  StandUpPaddling: { icon: FaWater, label: "Stand Up Paddling" },
  Surfing: { icon: FaWater, label: "Surfing" },
  Soccer: { icon: FaFutbol, label: "Soccer" },
};

function splitCamelCase(str: string): string {
  return str.replace(/([A-Z])/g, " $1").trim();
}

export function getActivityMeta(sportType: string): { icon: IconType; label: string } {
  if (!sportType) {
    return { icon: FaBolt, label: "Activity" };
  }
  if (ACTIVITY_MAP[sportType]) {
    return ACTIVITY_MAP[sportType];
  }
  return { icon: FaBolt, label: splitCamelCase(sportType) };
}

export function formatPace(elapsedSeconds: number, distanceMetres: number): string | null {
  if (distanceMetres === 0) return null;
  const paceSecondsPerKm = (elapsedSeconds / distanceMetres) * 1000;
  const minutes = Math.floor(paceSecondsPerKm / 60);
  const seconds = Math.floor(paceSecondsPerKm % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")} /km`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
