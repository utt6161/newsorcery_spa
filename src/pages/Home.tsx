import React, {useState} from "react";
import News from "../components/NewsList";
import { Transition, animated } from 'react-spring'

export default function Home() {
    const [showHome, setShowHome] = useState(false)
    return (
        // <Transition
        //     items={showHome}
        //     from={{opacity: 0}}
        //     enter={{opacity: 1}}
        //     delay={150}
        //     onRest={() =>
        //         setShowHome(true)
        //     }
        //
        // >{(styles, item) =>
        //     item && <animated.div style={styles}>
                <News/>
        //     </animated.div>
        // }
        // </Transition>
    )
}
