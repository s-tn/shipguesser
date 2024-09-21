'use client';

import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as casing from 'crypto';
import './main.css';

interface Ship {
  special: string[];
  name: string;
  tank: ('armor' | 'shield')[];
  weapon: ('turret' | 'launcher' | 'drones' | 'projector' | 'fighters')[];
  class: string;
  faction: 'amarr' | 'caldari' | 'gallente' | 'minmatar' | 'ore' | 'angel cartel' | 'blood raiders' | 'guristas' | "mordu's legion" | "sansha's nation" | 'serpentis' | 'sisters of eve' | 'concord' | 'edencom' | 'soct' | 'triglavian' | 'upwell';
}

const classes = {
  corvette: ['corvette'],
  frigate: ["frigate", "navy frigate", "pirate frigate", "assault frigate", "covert ops", "electronic attack frigate", "interceptor", "logistics frigate"],
  destroyer: ["destroyer", "navy destroyer", "pirate destroyer", "command destroyer", "interdictor", "tactical destroyer"],
  cruiser: ["cruiser", "navy cruiser", "pirate cruiser", "heavy assault cruiser", "heavy interdiction cruiser", "logistics cruiser", "recon ship", "strategic cruiser"],
  battlecruiser: ["battlecruiser", "navy battlecruiser", "pirate batlecruiser", "command ship"],
  battleship: ["battleship", "navy battleship", "pirate battleship", "black ops", "marauder"],
  dreadnought: ["dreadnought", "navy dreadnought", "pirate dreadnought", "lancer dreadnought"],
  carrier: ["carrier", "supercarrier", "pirate supercarrier", "force auxiliary", "pirate force auxiliary"],
  titan: ["titan", "pirate titan"],
}

const classNames = Object.keys(classes);

const pirates = Object.assign(
  Object.fromEntries(['amarr', 'caldari', 'gallente', 'minmatar', 'ore', 'angel cartel', 'blood raiders', 'guristas', "mordu's legion", "sansha's nation", 'serpentis', 'sisters of eve', 'concord', 'edencom', 'soct', 'triglavian', 'upwell'].map(name => [name, null])),
  {
    'angel cartel': ["gallente", "minmatar"],
    'blood raiders': ["amarr", "minmatar"],
    guristas: ["gallente", "caldari"],
    "mordu's legion": ["gallente", "caldari"],
    "sansha's nation": ["amarr", "caldari"],
    serpentis: ["gallente", "minmatar"],
    'sisters of eve': ["gallente", "amarr"],
    concord: ["amarr", "caldari", "gallente", "minmatar"],
    edencom: ["concord"],
    'upwell': ["concord"],
  }
);

const specials: {[key: string]: string[]} = {
  resources: ["mining", "salvaging"],
  offensive_tackle: ["tackle", "webbing", "bubbles", "WDFG"],
  offensive_ewar: ["tracking disruption", "guidance disruption", "neutralization", "ECM", "target painter", "damps"],
  offensive: ["bombs"],
  standstils: ["bastion", "siege", "triage", "industrial core"],
  defensive: ["assault damage control", "PANIC"],
  subcap_support: ["logi", "command bursts", "MJFG"],
  cap_support: ["logi", "networked sensor array", "clone bay", "portal generator", "command bursts"],
  cap_offensive: ["lance", "burst projector", "doomsday"],
  travel: ["cloaking", "cyno", "invisibility", "exploration"],
  misc: ["modes"]
};

export default function Home() {
  const [ ships, setShips ] = useState<Ship[]>([]);
  const [ guesses, setGuesses ] = useState<string[]>([]);
  const [ guessDisplay, setGuessDisplay ] = useState<any[]>([]);

  useEffect(() => {
    fetch('/final.css').then(res => res.text()).then(buffer => {
      let data = Buffer.from(buffer, 'base64');
      while (data.length % 16 !== 0) {
        data = Buffer.concat([data, Buffer.from('00', 'hex')]);
      }
      const cipher = casing.createDecipheriv(atob('YWVzLTI1Ni1jYmM='), Buffer.from('2afb7f24669427b0e4919361a158f5587a3a80b46099582b03a46d64b46bc3d4', 'hex'), Buffer.from('fdb01e7bc91566ba603f1e46c7f72904', 'hex'));
      const decrypted = cipher.update(data) + cipher.final('utf-8');

      setShips(JSON.parse(decrypted));
    });
  }, []);

  useEffect(() => {
    if (!ships.length) {
      return;
    }

    if (localStorage.getItem('guesses')) {
      // setGuesses(JSON.parse(localStorage.getItem('guesses')!).map((guess: {guess: string, colors: { [key: string]: 'gray' | 'orange' | 'yellow' | 'green'; }}) => guess.guess));
    }
  }, [ships]);

  useEffect(() => {
    if (!guesses.length) {
      return;
    }

    const data: {guess: string, colors: {
      [key: string]: 'gray' | 'orange' | 'yellow' | 'green';
    } & {
      specials: [string, 'gray' | 'orange' | 'yellow' | 'green'][];
    }}[] = [];

    guesses.forEach(guess => {
      const correct = ships.find(s => s.name === ship)!;
      const guessShip = ships.find(s => s.name === guess)!;
      
      if (guess === ship) {
        return alert('vruh ' + guesses.length + 1);
      }

      const colors: {
        [key: string]: 'gray' | 'orange' | 'yellow' | 'green';
      } & {
        specials: [string, 'gray' | 'orange' | 'yellow' | 'green'][];
      } = {
        class: 'gray',
        faction: 'gray',
        specials: [],
        tank: 'gray',
        weapon: 'gray'
      } as any

      /* Class */
      { 
        function getClass(type: string) {
          for (const [key, value] of Object.entries(classes)) {
            if (value.includes(type)) {
              return key;
            }
          }

          return null;
        }
        
        const classIndex = classNames.indexOf(getClass(correct.class) || '');
        const guessClassIndex = classNames.indexOf(getClass(guessShip.class) || '');
        const classDiff = Math.abs(classIndex - guessClassIndex);
        console.log(classDiff)
        if (classDiff == 1) {
          colors['class'] = 'orange';
        }

        if (classDiff == 0) {
          if (correct.class === guessShip.class) {
            colors['class'] = 'green';
          } else {
            colors['class'] = 'yellow'
          }
        }
      }

      /* Faction */
      {
        if (correct.faction === guessShip.faction) {
          colors['faction'] = 'green';
        } else if (pirates[correct.faction]?.includes(guessShip.faction)) {
          colors['faction'] = 'yellow';
        } else if (pirates[guessShip.faction]?.includes(correct.faction)) {
          colors['faction'] = 'yellow';
        }
      }

      /* Special */
      {
        if (!correct.special.length && !guessShip.special.length) {
          colors['specials'] = [["None", 'green']];
        } else {
          for (const special of correct.special) {
            if (guessShip.special.includes(special)) {
              colors['specials'].push([special, 'green']);
            } else {
              for (const guessSpecial of guessShip.special) {
                for (const key in specials) {
                  if (specials[key].includes(special) && specials[key].includes(guessSpecial)) {
                    colors['specials'].push([special, 'yellow']);
                    break;
                  }
                }

                if (!colors['specials'].find(([s]) => s === guessSpecial)) {
                  colors['specials'].push([guessSpecial, 'gray']);
                }
              }
            }
          }
        }
      }

      /* Tank */
      {
        let len = correct.tank.length;
        let correctTank = correct.tank;

        for (const tank of guessShip.tank) {
          if (correctTank.includes(tank)) {
            len--;
          }
        }

        if (len === 0) {
          colors['tank'] = 'green';
        } else if (len === 1) {
          colors['tank'] = 'yellow';
        } else {
          colors['tank'] = 'gray';
        }
      }

      /* Weapon */
      {
        const categories = [
          ['turret'], ['launcher'], ['drones', 'fighters'], ['projector']
        ];

        const correctWeapon = correct.weapon;
        const guessWeapon = guessShip.weapon;

        let len = correctWeapon.length;

        let category = len;

        for (const [index, weapons] of categories.entries()) {
          let correctLen = correctWeapon.filter(w => weapons.includes(w)).length;
          let guessLen = guessWeapon.filter(w => weapons.includes(w)).length;

          if (correctLen === guessLen) {
            category--;
          }
        }

        if (category < len) {
          colors['weapon'] = 'yellow';
        }

        if (JSON.stringify(correctWeapon) === JSON.stringify(guessWeapon)) {
          colors['weapon'] = 'green';
        }
      }
      
      data.push({guess, colors})
    });

    localStorage.setItem('guesses', JSON.stringify(data));

    setGuessDisplay(data.toReversed().map(({guess, colors}) => {
      const shipData = ships.find(s => s.name === guess)!;
      return (
        <div key={guess} className="guess">
          <h2>{shipData.name}</h2>
          <div className="guess-internals">
            <div className="image-over guess-internal">
              <Image className="ship-image" src="/favicon.ico" alt="ship image" width="130" height="130" />
            </div>
            <div className="class-over guess-internal">
              <Image className="class-image" src="/favicon.ico" alt="ship class image" width="100" height="100" />
              <div className="class" style={{color: colors.class}}>Class: {shipData.class}</div>
            </div>
            <div className="other-over guess-internal">
              <div className="faction half" style={{color: colors.faction}}>Faction: {shipData.faction}</div>
              <div className="tank half" style={{color: colors.tank}}>Tank: {shipData.tank.join(', ')}</div>
            </div>
            <div className="weapon-over guess-internal">
            <Image className="weapon-image" src="/favicon.ico" alt="ship class image" width="100" height="100" />
              <div className="weapon" style={{color: colors.weapon}}>Weapon: {shipData.weapon.join(', ')}</div>
            </div>
            <div className="specials guess-internal">
              <h3 className="specials-head">Specials</h3>
              {
                colors.specials.map(([special, color]) => (
                  <span key={special} style={{color}}>{special}</span>
                ))
              }
            </div>
          </div>
        </div>
      );
    }));
  }, [guesses, ships]);

  const ship = 'thrasher';

  function submit(e: SubmitEvent) {
    e.preventDefault();
    const target: HTMLFormElement = e.target as any; // womp womp
    const input = target.querySelector('input') as HTMLInputElement;
    const guess: string = input.value.toLowerCase();

    if (!guess) {
      return;
    }

    if (!ships.find(s => s.name === guess)) {
      return alert('Invalid ship');
    }

    if (guesses.includes(guess)) {
      return;
    }

    setGuesses([...guesses, guess]);
  }

  if (!ships.length) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  return (
    <>
      <form onSubmit={submit as any}>
        <h1>shipguesser</h1>
        <input />

        <div>
          {
            guessDisplay
          }
        </div>
      </form>
    </>
  );
}


