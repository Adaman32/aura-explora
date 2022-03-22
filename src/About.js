import React from 'react';
import AuraExploraLogo from './images/AuraExploraLogo';
import amanda from './images/amanda.jpg';
import haris from './images/haris.jpg';
import adam from './images/adam.png';
import solbritt from './images/solbritt.jpg';
import wenjia from './images/wenjia.jpg';
import BackIcon from './images/back-icon';

export const About = () => {
    return (
        <>
            <div className='containerAboutLogo'>
                <a className='aura-explora-logo' href='/'>
                    <AuraExploraLogo/>
                </a>
                <a style={{ position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    color: 'white',
                    fontSize: '0.4em',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
                    href='/'>
                    <BackIcon />Back
                </a>
            </div>
            <div className="containerAboutSidebar">
            <h1>About AuraExplora</h1>
                <nav>
                    <a href="#team"><h3>The team</h3></a>
                    <a href="#demonstration"><h3>Demonstration</h3></a>
                    <a href="#data"><h3>Data</h3></a>
                    <a href="#learning"><h3>Learning Outcomes</h3></a>
                </nav>
            </div>

            <div className='containerAboutContent'>
                <div id="welcome" className="containerAboutEntry">
                    <h1>Welcome to AuraExplora!</h1>
                    <hr className='line' size="1" width="100%" color="white"></hr>
                    <p>
                    Aurora Borealis is a beautiful event that occurs in the skies around the north pole. In order to get a glimpse of the flowing green patterns appearing in the sky, there 
                    are several factors that play in. Not only must the geomagnetic activity above the earth be high enough, but there also needs to be darkness and clear skies if the aurora is to be visible. 
                    <br /><br />
                    The idea behind our website is to provide the necessary information needed to guide aurora hunters towards their goal. Our users can be anything from an expert to someone just 
                    looking to experience a unique natural phenomena.                  
                    </p>
                </div>

                <div id="team" className="containerAboutEntry">
                    <h1>The Team</h1>
                    <hr className='line' size="1" width="100%" color="white"></hr>
                    <div className='row'>
                        <div className="column">
                            <div className="card">
                                <img src={amanda} alt="Amanda" className="aboutTeamImg"></img>
                                <div className='containerAboutTeam'>
                                    <h2>Amanda Lindqvist</h2>
                                    <p>Data Processing, Front-end Development, User Testing</p>
                                    <p>amlindqv@kth.se</p>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="card">
                                <img src={haris} alt="Haris" className="aboutTeamImg"></img>

                                <div className='containerAboutTeam'>
                                    <h2>Haris Vidimlic</h2>
                                    <p>Front-end Development, User Testing</p>
                                    <p>harisv@kth.se</p>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="card">
                                <img src={adam} alt="Adam" className="aboutTeamImg"></img>
                                <div className='containerAboutTeam'>
                                    <h2>Adam Cerven</h2>
                                    <p>Front-end Development, UX & Visual Design, User Testing</p>
                                    <p>cerven@kth.se</p>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="card">
                                <img src={solbritt} alt="Solbritt" className="aboutTeamImg"></img>
                                <div className='containerAboutTeam'>
                                    <h2>Solbritt Gateman</h2>
                                    <p>Front-end Development, User Testing</p>
                                    <p>solbritt@kth.se</p>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="card">
                                <img src={wenjia} alt="Wenjia" className="aboutTeamImg"></img>
                                <div className='containerAboutTeam'>
                                    <h2>Wenjia Chen</h2>
                                    <p>Front-end Development, User Testing</p>
                                    <p>wenjiac@kth.se</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="demonstration" className="containerAboutEntry">
                    <h1>Demonstration</h1>
                    <hr className='line' size="1" width="100%" color="white"></hr>
                    <div className='videoWrapperOuter'>
                        <div className='videoWrapperInner'>
                            <iframe 
                                className="demoVideo"
                                width="854" 
                                height="480" 
                                src="https://www.youtube.com/embed/PEWULmmZ8MQ" 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                    <p>Source code for the website: <a href='https://gits-15.sys.kth.se/solbritt/AuraExplora'>https://gits-15.sys.kth.se/solbritt/AuraExplora</a></p>
                </div>
                <div id="data" className="containerAboutEntry">
                    <h1>Data</h1>
                    <hr className='line' size="1" width="100%" color="white"></hr>
                    <p>
                        AuraExplora provides a map over Sweden and data for aurora forecasts, Kp-index, cloudiness, sunrise/sunset times and the population of 48 of the largest Swedish
                        cities and towns. Data from the Space Weather Prediction Center was used for the “Current Probabilty of Aurora” and for the KP-index. SMHI’s Open Data API provided
                        data on cloud coverage, and lastly, https://sunrise-sunset.org/api was used for sunrise and sunset times. We used Python to do all the necessary data processing. <br /><br />
                        The data that can be viewed on this website is not live and as you can see, the current day is set to be 3rd of February. This is because the amount of API calls we would
                        need for it to run in real-time is beyond the scale of our project. However, everything you can see on the website is a simulation of that time period, meaning that the website works just like it would have done on the 3rd of February.
                    </p>
                    
                </div>
                <div id="learning" className="containerAboutEntry">
                    <h1>Learning Outcomes</h1>
                    <hr className='line' size="1" width="100%" color="white"></hr>
                    <p>
                    During the course of this project, we have worked with UX design, map interactions, data handling, data visualization and user testing of our application. 
                    We have developed our knowledge in the theory of information visualization as well as in frontend development.
                    In the first stage, we used Figma to create design prototypes. The map color was chosen with the help of ColorBrewer2.0 [1] and suitable color mapping for data points 
                    was found using “Color use Guidelines for Mapping and Visualization” [2]. For the glyphs we used, we took inspiration from the recommendations by Chris North [3]. Regarding the frontend, we got to try out and learn about using React and D3 to create an interactive 
                    website where data is displayed in an engaging way. We made several user tests along the way, which was very rewarding for our process. Through these tests, we got to learn 
                    about the perspective of our intended users and we could develop our application according to their needs and expectations.        
                    </p>
                </div>
                <div className="containerAboutEntry">
                <hr className='line' size="1" width="100%" color="white"></hr>
                    <h1>References</h1>
                    <ul>
                        <dt>[1] ColorBrewer 2.0. <a href='https://colorbrewer2.org/'>Link</a></dt>
                        <dt>[2] Brewer, Cynthia (1994). Color use Guidelines for Mapping and Visualization, Volume 2. Ch7. <a href='https://www.sciencedirect.com/science/article/pii/B9780080424156500144'>Link</a></dt>
                        <dt>[3] North, Chris. (2012). Handbook of Human Factors and Ergonomics, Fourth Edition. <a href='https://www.researchgate.net/publication/277695836_Handbook_of_Human_Factors_and_Ergonomics_Fourth_Edition'>Link</a></dt>
                    </ul>
                    <h1>Data resources</h1>
                    <ul>
                        <dt>NOAA/NWS Space Weather Prediction Center <a href='https://www.swpc.noaa.gov/products/aurora-30-minute-forecast'>Link: Aurora Forecast</a> <a href='https://www.swpc.noaa.gov/products/planetary-k-index'>Link: Kp-index</a></dt>
                        <dt>SMHI Open Data API <a href='https://opendata.smhi.se/'>Link</a></dt>
                        <dt>Sunrise Sunset Times API <a href='https://sunrise-sunset.org/api'>Link</a></dt>
                        <dt>Simplemaps - Sweden Cities Database <a href='https://simplemaps.com/data/se-cities'>Link</a></dt>
                        <dt>Jacob Nordgren - Swedish provinces <a href='https://github.com/jnordgren/swedish_data_map_geojson/blob/master/GeoJSON/swedish_provinces.geojson'>Link</a></dt>
                    </ul>
                </div>
            </div>
        </>
    )
}
