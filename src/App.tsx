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
const data: Character[] = jsonData as Character[]

function App() {
  const [allTags, setAllTags] = useState([] as any);
  const [selectedSquad, setSelectedSquad] = useState([] as any);
  const [searchTerm, setSearchTerm] = useState('');
  const abilityList = useRef(['Power', 'Mobility', 'Technique', 'Survivability', 'Energy']);
  // const [selectedMember, setSelectedMember] = useState(null);

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const generateListOfTags = useCallback(
    () => {
      // TODO: rename const
      const arr: any[] = [];
      data.forEach((fighter) => {
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
    [],
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

  console.log(data);
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
          {selectedSquad.map((member: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
            <div className="selected-squad--member">
              {member.name}
            </div>
          ))}
        </div>
        <div className="selected-member--wrapper">
          <div className="selected-member--stat">
            <span>Power</span>
            dsfsdf
          </div>
          <div className="selected-member--stat">
            <span>Mobility</span>
            dsfsdf
          </div>
          <div className="selected-member--stat">
            <span>Technique</span>
            dsfsdf
          </div>
          <div className="selected-member--stat">
            <span>Survability</span>
            dsfsdf
          </div>
          <div className="selected-member--stat">
            <span>Energy</span>
            dsfsdf
          </div>
          <small>* Totals as average for squad</small>
        </div>
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
          {allTags.map((tag: { tag_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
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
              {data.map((fighter) => (
                <tr key={fighter.id}>
                  <th scope="row">
                    <img src={fighter.thumbnail} alt={fighter.name} />
                    {fighter.name}
                  </th>
                  <td>
                    {typeof fighter.tags !== 'undefined'
                      && fighter.tags.map((tag) => (
                        <div className="individual-tag">
                          {tag.tag_name}
                        </div>
                      ))}
                  </td>
                  {abilityList.current.map((ability) => {
                    const abilities = fighter.abilities.filter((a) => a.abilityName === ability)[0];

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
      </main>
    </div>
  )
}

export default App;
