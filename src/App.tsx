import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import logo from './img/mortal-kombat-logo.png'
import { ReactComponent as Search } from './img/search.svg';
import { ReactComponent as Tick } from './img/tick.svg';
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
  const [selectedTags, setSelectedTags] = useState([]);
  const searchTerm = useRef('');
  const abilityList = useRef(['Power', 'Mobility', 'Technique', 'Survivability', 'Energy']);
  const fighterSelected = useCallback((fighter: { id: number; }) => typeof selectedSquad.filter((member: { id: number; }) => member.id === fighter.id)[0] !== 'undefined', [selectedSquad]);

  const filterFighters = (selectedTagsClone: never[] | null) => {
    const selectedtags = selectedTagsClone || selectedTags;
    const filterSearch = allFighters.filter((fighter: {
      tags: any;
      id: number;
      name: string;
    }) => {
      let tagSearch = [];

      if (typeof fighter.tags !== 'undefined') {
        tagSearch = fighter.tags.filter((a: { tag_name: string; }) => {
          return selectedtags.includes(a.tag_name.toLowerCase())
        });
      }

      if (selectedtags.length > 0) {
        return tagSearch.length > 0 && fighter.name.toLowerCase().includes(searchTerm.current);
      }

      return fighter.name.toLowerCase().includes(searchTerm.current);
    });
    setFilteredFighters(filterSearch);
  };

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    filterFighters(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchTerm.current = e.target.value;
    filterFighters(null);
  };

  const generateListOfTags = useCallback(
    () => {
      // TODO: rename const
      const arr: any[] = [];
      allFighters.forEach((fighter) => {
        if (typeof fighter.tags !== 'undefined') {
          fighter.tags.forEach((tag: { tag_name: string; }) => {
            const tagExists = arr.filter((a: { tag_name: string; }) => a.tag_name === tag.tag_name);
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

  const clearFilter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setFilteredFighters(allFighters);
    setSelectedTags([]);
    searchTerm.current = '';
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
              key={member.id}
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
                value={searchTerm.current}
                onChange={(e) => { handleInputChange(e); }}
              />
            </div>
            {/* TODO: add loader */}
            <button
              type="button"
              className="btn"
            >
              <Search />
            </button>
          </form>
        </div>
        <div className="tags--wrapper">
          {allTags.map((tag: { tag_name: string; }) => (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const selectedTagsClone = JSON.parse(JSON.stringify(selectedTags));

                if (selectedTagsClone.includes(tag.tag_name)) {
                  const index = selectedTagsClone.indexOf(tag.tag_name);
                  selectedTagsClone.splice(index, 1);
                } else {
                  selectedTagsClone.push(tag.tag_name);
                }

                setSelectedTags(selectedTagsClone);
                filterFighters(selectedTagsClone);
              }}
              className={`individual-tag${selectedTags.includes(tag.tag_name) ? ' active' : ''}`}
              key={tag.tag_name}
            >
              <Tick />
              {tag.tag_name}
            </button>
          ))}
          <button
            type="button"
            onClick={(e) => clearFilter(e)}
            className="clear-all"
          >
            Clear all
          </button>
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
                <tr key={fighter.id} className={fighterSelected(fighter) ? 'active' : ''}>
                  <td>
                    <div className="table-row-fighter--wrapper">
                      <input
                        type="checkbox"
                        name={String(fighter.id)}
                        checked={fighterSelected(fighter)}
                        onChange={(e) => {
                          const { checked } = e.target;
                          amendSquad(checked, fighter);
                        }}
                      />
                      <img src={fighter.thumbnail} alt={fighter.name} />
                      {fighter.name}
                    </div>
                  </td>
                  <td>
                    <div className="tags--wrapper">
                      {typeof fighter.tags !== 'undefined'
                        && fighter.tags.map((tag: { tag_name: string; }) => (
                          <div className="individual-tag" key={tag.tag_name}>
                            {tag.tag_name}
                          </div>
                        ))}
                    </div>
                  </td>
                  {abilityList.current.map((ability) => {
                    const abilities = fighter.abilities.filter((a: { abilityName: string; }) => a.abilityName === ability)[0];

                    if (typeof abilities !== 'undefined') {
                      return <td key={ability} className={abilities.abilityScore === 10 ? 'active' : ''}>{abilities.abilityScore}</td>
                    }

                    return <td key={ability}>0</td>
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
