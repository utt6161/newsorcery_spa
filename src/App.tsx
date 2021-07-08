import "bootstrap/dist/css/bootstrap.min.css"
import "../src/styles/Global.css"
import React, {useRef, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Container, Navbar} from "react-bootstrap";
import SectionButton from "./components/SectionButton";
import {selectSectionInfo, selectSectionSelected, setUnselected} from "./store/sectionSlice";
import Button from "react-bootstrap/Button";
import {selectSearchText, setCurrentPath, setSearchText} from "./store/searchSlice";
import {restoreArticlesState} from "./store/articlesSlice";
// @ts-ignore // no ts types, bruh
import AnchorLink from 'react-anchor-link-smooth-scroll'
// @ts-ignore
import Cookies from "js-cookie/src/js.cookie"
import Fade from "react-bootstrap/Fade";
import SettingsIcon from "./components/SettingsIcon";
import Modal from "react-bootstrap/Modal";
import Switch from "./components/Switch";
import {selectSwitch, setSwitch, toggleSwitch} from "./store/switchSlice";
import {Switch as RouterSwitch, Route, useLocation} from "react-router-dom";
import Search from "./pages/Search";
import Article from "./pages/Article";
import {useHistory} from "react-router";
import Home from "./pages/Home";

function App() {

    // to make tooltip work
    // const [show, setShow] = useState(false);
    // const target = useRef(null);

    const dispatch = useDispatch()
    const settingsSwitch = useSelector(selectSwitch)
    const cookiesSettingsSwitch = Cookies.get("switch")
    useEffect(() => {
        if ((settingsSwitch.toString() !== cookiesSettingsSwitch) && cookiesSettingsSwitch !== undefined) {
            dispatch(toggleSwitch())
        }
    })


    const search = useSelector(selectSearchText)
    //const serverSidePathName = useSelector(selectPathName) // for a server's info, servers will be null after first render of articles
    //const clientSidePathName = useSelector(selectCurrentPath) // for a clients' info
    //console.log("serverSidePathName(_appjs): " + serverSidePathName)
    //console.log("clientSidePathName(_appjs): " + clientSidePathName)
    const sectionSelected = useSelector(selectSectionSelected)
    const sectionInfo = useSelector(selectSectionInfo)
    const setSearchInfo = useRef(true)
    const [showAnchor, setShowAnchor] = useState(false);
    const [modalShow, setModalShow] = useState(false); // for a modal with settings
    const history = useHistory()
    const location = useLocation() // REACT ROUTER THING FOR ACCESSING WINDOW.LOCATION
    const searchQuery = new URLSearchParams(location.search).get("q")
    useEffect(() => {
        if (setSearchInfo.current) {
            dispatch(setCurrentPath(searchQuery))
        }
        setSearchInfo.current = false
    })
    const searchLocation = `/search?&q=${search}${sectionSelected ? "&sectionId=" + sectionInfo.sectionId : ""}`

    const onSearchHandler: React.MouseEventHandler = (e) => {
        history.push(searchLocation)
    }

    // const [isNotEvenRows, setRows] = useState(true)

    const [showSettings, setShowSettings] = useState(false) // for a settings button
    let restoringHandler!: React.MouseEventHandler<HTMLButtonElement>
    useEffect(() => {
        if (location.pathname === "/") {
            setShowSettings(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSettings])

    switch (location.pathname) {
        case "/":
            restoringHandler = (e: React.MouseEvent<HTMLElement>) => {
                dispatch(restoreArticlesState());
                dispatch(setUnselected())
            }
            break;
        case "/search":
            restoringHandler = (e: React.MouseEvent<HTMLElement>) => {
                dispatch(restoreArticlesState());
                dispatch(setUnselected())
            }
            break;

        case "/article":
            restoringHandler = (e: React.MouseEvent<HTMLElement>) => {
                dispatch(setUnselected())
            }
            break;
    }

    let setScrollAnchorListener = useRef(true)
    useEffect(() => {
        if (setScrollAnchorListener.current) {
            window.addEventListener('scroll', (event) => {
                let yOffset = window.pageYOffset
                if (yOffset > 1200) {
                    setShowAnchor(true)
                } else {
                    setShowAnchor(false)
                }
            })
        }
        setScrollAnchorListener.current = false
    },)
    // tooltip thing, biohazard
    //         <Button className="ml-1 info_button d-none" variant="outline-primary" ref={target}
    //     onClick={() => setShow(!show)}>
    // <img className="info_img" src="/info.svg" alt="info button logo"/>
    //         </Button>
    //     <Overlay target={target.current} show={show} placement="bottom-end">
    //         {(props) => (
    //             <Tooltip {...props}>
    //                 API was generously provided by <a className="link_to_tg"
    //                                                   href="https://www.theguardian.com">the
    //                 Guardian</a>.
    //             </Tooltip>
    //         )}
    //     </Overlay>
    // <script defer src="https://platform.twitter.com/widgets.js" charSet="utf-8"/>
    return (
        <>
            <Container>
                <Navbar id="navbar" expand="lg" className="mt-5" variant="light">
                    <a data-cy="brand-link" className="navbar-brand brand" id="top" href="/">NEWSorcery</a>
                    <div className="d-flex w-100">
                        {sectionSelected &&
                        <SectionButton text={sectionInfo.sectionText} onClick={restoringHandler}/>
                        }
                        <input data-cy="search-input" placeholder="Search" aria-label="Search" value={search}
                               onChange={(e) => {
                                   dispatch(setSearchText(e.target.value))
                               }}
                               className="squared colored-search form-control" onKeyUp={({key}) => {
                            if (key === "Enter") {
                                window.location.href = searchLocation
                            }
                        }}/>
                        <Button data-cy="search-btn" className="squared ml-1" onClick={onSearchHandler}
                                variant="outline-primary">Search</Button>
                        {showSettings &&
                        <>
                            <Button data-cy="settings-btn" className="squared settings-button ml-1 px-2 py-0"
                                    onClick={() => setModalShow(true)} variant="outline-primary">
                                <SettingsIcon className="settings-gear"/>
                            </Button>
                            <Modal
                                show={modalShow}
                                onHide={() => setModalShow(false)}
                                size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Settings (still unstable, sry)</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="d-flex">
                                        <span className="align-self-center" style={{fontSize: "1.3rem"}}>Rows aren't even in height: </span>
                                        <div className="d-inline-block ml-2" style={{verticalAlign: "middle"}}>
                                            <Switch
                                                isOn={settingsSwitch}
                                                handleObject={{dispatcher: dispatch, reducer: setSwitch}}/>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>

                        </>}
                    </div>

                </Navbar>


                <RouterSwitch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="/search">
                        <Search/>
                    </Route>
                    <Route path="/article">
                        <Article/>
                    </Route>
                </RouterSwitch>


                <div className="fixed-bottom">
                    <Fade in={showAnchor}>
                        <AnchorLink data-cy="anchor-btn" href='#top' className="go-up">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0"
                                y="0"
                                enableBackground="new 0 0 240.835 240.835"
                                version="1.1"
                                viewBox="0 0 240.835 240.835"
                                xmlSpace="preserve"
                            >
                                <path
                                    d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z"/>
                            </svg>
                        </AnchorLink>
                    </Fade>
                </div>
            </Container>
        </>
    )
}

//
// if(process.browser){
//     window.store = wrapper.withRedux()
// }

export default App;

