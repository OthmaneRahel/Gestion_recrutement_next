import React, { useRef, useState } from "react";
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from "react-router-dom";
export default function TestQrCode(){
    const [user, setuser] = useState("");

    let qrref = useRef();
    console.log(qrref);
    const fff = () => {
        toPng(qrref.current).then((e) => {
            let aele = document.createElement("img")
            aele.src = e
            document.getElementById("aff").appendChild(aele)
        }).catch((er) => {
            console.error(er)
        })
    }
    console.log(user)
    return <>
        {/* <input type="text" name="user" id="" onChange={(e) => setuser(e.target.value)} />
        <div >
            <Link title="https://discord.com/channels/1361413803064950885/1381989462476591175`" to={`https://discord.com/channels/1361413803064950885/1381989462476591175`}>
                <QRCodeSVG ref={qrref} value={'https://discord.com/channels/1361413803064950885/1381989462476591175'} size={200} id="qrcode" level="H"/>
            </Link>
        </div>

         <div style={{ position: 'absolute', left: '-9999px' }}>
            <QRCodeSVG ref={qrref} value={user} size={200} id="qrcode" level="H"/>
        </div>

        <br />

        <h1>hada element li jab f docuement</h1>
        
        <div id="aff"></div>

    
        <button type="button" onClick={fff}>etst</button> */}

        <img src="data:image/png;base64,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" alt="" />


    </>
}