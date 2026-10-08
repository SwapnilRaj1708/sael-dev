import Image from 'next/image';
import boilerIcon from '@/assets/icons/equipped-with-the-best-available-technology/animated/19a-technology-chip-white-animated.svg';
import baleIcon from '@/assets/icons/adaptable-and-long-life-boiler-equipment/animated/20a-boiler-factory-white-animated.svg';
import threePassIcon from '@/assets/icons/secured-3-pass-straw-fired-boiler/animated/21a-boiler-shield-white-animated.svg';
import airCooledIcon from '@/assets/icons/conserving-water-through-air-cooled-condensers/animated/22c-water-saved-white-animated.svg';
import cycleIcon from '@/assets/icons/the-cycle-of-energy/animated/23b-cycle-sun-leaf-energy-white-animated.svg';
import ruralIcon from '@/assets/icons/augmentation-of-rural-economy/animated/24b-rural-coins-sprout-white-animated.svg';
import airQualityIcon from '@/assets/icons/improves-environmental-health-and-air-quality/animated/25a-air-sun-cloud-wind-white-animated.svg';
import fossilIcon from '@/assets/icons/reduces-reliance-on-fossil-fuels/animated/26a-fossil-power-plant-white-animated.svg';
import steadyIcon from '@/assets/icons/steady-and-reliable/animated/27d-reliable-shield-leaf-white-animated.svg';
import sheafIcon from '@/assets/icons/abundant-local-fuel-supply/animated/28a-fuel-pump-leaves-white-animated.svg';
import certificateIcon from '@/assets/icons/iso-certifications/animated/29b-iso-certificate-white-animated.svg';
import dataIcon from '@/assets/icons/mes-integration/animated/30a-mes-live-bars-white-animated.svg';
import inspectionIcon from '@/assets/icons/intelligent-inspection/animated/31b-inspection-eye-scan-white-animated.svg';
import chainIcon from '@/assets/icons/backward-integration/animated/32a-integration-chain-link-white-animated.svg';
import automationIcon from '@/assets/icons/n-type-topcon-cells/animated/33a-topcon-chip-white-animated.svg';
import targetIcon from '@/assets/icons/renewable-energy-targets/animated/34c-targets-scaling-modules-white-animated.svg';
import handshakeIcon from '@/assets/icons/policy-support-and-talent/animated/35b-policy-and-talent-white-animated.svg';
import { cn } from '@/lib/utils/cn';

/**
 * The marks for the Waste-to-Energy, Module Manufacturing and Solar Cell
 * Manufacturing pages (icons 19-35 of the supplied set, 2026-10-08), which
 * replaced the line art drawn here at the client's request of 2026-09-18.
 *
 * Files rather than inline SVG: each is fixed-colour white, carries its own
 * gradient id and animates itself with SMIL on a 3.5s loop, so none needs
 * `currentColor` and inlining would let ids collide. Every mark is decorative:
 * the card's heading is its name.
 */

/** Sized by the token, not by width/height attributes, so one value governs. */
const MARK_CLASS = 'size-(--value-mark-size) shrink-0 object-contain';

interface MarkProps {
  className?: string;
}

/** Equipped With the Best Available Technology */
export function BoilerMark({ className }: MarkProps) {
  return <Image src={boilerIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Adaptable and Long-Life Boiler Equipment */
export function BaleMark({ className }: MarkProps) {
  return <Image src={baleIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Secured 3-Pass Straw-Fired Boiler */
export function ThreePassMark({ className }: MarkProps) {
  return <Image src={threePassIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Conserving Water Through Air-Cooled Condensers */
export function AirCooledMark({ className }: MarkProps) {
  return <Image src={airCooledIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** The Cycle of Energy */
export function CycleMark({ className }: MarkProps) {
  return <Image src={cycleIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Augmentation of Rural Economy */
export function RuralMark({ className }: MarkProps) {
  return <Image src={ruralIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Improves Environmental Health and Air Quality */
export function AirQualityMark({ className }: MarkProps) {
  return <Image src={airQualityIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Reduces Reliance on Fossil Fuels */
export function FossilMark({ className }: MarkProps) {
  return <Image src={fossilIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Steady and Reliable */
export function SteadyMark({ className }: MarkProps) {
  return <Image src={steadyIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Abundant Local Fuel Supply */
export function SheafMark({ className }: MarkProps) {
  return <Image src={sheafIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** ISO certifications */
export function CertificateMark({ className }: MarkProps) {
  return <Image src={certificateIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** MES integration */
export function DataMark({ className }: MarkProps) {
  return <Image src={dataIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Intelligent inspection */
export function InspectionMark({ className }: MarkProps) {
  return <Image src={inspectionIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Backward integration */
export function ChainMark({ className }: MarkProps) {
  return <Image src={chainIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** N-type TOPCon cells */
export function AutomationMark({ className }: MarkProps) {
  return <Image src={automationIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Renewable energy targets */
export function TargetMark({ className }: MarkProps) {
  return <Image src={targetIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** Policy support and talent */
export function HandshakeMark({ className }: MarkProps) {
  return <Image src={handshakeIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}
