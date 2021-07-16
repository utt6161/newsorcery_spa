import {useSpring, animated, useTransition} from "react-spring"
import React, {useState} from "react";
import {ReactComponent as LoadingSvg} from '../svgs/loading.svg';
import * as easings from "d3-ease";

const Loading = () => {
    const rotatingStyles = useSpring({
        loop: true,
        from: {rotate: 0},
        to: {rotate: 360},
        unique: true,
        config: {
            duration: 1000,
        }
    })

    const [showLoad, setShowLoad] = useState(false)
    const appearingStyles = useTransition(showLoad, {
            from: {opacity: 0},
            enter: {opacity: 1},
            leave: {opacity: 0},
            config: {duration: 50},
            unique: true,
            onRest: () => setShowLoad(true)
        }
    )
    return (
        <div className="m-auto pt-5">
            <animated.div style={{...appearingStyles}}>
                {showLoad && <animated.div
                    style={{
                        ...rotatingStyles,
                        transformOrigin: "center center",
                    }}
                >
                    <LoadingSvg className="m-auto d-block w-25" style={{opacity: .8, height: "10rem"}}/>
                </animated.div>
                }
            </animated.div>
        </div>
    )
}

export default Loading
