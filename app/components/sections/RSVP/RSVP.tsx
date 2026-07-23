"use client";

import "./rsvp.css";

import SectionTitle from "@/app/components/ui/SectionTitle/SectionTitle";
import Button from "@/app/components/ui/Button/Button";
import GuestSelect from "@/app/components/ui/GuestSelect/GuestSelect";

type Props = {

    mainName: string;
    setMainName: (v: string) => void;

    guestCount: number | "";
    setGuestCount: (v: number | "") => void;

maxInvites: number | null;

    attending: boolean | null;
    setAttending: (v: boolean) => void;

    note: string;
    setNote: (v: string) => void;

    submitRSVP: () => void;

    sending: boolean;
    sent: boolean;
    error: string | null;
};

export default function RSVP({

    mainName,
    setMainName,

    guestCount,
    setGuestCount,

  maxInvites,

    attending,
    setAttending,

    note,
    setNote,

    submitRSVP,

    sending,
    sent,
    error,

}: Props) {

    if (sent) {

        return (

            <section className="rsvp success">

                <div className="rsvp-heart">♥</div>

                <SectionTitle>
    شكراً لتأكيد حضوركم
</SectionTitle>

<p className="rsvp-message">
    لقد تم استلام ردكم بنجاح.
    <br /><br />
    يشرفنا حضوركم ومشاركتكم هذه المناسبة السعيدة،
    <br />
    ونترقب الاحتفال معكم بكل فرح.
</p>

            </section>

        );

    }

    return (

        <section className="rsvp">

            <SectionTitle>

                RSVP

            </SectionTitle>

            <div className="gift-divider">

                <span></span>

                <div className="gift-divider-icon">
                    ✦
                </div>

                <span></span>

            </div>

            <p className="rsvp-message">

                نتطلع بشوق للاحتفال معكم.
                <br />
نرجو تأكيد حضوركم أو اعتذاركم قبل
<br />
<strong style={{ fontSize: "24px" }}>
  ٢٠ آب
</strong>
     </p>

            <div className="rsvp-heart">

                ♥

            </div>

            {/* Attendance */}

            <div className="rsvp-choice">

    <div
        className={`rsvp-option accept ${
            attending === true ? "selected" : ""
        }`}
        onClick={() => setAttending(true)}
    >

        <span className="rsvp-icon">

            {attending === true ? "✓" : ""}

        </span>

        <span>

            سأكون بالحضور

        </span>

    </div>

    <div
        className={`rsvp-option decline ${
            attending === false ? "selected" : ""
        }`}
        onClick={() => {

    setAttending(false);

    setGuestCount(1);

}}
    >

        <span className="rsvp-icon">

            {attending === false ? "✕" : ""}

        </span>

        <span>

            أعتذر عن الحضور

        </span>

    </div>

</div>

            {/* Name */}

            <div className="rsvp-field">

                <label>

                    الاسم الكريم

                </label>

                <input

                    value={mainName}

                    onChange={(e) => setMainName(e.target.value)}

                    placeholder="اكتب اسمك"

                />

            </div>

 {/* Guests */}

{attending !== false && (

    <div className="rsvp-field">

        <label>

            عدد الضيوف

        </label>

        {maxInvites ? (

    maxInvites === 1 ? (

        <div className="guest-one">

            1 Guest Included

        </div>

    ) : (

        <GuestSelect
            value={guestCount === "" ? 0 : Number(guestCount)}
            max={maxInvites}
            onChange={(value) => setGuestCount(value)}
        />

    )

) : (

    <input
        type="number"
        min={1}
        step={1}
        inputMode="numeric"
        value={guestCount === "" ? "" : guestCount}
        placeholder="اختر عدد الضيوف"
        onChange={(e) => {

            const value = e.target.value;

            // Allow empty while typing
            if (value === "") {

                setGuestCount("");

                return;

            }

            const number = parseInt(value, 10);

            // Reject invalid values
            if (
                isNaN(number) ||
                number < 1 ||
                value.includes(".")
            ) {
                return;
            }

            setGuestCount(number);

        }}
        onBlur={() => {

            if (guestCount === "") return;

            if (Number(guestCount) < 1) {

                setGuestCount(1);

            }

        }}
    />

)}

{maxInvites && (

    <small className="guest-limit">

        {maxInvites === 1
            ? "This invitation includes 1 guest."
            : `This invitation includes up to ${maxInvites} guests.`}

    </small>

)}

    </div>

)}

            {/* Note */}

            <div className="rsvp-field">

                <label>

                    اترك رسالة

                </label>

                <textarea

                   

                    value={note}

                    placeholder="اختياري"

                    onChange={(e) => setNote(e.target.value)}

                />

            </div>

            {error && (

                <p className="rsvp-error">

                    {error}

                </p>

            )}

            <Button

                onClick={submitRSVP}

                disabled={sending}

            >

                {sending
                    ? "Sending..."
                    : "تأكيد الحضور"}

            </Button>

        </section>

    );

}