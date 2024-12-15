'use client';

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import * as casing from 'crypto';
import Confetti from 'react-confetti'
import './main.css';

interface Ship {
  special: string[];
  name: string;
  tank: ('armor' | 'shield')[];
  weapon: ('turret' | 'launcher' | 'drones' | 'projector' | 'fighters')[];
  class: string;
  majorClass: string;
  faction: 'amarr' | 'caldari' | 'gallente' | 'minmatar' | 'ore' | 'angel cartel' | 'blood raiders' | 'guristas' | "mordu's legion" | "sansha's nation" | 'serpentis' | 'sisters of eve' | 'concord' | 'edencom' | 'soct' | 'triglavian' | 'upwell' | 'deathless';
}

const classes = {
  corvette: ['corvette'],
  frigate: ["frigate", "navy frigate", "pirate frigate", "assault frigate", "covert ops", "electronic attack frigate", "interceptor", "logistics frigate", "mining frigate", "stealth bomber", "expedition frigate"],
  destroyer: ["destroyer", "navy destroyer", "pirate destroyer", "command destroyer", "interdictor", "tactical destroyer"],
  cruiser: ["cruiser", "navy cruiser", "pirate cruiser", "heavy assault cruiser", "heavy interdiction cruiser", "logistics cruiser", "recon ship", "strategic cruiser", "flag cruiser", "mining barge", "exhumer"],
  battlecruiser: ["battlecruiser", "navy battlecruiser", "pirate battlecruiser", "command ship"],
  battleship: ["battleship", "navy battleship", "pirate battleship", "black ops", "marauder"],
  dreadnought: ["dreadnought", "navy dreadnought", "pirate dreadnought", "lancer dreadnought"],
  freighter: ["freighter", "jump freighter"],
  carrier: ["carrier", "supercarrier", "pirate supercarrier", "force auxiliary", "pirate force auxiliary"],
  titan: ["titan", "pirate titan"],
}

const command_classes = {
  porpoise: "cruiser",
  orca: "battleship",
  rorqual: "freighter"
}

const turrets = {
  laser: ['amarr', 'blood raiders', "sansha's nation", 'concord', 'soct'],
  hybrid: ['caldari', 'gallente', 'serpentis', 'concord', 'soct'],
  projectile: ['minmatar', 'angel cartel', 'concord', 'soct'],
  disintegrator: ['triglavian']
};

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
  offensive: ["bombs", "breacher"],
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
  const [ Omnibox, setOmnibox ] = useState<any>(<></>);
  
  let ship = useRef<string>('');

  useEffect(() => {
    fetch('/final.css').then(res => res.text()).then(buffer => {
      let data = Buffer.from(buffer, 'base64');
      while (data.length % 16 !== 0) {
        data = Buffer.concat([data, Buffer.from('00', 'hex')]);
      }
      const cipher = casing.createDecipheriv(atob('YWVzLTI1Ni1jYmM='), Buffer.from('2afb7f24669427b0e4919361a158f5587a3a80b46099582b03a46d64b46bc3d4', 'hex'), Buffer.from('fdb01e7bc91566ba603f1e46c7f72904', 'hex'));
      const decrypted = cipher.update(data) + cipher.final('utf-8');

      const parsed = JSON.parse(decrypted);

      for (var i = 0; i < parsed.length; i++) {
        const ship = parsed[i];
        if (ship.class === "industrial command ship") {
          ship.majorClass = "industrial command ship";
        } else {
          ship.majorClass = Object.keys(classes).find((key) => (classes as any)[key].includes(ship.class))!;
        }
      }

      setShips(parsed);
    });
  }, []);

  useEffect(() => {
    if (!ships.length) {
      return;
    }

    if (ship.current === '') {
      ship.current = ships[Math.floor(Math.random() * ships.length)].name;

      fetch(`/log/${ship.current}`);
    }

    if (localStorage.getItem('guesses')) {
      // setGuesses(JSON.parse(localStorage.getItem('guesses')!).map((guess: {guess: string, colors: { [key: string]: '#b3b3b3' | '#ffc04d' | '#ecec52' | '#00df00'; }}) => guess.guess));
    }
  }, [ships]);

  useEffect(() => {
    if (!guesses.length) {
      return;
    }

    const data: {guess: string, colors: {
      [key: string]: '#b3b3b3' | '#ffc04d' | '#ecec52' | '#00df00';
    } & {
      specials: [string, '#b3b3b3' | '#ffc04d' | '#ecec52' | '#00df00'][];
    }}[] = [];

    guesses.forEach(guess => {
      const correct = ships.find(s => s.name === ship.current)!;
      const guessShip = ships.find(s => s.name === guess)!;

      const colors: {
        [key: string]: '#b3b3b3' | '#ffc04d' | '#ecec52' | '#00df00';
      } & {
        specials: [string, '#b3b3b3' | '#ffc04d' | '#ecec52' | '#00df00'][];
      } = {
        class: '#b3b3b3',
        faction: '#b3b3b3',
        specials: [],
        tank: '#b3b3b3',
        weapon: '#b3b3b3'
      } as any

      const c: {
        [key: string]: '#b3b3b3' | '#ffc04d' | '#ecec52' | '#00df00';
      } = {
        grey: '#b3b3b3',
        orange: '#ffc04d',
        yellow: '#ecec52',
        green: '#00df00'
      }

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

        if (ship.current in command_classes) {
          if (correct.class === guessShip.class) {
            colors['class'] = c.orange;
            if (command_classes[ship.current as keyof typeof command_classes] === command_classes[guessShip.name as keyof typeof command_classes]) {
              colors['class'] = c.orange;
            }
          } else {
            if (command_classes[ship.current as keyof typeof command_classes] === getClass(guessShip.class)) {
              colors['class'] = c.yellow;
            }
          }
        } else {
          const classIndex = classNames.indexOf(getClass(correct.class) || '');
          const guessClassIndex = classNames.indexOf(getClass(guessShip.class) || '');
          const classDiff = Math.abs(classIndex - guessClassIndex);
          if (classDiff == 1) {
            colors['class'] = c.orange;
          }

          if (classDiff == 0) {
            if (correct.class === guessShip.class) {
              colors['class'] = c.green;
            } else {
              colors['class'] = c.yellow;
            }
          }
        }
      }

      /* Faction */
      {
        if (correct.faction === guessShip.faction) {
          colors['faction'] = c.green;
        } else if (pirates[correct.faction]?.includes(guessShip.faction)) {
          colors['faction'] = c.yellow;
        } else if (pirates[guessShip.faction]?.includes(correct.faction)) {
          colors['faction'] = c.yellow;
        }
      }

      /* Special */
      {
        if (!correct.special.length && !guessShip.special.length) {
          colors['specials'] = [["None", c.green]];
        } else if (!guessShip.special.length) {
          colors['specials'] = [["None", c.grey]];
        } else {
          const temp = [];
          for (const special of guessShip.special) {
            if (correct.special.includes(special)) {
              colors['specials'].push([special, c.green]);
            } else {
              for (const guessSpecial of guessShip.special) {
                for (const key in specials) {
                  if (specials[key].includes(special) && specials[key].includes(guessSpecial)) {
                    colors['specials'].push([special, c.yellow]);
                    break;
                  }
                }

                if (!colors['specials'].find(([s]) => s === guessSpecial) && !correct.special.includes(guessSpecial)) {
                  temp.push([guessSpecial, c.grey]);
                }
              }
            }
          }
          for (const entry of temp) {
            if (!colors['specials'].find(([s]) => s === entry[0])) {
              colors['specials'].push(entry as typeof colors['specials'][0]);
            }
          }
          /*for (const special of ["", ...correct.special]) {
            if (guessShip.special.includes(special)) {
              colors['specials'].push([special, c.green]);
            } else {
              for (const guessSpecial of guessShip.special) {
                for (const key in specials) {
                  if (specials[key].includes(special) && specials[key].includes(guessSpecial)) {
                    colors['specials'].push([special, c.yellow]);
                    break;
                  }
                }

                if (!colors['specials'].find(([s]) => s === guessSpecial) && !correct.special.includes(guessSpecial)) {
                  colors['specials'].push([guessSpecial, c.grey]);
                }
              }
            }
          }*/
        }
      }

      /* Tank */
      {
        let len = correct.tank.length;
        let len_0 = correct.tank.length;
        let correctTank = correct.tank;

        for (const tank of guessShip.tank) {
          if (correctTank.includes(tank)) {
            len--;
          }
        }

        if (len === 0) {
          colors['tank'] = c.green;

          if (guessShip.tank.length > correctTank.length) {
            colors['tank'] = c.orange;
          }
        } else if (len === 1 && len_0 === 2) {
          colors['tank'] = c.yellow;
        } else {
          colors['tank'] = c.grey;
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

          if (correctLen === guessLen && (correctLen > 0 || guessLen > 0)) {
            category--;
          }
        }

        if (category < len) {
          colors['weapon'] = c.yellow;
        }

        if (JSON.stringify(correctWeapon) === JSON.stringify(guessWeapon)) {
          colors['weapon'] = c.green;
        }
      }
      
      data.push({guess, colors})
    });

    localStorage.setItem('guesses', JSON.stringify(data));

    setGuessDisplay(data.toReversed().map(({guess, colors}) => {
      const shipData = ships.find(s => s.name === guess)!;
      return (
        <div key={guess} className="guess guess-correct">
          {
            (() => {
              if (guess === ship.current) {
                return <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  confettiSource={{
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                    w: 0,
                    h: 0
                  }}
                  recycle={false}
                  numberOfPieces={100}
                  gravity={0.1}
                  initialVelocityX={{
                    min: -7,
                    max: 7
                  }}
                  initialVelocityY={10}
                  tweenDuration={100}
                 />;
              }
            })()
          }
          <h2 className="ship-name">{shipData.name.split(' ').map((seg: any) => seg.upperFirst()).join(' ')}</h2>
          <div className="guess-internals">
            <div className="image-over guess-internal">
              <Image className="ship-image" src={`/shipimg/${shipData.name.toLowerCase().split(' ').join('_')}.jpg`} alt="ship image" width="130" height="130" />
            </div>
            <div className="other-internals">
              <div className="class-over guess-internal">
                <Image className="class-image" src={`/classimg/${shipData.majorClass}.png`} alt="ship class image" width="32" height="32" />
                <div className="class" style={{color: colors.class}}>Class: {shipData.class.split(' ').map((seg: any) => seg.upperFirst()).join(' ')}</div>
              </div>
              <div className="other-over guess-internal">
                <div className="faction" style={{color: colors.faction}}>
                  <Image className="faction-image" src={`/factionimg/${shipData.faction.toLowerCase().split(' ').join('_')}.png`} alt="ship class image" width="84" height="84" />
                  Faction: {shipData.faction.split(' ').map((seg: any) => seg.upperFirst()).join(' ')}
                </div>
                <div className="tank" style={{color: colors.tank}}>Tank: {shipData.tank.map((tank: any) => tank.split(' ').map((seg: any) => seg.upperFirst()).join(' ')).join(', ')}</div>
              </div>
              <div className="weapon-over guess-internal">
                <div className="weapon-image-container">
                  {
                    shipData.weapon.map(weapon => {
                      switch(weapon.toLowerCase()) {
                        case 'turret':
                          const turretTypes = Object.keys(turrets).filter(t => turrets[t as keyof typeof turrets].includes(shipData.faction));
                          return (
                            <>
                              {
                                turretTypes.map(turret => (
                                  <Image key={turret} className="weapon-image" src={`/weaponimg/Turret_${turret}.png`} alt="ship class image" width="32" height="32" />
                                ))
                              }
                            </>
                          );
                        case 'launcher':
                          return <Image key={weapon} className="weapon-image" src={`/weaponimg/launcher.png`} alt="ship class image" width="32" height="32" />;
                        case 'drones':
                        case 'fighters':
                          return <Image key={weapon} className="weapon-image" src={`/weaponimg/drones.png`} alt="ship class image" width="32" height="32" />;
                        case 'projector':
                          return <Image key={weapon} className="weapon-image" src={`/weaponimg/vortron.png`} alt="ship class image" width="32" height="32" />;
                      }
                    })
                  }
                </div>
                <div className="weapon" style={{color: colors.weapon}}>Weapon: {shipData.weapon.map((weapon: any) => weapon.split(' ').map((seg: any) => seg.upperFirst()).join(' ')).join(', ')}</div>
              </div>
              <div className="specials guess-internal">
                <h3 className="specials-head">Specials</h3>
                {
                  colors.specials.map(([special, color]) => (
                    <span key={special} style={{color}}>{special.split(' ').map((seg: any) => seg.upperFirst()).join(' ')}</span>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      );
    }));
  }, [guesses, ships]);

  function input(e: InputEvent) {
    const applied = ships.filter(s => s.name.toLowerCase().startsWith((e.target as HTMLInputElement).value.toLowerCase()));

    setOmnibox(
      <>
        <div className="omnibox">
          {
            applied.map(entry => (
              <div key={entry.name} className="omnibox-entry" onClick={() => {
                (e.target as HTMLInputElement).value = entry.name;
                setOmnibox(<></>);
                (e.target as HTMLInputElement).focus()
              }}>
                {entry.name}
              </div>
            ))
          }
        </div>
      </>
    )
  }

  function submit(e: SubmitEvent) {
    e.preventDefault();
    const target: HTMLFormElement = e.target as any; // womp womp
    const input = target.querySelector('input') as HTMLInputElement;
    const guess: string = input.value.toLowerCase();

    if (!guess) {
      return;
    }

    if (guesses.includes(ship.current)) {
      return;
    }

    if (!ships.find(s => s.name === guess)) {
      return alert('Invalid ship');
    }

    if (guesses.includes(guess)) {
      return;
    }

    input.value = '';
    document.getElementById('main')!.scrollTo({ top: 0, behavior: 'smooth' });
    setOmnibox(<></>);

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
        <div id="form-over">
          <h1>shipguesser</h1>
          <div className="main-input">
            <input onInput={input as any} />
            { 
              Omnibox
            }
          </div>
        </div>

        <div id="main">
          {
            guessDisplay
          }
        </div>
      </form>
    </>
  );
}


