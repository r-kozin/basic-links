import React, { useEffect, useState } from "react";

export const History = ({addedLink}) => {
  const [links, setLinks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/links")
      .then((res) => res.json())
      .then((data) => {
        setLinks(data);
        console.log(data);
        setIsLoading(false);
      });
  }, [addedLink]); //fetch link list from backend, dependsa on addingLink from parent to refresh when link added

  return (
    <div className="history">
      History
      <br />
      <table className="history-table">
        <thead>
          <tr>
            <th>Link</th>
            <th>Shortcode</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (<tr>
          <td>Loading...</td>
          <td>Loading...</td>
          <td>Loading...</td>
          </tr>
          ) : (links.map((link) => { //map over links from fetch, add to table
            return (
            <tr key={link.id}>
                <td>{link.link}</td>
                <td><a href={`/api/link/${link.shortcode}`}>{link.shortcode}</a></td>
                <td>{link.created}</td>
            </tr>)
          })) //link to shortcode to redirect
        }
        </tbody>
      </table>
    </div>
  );
};
