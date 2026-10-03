import { Jellyfish, Octopus } from '../creatures'
import { Ambient, Critter } from './Critter'

/** Twilight zone (Experience, Achievements): drifting jellyfish and an octopus watching from its rock */
export default function TwilightLife() {
  return (
    <>
      <Ambient />

      <Critter lane={1} dy="clamp(-34px, -2.6vw, -16px)" w="clamp(26px, 3vw, 46px)" mode="swim-right" dur={110} delay={30} restX="18vw" bob={8} bobDur={4.4} glows className="jelly">
        <Jellyfish />
      </Critter>
      <Critter lane={1} dy="clamp(6px, 1.4vw, 20px)" w="clamp(20px, 2.2vw, 34px)" mode="swim-right" dur={130} delay={85} restX="44vw" bob={6} bobDur={3.6} glows className="jelly violet" extra>
        <Jellyfish />
      </Critter>
      <Critter lane={1} dy="clamp(-14px, -1vw, -4px)" w="clamp(22px, 2.6vw, 40px)" mode="swim-left" dur={120} delay={50} restX="74vw" bob={8} bobDur={5} glows className="jelly">
        <Jellyfish />
      </Critter>

      {/* Taller jellies rising and sinking in the side margins on wide screens */}
      <Critter lane={1} w="44px" mode="drift" dur={18} delay={4} gutter="left" glows className="jelly violet">
        <Jellyfish />
      </Critter>
      <Critter lane={2} w="36px" mode="drift" dur={22} delay={11} gutter="right" glows className="jelly">
        <Jellyfish />
      </Critter>

      <div className="octopus-spot">
        <Octopus />
      </div>
    </>
  )
}
