import React, { useEffect, useState } from "react";
import { History } from "./History";
import { nanoid } from "nanoid";

export const Shortener = () => {
  const [addedLink, setAddedLink] = useState(false);
  const [newLink, setNewLink] = useState(null);

  async function handleSubmit() {
    console.log(newLink);
    let newShortCode = nanoid(6); //generate random shortcode
    let linkToShorten = { link: newLink, shortcode: newShortCode };
    try {
      const response = await fetch(
        "/api/link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(linkToShorten),
        },
      );
      const result = await response.json();
      console.log("Success:", result);
      setAddedLink(!addedLink)
    } catch (e) {
      console.log("Error", e);
    }
  }
  return (
    <div className="shortener">
      <input type="text" onChange={(e) => setNewLink(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
      <History addedLink={addedLink} />
    </div>
  );
};
