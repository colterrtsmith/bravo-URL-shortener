import React from "react";
import "./App.css";

function SubmitURL() {
  const [longURL, setLongURL] = React.useState('');
  const [submitURLResponse, setSubmitURLResponse] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!longURL) {
      alert("Cannot submit an empty URL!");
      return;
    }

    fetch('/api/url', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        url: longURL
      })
    })
    .then((response: Response) => {
      const response_ok: boolean = response.ok;
      response.json().then(responseBody => {
        if (!response_ok) {
          throw new Error(responseBody.message);
        }
        if (!responseBody.longURL) {
          throw new Error("bad response from server");
        }

        const resp_str: string = `long URL "${responseBody.longURL}" has been given short URL "${responseBody.shortURL}"`
        setSubmitURLResponse(resp_str);
      }).catch((error: string) => {
        setSubmitURLResponse(`Could not get short URL: ${error}`);
      })
    });

    setLongURL('');
  }

  return (
    <div>
      <h4>Shorten a URL: </h4>
      <form onSubmit={handleSubmit}>
        <label>
          <input 
            type="text" 
            value={longURL}
            onChange={(e) => setLongURL(e.target.value)}
          />
        </label>
        <input type="submit" value="Shorten"/>
      </form>
      <p>{submitURLResponse}</p>
    </div>
  );
}

function DeleteURL() {
  const [shortURL, setShortURL] = React.useState('');
  const [deleteURLResponse, setDeleteURLResponse] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shortURL) {
      alert("Cannot submit an empty URL!");
      return;
    }

    fetch('/api/url', {
      method: 'DELETE',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        url: shortURL
      })
    })
    .then((response: Response) => {
      if(response.ok) {
        setDeleteURLResponse(`Sucessfully deleted short URL ${shortURL}`);
        return;
      }

      response.json().then(responseBody => {
        setDeleteURLResponse(`Could not delete short URL ${shortURL}: ${responseBody.message}`);
      });
    });

    setShortURL('');
  }

  return (
    <div>
      <h4>Delete a shortened URL:</h4>
      <form onSubmit={handleSubmit}>
        <label> 
          <input 
            type="text" 
            value={shortURL}
            onChange={(e) => setShortURL(e.target.value)}
          />
        </label>
        <input type="submit"  value="Delete"/>
      </form>
      <p>{deleteURLResponse}</p>
    </div>
  );
}

function ListURLs() {
  const [URLsList, setURLsList] = React.useState(<ol></ol>);

  const handleListURLs = () => {
    fetch('/api/list', {
      method: 'GET'
    })
    .then((response: Response) => {
      const response_ok: boolean = response.ok;
      response.json().then(responseBody => {
        if (!response_ok) {
          throw new Error(responseBody.message);
        }
        if (!responseBody.URLsList || !(responseBody.URLsList instanceof Array)) {
          throw new Error("bad response from server");
        }

        const listItems: JSX.Element = responseBody.URLsList.map((item: any, index: number) => {
          if (typeof item !== 'string') {
            throw new Error("bad response from server");
          }
          return <li key={index}>{item}</li>;
        });
        const formattedURLsList: JSX.Element = <ol>{listItems}</ol>;
        setURLsList(formattedURLsList);
      }).catch((error: string) => {
        setURLsList(<p>{`Could not load URL list: ${error}`}</p>);
      })
    })
  }

  return (
    <div>
      <button onClick={handleListURLs}>See URLs</button>
      {URLsList}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <SubmitURL />
      <hr />
      <DeleteURL />
      <hr />
      <ListURLs />
    </div>
  );
}

export default App;