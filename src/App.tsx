import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import logo from './img/mortal-kombat-logo.png'
import './App.css'
import jsonData from './data/characters.json'
import type { Character } from './types'
import SquadAverage from './componenets/SquadAverage';
const data: Character[] = jsonData as Character[]

function App() {
  // TODO: list out all of the object params for tags and selectedSquad
  const [allTags, setAllTags] = useState([] as any);
  const [selectedSquad, setSelectedSquad] = useState([] as any);
  const [allFighters] = useState(data);
  const [filteredFighters, setFilteredFighters] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const abilityList = useRef(['Power', 'Mobility', 'Technique', 'Survivability', 'Energy']);

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    const filterSearch = allFighters.filter((fighter) => fighter.name.toLowerCase().includes(value));
    setFilteredFighters(filterSearch);
  };

  const generateListOfTags = useCallback(
    () => {
      // TODO: rename const
      const arr: any[] = [];
      allFighters.forEach((fighter) => {
        if (typeof fighter.tags !== 'undefined') {
          fighter.tags.forEach((tag) => {
            const tagExists = arr.filter((a) => a.tag_name === tag.tag_name);
            if (tagExists.length === 0) {
              arr.push(tag);
            }
          });
        }
      });

      setAllTags(arr);
    },
    [allFighters],
  );

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      generateListOfTags();
    }

    return () => {
      isMounted = false;
    };
  }, [generateListOfTags]);

  const amendSquad = (add: any, fighter: { id: number; }) => {
    const selectedSquadClone = JSON.parse(JSON.stringify(selectedSquad));

    if (add) {
      selectedSquadClone.push(fighter);
    } else {
      const index = selectedSquadClone.findIndex((obj: { id: number; }) => obj.id === fighter.id);
      selectedSquadClone.splice(index, 1);
    }

    setSelectedSquad(selectedSquadClone);
  };

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
      </header>
      <main>
        <h1>
          {selectedSquad.length > 0 ? 'Your champions!' : 'Select your squad to defend earthrealm'}
        </h1>
        <div className="selected-squad--wrapper">
          {selectedSquad.map((member: {
            thumbnail: string;
            name: string;
            id: number;
          }) => (
            <button
              type="button"
              className="selected-squad--member"
              onClick={() => amendSquad(false, member)}
            >
              <img src={member.thumbnail} alt={member.name} />
            </button>
          ))}
        </div>
        <SquadAverage selectedSquad={selectedSquad} abilityList={abilityList} />
        <div className="search-form--wrapper">
          {/* TODO: add validation */}
          <form noValidate onSubmit={(e) => submitSearch(e)}>
            <div className="input-wrapper">
              <label htmlFor="search" className="form-label">Search characters</label>
              <input
                type="text"
                className="form-control"
                id="search"
                name="search"
                required
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => { handleInputChange(e); }}
              />
            </div>
            {/* TODO: add loader */}
            <button
              type="button"
              className="btn"
            >
              <span>Search</span>
            </button>
          </form>
        </div>
        <div className="tags--wrapper">
          {allTags.map((tag: { tag_name: string; }) => (
            <div className="individual-tag">
              {tag.tag_name}
            </div>
          ))}
        </div>
        <div className="fighter-table--wrapper">
          <table>
            <thead>
              <tr>
                <th scope="col">Character</th>
                <th scope="col">Tags</th>
                {abilityList.current.map((ability) => (
                  <th scope="col" key={ability}>{ability}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFighters.map((fighter: {
                abilities: any;
                tags: any;
                thumbnail: string;
                name: string;
                id: number;
              }) => (
                <tr key={fighter.id}>
                  <th scope="row">
                    {/* TODO: move to actual function */}
                    <input
                      type="checkbox"
                      name={String(fighter.id)}
                      checked={typeof selectedSquad.filter((member: { id: number; }) => member.id === fighter.id)[0] !== 'undefined'}
                      onChange={(e) => {
                        const { checked } = e.target;
                        amendSquad(checked, fighter);
                      }}
                    />
                    <img src={fighter.thumbnail} alt={fighter.name} />
                    {fighter.name}
                  </th>
                  <td>
                    {typeof fighter.tags !== 'undefined'
                      && fighter.tags.map((tag: { tag_name: string; }) => (
                        <div className="individual-tag" key={tag.tag_name}>
                          {tag.tag_name}
                        </div>
                      ))}
                  </td>
                  {abilityList.current.map((ability) => {
                    const abilities = fighter.abilities.filter((a: { abilityName: string; }) => a.abilityName === ability)[0];

                    if (typeof abilities !== 'undefined') {
                      return <th scope="col" key={ability}>{abilities.abilityScore}</th>
                    }

                    return <th scope="col" key={ability}>0</th>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main >
    </div >
  )
}

export default App;
