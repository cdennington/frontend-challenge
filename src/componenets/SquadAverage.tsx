import React, { useCallback } from 'react';

// TODO: add prop types
function SquadAverage({ selectedSquad, abilityList }) {
  const displayTeamAverage = useCallback(
    (type: any) => {
      let total = 0;
      selectedSquad.forEach((member: { abilities: { abilityName: any; abilityScore: number; }[]; }) => {
        member.abilities.forEach((ability: { abilityName: any; abilityScore: number; }) => {
          if (ability.abilityName === type) {
            total += ability.abilityScore;
          }
        });
      });

      if (total === 0) {
        return '-';
      }

      return (total / selectedSquad.length).toFixed(2);
    },
    [selectedSquad],
  );

  return (
    <div className="selected-member--wrapper">
      {abilityList.current.map((ability: string) => (
        <div className="selected-member--stat" key={ability}>
          <span>{ability}</span>
          {displayTeamAverage(ability)}
        </div>
      ))}
      <small>* Totals as average for squad</small>
    </div>
  )
}

export default SquadAverage;
