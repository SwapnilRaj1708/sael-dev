import Image from 'next/image';
import selectionIcon from '@/assets/icons/project-selection-and-monitoring/animated/12a-selection-sun-globe-white-animated.svg';
import efficiencyIcon from '@/assets/icons/sustain-operational-efficiencies/animated/13a-efficiency-solar-panel-white-animated.svg';
import developmentIcon from '@/assets/icons/robust-development-capabilities/animated/14a-development-blueprint-white-animated.svg';
import teamIcon from '@/assets/icons/dedicated-manpower-and-supervisory-team/animated/15a-manpower-team-white-animated.svg';
import planIcon from '@/assets/icons/implementation-&-monitoring-of-pre-approved-plan/animated/16a-plan-checklist-white-animated.svg';
import evacuationIcon from '@/assets/icons/designated-engineer-for-evacuation/animated/17a-evacuation-engineer-white-animated.svg';
import scadaIcon from '@/assets/icons/advanced-scada-technologies/animated/18b-scada-dashboard-white-animated.svg';
import { cn } from '@/lib/utils/cn';

/**
 * The Solar Energy page's seven marks: three for "Proven Execution
 * Capabilities", four for "Our EPC And O&M Practices".
 *
 * The supplied animated icons (2026-10-08, icons 12–18), which replaced the
 * line art drawn here on 2026-09-18. Files rather than inline SVG: each is
 * fixed-colour white, carries its own gradient id and animates itself with SMIL
 * on a 3.5s loop, so none needs `currentColor` and inlining would let ids
 * collide. Every mark is decorative — the card's `<h3>` is its name.
 */

/** Sized by the token, not by width/height attributes, so one value governs. */
const MARK_CLASS = 'size-(--value-mark-size) shrink-0 object-contain';

interface MarkProps {
  className?: string;
}

/** "Project Selection and Monitoring" */
export function SelectionMark({ className }: MarkProps) {
  return <Image src={selectionIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** "Sustain Operational Efficiencies" */
export function EfficiencyMark({ className }: MarkProps) {
  return <Image src={efficiencyIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** "Robust Development Capabilities" */
export function DevelopmentMark({ className }: MarkProps) {
  return <Image src={developmentIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** "Dedicated Manpower and Supervisory Team" */
export function TeamMark({ className }: MarkProps) {
  return <Image src={teamIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** "Implementation & Monitoring of Pre-approved Plan" */
export function PlanMark({ className }: MarkProps) {
  return <Image src={planIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** "Designated Engineer for Evacuation" */
export function EvacuationMark({ className }: MarkProps) {
  return <Image src={evacuationIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}

/** "Advanced SCADA Technologies" */
export function ScadaMark({ className }: MarkProps) {
  return <Image src={scadaIcon} alt="" aria-hidden className={cn(MARK_CLASS, className)} />;
}
