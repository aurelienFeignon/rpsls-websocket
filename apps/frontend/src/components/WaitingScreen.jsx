export const WaitingScreen = ({ message, invitationLink }) => {
    async function handleCopy() {
        if (!invitationLink) {
            return;
        }

        await navigator.clipboard.writeText(invitationLink);
    }

    return (
        <section>
            <h1>{message}</h1>

            {invitationLink ? (
                <div>
                    <p>{invitationLink}</p>

                    <button type="button" onClick={handleCopy}>
                        Copy invitation link
                    </button>
                </div>
            ) : null}
        </section>
    );
}