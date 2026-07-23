"use client";

import "./countdown.css";

type Props = {

    timeLeft: {

        days:number;

        hours:number;

        minutes:number;

        seconds:number;

    };

};

export default function Countdown({

    timeLeft,

}:Props){

    return(

        <div className="countdown">

            <div>

                <strong>{timeLeft.days}</strong>

                <span>Days</span>

            </div>

            <div>

                <strong>{timeLeft.hours}</strong>

                <span>Hours</span>

            </div>

            <div>

                <strong>{timeLeft.minutes}</strong>

                <span>Minutes</span>

            </div>

            <div>

                <strong>{timeLeft.seconds}</strong>

                <span>Seconds</span>

            </div>

        </div>

    );

}