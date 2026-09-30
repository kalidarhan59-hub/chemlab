import { describe, it, expect } from 'vitest';
import {
  createEmptyVessel,
  processVesselState,
  getImpossibleReason,
  REAGENTS_MAP,
  REACTIONS_LIST,
} from './reactionEngine';

describe('Laboratory Reaction Engine Tests (20+ test cases)', () => {
  const dummyName = { kk: 'Сынауық 1', ru: 'Пробирка 1', en: 'Test Tube 1' };

  it('1. Test Tube initialization starts empty and clean', () => {
    const vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    expect(vessel.volumeMl).toBe(0);
    expect(vessel.reagentsAdded.length).toBe(0);
    expect(vessel.precipitate).toBeNull();
    expect(vessel.gas).toBeNull();
    expect(vessel.lastReaction).toBeNull();
  });

  it('2. Adding single reagent does not trigger reaction yet', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'CuSO4', 5);
    expect(vessel.volumeMl).toBe(5);
    expect(vessel.reagentsAdded.length).toBe(1);
    expect(vessel.lastReaction).toBeNull();
    expect(vessel.liquidColor).toBe(REAGENTS_MAP['CuSO4'].color);
  });

  it('3. Precipitation: CuSO4 + 2NaOH -> blue precipitate Cu(OH)2', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'CuSO4', 5);
    vessel = processVesselState(vessel, 'NaOH', 5);

    expect(vessel.lastReaction).not.toBeNull();
    expect(vessel.lastReaction?.id).toBe('cux_naoh_cuoh2');
    expect(vessel.precipitate?.color).toBe('blue');
    expect(vessel.precipitate?.formula).toBe('Cu(OH)2');
  });

  it('4. Precipitation: AgNO3 + NaCl -> white curdy precipitate AgCl', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'AgNO3', 5);
    vessel = processVesselState(vessel, 'NaCl', 5);

    expect(vessel.lastReaction?.id).toBe('agno3_nacl_agcl');
    expect(vessel.precipitate?.formula).toBe('AgCl');
    expect(vessel.precipitate?.color).toBe('white');
  });

  it('5. Precipitation: BaCl2 + H2SO4 -> white dense precipitate BaSO4', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'BaCl2', 5);
    vessel = processVesselState(vessel, 'H2SO4', 5);

    expect(vessel.lastReaction?.id).toBe('bacl2_h2so4_baso4');
    expect(vessel.precipitate?.formula).toBe('BaSO4');
  });

  it('6. Precipitation: FeCl3 + 3NaOH -> brown rust precipitate Fe(OH)3', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'FeCl3', 5);
    vessel = processVesselState(vessel, 'NaOH', 5);

    expect(vessel.lastReaction?.id).toBe('fecl3_naoh_feoh3');
    expect(vessel.precipitate?.color).toBe('brown');
    expect(vessel.precipitate?.formula).toBe('Fe(OH)3');
  });

  it('7. Precipitation: Pb(NO3)2 + 2KI -> bright yellow precipitate PbI2 (Golden Rain)', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'Pb(NO3)2', 5);
    vessel = processVesselState(vessel, 'KI', 5);

    expect(vessel.lastReaction?.id).toBe('pbno32_ki_pbi2');
    expect(vessel.precipitate?.color).toBe('yellow');
    expect(vessel.precipitate?.formula).toBe('PbI2');
  });

  it('8. Gas Evolution: Na2CO3 + 2HCl -> CO2 gas without precipitate', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'Na2CO3', 5);
    vessel = processVesselState(vessel, 'HCl', 5);

    expect(vessel.lastReaction?.id).toBe('na2co3_hcl_co2');
    expect(vessel.gas?.formula).toBe('CO2');
    expect(vessel.precipitate).toBeNull();
  });

  it('9. Gas Evolution: NaHCO3 + CH3COOH -> kitchen volcano CO2 gas', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'NaHCO3', 5);
    vessel = processVesselState(vessel, 'CH3COOH', 5);

    expect(vessel.lastReaction?.id).toBe('nahco3_ch3cooh_co2');
    expect(vessel.gas?.formula).toBe('CO2');
  });

  it('10. Gas Evolution: Solid chalk CaCO3 + 2HCl -> bubbling CO2', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'CaCO3', 5);
    vessel = processVesselState(vessel, 'HCl', 5);

    expect(vessel.lastReaction?.id).toBe('caco3_hcl_co2');
    expect(vessel.gas?.formula).toBe('CO2');
  });

  it('11. Metal displacement: Zn + 2HCl -> H2 gas evolution', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'Zn', 5);
    vessel = processVesselState(vessel, 'HCl', 5);

    expect(vessel.lastReaction?.id).toBe('zn_hcl_h2');
    expect(vessel.gas?.formula).toBe('H2');
  });

  it('12. Metal displacement: Mg + 2HCl -> violent H2 gas evolution', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'Mg', 5);
    vessel = processVesselState(vessel, 'HCl', 5);

    expect(vessel.lastReaction?.id).toBe('mg_hcl_h2');
    expect(vessel.gas?.formula).toBe('H2');
    expect(vessel.gas?.intensity).toBe('violent');
  });

  it('13. Metal displacement: Fe + CuSO4 -> reddish metallic copper deposition', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'Fe', 5);
    vessel = processVesselState(vessel, 'CuSO4', 5);

    expect(vessel.lastReaction?.id).toBe('fe_cuso4_cu');
    expect(vessel.precipitate?.formula).toBe('Cu');
    expect(vessel.precipitate?.color).toBe('red');
  });

  it('14. Amphoteric metal: Al + NaOH -> H2 gas evolution', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'Al', 5);
    vessel = processVesselState(vessel, 'NaOH', 5);

    expect(vessel.lastReaction?.id).toBe('al_naoh_h2');
    expect(vessel.gas?.formula).toBe('H2');
  });

  it('15. Acid-Base Neutralization: NaOH + HCl -> NaCl + H2O with heat', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'NaOH', 5);
    vessel = processVesselState(vessel, 'HCl', 5);

    expect(vessel.lastReaction?.id).toBe('naoh_hcl_neutralization');
    expect(vessel.lastReaction?.type).toBe('neutralization');
    expect(vessel.temperatureC).toBeGreaterThan(25);
  });

  it('16. Indicator: Litmus in HCl shifts to red', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'Litmus', 2);
    vessel = processVesselState(vessel, 'HCl', 5);

    expect(vessel.lastReaction?.id).toBe('litmus_in_acid');
    expect(vessel.liquidColor).toContain('239, 68, 68');
  });

  it('17. Indicator: Phenolphthalein in NaOH turns magenta/pink', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'Phenolphthalein', 2);
    vessel = processVesselState(vessel, 'NaOH', 5);

    expect(vessel.lastReaction?.id).toBe('phenolphthalein_in_base');
    expect(vessel.liquidColor).toContain('236, 72, 153');
  });

  it('18. Multi-reagent mixture: NaOH + Phenolphthalein + HCl neutralizes back to colorless', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'NaOH', 5);
    vessel = processVesselState(vessel, 'Phenolphthalein', 2);
    vessel = processVesselState(vessel, 'HCl', 10);

    expect(vessel.lastReaction?.id).toBe('neutralize_pink_phenolphthalein');
    expect(vessel.precipitate).toBeNull();
  });

  it('19. Thermal decomposition: Cu(OH)2 upon heating turns into black CuO', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'CuSO4', 5);
    vessel = processVesselState(vessel, 'NaOH', 5);
    expect(vessel.precipitate?.color).toBe('blue');

    // Turn on burner
    vessel = processVesselState(vessel, undefined, 0, true);
    expect(vessel.lastReaction?.id).toBe('heat_cuoh2_cuo');
    expect(vessel.precipitate?.formula).toBe('CuO');
    expect(vessel.precipitate?.color).toBe('black');
  });

  it('20. Impossible reaction: Cu + HCl does not react because copper is below H2', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'Cu', 5);
    vessel = processVesselState(vessel, 'HCl', 5);

    expect(vessel.lastReaction).toBeNull();
    expect(vessel.impossibleNotice).not.toBeNull();
    expect(vessel.impossibleNotice?.ru).toContain('Медь');
    expect(vessel.impossibleNotice?.kk).toContain('Мыс');
  });

  it('21. Impossible reaction: Two strong acids (HCl + H2SO4) do not react', () => {
    const reason = getImpossibleReason(['HCl', 'H2SO4']);
    expect(reason.ru).toContain('Кислоты не реагируют друг с другом');
  });

  it('22. Complexation: CuSO4 + excess NH3 forms deep sapphire blue complex', () => {
    let vessel = createEmptyVessel('t1', 'test_tube', dummyName);
    vessel = processVesselState(vessel, 'CuSO4', 5);
    vessel = processVesselState(vessel, 'NH3', 10);

    expect(vessel.lastReaction?.id).toBe('cux_nh3_complex');
    expect(vessel.precipitate).toBeNull();
  });
});
