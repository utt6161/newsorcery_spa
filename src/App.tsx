import "bootstrap/dist/css/bootstrap.min.css"
import "../src/styles/Global.css"
import React, {useRef, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Container, Navbar} from "react-bootstrap";
import SectionButton from "./components/SectionButton";
// import {selectSectionInfo, selectSectionSelected, setUnselected} from "./store/sectionSlice";

import Button from "react-bootstrap/Button";
import {selectSearchText, setCurrentPath, setSearchText} from "./store/searchSlice";
import {restoreArticlesState, selectSectionId, selectSectionSelected} from "./store/articlesSlice";
// @ts-ignore // no ts types, bruh
import AnchorLink from 'react-anchor-link-smooth-scroll'
// @ts-ignore
import Cookies from "js-cookie/src/js.cookie"
import Fade from "react-bootstrap/Fade";
import SettingsIcon from "./components/SettingsIcon";
import Modal from "react-bootstrap/Modal";
import Switch from "./components/Switch";
import {selectSwitch, setSwitch, toggleSwitch} from "./store/switchSlice";
import {Switch as RouterSwitch, Route, useLocation, Link} from "react-router-dom";
import Search from "./pages/Search";
import Article from "./pages/Article";
import {useHistory} from "react-router";
import Home from "./pages/Home";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Sections from "./components/Sections";
import {Transition, animated} from 'react-spring'
import {sectionsList} from "./store/crucialData";
import SearchField from "./components/SearchField";

function App() {

    // go back/forward browser interceptor
    // because it just changes the url, but doesnt
    // do anything else, like reload
    // or at least some sort of redirect
    // im not exactly sure how it works
    // copypasted it from stackoverflow
    // https://stackoverflow.com/a/61961026

    const location = useLocation() // REACT ROUTER THING FOR ACCESSING WINDOW.LOCATION
    const [locationKeys, setLocationKeys] = useState<(string | undefined)[]>([]);
    const history = useHistory();

    useEffect(() => {
        return history.listen((location) => {
            if (history.action === 'PUSH') {
                if (location.key) setLocationKeys([location.key]);
            }

            if (history.action === 'POP') {
                if (locationKeys[1] === location.key) {
                    setLocationKeys(([_, ...keys]) => keys);
                    window.location.reload()
                    //Handle forward event

                } else {
                    setLocationKeys((keys) => [location.key, ...keys]);
                    window.location.reload()
                    // Handle back event
                }
            }
        });
    }, [locationKeys]);


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


    //const search = useSelector(selectSearchText)
    //const serverSidePathName = useSelector(selectPathName) // for a server's info, servers will be null after first render of articles
    //const clientSidePathName = useSelector(selectCurrentPath) // for a clients' info
    //console.log("serverSidePathName(_appjs): " + serverSidePathName)
    //console.log("clientSidePathName(_appjs): " + clientSidePathName)
    const sectionSelected = useSelector(selectSectionSelected)
    const stateSectionId = useSelector(selectSectionId)
    const [showAnchor, setShowAnchor] = useState(false);
    const [modalShow, setModalShow] = useState(false); // for a modal with settings
    const queryParser = new URLSearchParams(location.search)

    const toMainPageHandler: React.MouseEventHandler = (e) => {
        if(stateSectionId !== ""){
            dispatch(restoreArticlesState())
        }
    }



    // const [isNotEvenRows, setRows] = useState(true)

    const [showSettings, setShowSettings] = useState(false) // for a settings button

    const restoringHandler: React.MouseEventHandler<HTMLButtonElement> = (e: React.MouseEvent<HTMLElement>) => {
        if(location.pathname !== "/article") {
            if (stateSectionId !== "") {
                queryParser.delete("sectionId")
                window.history.pushState("", "", location.pathname + "?" + queryParser.toString())
            }
        }
        dispatch(restoreArticlesState())
    }

    useEffect(() => {
        if (location.pathname === "/") {
            setShowSettings(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSettings])


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
                    <Link data-cy="brand-link" className="navbar-brand brand" id="top" to="/" onClick = {toMainPageHandler}>NEWSorcery</Link>
                    <div className="d-flex w-100">
                        {sectionSelected &&
                        <SectionButton text={sectionsList[stateSectionId]} onClick={restoringHandler}/>
                        }

                        <SearchField/>

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
                <Sections/>
                {/*<Transition*/}
                {/*    items={location}*/}
                {/*    from={{opacity: 0}}*/}
                {/*    enter={{opacity: 1}}*/}
                {/*    leave={{opacity: 0}}*/}
                {/*    delay={100}*/}

                {/*>{(styles, item) =>*/}
                {/*    <animated.div style={styles}>*/}
                        <RouterSwitch location={location}>
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
                {/*    </animated.div>*/}
                {/*}*/}
                {/*    </Transition>*/}

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

