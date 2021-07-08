import React from 'react';
// @ts-ignore
import Cookies from "js-cookie/src/js.cookie"
import {dispatchType} from "../store/store";
import {setSwitchType} from "../store/switchSlice";

interface ISwitchProps{
    isOn: boolean,
    handleObject: {
        dispatcher: dispatchType,
        reducer: setSwitchType
    }
}

const Switch = ({ isOn, handleObject }: ISwitchProps) => {
    return (
        <>
            <input
                data-cy = "settings-switch"
                checked={isOn}
                onChange={() => {
                    handleObject.dispatcher(handleObject.reducer(!isOn))
                    Cookies.remove('switch', { path: '/' });
                    Cookies.set('switch',`${!isOn}`)
                }}
                className="react-switch-checkbox"
                id={`react-switch-new`}
                type="checkbox"
            />
            <label
                style={{ background: isOn ? '#06D6A0' : '#EF476F' }}
                className="react-switch-label m-0"
                htmlFor={`react-switch-new`}
            >
                <span className="react-switch-button"/>
            </label>
        </>
    );
};

export default Switch;
