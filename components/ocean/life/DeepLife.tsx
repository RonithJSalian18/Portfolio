import { Anglerfish, CombJelly, Lanternfish } from '../creatures'
import { MiniDiver } from '../MiniDiver'
import { Ambient, Critter } from './Critter'

/** Deep sea (Contact): an anglerfish with its glowing lure, lanternfish and comb jellies */
export default function DeepLife() {
  return (
    <>
      <Ambient />

      {/* The diver, on screens without room for it in the side margin */}
      <Critter lane={0} dy="clamp(-34px, -4vw, -20px)" w="clamp(58px, 14vw, 86px)" mode="scroll-right" bob={4} bobDur={3.4} className="mini-diver">
        <MiniDiver lamp />
      </Critter>

      <Critter lane={0} w="clamp(78px, 9vw, 140px)" mode="swim-left" dur={64} delay={18} restX="62vw" bob={6} bobDur={5.5} glows className="angler">
        <Anglerfish />
      </Critter>

      <Critter lane={1} dy="-14px" w="clamp(32px, 3vw, 46px)" mode="swim-left" dur={34} delay={6} restX="30vw" glows className="lantern" flee>
        <Lanternfish />
      </Critter>
      <Critter lane={1} dy="8px" w="clamp(28px, 2.6vw, 40px)" mode="swim-left" dur={34} delay={4.6} restX="36vw" glows className="lantern" flee>
        <Lanternfish />
      </Critter>
      <Critter lane={1} dy="-2px" w="clamp(26px, 2.4vw, 36px)" mode="swim-left" dur={34} delay={3.2} restX="41vw" glows className="lantern" flee extra>
        <Lanternfish />
      </Critter>
      <Critter lane={1} dy="0px" w="clamp(18px, 1.8vw, 26px)" mode="swim-right" dur={90} delay={40} restX="78vw" bob={10} bobDur={4} glows className="comb" extra>
        <CombJelly />
      </Critter>

      <Critter lane={0} w="26px" mode="drift" dur={20} delay={6} gutter="right" glows className="comb">
        <CombJelly />
      </Critter>
      <Critter lane={1} w="22px" mode="drift" dur={16} delay={2} gutter="left" glows className="comb">
        <CombJelly />
      </Critter>
    </>
  )
}
