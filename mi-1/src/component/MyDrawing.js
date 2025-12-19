import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from '../ulits';
import { useLocation } from "react-router-dom";
import '../App.css';
import { Link } from 'react-router-dom';

export default function SavedImagePage() {
  const location = useLocation();
  const [drawings, setDrawings] = useState([]);
  const token = localStorage.getItem('token')
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchdrawings = async () => {
      try {
        const response = await fetch("https://deploy-mi-test-api.vercel.app/drawing/alldrawings", {
          method: "POST", // default method, can be omitted
          headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure correct content type
          }
        });
        const data = await response.json();
        setDrawings(data);
    } catch (err) {
        console.error("Error fetching drawings:", err.message);
        }
    };
    fetchdrawings();
  }, [location, reload] )

  const deletedrawing = async (id) => {
    try {
      const response = await fetch(`https://deploy-mi-test-api.vercel.app/drawing/deletedrawing`, {
        method: "DELETE", // default method, can be omitted
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
          body: JSON.stringify({ id: id })
        });
        const result = await response.json();
        const {success, message, error} = result;
        if(success){
          setReload(!reload)
          handleSuccess(message)
        }else if(error){
          const details = error?.details[0].message;
          handleError(details)
        }else if(!success){
          handleError(message)
        }
    } catch (error) {
      alert("Failed to delete drawing:", error);
    }
  };

  return (
    <>
    <div className="saved-image-page">
      <header className="header">
        <div className="title-wrap">
          <h4>New-Drawing</h4>
        </div>
      </header>
      <div className="containers" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <figure className="card">
            <div className="img-wrap">
                <img className='Image' src="https://i.pinimg.com/originals/11/7e/2e/117e2ed7ebe96dd0c3838cfa10f07311.jpg" alt="Button Icon"/>
            </div>
            <div className="meta">
                <div className="name">New Drawing</div>
                <Link to="/from_scratch" state={{ shapes: null}}>
                    <div className="card-actions">
                    <button className="btn btn-sm">Go</button>
                    </div>
                </Link>
            </div>
        </figure>
      </div>
      <hr className="w-100"/>
      <div className="container">
        <header className="header">
          <div className="title-wrap">
            <h4>My-Drawing</h4>
          </div>
        </header>
        {false ? (
          <div className="empty-box">No saved images found.</div>
        ) : (
          <div className={`row row-cols-1 row-cols-md-${Math.min(drawings.length, 4)} g-4`}>
            {drawings.map((drawing) => (
              <div className="col">
                <figure key={drawing.id} className="card">
                  <div className="img-wrap">
                    {drawing.imageUrl ? (
                      <img src={drawing.imageUrl} alt={drawing.name}/>
                    ) : (
                      <div>No image</div>
                    )}
                  </div>
                  <div className="meta">
                    <div>
                      <div className="name">{drawing.profileName}</div>
                      <div className="date">{drawing.profileReferenceNo}</div>
                      <div className="date">{drawing.profileDescription}</div>
                      <div className="date">{drawing.time}</div>
                    </div>

                    <div className="card-actions">
                      <Link to="/from_scratch" state={{ drawingId: drawing._id }} >
                      <button className="btn btn-sm" >Go</button></Link>
                      <button className="btn btn-sm btn-delete" onClick={() => deletedrawing(drawing._id)}>Delete</button>
                    </div>
                  </div>
                </figure>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
    </>
  );
}
